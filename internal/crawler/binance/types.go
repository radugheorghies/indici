package binance

import (
	"moontrade/internal/ema"
	"moontrade/internal/kline"
	"moontrade/internal/wsc"
	"sync"

	nats "github.com/nats-io/nats.go"
	"gopkg.in/jcelliott/turnpike.v2"
)

const (
	wssURL       = "wss://stream.binance.com:9443"
	aggTradeURL  = "stream?streams="
	aggTrade     = "%s@aggTrade"
	httpBaseURL  = "https://api.binance.com"
	httpKLineURL = "/api/v3/klines"
	realm        = "dataGateway"
	wampURL      = "ws://wampserver:8087/"
)

var (
	pairs   = []string{"btcusdt", "ethusdt", "solusdt", "dogeusdt"}
	pondere = map[string]float64{
		"btcusdt":  0.48,
		"ethusdt":  0.3,
		"solusdt":  0.16,
		"dogeusdt": 0.06,
	}
	rap = map[string]float64{
		"btcusdt":  0.021494283,
		"ethusdt":  0.297619048,
		"solusdt":  7.759155804,
		"dogeusdt": 7052.186178,
	}
	intervals    = []string{"5m"}
	emaIntervals = []int{5, 15, 99}

	wg sync.WaitGroup
)

type Binance struct {
	ws        *wsc.Wsc
	nc        *nats.Conn // nats connection
	wamp      *turnpike.Client
	TradesIDs map[string]int64
	kLines    map[string]map[string]map[int]*kline.List
	ema       map[string]map[int]*ema.EWMA
	lastValue map[string]float64
}

type StreamData struct {
	Stream string      `json:"stream"`
	Data   interface{} `json:"data"`
}
