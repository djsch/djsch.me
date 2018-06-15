"use strict"

// Create and return an HTML element that displays a bye.
function createBye(i) {
	let round_span = document.createElement("span");
	let bye = document.createElement("p");
	bye.className = "round_text";
	bye.innerHTML = "Round 1 Bye";
	round_span.appendChild(bye);
	return round_span;
}

// Fills the toggleableElements array with a list of elements that should be toggled
// on and off -- that is to say, all elements which were generated 'visible'. Elements
// which were generated 'hidden' should never be toggled on.
function fillToggleableElements() {
	let elements = document.getElementsByClassName("toggleable");
	console.log("elements is: " + elements.length);
	for (let i = 0; i < elements.length; i++) {
    	if (elements[i].style.visibility == "visible") {
    		toggleableElements.push(elements[i]);
    	}
	}
}

// Switches all toggleable elements on or off.
function toggleOverlay() {
    if (toggleableElements.length == 0) {
	   fillToggleableElements();
    }
	for (let i = 0; i < toggleableElements.length; i++) {
        toggleableElements[i].style.visibility = toggleableElements[i].style.visibility == 'hidden' ? 'visible' : 'hidden';
    }
}

// Adds the given card_name to the bracket at start_round and all lower rounds. Also
// recursively calls this function for all cards that card_name was matched against
// that are visible in the current bracket view.
function addRowFromRoot(card_name, start_round, start_col, start_row) {
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let data = JSON.parse(this.responseText);
            console.log(data);

            let cards = [];
			let percentages = [];
            for (let i = 2; i < 45; i+=3) {
            	if (data[i]) {
            		cards.push(data[i]);
            	}
            	if (data[i+1]) {
            		percentages.push(Number(data[i+1]));
            	}
			}

            let rounds_and_bracket = document.getElementById("bracket_span").childNodes;
            // horizontal, vertical, left, image (not x)
            let cur_col = start_col;
            let cur_row = start_row;
            let cur_round = start_round;
            // TODO can i put multiple statements in this for loop?
            //for (; cur_col >= 0; ) {
            //for (let i = cards.length-1; i >= 0; i--) {
            for (let i = start_col; i >= 0; i--) {
            	// horizontal, vertical, left, image (not x)
            	// TODO: cache the image somehow so I don't need to request it over and over and over again
				getAndSetCardImage(card_name, rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[0].childNodes[0]);
            	getAndSetCardImage(cards[cur_round-1], rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[1].childNodes[0])

            	// If there is no percentage here, the round is still open for voting, so hide the 'x'.
            	if (percentages.length <= cur_round-1) {
            		rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[1].childNodes[1].style.visibility = "hidden";
            	}
            	// If this is a bye, remove the 'x' and image, and instead display the 'bye'.
            	else if (cards[cur_round-1] == "(bye)") {
            		rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[1].childNodes[0].style.visibility = "hidden";
            		rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[1].childNodes[1].style.visibility = "hidden";
            		rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[1].childNodes[3].style.visibility = "visible";
            	}
            	// If there is a percentage, but it's less than 50, the card lost, show the left 'x'.
            	else if (percentages.length > cur_round-1 && percentages[cur_round-1] < 50) {
            		rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[0].childNodes[1].style.visibility = "visible";
            	}
            	// If there is a percentage, and it's greater than 50, the card won, show the right 'x'.
            	else if (percentages.length > cur_round-1 && percentages[cur_round-1] > 50) {
            		rounds_and_bracket[(cur_col*2)].childNodes[cur_row].childNodes[1].childNodes[1].style.visibility = "visible";
            	}       	
            	
            	// If we haven't gotten to the leftmost column yet, recurse for the losing card.
            	if (cur_col != 0) {
            		addRowFromRoot(cards[cur_round-1], cur_round-1, cur_col-1, (cur_row*2)+1);
            	}
            	cur_col -= 1;
            	cur_row *= 2;
                cur_round -= 1;
            }         
        }
    };
    let escaped_card_name = card_name.replace(/'/g,"\\\'");
    xmlhttp.open("GET","get_card_info.php?q="+escaped_card_name, true);
    xmlhttp.send();
}

// Given a card_name and the last_round that should be filled out, create and fill a bracket
// for the given card, ending at 'last_round' if it is specified, or the most recent
// round that we have data for.
// TODO: fix the way the backend fills out this JSON response so that I don't need to make
// a whole bunch of requests to fill out a bracket.
function getAndFillBracket(card_name, last_round=-1) {
    console.log("last_round is: " + last_round);
    if (card_name == "") {
        return;
    }

    var xmlhttp = new XMLHttpRequest();

    // TODO: Rework this whole function so I don't have to get the same row twice.
    // this will probably be done by doing a bunch of work server-side and 
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);

			let cards = [];
			let percentages = [];
            for (let i = 2; i < 45; i+=3) {
            	if (data[i]) {
            		cards.push(data[i]);
            	}
            	if (data[i+1]) {
            		percentages.push(Number(data[i+1]));
            	}
			}

            if (last_round == -1) {
                last_round = cards.length;
            }

            let bracket_size = Math.min(cards.length, 4);
			fillBracketDom(bracket_size, last_round);

            // If there are too many rounds to fit in the bracket, let the user choose a different
            // set of rounds to view.
            if (bracket_size != last_round) {
                let change_bounds = document.getElementById("change_bracket_bounds");
                let change_bounds_p = document.createElement("p");
                change_bounds_p.innerHTML = "Too many rounds to display at one time. See different rounds?";
                change_bounds.appendChild(change_bounds_p);
                let cur_first_round = (last_round - bracket_size + 1);
                let cur_last_round = last_round;
                console.log("first round is: " + cur_first_round);
                console.log("last round is: " + cur_last_round);
                for (let i = cur_first_round; i > 0; i--) {
                    let change_p = document.createElement("p");
                    change_p.innerHTML = "See Rounds " + cur_first_round + " to " + cur_last_round;
                    let tmp_last_round = cur_last_round;
                    change_p.onclick = function(){getAndFillBracket(card_name, tmp_last_round);};
                    change_bounds.appendChild(change_p);
                    cur_first_round -= 1;
                    cur_last_round -= 1;
                }
            }

            let cols = document.getElementById("bracket_span").childNodes;
			let num_rounds = (cols.length - 1) / 2;
		    // horizontal, vertical, left, image (not x)
			addRowFromRoot(card_name, last_round, num_rounds, 0);

        }
    };
    let escaped_card_name = card_name.replace(/'/g,"\\\'");
    xmlhttp.open("GET","get_card_info.php?q="+escaped_card_name, true);
    xmlhttp.send();
}

// Get and display the matchups for the given card_name.
function getAndFillMatchups(card_name) {
	clearPage();
    if (card_name == "") {
        return;
    }
	// This is jquery, in case I decide I want to figure out how that works
	//$.GET("get_card_info.php?q="+card_name, function(data, status) {
	//	alert("Data is: " + data + " and status is: " + status);
	//});

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
    	//alert("this is what I got back" + this.responseText)
        if (this.readyState == 4 && this.status == 200) {

            let data = JSON.parse(this.responseText);
            //console.log(data);

            // Fill cards and percentages from the JSON response.
			let cards = [];
			let percentages = [];
            for (let i = 2; i < 45; i+=3) {
            	if (data[i]) {
            		cards.push(data[i]);
            	}
            	if (data[i+1]) {
            		percentages.push(Number(data[i+1]));
            	}
			}

			// For each round, create the appropriate HTML elements.
			let rounds_element = document.getElementById("rounds");			
			for (let i = cards.length; i > 0; i--) {
				if (cards[i-1] == '(bye)') {
					rounds_element.appendChild(createBye(i));
				}
				else {
					rounds_element.appendChild(createRound("matchups", i));
				}
			}

			// For each round, fill the HTML elements with the appropriate card art, percentages,
			// and display the appropriate 'x's.
			let rounds = document.getElementById("rounds").childNodes;
			for (let i = 0; i < cards.length; i++) {
				// Skip byes because there's nothing else to display.
				if (cards[i] == '(bye)') {
					continue;
				}

				let percent = -1;
				if (i < percentages.length) {
					percent = percentages[i];
				}
				//console.log("percent is: " + percent);
				getAndSetCardImage(card_name, rounds[cards.length-i-1].childNodes[1].childNodes[0]);
				getAndSetCardImage(cards[i], rounds[cards.length-i-1].childNodes[2].childNodes[0]);
				if (percent == -1) {
	            	return;
	            }
	            if (percent < 50) {
	            	rounds[cards.length-i-1].childNodes[1].childNodes[1].style.visibility = "visible";
	            }
	            else {
	            	rounds[cards.length-i-1].childNodes[2].childNodes[1].style.visibility = "visible";
	            }
	        	rounds[cards.length-i-1].childNodes[1].childNodes[2].innerText = +percent.toFixed(2);
	        	rounds[cards.length-i-1].childNodes[2].childNodes[2].innerText = +(100-percent).toFixed(2);
	        }
	    }
	};
    let escaped_card_name = card_name.replace(/'/g,"\\\'");
    xmlhttp.open("GET","get_card_info.php?q="+escaped_card_name, true);
    xmlhttp.send();
}

// Check to see whether the requested card is a unique Magic card. If so, display it in the
// requested style. If not, display the appropriate error or disambiguation.
function getCardNameAndFill(style="", card="") {
	clearPage();
	let card_name;

	// If a card name wasn't passed in, get the card name from the input textbox.
	if (card == "") {
		card_name = document.getElementById("input_textbox").value;
	}
	else {
		card_name = card;
		document.getElementById("input_textbox").value = card_name;
	}

	// If we clicked the button with nothing in the textbox, there's nothing to do, so just return.
    if (card_name == "") {
        return;
    }

    // Get a list of all possible cards (ie, cards prefixed with 'card_name'). If there's
    // only 1 such card, display it in the requested style. Otherwise, display an appropriate
    // error or disambiguation message with clickable options.
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
        	console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            console.log(data);

            if (data.length == 0) {
            	let error = document.getElementById("error");
            	error.innerHTML = "Couldn't find any cards beginning with \"" + card_name + "\"";
            }
            else if (data.length > 1) {
            	let error = document.getElementById("error");
            	let error_p = document.createElement("p");
            	error_p.innerHTML = "Found multiple cards beginning with \"" + card_name + "\", which one did you mean? (click on a card name)";
            	error.appendChild(error_p);
            	for (let i = 0; i < data.length; i++) {
            		let cardname_p = document.createElement("p");
            		cardname_p.innerHTML = data[i];
            		cardname_p.onclick = function(){getCardNameAndFill(style, data[i]);};
            		error.appendChild(cardname_p);
            	}
            }
            else if (data.length == 1) {
            	if (style == "matchups") {
            		getAndFillMatchups(data[0]);
            	}
            	else if (style == "bracket") {
            		getAndFillBracket(data[0]);
            	}
            	else {
            		console.log("unrecognized style");
            	}
            }
        }
    };
    let escaped_card_name = card_name.replace(/'/g,"\'");
    xmlhttp.open("GET","get_card_name.php?q="+escaped_card_name, true);
    xmlhttp.send();
}

let button = document.getElementById("matchupsButton");
button.setAttribute("onclick", "getCardNameAndFill(\"matchups\", \"\")");

button = document.getElementById("toggleButton");
button.onclick = toggleOverlay;

button = document.getElementById("bracketButton");
button.setAttribute("onclick", "getCardNameAndFill(\"bracket\", \"\")");

let toggleableElements = [];