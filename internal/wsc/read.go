package wsc

import (
	"log"

	"github.com/gorilla/websocket"
)

func (wsc *Wsc) listenForRead() {
	for {
		if wsc.ws == nil {
			log.Println("Socket is disconnected !")
			return
		}
		messageType, message, err := wsc.readMessage()
		if err != nil {
			log.Println("Error reading the message:", err)
			wsc.dropConnection()
			return
		}

		// parse the message
		switch messageType {
		case websocket.TextMessage:
			wsc.Messages <- message
		case websocket.PingMessage:
			wsc.WriteMessage(websocket.PongMessage, []byte{})
		}

	}
}

// ReadMessage will read message from the ws
// If the connection is closed ErrNotConnected is returned
func (wsc *Wsc) readMessage() (messageType int, message []byte, err error) {
	messageType, message, err = wsc.ws.ReadMessage()
	if err != nil {
		log.Println("Error reading the message:", err)
		wsc.dropConnection()
	}

	return
}
