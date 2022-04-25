package binance

import (
	"context"
	"encoding/json"
	"log"
	"moontrade/internal/ema"
	"moontrade/internal/kline"
	"moontrade/internal/trades"
	"time"
)

// Comand send thru sockets
type Comand struct {
	Method string   `json:"method"`
	Params []string `json:"params"`
	ID     int64    `json:"id"`
}

func New() *Binance {
	b := Binance{
		TradesIDs:      make(map[string]int64),
		kLines:         make(map[string]map[string]*kline.List),
		indiceKLine:    make(map[string]*kline.List),
		tmpKLine:       make(map[string]map[string]kline.KLineData),
		tmpIndiceKLine: make(map[string]kline.KLineData),
		ema:            make(map[string]map[int]*ema.EWMA),
		lastValue:      make(map[string]float64),
		lastKLineSent:  make(map[string]time.Time),
	}

	for _, pair := range pairs {
		b.kLines[pair] = make(map[string]*kline.List)
		b.tmpKLine[pair] = make(map[string]kline.KLineData)
		b.ema[pair] = make(map[int]*ema.EWMA)

		for _, interval := range intervals {
			b.kLines[pair][interval] = kline.New()
			b.kLines[pair][interval].MaxLength = maxEmaIntervals + 2
		}

		for _, emaInterval := range emaIntervals {
			b.ema[pair][emaInterval] = ema.New(emaInterval)
		}
	}

	for _, interval := range intervals {
		b.indiceKLine[interval] = kline.New()
		b.indiceKLine[interval].MaxLength = maxEmaIntervals + 2
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
			//for _, e := range emaIntervals {
			b.kLines[pair][period].InsertValue(kLine)
			//}

			b.processKLine(kLine)

			b.sendDataToFrontend(pair, period, nil)
		} else {
			b.tmpKLine[pair][period] = kLine

			timeDiff := time.Since(b.lastKLineSent[pair])
			if timeDiff > 5*time.Second {
				b.sendDataToFrontend(pair, period, &kLine)
			}
		}

		// calculate indice kline
		indiceKLineData := kline.KLineData{
			IsClosed: true,
		}

		for _, pair := range pairs {
			indiceKLineData.OpenPrice += b.tmpKLine[pair][period].OpenPrice * pondere[pair] * rap[pair]
			indiceKLineData.ClosePrice += b.tmpKLine[pair][period].ClosePrice * pondere[pair] * rap[pair]
			indiceKLineData.HighPrice += b.tmpKLine[pair][period].HighPrice * pondere[pair] * rap[pair]
			indiceKLineData.LowPrice += b.tmpKLine[pair][period].LowPrice * pondere[pair] * rap[pair]
			indiceKLineData.Volume += b.tmpKLine[pair][period].Volume * pondere[pair] * rap[pair]
		}

		b.tmpIndiceKLine[period] = indiceKLineData

		timeDiff := time.Since(b.lastIndiceKLineSent)
		if timeDiff > 5*time.Second {
			b.sendIndiceDataToFrontend(period, &indiceKLineData)
		}
	}
}
