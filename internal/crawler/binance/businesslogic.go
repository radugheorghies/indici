package binance

import (
	"encoding/json"
	"log"
	"moontrade/internal/kline"
	"moontrade/internal/trades"
	"strings"
)

func (b *Binance) processTrade(t trades.AggTrade) {
	// check if we have the right order of the trades
	if tID, ok := b.TradesIDs[t.Symbol]; ok {
		if tID+1 != t.TradeID {
			// we have a trade missing
			// to do some action here
			log.Println("Trade with ID is missing")
		}
	}
	// log.Println("Trade:", t)
	b.TradesIDs[t.Symbol] = t.TradeID

	b.lastValue[t.Symbol] = t.Price
	b.calculateInice()

	if err := b.wamp.Publish("trades", nil, []interface{}{t}, nil); err != nil {
		log.Println("Problem occurred while publishing the trade:", err)
	}
}

func (b *Binance) processKLine(t kline.KLineData) {
	// check if we have the right order of the trades
	// if tID, ok := b.TradesIDs[t.Symbol]; ok {
	// 	if tID+1 != t.TradeID {
	// 		// we have a trade missing
	// 		// to do some action here
	// 		// log.Println("Trade with ID is missing")
	// 	}
	// }
	value, _ := json.Marshal(t)
	if err := b.wamp.Publish("kline", nil, []interface{}{value}, nil); err != nil {
		log.Println("Problem occurred while publishing the wallets:", err)
	}
	log.Printf("KLine: %s\n", value)

	// b.TradesIDs[t.Symbol] = t.TradeID

}

func (b *Binance) calculateInice() {
	for _, pair := range pairs {
		if _, ok := b.lastValue[strings.ToUpper(pair)]; !ok {
			log.Println("last value not exist for pair:", pair)
			return
		}
	}

	values := []float64{0, 0, 0, 0}
	var theIndex float64

	for index, pair := range pairs {
		values[index] = b.lastValue[strings.ToUpper(pair)] * pondere[pair] * rap[pair]
		theIndex += values[index]
	}

	if err := b.wamp.Publish("indice", nil, []interface{}{theIndex}, nil); err != nil {
		log.Println("Problem occurred while publishing the indice value:", err)
	}

}
