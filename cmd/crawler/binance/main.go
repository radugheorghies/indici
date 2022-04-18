package main

import (
	"context"
	"moontrade/internal/crawler/binance"
)

func main() {
	b := binance.New()
	b.Run(context.Background())
}
