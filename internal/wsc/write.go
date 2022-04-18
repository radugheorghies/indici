package wsc

import "log"

// listenForWrite will listen for any message and write it to the ws connection
func (wsc *Wsc) listenForWrite() {
	for msg := range wsc.writeChan {
		if wsc.ws == nil {
			wsc.dropConnection()
			return
		}
		err := wsc.ws.WriteMessage(msg.messageType, msg.data)
		if err != nil {
			log.Println(err)
			wsc.dropConnection()
			msg.responseChan <- err
			return
		}
		msg.responseChan <- err
	}
}

// WriteMessage will write message in channel in order to be written on socket
func (wsc *Wsc) WriteMessage(messageType int, data []byte) error {
	responseChan := make(chan error)
	// log.Println("msg ready to be sent:", string(data))
	wsc.writeChan <- message{
		data:         data,
		messageType:  messageType,
		responseChan: responseChan,
	}
	response := <-responseChan
	close(responseChan)
	return response
}
