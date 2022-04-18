package wsc

import (
	"log"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

func (wsc *Wsc) keepAlive() {
	wsc.Lock()
	if atomic.LoadUint32(&wsc.keepAliveActive) > 0 {
		return
	}
	atomic.AddUint32(&wsc.keepAliveActive, 1)
	wsc.Unlock()
	// initiate ticker interval
	intervalTicker := time.NewTicker(wsc.KeepAliveInterval)
	defer intervalTicker.Stop()

	for range intervalTicker.C {
		timeoutTicker := time.NewTicker(wsc.KeepAliveTimeout)

		// send ping message
		if err := wsc.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
			log.Println("Error writing message:", err)
			wsc.Lock()
			atomic.StoreUint32(&wsc.keepAliveActive, 0)
			wsc.Unlock()
			go wsc.dropConnection()
			return
		}

		log.Println("Ping message sent")

		select {
		case <-wsc.PongMessage: // in setPongHandler we wait to receive a pong status on this chan
			// wait until the ticker ocured
			log.Println("Pong message received")
		case <-timeoutTicker.C:
			// this is timeout
			log.Println("No pong message. Timeout, disconnecting ...")
			wsc.Lock()
			atomic.StoreUint32(&wsc.keepAliveActive, 0)
			wsc.Unlock()
			go wsc.dropConnection()
			return
		}

		// stop the ticker
		timeoutTicker.Stop()
	}
}
