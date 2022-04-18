package trades

import (
	"errors"
	"fmt"
	"strconv"
)

// Trade is the row trade from markets
type Trade map[string]interface{}

// The model for trade is:
/*
{
  "e": "aggTrade",  // Event type
  "E": 123456789,   // Event time
  "s": "BNBBTC",    // Symbol
  "a": 12345,       // Aggregate trade ID
  "p": "0.001",     // Price
  "q": "100",       // Quantity
  "f": 100,         // First trade ID
  "l": 105,         // Last trade ID
  "T": 123456785,   // Trade time
  "m": true,        // Is the buyer the market maker?
  "M": true         // Ignore
}
*/

// AggTrade represent the aggregated data from a trade
type AggTrade struct {
	Symbol    string
	TradeID   int64
	Price     float64
	Quantity  float64
	Time      int64
	TradeType string // buy or sell
}

func (t Trade) ConvertToAggTrade() (AggTrade, error) {
	var err error
	a := AggTrade{}

	if a.Price, err = strconv.ParseFloat(fmt.Sprintf("%v", t["p"]), 64); err != nil {
		return a, err
	}

	if a.Quantity, err = strconv.ParseFloat(fmt.Sprintf("%v", t["q"]), 64); err != nil {
		return a, err
	}

	a.Symbol = fmt.Sprintf("%v", t["s"])

	if tmpTradeID, err := strconv.ParseFloat(fmt.Sprintf("%v", t["a"]), 64); err != nil {
		return a, err
	} else {
		a.TradeID, err = strconv.ParseInt(fmt.Sprintf("%.0f", tmpTradeID), 10, 64)
		if err != nil {
			return a, err
		}
	}

	if tmpTime, err := strconv.ParseFloat(fmt.Sprintf("%v", t["T"]), 64); err != nil {
		return a, err
	} else {
		a.Time, err = strconv.ParseInt(fmt.Sprintf("%.0f", tmpTime), 10, 64)
		if err != nil {
			return a, err
		}
	}

	if tradeType, ok := t["m"].(bool); !ok {
		err := errors.New("could not convert tradeType")
		return a, err
	} else {
		if tradeType {
			a.TradeType = "sell"
		} else {
			a.TradeType = "buy"
		}
	}

	return a, nil
}
