package ema

import "errors"

// EWMA represents the exponentially weighted moving average of a series of numbers
type EWMA struct {
	// Warmup is number of values to start from (warmup values)
	warmup int
	// The multiplier factor by which the previous samples decay.
	decay float64
	// The number of samples added to this instance.
	count int
	// The current value of the average.
	value float64
	// All the computed values
	values []float64
	// Keeps all previous values
	Results []float64
}

// New gives a new EWMA instance
func New(warmup int) *EWMA {
	return &EWMA{
		warmup: warmup,
		decay:  2 / float64(warmup+1),
	}
}

// addValue adds a value to the series and updates the moving average.
func (e *EWMA) addValue(value float64) {
	switch {
	case e.count < e.warmup:
		e.count++
		e.value += value
	case e.count == e.warmup:
		e.count++
		e.value = e.value / float64(e.warmup)
		e.value = (value * e.decay) + (e.value * (1 - e.decay))
		e.values = append(e.values, e.value)
	default:
		e.value = (value * e.decay) + (e.value * (1 - e.decay))
		e.values = append(e.values, e.value)
	}
}

// InputValues loads multiple initial values to the series and updates the moving average.
func (e *EWMA) InputValues(values []float64) error {
	if e.warmup >= len(values) {
		return errors.New("Warmup must be strictly smaller than the length of the input values array")
	}

	e.reset()

	for _, value := range values {
		e.addValue(value)
	}

	return nil
}

// ComputedValues gives you all the computed values
func (e *EWMA) ComputedValues() []float64 {
	return e.values
}

// reset zeroes values that need to be reinitialized
func (e *EWMA) reset() {
	e.count = 0
	e.value = 0
	e.values = nil
}
