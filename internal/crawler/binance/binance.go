package binance

import (
	"context"
	"encoding/json"
	"log"
	"moontrade/internal/ema"
	"moontrade/internal/kline"
	"moontrade/internal/trades"
)

// Comand send thru sockets
type Comand struct {
	Method string   `json:"method"`
	Params []string `json:"params"`
	ID     int64    `json:"id"`
}

func New() *Binance {
	b := Binance{
		TradesIDs: make(map[string]int64),
		kLines:    make(map[string]map[string]map[int]*kline.List),
		ema:       make(map[string]map[int]*ema.EWMA),
		lastValue: make(map[string]float64),
	}

	for _, pair := range pairs {
		b.kLines[pair] = make(map[string]map[int]*kline.List)
		b.ema[pair] = make(map[int]*ema.EWMA)

		for _, interval := range intervals {
			b.kLines[pair][interval] = make(map[int]*kline.List)

			for _, emaInterval := range emaIntervals {
				b.kLines[pair][interval][emaInterval] = kline.New()
				b.kLines[pair][interval][emaInterval].MaxLength = emaInterval + 2
			}
		}

		for _, emaInterval := range emaIntervals {
			b.ema[pair][emaInterval] = ema.New(emaInterval)
		}
	}

	return &b
}

func (b *Binance) Run(ctx context.Context) {
	b.init(ctx)

	wait := make(chan struct{})
	defer b.ws.Close()
	go b.listenForMessages()
	<-wait

}

func (b *Binance) listenForMessages() {
	log.Println("Start reading messages ...")
	for v := range b.ws.Messages {
		streamData := StreamData{}
		json.Unmarshal(v, &streamData)

		data, err := json.Marshal(streamData.Data)
		if err != nil {
			log.Println("Error marshaling stream data:", streamData.Data)
		}

		for _, pair := range pairs {
			switch streamData.Stream {
			case pair + "@aggTrade":
				tmpTrade := trades.Trade{}
				json.Unmarshal(data, &tmpTrade)

				trade, err := tmpTrade.ConvertToAggTrade()
				if err != nil {
					log.Println("Error converting the trade:", tmpTrade, err)
				}
				b.processTrade(trade)

			case pair + "@kline_" + intervals[0]:
				b.prepareKLine(data, pair, intervals[0])
				// case pair + "@kline_" + intervals[1]:
				// 	b.prepareKLine(data, pair, intervals[1])
				// case pair + "@kline_" + intervals[2]:
				// 	b.prepareKLine(data, pair, intervals[2])
				// case pair + "@kline_" + intervals[3]:
				// 	b.prepareKLine(data, pair, intervals[3])
				// case pair + "@kline_" + intervals[4]:
				// 	b.prepareKLine(data, pair, intervals[4])
				// case pair + "@kline_" + intervals[5]:
				// 	b.prepareKLine(data, pair, intervals[5])
			}
		}
	}
}

func (b *Binance) prepareKLine(data []byte, pair, period string) {

	tmpKLine := kline.KLine{}

	if err := json.Unmarshal(data, &tmpKLine); err != nil {
		log.Println("Error unmarshal the kline:", err)
		return
	}

	if tmpKLine["k"] == nil {
		log.Println("Empty kline data.")
		return
	}

	kLineData, err := json.Marshal(tmpKLine["k"])
	if err != nil {
		log.Println("Error marshaling stream data:", tmpKLine["k"])
		return
	}

	tmpKLine = kline.KLine{}
	if err := json.Unmarshal(kLineData, &tmpKLine); err != nil {
		log.Println("Error unmarshal the kline data:", err)
		return
	}

	if kLine, err := tmpKLine.ConvertToKLine(); err == nil {
		if kLine.IsClosed {
			log.Printf("kLine %s: %v \n", period, kLine)
			for _, e := range emaIntervals {
				b.kLines[pair][period][e].InsertValue(kLine)
			}

			b.processKLine(kLine)
		}
	}
}
