"use strict"

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

// winners is a mtgBracketWinners object
function createAndDisplayCompression(bracket_winners) {
	console.log("testing printing argument");
	console.log(bracket_winners.printDebugString());
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            console.log(data);

            let compressed = new Array();
            let myMap = new Map();
            // Create the map from the response.
            for (let i = 0; i < data.length; i++) {
				myMap.set(data[i], i);
            }

            for (let i = 0; i < 9; i++) {
				let branch_winners = bracket_winners.getBranchWinners(i);
				// If this branch hasn't been created yet, fill it with 
				//if (branch_winners == null) {
				//	continue;
				//}
				let arr = branch_winners.getFullBranch();
				for (let j = 0; j < arr.length; j++) {
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
function fillMtgBracketWinners(comp, bracket_winners, division, set_onclick) {

	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	//console.log("aaa");
		    //bracket_winners.printDebugString();
		    
        	//console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            //console.log(data);

            let converted_cards = new Array();
            let myMap = new Map();
            // Create the map from the response.
            for (let i = 0; i < data.length; i++) {
				myMap.set(i, data[i]);
            }
            //console.log("map is: ");
            //console.log(myMap);

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

			//compressed.join(",");
			// 'compessed' now has the string to display
			//console.log("bbb");
		    //bracket_winners.printDebugString();
		    showBranch(division, set_onclick, bracket_winners);
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q=all", true);
    xmlhttp.send();
}

function fillActualMtgBracketWinners(division, set_onclick, bracket_winners) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
       	if (this.readyState == 4 && this.status == 200) {
       		let data = JSON.parse(this.responseText);
       		console.log(data[0].string);

       		fillMtgBracketWinners(data[0].string, bracket_winners, division, set_onclick)
       	}
    };
    xmlhttp.open("GET","get_compressed_128.php", true);
    xmlhttp.send();
}