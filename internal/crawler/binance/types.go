package binance

import (
	"moontrade/internal/ema"
	"moontrade/internal/kline"
	"moontrade/internal/wsc"
	"sync"
	"time"

	"gopkg.in/jcelliott/turnpike.v2"
)

const (
	wssURL          = "wss://stream.binance.com:9443"
	aggTradeURL     = "stream?streams="
	aggTrade        = "%s@aggTrade"
	httpBaseURL     = "https://api.binance.com"
	httpKLineURL    = "/api/v3/klines"
	realm           = "dataGateway"
	wampURL         = "ws://0.0.0.0:8087/"
	maxEmaIntervals = 90
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
	ws *wsc.Wsc
	// nc        *nats.Conn // nats connection
	wamp                *turnpike.Client
	TradesIDs           map[string]int64
	kLines              map[string]map[string]*kline.List
	indiceKLine         map[string]*kline.List
	tmpKLine            map[string]map[string]kline.KLineData
	tmpIndiceKLine      map[string]kline.KLineData
	ema                 map[string]map[int]*ema.EWMA
	lastValue           map[string]float64
	lastKLineSent       map[string]time.Time
	lastIndiceKLineSent time.Time
}

type StreamData struct {
	Stream string      `json:"stream"`
	Data   interface{} `json:"data"`
}

type FrKLine struct {
	T string
	O float64
	C float64
	H float64
	L float64
	V float64
}

type FrontendPayload struct {
	Data []FrKLine
	Pair string
}
