package kline

import (
	"errors"
	"fmt"
	"strconv"
	"sync"
)

// KLine is the row kline from markets
type KLine map[string]interface{}

// AggTrade represent the aggregated data from a trade
type KLineData struct {
	OpenPrice      float64
	ClosePrice     float64
	HighPrice      float64
	LowPrice       float64
	Volume         float64
	BuyVolume      float64
	SellVolume     float64
	NumberOfTrades int64
	IsClosed       bool
}

// Node of the list
type Node struct {
	KLineData  // Embedded struct
	next, prev *Node
}

// List structure
type List struct {
	Head, Tail *Node
	Length     int
	MaxLength  int
	sync.Mutex
}

// New create a new list
func New() *List {
	return &List{
		Head:   nil,
		Tail:   nil,
		Length: 0,
	}
}

// First return the first node
func (l *List) First() *Node {
	return l.Head
}

// Last return the first node
func (l *List) Last() *Node {
	return l.Tail
}

// Next node of the list
func (n *Node) Next() *Node {
	if n != nil {
		return n.next
	}
	return nil
}

// Prev node of the list
func (n *Node) Prev() *Node {
	if n != nil {
		return n.prev
	}
	return nil
}

// Push add new node with value as the last node in list
func (l *List) Push(v KLineData) *List {
	n := &Node{KLineData: v}
	if l.Head == nil {
		l.Head = n // First node
	} else {
		l.Tail.next = n // Add after prev last node
		n.prev = l.Tail // Link back to prev last node
	}
	l.Tail = n // reset Tail to newly added node
	l.Length++
	return l
}

// Delete node from the list
func (l *List) Delete(node *Node) bool {
	success := false
	if node != nil {

		switch node {
		case l.First():
			if l.Length == 1 {
				l.Length = 0
				l.Head = nil
				l.Tail = nil
			} else {
				nextNode := node.next
				nextNode.prev = nil
				node.next = nil
				l.Head = nextNode
				l.Length--
			}
			success = true
		case l.Last():
			if l.Length == 1 {
				l.Length = 0
				l.Head = nil
				l.Tail = nil
			} else {
				prevNode := node.prev
				prevNode.next = nil
				node.prev = nil
				l.Tail = prevNode
				l.Length--
			}
			success = true
		default:
			prevNode := node.prev
			nextNode := node.next
			// Remove this node
			prevNode.next = node.next
			nextNode.prev = node.prev
			l.Length--

			success = true
		}
	}
	return success
}

// InsertValue update the candlestick with the new value
func (l *List) InsertValue(value KLineData) {
	l.Lock()
	defer l.Unlock()
	l.Push(value)
	l.CleanOldData()
}

// CleanOldData will purge the old values from the list
func (l *List) CleanOldData() {
	for l.Length > l.MaxLength {
		l.Delete(l.First())
	}
}

func (k KLine) ConvertToKLine() (KLineData, error) {
	var err error
	a := KLineData{}

	if a.OpenPrice, err = strconv.ParseFloat(fmt.Sprintf("%v", k["o"]), 64); err != nil {
		return a, err
	}

	if a.ClosePrice, err = strconv.ParseFloat(fmt.Sprintf("%v", k["c"]), 64); err != nil {
		return a, err
	}

	if a.HighPrice, err = strconv.ParseFloat(fmt.Sprintf("%v", k["h"]), 64); err != nil {
		return a, err
	}

	if a.LowPrice, err = strconv.ParseFloat(fmt.Sprintf("%v", k["l"]), 64); err != nil {
		return a, err
	}

	if tradeType, ok := k["x"].(bool); !ok {
		err := errors.New("could not convert close argument")
		return a, err
	} else {
		a.IsClosed = tradeType
	}

	if tmpNuberOfTrades, err := strconv.ParseFloat(fmt.Sprintf("%v", k["n"]), 64); err != nil {
		return a, err
	} else {
		a.NumberOfTrades, err = strconv.ParseInt(fmt.Sprintf("%.0f", tmpNuberOfTrades), 10, 64)
		if err != nil {
			return a, err
		}
	}

	if a.Volume, err = strconv.ParseFloat(fmt.Sprintf("%v", k["v"]), 64); err != nil {
		return a, err
	}

	if a.SellVolume, err = strconv.ParseFloat(fmt.Sprintf("%v", k["l"]), 64); err != nil {
		return a, err
	}

	a.BuyVolume = a.Volume - a.SellVolume

	return a, err
}

func ConvertArrayToKLine(v []interface{}) (KLineData, error) {
	var err error
	a := KLineData{}

	if a.OpenPrice, err = strconv.ParseFloat(fmt.Sprintf("%v", fmt.Sprintf("%v", v[1])), 64); err != nil {
		return a, err
	}

	if a.ClosePrice, err = strconv.ParseFloat(fmt.Sprintf("%v", fmt.Sprintf("%v", v[4])), 64); err != nil {
		return a, err
	}

	if a.HighPrice, err = strconv.ParseFloat(fmt.Sprintf("%v", fmt.Sprintf("%v", v[2])), 64); err != nil {
		return a, err
	}

	if a.LowPrice, err = strconv.ParseFloat(fmt.Sprintf("%v", fmt.Sprintf("%v", v[3])), 64); err != nil {
		return a, err
	}

	a.IsClosed = true

	if tmpNuberOfTrades, err := strconv.ParseFloat(fmt.Sprintf("%v", fmt.Sprintf("%v", v[8])), 64); err != nil {
		return a, err
	} else {
		a.NumberOfTrades, err = strconv.ParseInt(fmt.Sprintf("%.0f", tmpNuberOfTrades), 10, 64)
		if err != nil {
			return a, err
		}
	}

	if a.Volume, err = strconv.ParseFloat(fmt.Sprintf("%v", fmt.Sprintf("%v", v[5])), 64); err != nil {
		return a, err
	}

	if a.SellVolume, err = strconv.ParseFloat(fmt.Sprintf("%v", fmt.Sprintf("%v", v[9])), 64); err != nil {
		return a, err
	}

	a.BuyVolume = a.Volume - a.SellVolume

	return a, err
}
