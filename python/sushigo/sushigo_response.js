"use strict"

class SushigoResponse {
	// TYPE:~~~~
	// if ERROR
	//   ERROR:string
	// if DEBUG
	//   DEBUG:string
	// if OK
	//   OK:POINTS:HAND:MY_CARDS:OPP_NAME,OPP_POINTS,OPP_CARD_1,OPP_CARD_2,...:<next opp>:etc
	// if WAIT
	//   WAIT
	constructor(responseString) {
		// TODO: store the response as something other
		// than just a string
		this.text = responseString;
	}

	getStatus() {
		let split = this.text.split(":");
		return split[0];
	}

	checkValidStatus() {
		let split = this.text.split(":");
		if (split[0] != "OK") {
			throw "Invalid status";
		}
	}

	getDebug() {
		let split = this.text.split(":");
		if (split[0] != "DEBUG") {
			throw "Invalid status";
		}
		if (split.length >= 2) {
			return split[1];
		}
		else {
			throw "Empty Debug";
		}
	}

	getError() {
		let split = this.text.split(":");
		if (split[0] != "ERROR") {
			throw "Invalid status";
		}
		if (split.length >= 2) {
			return split[1];
		}
		else {
			throw "Empty Error";
		}
	}

	getPoints() {
		this.checkValidStatus();
		let split = this.text.split(":");
		if (split.length >= 2) {
			if (split[1] == "") {
				return 0;
			}
			else {
				return parseInt(split[1]);
			}
		}
		else {
			return 0;
		}
	}

	getOpponentPoints(opp) {
		this.checkValidStatus();
		let split = this.text.split(":");
		if (split.length >= (5+opp)) {
			let opp_played = split[(4+opp)];
			if (opp_played == "") {
				return [];
			}
			opp_played = opp_played.split(",");
			//return opp_played;
			// slice to get just the points
			return parseInt(opp_played.slice(1, 2));
		}
		else {
			return "";
		}
	}

	getHand() {
		this.checkValidStatus();
		let split = this.text.split(":");
		if (split.length >= 3) {
			let hand = split[2];
			if (hand == "") {
				return [];
			}
			return hand.split(",");
			//return hand.shift();
		}
		else {
			return "";
		}
	}

	getPlayed() {
		this.checkValidStatus();
		let split = this.text.split(":");
		if (split.length >= 4) {
			let played = split[3];
			if (played == "") {
				return [];
			}
			played = played.split(",");
			//slice to remove the player name
			return played.slice(1);
		}
		else {
			return "";
		}
	}

	getNumOpponents() {
		this.checkValidStatus();
		let split = this.text.split(":");
		return split.length - 4;
	}

	// opp is the number opponent, 0-indexed
	getOppPlayed(opp) {
		this.checkValidStatus();
		let split = this.text.split(":");
		if (split.length >= (5+opp)) {
			let opp_played = split[(4+opp)];
			if (opp_played == "") {
				return [];
			}
			opp_played = opp_played.split(",");
			//return opp_played;
			// slice to remove player name and points
			return opp_played.slice(2);
		}
		else {
			return "";
		}
	}

	getText() {
		return this.text;
	}
}