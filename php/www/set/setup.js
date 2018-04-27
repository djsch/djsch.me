"use strict"

class Card {
	constructor(number, type, color, shape) {
		this.number = number;
		this.type = type;
		this.color = color;
		this.shape = shape;
	}

	get number() {
		return this._number;
	}

	set number(value) {
		this._number = value;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	get color() {
		return this._color;
	}

	set color(value) {
		this._color = value;
	}

	get shape() {
		return this._shape;
	}

	set shape(value) {
		this._shape = value;
	}

	getFilename(color) {
		let s = ""
		if (color == "red") {
			s += "red_border/";
		} else if (color == "black") {
			s += "black_border/";
		}

		if (this._number == 0) {
			s += "one_";
		} else if(this._number == 1) {
			s += "two_";
		} else if(this._number == 2) {
			s += "three_";
		}

		if (this._type == 0) {
			s += "hollow_";
		} else if(this._type == 1) {
			s += "shaded_";
		} else if(this._type == 2) {
			s += "solid_";
		}

		if (this._color == 0) {
			s += "green_";
		} else if(this._color == 1) {
			s += "purple_";
		} else if(this._color == 2) {
			s += "red_";
		}

		if (this._shape == 0) {
			s += "diamond";
		} else if(this._shape == 1) {
			s += "oval";
		} else if(this._shape == 2) {
			s += "squiggly";
		}
		s += ".jpg";
		return s;
	}

	stringInfo() {
		return "" + this._number + this._type + this._color + this._shape;
	}
	
}

function isSetProperty(val1, val2, val3) {
	if (val1 == val2 && val2 == val3) {
		return true;
	}
	if (val1 != val2 && val1 != val3 && val2 != val3) {
		return true;
	}
	return false;
}

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

// i is int of card to switch
function switchToRed(i) {
	let s = "image" + i;
	let image = document.getElementById(s);
	//alert("there are " + arr.length + "cards left");
	//let index = Math.floor(Math.random() * arr.length);
	//alert("getting card: " + card.getFilename());
	image.src = cards[i].getFilename("red");
	//cards.push(card);
}

function switchAllToBlack() {
	for (let i = 0; i < cards.length; i++) {
		let s = "image" + i;
		let image = document.getElementById(s);
		image.src = cards[i].getFilename("black");
	}
}

function arrayContains(arr, elem) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] == elem) {
			return true;
		}
	}
	return false;
}


//13, 3, 8
//12, 13, 14

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
		let s = "image" + i;
		let image = document.getElementById(s);
		let card = cards[i];
		image.src = card.getFilename("black");
	}

	removeCards();
}

function onImageClick(i) {
	//alert ("clicked on button" + i);
	//alert ("there are " + arr.length + " elements in the list");
	//alert("filename is: " + cards[i].getFilename("black"));
	switchToRed(i);

	potentialSet.push(cards[i]);
	potentialSetIndices.push(i);
	if (potentialSet.length == 3) {
		if (potentialSet[0] == potentialSet[1] || potentialSet[0] == potentialSet[2] || potentialSet[1] == potentialSet[2]) {
				
		}
		else if (isSet(potentialSet[0], potentialSet[1], potentialSet[2])) {

			//alert("you found a set");
			if (cards.length > 12) {
				condenseCards(potentialSetIndices);
			}
			else {
				for (let i = 0; i < 3; i++) {
					fillWithRandomCard(arr, potentialSetIndices[i]);
				}
			}
		} else {
			//alert("that's not a set");
		}
		potentialSet.length = 0;
		potentialSetIndices.length = 0;

		switchAllToBlack();
	}
}

function emptyCard(i) {
	let s = "image" + i
	let card = document.getElementById(s);
	card.style.visibilty = "hidden";
	card.style.width = "0px";
	card.style.height = "0px";
}

// arr is an array of cards
// i is the image to fill
function fillWithRandomCard(arr, i) {
	if (arr.length == 0) {
		emptyCard(i);
		return;
	}
	let s = "image" + i;
	let image = document.getElementById(s);
	//alert("there are " + arr.length + "cards left");
	let index = Math.floor(Math.random() * arr.length);
	let card = arr[index];
	arr.splice(index, 1);
	//alert("getting card: " + card.getFilename());
	image.src = card.getFilename("black");
	//cards.push(card);
	cards[i] = card;
}

function status() {
	console.log("there are " + arr.length + " cards left in the deck");
	console.log("there are " + cards.length + " cards out right now");
	let debugString = "";
	for (let i = 0; i < arr.length; i++) {
		//arr[i].stringInfo();
		debugString += arr[i].getFilename("black");
		debugString += '\n';
	}
	//console.log(debugString);
}

function addCards() {
	if (arr.length == 0) {
		return;
	}
	console.log("in function");
	if (cards.length == 12) {
		console.log("adding cards");
		let card = document.getElementById("image12");
		card.style.visibilty = "visible";
		card.style.width = "200px";
		card.style.height = "150px";
		card = document.getElementById("image13");
		card.style.visibilty = "visible";
		card.style.width = "200px";
		card.style.height = "150px";
		card = document.getElementById("image14");
		card.style.visibilty = "visible";
		card.style.width = "200px";
		card.style.height = "150px";
		fillWithRandomCard(arr, 12);
		fillWithRandomCard(arr, 13);
		fillWithRandomCard(arr, 14);
	}
	else if (cards.length == 15) {
		console.log("adding cards");
		let card = document.getElementById("image15");
		card.style.visibilty = "visible";
		card.style.width = "200px";
		card.style.height = "150px";
		card = document.getElementById("image16");
		card.style.visibilty = "visible";
		card.style.width = "200px";
		card.style.height = "150px";
		card = document.getElementById("image17");
		card.style.visibilty = "visible";
		card.style.width = "200px";
		card.style.height = "150px";
		fillWithRandomCard(arr, 15);
		fillWithRandomCard(arr, 16);
		fillWithRandomCard(arr, 17);
	}
}

function removeCards() {
	if (cards.length == 12) {
		let card = document.getElementById("image12");
		card.style.visibilty = "hidden";
		card.style.width = "0px";
		card.style.height = "0px";
		card = document.getElementById("image13");
		card.style.visibilty = "hidden";
		card.style.width = "0px";
		card.style.height = "0px";
		card = document.getElementById("image14");
		card.style.visibilty = "hidden";
		card.style.width = "0px";
		card.style.height = "0px";
	}
	else if (cards.length == 15) {
		console.log("adding cards");
		let card = document.getElementById("image15");
		card.style.visibilty = "hidden";
		card.style.width = "0px";
		card.style.height = "0px";
		card = document.getElementById("image16");
		card.style.visibilty = "hidden";
		card.style.width = "0px";
		card.style.height = "0px";
		card = document.getElementById("image17");
		card.style.visibilty = "hidden";
		card.style.width = "0px";
		card.style.height = "0px";
	}
}

function resetBoard() {
	console.log("restting board");
	arr = [];
	// create the array of cards
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let k = 0; k < 3; k++) {
				for (let m = 0; m < 3; m++) {
					let card = new Card(i, j, k, m);
					arr.push(card);
				}
			}
		}
	}

	for (let i = 0; i < 12; i++) {
		fillWithRandomCard(arr, i);
	}
	//alert ("there are " + arr.length + " elements in the list");
	//for (let i = 0; i < arr.length; i++) {
	//	arr[i].printStuff();
	//}
}

let arr = [];
let cards = [];
let potentialSet = [];
let potentialSetIndices = [];

let button = document.getElementById("button");
button.onclick = resetBoard;

let addCardsButton = document.getElementById("addCardsButton");
addCardsButton.onclick = addCards;

let debugButton = document.getElementById("debugButton");
debugButton.onclick = status;

resetBoard();

// TODO: Implement adding extra cards if there's no set
// Button to verify that there are no sets?
// Check the ending is working, do something there
// Cards left as a title