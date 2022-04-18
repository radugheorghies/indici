package ema

import (
	"log"
	"testing"
)

func TestNew(t *testing.T) {
	ema := New(3)
	log.Println("ema.warmup:", ema.warmup)
	if ema.warmup != 3 {
		t.Fatalf("Expected warmup value to be 3. Got %d", ema.warmup)
	}
}

func TestComputedValues(t *testing.T) {
	ema := New(10)
	ema.InputValues([]float64{45, 46, 43, 44, 42, 41, 40, 39, 41, 40, 38, 36})
	result := ema.ComputedValues()

	log.Println("EMA result:", result)
}
