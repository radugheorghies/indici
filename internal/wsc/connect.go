package wsc

import (
	"log"
	"sync/atomic"
	"time"
)

// Close closes the underlying network connection without
// sending or waiting for a close frame.
func (wsc *Wsc) Close() {
	// wsc.status.setStatus(false)
	if wsc.ws != nil {
		wsc.ws.Close()
	}
}

// CloseForTests closes the underlying network connection without
// sending or waiting for a close frame, used only for test scenario.
func (wsc *Wsc) CloseForTests() {
	if wsc.ws != nil {
		wsc.ws.Close()
	}
}

func (wsc *Wsc) dropConnection() {
	wsc.Lock()
	defer wsc.Unlock()
	if atomic.LoadUint32(&wsc.isDown) > 0 {
		return
	}
	atomic.AddUint32(&wsc.isDown, 1)
	wsc.reconnectChan <- struct{}{}
}

func (wsc *Wsc) reconnect() {
	// listen for reconect message
	// if other reconnect message is coming and the
	// reconnect faze is not finished, we will apply the drop pattern
	for range wsc.reconnectChan {

		// reconnect code
		wsc.ws = nil

		for err := wsc.Connect(); err != nil; {
			log.Println("Error reconnecting to socket: ", err)
			time.Sleep(wsc.TimeBetweenReconnects)
			err = wsc.Connect()
		}

		// start reading the messages
		go wsc.listenForRead()
		go wsc.listenForWrite()
		go wsc.keepAlive()

		atomic.StoreUint32(&wsc.isDown, 0)

		// running recover comands
		wsc.recoverCommands.Lock()
		for _, c := range wsc.recoverCommands.commands {
			if err := wsc.WriteMessage(1, c); err != nil {
				log.Println("Error writing the commands:", err)
				wsc.dropConnection()
				break
			}
		}
		wsc.recoverCommands.Unlock()

	}
}

func (wsc *Wsc) Connect() error {
	log.Println("Connecting ....")

	wsConn, httpResp, err := wsc.dialer.Dial(wsc.URL, wsc.reqHeader)

	if err != nil {
		wsc.httpResp = httpResp
		return err
	}

	wsc.ws = wsConn

	// setting up the pong handler here
	// because we regenerate the connection
	wsc.ws.SetPongHandler(func(msg string) error {
		wsc.PongMessage <- struct{}{}
		return nil
	})

	log.Println("Connected.")

	return nil
}
