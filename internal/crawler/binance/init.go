package binance

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"moontrade/internal/kline"
	"moontrade/internal/wsc"
	"net/http"
	"strings"

	nats "github.com/nats-io/nats.go"
	"gopkg.in/jcelliott/turnpike.v2"
)

func (b *Binance) init(ctx context.Context) {
	b.initGateway()
	b.getInitialKLines()
	b.initSocket()
	// b.initNatsConnection(nats.DefaultURL)
}

func (b *Binance) initSocket() {
	url := wssURL + "/" + aggTradeURL
	for index, pair := range pairs {
		if index != 0 {
			url += "/"
		}
		url += fmt.Sprintf(aggTrade, pair)
	}

	log.Println("agg trade url:", url)

	for _, s := range intervals {
		for _, pair := range pairs {
			url += fmt.Sprintf("/%s@kline_%s", pair, s)
		}
	}
	b.ws = wsc.New(url)
	b.ws.Run()
}

func (b *Binance) initNatsConnection(url string) {
	nc, err := nats.Connect("nats://nats:4222")
	if err != nil {
		log.Fatal("Could not connect to nats server:", err)
	}
	b.nc = nc
}

func (b *Binance) getInitialKLines() {
	for _, interval := range intervals {
		wg.Add(1)
		go b.getInitialKLine(interval)
	}

	wg.Wait()
}

func (b *Binance) getInitialKLine(interval string) {
	var url string
	for _, pair := range pairs {
		url = fmt.Sprintf("%s%s?symbol=%s&interval=%s&limit=100", httpBaseURL, httpKLineURL, strings.ToUpper(pair), interval)

		fmt.Println("URL:", url)

		resp, err := http.Get(url)
		if err != nil {
			log.Fatalln(err)
		}
		//We Read the response body on the line below.
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatalln(err)
		}

		var arrayResult [][]interface{}

		if err := json.Unmarshal(body, &arrayResult); err != nil {
			panic(err)
		}

		for _, v := range arrayResult {
			if k, err := kline.ConvertArrayToKLine(v); err == nil {
				for _, e := range emaIntervals {
					b.kLines[pair][interval][e].InsertValue(k)
				}
			}
		}
	}

	wg.Done()
}

// initGateway initiates a new wamp client and connects to a realm gateway
func (b *Binance) initGateway() {
	var err error
	// Create a new websockets client
	b.wamp, err = turnpike.NewWebsocketClient(turnpike.JSON, wampURL, nil, nil, nil)
	if err != nil {
		log.Fatal("problem occurred while connecting to WAMP Server:", err)
	}
	log.Println("Successfully connected to WAMP Server")
	// Connecting to dataGateway realm
	if _, err := b.wamp.JoinRealm(realm, nil); err != nil {
		log.Fatal("problem occured while joining dataGateway realm:", err)
	}
	log.Println("Successfully joined dataGateway")
}
