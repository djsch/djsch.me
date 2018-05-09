"use strict"

// Given 3 properties from different Set cards, checks if all the 
// properties are all the same or all different.
function isSetProperty(val1, val2, val3) {
	if (val1 == val2 && val2 == val3) {
		return true;
	}
	if (val1 != val2 && val1 != val3 && val2 != val3) {
		return true;
	}
	return false;
}

// Given 3 SetCard objects, checks if they form a set.
function isSet(card1, card2, card3) {
	if (isSetProperty(card1.number, card2.number, card3.number) &&
		isSetProperty(card1.type, card2.type, card3.type) &&
		isSetProperty(card1.color, card2.color, card3.color) &&
		isSetProperty(card1.shape, card2.shape, card3.shape)) {
		return true;
	} else {
		return false;
	}
}

// Changes the border of the i-th card on the board to red.
function switchToRed(i) {
	let s = "image" + i;
	let image = document.getElementById(s);
	image.src = cards[i].getFilename("red");
}

// Changes the borders of all the cards on the board to black.
function switchAllToBlack() {
	for (let i = 0; i < cards.length; i++) {
		let s = "image" + i;
		let image = document.getElementById(s);
		image.src = cards[i].getFilename("black");
	}
}

// Helper function to determine if an array contains a particular element.
function arrayContains(arr, elem) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] == elem) {
			return true;
		}
	}
	return false;
}

// Shifts all cards on the board down to fill in any empty spaces.
// args:
// -- indices: The indices of the board that are currently empty.
function condenseCards(indices) {
	let index = 0;
	for (let i = 0; i < cards.length; i++) {
		while (arrayContains(indices, index)) {
			index++;
		}
		cards[i] = cards[index];
		index++;
	}

	cards.length = cards.length - 3;

	for (let i = 0; i < cards.length; i++) {
		let str = "image" + i;
		let image = document.getElementById(str);
		image.src = cards[i].getFilename("black");
	}

	removeRow();
}

// Returns whether a set exists on the board or not.
function doesSetExist() {
	for (let i = 0; i < cards.length; i++) {
		for (let j = 0; j < cards.length; j++) {
			for (let k = 0; k < cards.length; k++) {
				if (i == j || i == k || j == k) {
					continue;
				}
				if (isSet(cards[i], cards[j], cards[k])) {
					return true;
				}
			}
		}
	}
	return false;
}

// Register the i-th card of the board as clicked on. If 3 cards have
// been clicked on, check if they are a Set and add/remove cards if so.
function onImageClick(i) {
	switchToRed(i);

	// Track the cards clicked on so we can determine if they are a set.
	potentialSet.push(cards[i]);
	potentialSetIndices.push(i);
	if (potentialSet.length == 3) {
		// Check that the same card was not clicked on multiple times.
		if (potentialSet[0] != potentialSet[1] && potentialSet[0] != potentialSet[2] && potentialSet[1] != potentialSet[2]) {
			if (isSet(potentialSet[0], potentialSet[1], potentialSet[2])) {

				// If there are more than 12 cards on the board, don't add more. Instead
				// condense the existing cards on the board.
				if (cards.length > 12) {
					condenseCards(potentialSetIndices);
				}
				else {
					for (let i = 0; i < 3; i++) {
						fillWithRandomCard(potentialSetIndices[i]);
					}
				}
				updateDeckSize();
			}
		}
		potentialSet.length = 0;
		potentialSetIndices.length = 0;

		switchAllToBlack();
	}
}

// Update the header displaying the number of cards left in the deck.
function updateDeckSize() {
	let deck_size = document.getElementById("deck_size");
	let str = ("Cards left in deck: " + deck.length);
	deck_size.innerHTML = str;
}

// Fills the i-th spot on the board with a random card from the deck.
function fillWithRandomCard(i) {
	if (deck.length == 0) {
		let str = "image" + i;
		let card = document.getElementById(str);
		setCardHidden(i);
		return;
	}
	let s = "image" + i;
	let image = document.getElementById(s);
	let index = Math.floor(Math.random() * deck.length);
	let card = deck[index];
	deck.splice(index, 1);
	image.src = card.getFilename("black");
	cards[i] = card;
}

// Prints a debug string to the console.
function printDebugString() {
	console.log("there are " + deck.length + " cards left in the deck");
	console.log("there are " + cards.length + " cards out right now");
	let debugString = "";
	for (let i = 0; i < deck.length; i++) {
		debugString += deck[i].getFilename("black");
		debugString += '\n';
	}
}

// Sets the given card_img HTML element visible.
function setCardVisible(card_img) {
	card.style.visibilty = "visible";
	card.style.width = "200px";
	card.style.height = "150px";
}

// Sets the given card_img HTML element hidden.
function setCardHidden(card_img) {
	card.style.visibilty = "hidden";
	card.style.width = "0px";
	card.style.height = "0px";
}

// Adds a row of cards to the current board.
function addRow() {
	if (deck.length == 0) {
		return;
	}

	if (doesSetExist()) {
		console.log("You can't add cards -- there's a set!");
		//return;
	}

	if (cards.length != 12 && cards.length != 15) {
		throw "Unexpected number of cards: " + cards.length;
	}
	let len = cards.length;
	for (let i = len; i < len + 3; i++) {
		let str = "image" + i;
		let card = document.getElementById(str);
		setCardVisible(card);
		fillWithRandomCard(i);
	}
	updateDeckSize();
}

// Removes the last row of cards from the current board.
function removeRow() {
	if (cards.length != 12 && cards.length != 15) {
		throw "Unexpected number of cards: " + cards.length;
	}
	let len = cards.length;
	for (let i = len; i < len + 3; i++) {
		let str = "image" + i;
		let card = document.getElementById(str);
		setCardHidden(card);
	}
}

// Resets the board to begin a new game.
function resetBoard() {
	console.log("restting board");
	deck = [];
	// create the array of cards
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let k = 0; k < 3; k++) {
				for (let m = 0; m < 3; m++) {
					let card = new SetCard(i, j, k, m);
					deck.push(card);
				}
			}
		}
	}

	for (let i = 0; i < 12; i++) {
		fillWithRandomCard(i);
	}

	updateDeckSize();
}

let deck = [];
let cards = [];
let potentialSet = [];
let potentialSetIndices = [];

let button = document.getElementById("button");
button.onclick = resetBoard;

let addCardsButton = document.getElementById("addCardsButton");
addCardsButton.onclick = addRow;

//let debugButton = document.getElementById("debugButton");
//debugButton.onclick = printDebugString;

resetBoard();
