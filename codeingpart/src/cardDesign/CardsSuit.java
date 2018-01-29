package cardDesign;

import java.util.ArrayList;
import java.util.Collections;

class Card {
	private CardValue cardValue;

	public Card(CardValue cardValue, Suit suit) {
		this.cardValue = cardValue;
		this.suit = suit;
	}

	public CardValue getCardValue() {
		return cardValue;
	}

	public Suit getSuit() {
		return suit;
	}

	private Suit suit;

}

class Deck {
	private ArrayList<Card> deck;

	public Deck() {
		this.deck = new ArrayList<>();
		for (int i = 0; i < 13; i++) {
			for (int j = 0; j < 4; j++) {
				this.deck.add(new Card(CardValue.values()[i], Suit.values()[j]));
			}
		}
	}

	public ArrayList<Card> getDeck() {
		return deck;
	}

	public void Shuffle() {
		Collections.shuffle(this.deck);
	}
}

public class CardsSuit {

	public static void main(String args[]) {
		Deck deck = new Deck();
		System.out.println(deck.getDeck());
		deck.Shuffle();
		System.out.println(deck.getDeck());
	}

}
