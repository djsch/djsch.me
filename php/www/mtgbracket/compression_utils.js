"use strict"

// Given a positive int 3 digits or less, pad it with leading '0' characters
// to make it exactly 3 digits, then return the corresponding string.
function padInt(i) {
	if (i >= 100) {
		return i.toString();
	}
	else if (i >= 10) {
		let ret = "0";
		ret = ret + i.toString();
		return ret;
	}
	else {
		let ret = "00";
		ret = ret + i.toString();
		return ret;
	}
}

// Given a string representing an int up to 3 digits long, return
// the corresponding int.
function unpadString(str) {
	if (str == "xxx") {
		return -1;
	}
	if (str.charAt(0) == '0') {
		if (str.charAt(1) == '0') {
			return parseInt(str.substring(2, 3));
		}
		else {
			return parseInt(str.substring(1, 3));
		}
	}
	else {
		return parseInt(str);
	}
}

// Given an mtgBracketWinners object, display its corresponding compression string.
function createAndDisplayCompression(bracket_winners) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);

            let compressed = new Array();
            let myMap = new Map();

            // Create the card-to-string map from the response.
            for (let i = 0; i < data.length; i++) {
				myMap.set(data[i], i);
            }

            // For each branch...
            for (let i = 0; i < 9; i++) {
				let branch_winners = bracket_winners.getBranchWinners(i);
				let arr = branch_winners.getFullBranch();
				// ...for each card...
				for (let j = 0; j < arr.length; j++) {
					// ...append the corresponding string to 'compressed'.
					if (arr[j] == "") {
						compressed.push("xxx");
					}
					else {
						let result = myMap.get(arr[j]);
						if (result == null) {
							throw "Couldn't find that card in the map: " + arr[j];
							//compressed.push("xxx");
						}
						else {
							compressed.push(padInt(result));
						}
					}
				}
			}

			let value = compressed.join("");
			// 'compessed' now has the string to display
			document.getElementById("saved_bracket").value = value;
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q=all", true);
    xmlhttp.send();
}

// comp is a string of compressed winners
// bracket_winners is an mtgBracketWinners object (that will have its data overwritten)
// if bracket_to_load is filled in, display that bracket instead, but also load
function fillMtgBracketWinners(comp, bracket_winners, division, second_bracket_string_to_load, second_bracket_to_load, show_compare=false) {

	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);

            let converted_cards = new Array();
            let myMap = new Map();
            // Create the map from the response.
            for (let i = 0; i < data.length; i++) {
				myMap.set(i, data[i]);
            }

            let i = 0;
            while (i < comp.length) {
            	let num = unpadString(comp.substring(i, i+3));
            	//console.log("got num: " + num);
            	if (num == -1) {
            		converted_cards.push("");
            	}
            	else {
            		let card = myMap.get(num);
            		//console.log("got card: " + card);
            		converted_cards.push(card);
            	}
            	i += 3;
            }
           
            bracket_winners.update(converted_cards);

			// 'compessed' now has the string to display
		    if (second_bracket_string_to_load != "") {
		    	fillMtgBracketWinners(second_bracket_string_to_load, second_bracket_to_load, 0, "", null, true);
		    }
		    else {
		    	showBranch(division, false, bracket_winners, show_compare);
		    }
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q=all", true);
    xmlhttp.send();
}

function fillActualMtgBracketWinners(division, bracket_winners, bracket_string_to_load, bracket_to_load) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
       	if (this.readyState == 4 && this.status == 200) {
       		let data = JSON.parse(this.responseText);
       		console.log(data[0].string);

       		fillMtgBracketWinners(data[0].string, bracket_winners, division, bracket_string_to_load, bracket_to_load)
       	}
    };
    xmlhttp.open("GET","get_compressed_128.php", true);
    xmlhttp.send();
}