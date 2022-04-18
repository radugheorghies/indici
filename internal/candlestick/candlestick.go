package candlestick

import (
	"sync"
)

// Node of the list
type Node struct {
	NodeValue  interface{} // accepting all tipe of values
	next, prev *Node
}

// List structure
type List struct {
	Head, Tail        *Node
	Length, MaxLength int
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
func (l *List) Push(v interface{}) *List {
	n := &Node{NodeValue: v}
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

// InsertNode insert the candlestick with the new value
func (l *List) InsertNode(value interface{}, i int) {
	l.Lock()
	defer l.Unlock()
	// update candlestick list

	l.Push(value)
	l.CleanOldData()
}

// CleanOldData will purge the old values from the list
func (l *List) CleanOldData() {
	cNode := l.First()
	found := true

	for cNode != nil && found {
		if l.Length > l.MaxLength {
			l.Delete(cNode)
			cNode = l.First()
		}
	}
}
