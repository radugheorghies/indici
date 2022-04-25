package binance

import (
	"encoding/json"
	"fmt"
	"log"
	"moontrade/internal/kline"
	"moontrade/internal/trades"
	"strings"
	"time"
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

func (b *Binance) sendDataToFrontend(pair, interval string, tmpK *kline.KLineData) {
	var k *kline.Node
	frp := FrontendPayload{
		Data: make([]FrKLine, b.kLines[pair][interval].Length),
		Pair: strings.ToUpper(pair),
	}

	if tmpK == nil {
		k = b.kLines[pair][interval].First()
	} else {
		k = b.kLines[pair][interval].First().Next()
	}

	for i := 0; k != nil; i++ {
		frp.Data[i] = FrKLine{
			T: fmt.Sprint(time.Now().UTC().Add(-time.Minute*time.Duration((b.kLines[pair][interval].Length-i)*5)).Format("2006-01-02T15:04:05Z07:00")) + "Z",
			O: k.OpenPrice,
			C: k.ClosePrice,
			H: k.HighPrice,
			L: k.LowPrice,
			V: k.Volume,
		}
		k = k.Next()
	}

	if tmpK != nil {
		frp.Data[len(frp.Data)-1] = FrKLine{
			T: fmt.Sprint(time.Now().UTC().Format("2006-01-02T15:04:05Z07:00")) + "Z",
			O: tmpK.OpenPrice,
			C: tmpK.ClosePrice,
			H: tmpK.HighPrice,
			L: tmpK.LowPrice,
			V: tmpK.Volume,
		}
	}

	if err := b.wamp.Publish("kline", nil, []interface{}{frp}, nil); err != nil {
		log.Println("Problem occurred while publishing the wallets:", err)
	}

	b.lastKLineSent[pair] = time.Now()
}

func (b *Binance) sendIndiceDataToFrontend(interval string, tmpK *kline.KLineData) {
	var k *kline.Node
	frp := FrontendPayload{
		Data: make([]FrKLine, b.indiceKLine[interval].Length),
	}

	if tmpK == nil {
		k = b.indiceKLine[interval].First()
	} else {
		k = b.indiceKLine[interval].First().Next()
	}

	for i := 0; k != nil; i++ {
		frp.Data[i] = FrKLine{
			T: fmt.Sprint(time.Now().UTC().Add(-time.Minute*time.Duration((b.indiceKLine[interval].Length-i)*5)).Format("2006-01-02T15:04:05Z07:00")) + "Z",
			O: k.OpenPrice,
			C: k.ClosePrice,
			H: k.HighPrice,
			L: k.LowPrice,
			V: k.Volume,
		}
		k = k.Next()
	}

	if tmpK != nil {
		frp.Data[len(frp.Data)-1] = FrKLine{
			T: fmt.Sprint(time.Now().UTC().Format("2006-01-02T15:04:05Z07:00")) + "Z",
			O: tmpK.OpenPrice,
			C: tmpK.ClosePrice,
			H: tmpK.HighPrice,
			L: tmpK.LowPrice,
			V: tmpK.Volume,
		}
	}

	if err := b.wamp.Publish("indicekline", nil, []interface{}{frp}, nil); err != nil {
		log.Println("Problem occurred while publishing the wallets:", err)
	}

	b.lastIndiceKLineSent = time.Now()
}

func (b *Binance) calculateInice() {
	for _, pair := range pairs {
		if _, ok := b.lastValue[strings.ToUpper(pair)]; !ok {
			log.Println("last value not exist for pair:", pair)
			return
		}
	}

	values := make([]float64, len(pairs))
	var theIndex float64

	for index, pair := range pairs {
		values[index] = b.lastValue[strings.ToUpper(pair)] * pondere[pair] * rap[pair]
		theIndex += values[index]
	}

	if err := b.wamp.Publish("indice", nil, []interface{}{theIndex}, nil); err != nil {
		log.Println("Problem occurred while publishing the indice value:", err)
	}

}

func (b *Binance) calculateIniceKLine() {

	nodes := make([]*kline.Node, len(pairs))

	// initialization
	for index, pair := range pairs {
		log.Println(intervals[0])
		log.Println("The node:", b.kLines[pair][intervals[0]])
		nodes[index] = b.kLines[pair][intervals[0]].First()
	}

	for nodes[0] != nil {
		kLineData := kline.KLineData{
			IsClosed: true,
		}

		for index, pair := range pairs {
			kLineData.OpenPrice += nodes[index].OpenPrice * pondere[pair] * rap[pair]
			kLineData.ClosePrice += nodes[index].ClosePrice * pondere[pair] * rap[pair]
			kLineData.HighPrice += nodes[index].HighPrice * pondere[pair] * rap[pair]
			kLineData.LowPrice += nodes[index].LowPrice * pondere[pair] * rap[pair]
			kLineData.Volume += nodes[index].Volume * pondere[pair] * rap[pair]
		}

		b.indiceKLine[intervals[0]].InsertValue(kLineData)

		// go ti the next node
		for index := range pairs {
			nodes[index] = nodes[index].Next()
		}
	}

	b.sendIndiceDataToFrontend(intervals[0], nil)

}
