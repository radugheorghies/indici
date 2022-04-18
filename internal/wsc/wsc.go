package wsc

import (
	"errors"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// TextMessage is text message type
	TextMessage = websocket.TextMessage
	// PingMessage is the ping message type
	PingMessage = websocket.PingMessage
	// defaultTimeBetweenReconnects how many seconds we wait until will try the reconnect
	defaultTimeBetweenReconnects = 10 * time.Second
	// defaultKeepAliveTimeout is the number of secoons to receive the pong message
	defaultKeepAliveTimeout = 5 * time.Second
	// defaultKeepAliveInterval is the number of secoons between ping messages
	defaultKeepAliveInterval = 60 * time.Second
	// defaultReadBufferSize is the buffer size for read
	defaultReadBufferSize = 4096
	// defaultWriteBufferSize is the buffer size for write
	defaultWriteBufferSize = 4096
)

var (
	// ErrNotConnected is the generic error when the socket is disconnected
	ErrNotConnected = errors.New("websocket: not connected. reconnecting")
)

type connectionStatus struct {
	connected bool
	sync.Mutex
}

type recover struct {
	commands [][]byte
	sync.Mutex
}

// Wsc is the type of custom socket connection
// base on gorila websocket package
type Wsc struct {
	ws     *websocket.Conn   // websocket connection
	dialer *websocket.Dialer // websocket dialer

	writeChan       chan message     // the chan for writing to socket
	Messages        chan []byte      // the chan for reading the messages
	reconnectChan   chan struct{}    // the chan where we send recconect signals
	PongMessage     chan struct{}    // we use this chan to receive the pong response
	reqHeader       http.Header      // request header
	httpResp        *http.Response   // httpResponse used only for debuging
	recoverCommands recover          // if a reconnection ocured, we will write to socket all comands, right after reconnect
	status          connectionStatus // the connection status: true = connected

	URL                    string        // the URL to dial
	KeepAliveTimeout       time.Duration // the inerval for receiving pong
	KeepAliveInterval      time.Duration // the inerval for sending pings
	MaxReconnectionAtempts int           // max reconnection atempts
	TimeBetweenReconnects  time.Duration // how many seconds we wait between reonnect atempts
	ReadBufferSize         int           // read buffer size
	WriteBufferSize        int           // write buffer size

	isDown          uint32 // if is not 0, it means that the connecction is down
	keepAliveActive uint32 // is is not 0, it means that the keep alive is active and we don't need to reinitiate
	sync.Mutex
}

// for gorilla wesockets, we must specify
type message struct {
	data         []byte
	messageType  int
	responseChan chan error
}

// New is the factory function for this package
func New(url string) *Wsc {
	wsc := Wsc{
		Messages:      make(chan []byte),
		writeChan:     make(chan message, 1),
		reconnectChan: make(chan struct{}),
		PongMessage:   make(chan struct{}),
	}

	wsc.URL = url                                            // set the url
	wsc.ReadBufferSize = defaultReadBufferSize               // set read buffer size
	wsc.WriteBufferSize = defaultWriteBufferSize             // set write buffer size
	wsc.TimeBetweenReconnects = defaultTimeBetweenReconnects // se reconnect time
	wsc.KeepAliveTimeout = defaultKeepAliveTimeout           // keep alive timeout
	wsc.KeepAliveInterval = defaultKeepAliveInterval

	return &wsc
}

// SetReqHeader set the reques header
func (wsc *Wsc) SetReqHeader(reqHeader http.Header) {
	wsc.reqHeader = reqHeader
}

// Run is starting the magic :)
func (wsc *Wsc) Run() {
	wsc.setDialer()
	go wsc.reconnect()
	wsc.dropConnection()
}

func (wsc *Wsc) setDialer() {
	wsc.dialer = &websocket.Dialer{
		ReadBufferSize:  wsc.ReadBufferSize,
		WriteBufferSize: wsc.WriteBufferSize,
	}
}

// AddToRecoverCommands generate a list of commands to be executed right after reconnect
func (wsc *Wsc) AddToRecoverCommands(command []byte) {
	wsc.recoverCommands.Lock()
	wsc.recoverCommands.commands = append(wsc.recoverCommands.commands, command)
	wsc.recoverCommands.Unlock()
}
