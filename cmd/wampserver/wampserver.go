package main

import (
	"log"
	"net/http"

	"gopkg.in/jcelliott/turnpike.v2"
)

func main() {
	//turnpike.Debug()
	s := turnpike.NewBasicWebsocketServer("dataGateway")

	// solving cors problem
	allowAllOrigin := func(r *http.Request) bool { return true }
	s.Upgrader.CheckOrigin = allowAllOrigin
	// cors proble solved

	server := &http.Server{
		Handler: s,
		Addr:    ":8087",
	}

	log.Println("WAMP server starting on port 8087")
	log.Fatal(server.ListenAndServe())
}
