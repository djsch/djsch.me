"use strict"

class mtgBracketWinners {
    constructor(cards) {
        if (cards.length != 16) {
            throw "Tried to construct an mtgBracketWinners object with the wrong number of cards: " + cards.length;
        }
        this.rounds = new Array();
        this.rounds.push(cards);

        let round2 = new Array()
        for (let i = 0; i < 8; i++) {
            round2.push("");
        }
        this.rounds.push(round2);

        let round3 = new Array();
        for (let i = 0; i < 4; i++) {
            round3.push("");
        }
        this.rounds.push(round3);

        let round4 = new Array();
        for (let i = 0; i < 2; i++) {
            round4.push("");
        }
        this.rounds.push(round4);

        let round5 = new Array();
        round5.push("");
        this.rounds.push(round5);
    }

    // 'card' is the card that wins
    // 'round' is the round that is won (0-indexed)
    //   (therefore we alter round+1)
    setRoundWinner(card, round) {
        console.log("setRoundWinner called for: " + card);
        let index = this.rounds[round].indexOf(card);
        let row = Math.floor(index/2);
        // Set the winning card to the next round.
        if (round < 4) {
            this.rounds[round+1][row] = card;
            doThing(card, round+1, Math.floor(row/2), row%2);
        }
        // If there are further rounds that need to be changed, change them.
        if (round < 3) {
            for (let i = round+2; i < 4; i++) {
                row = Math.floor(row/2);
                if (this.rounds[i][row] != card && this.rounds[i][row] != "") {
                    this.rounds[i][row] = "";
                    doThing("", i, Math.floor(row/2), row%2);
                }
            }
        }
        //round_next[Math.floor(index/2)] = card;
        //this.round2[Math.floor(pos/2)] = card;
        //doThing(card, 1, Math.floor(pos/2), pos%2);
        //refresh display
    }

    printDebugString() {
        for (let i = 0; i < this.rounds.length; i++) {
            console.log(this.rounds[i]);
        }
    }
}

function debug() {
    winners.printDebugString();
}

function doThing(card_name, col, row, pos) {
    console.log("card_name is: " + card_name);
    console.log("col is: " + col);
    console.log("row is: " + row);
    console.log("pos is: " + pos);
    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;

    // horizontal, vertical, left, image (not x)
    if (card_name == "") {
        rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[0].src="";
        return;
    }
    else {
        getAndSetCardImage(card_name, rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[0]);
    }

    // TODO: Make this generic
    if (col == 4) {
        return;
    }

    //if ((row % 2) == 0) {
        rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[0].onclick = function(){winners.setRoundWinner(card_name, col);};
        //rounds_and_bracket[col].childNodes[row].childNodes[pos].childNodes[0].onclick = function(){doThing(card_name, col+1, Math.floor(row/2), 0);};       
    //}
    //else {
        //rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[0].onclick = function(){doThing(card_name, col+1, Math.floor(row/2), 1);};
        //rounds_and_bracket[col].childNodes[row].childNodes[pos].childNodes[0].onclick = function(){doThing(card_name, col+1, Math.floor(row/2), 1);}; 
    //}
}

// branches 1-8 are the individual branches
// branch 9 is the top 8
function showBracket(branch) {
	clearPage();
	let card_name;

    fillBracketDom(4, 11); // show 4 rounds, last round is 11

    // Get a list of all possible cards (ie, cards prefixed with 'card_name'). If there's
    // only 1 such card, display it in the requested style. Otherwise, display an appropriate
    // error or disambiguation message with clickable options.
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
        	console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            console.log(data);

            winners = new mtgBracketWinners(data);

            let rounds_and_bracket = document.getElementById("bracket_span").childNodes;

            console.log("length of the array returned is: " + data.length);
            let num_rows = rounds_and_bracket[0].childNodes.length;
            //for (let i = 0; i < data.length; i+=2) {
            for (let i = 0; i < num_rows; i++) {
                // horizontal, vertical, left, image (not x)
                // TODO: cache the image somehow so I don't need to request it over and over and over again
                getAndSetCardImage(data[i*2], rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0]);
                getAndSetCardImage(data[(i*2)+1], rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0])

                //if ((i % 2) == 0) {
                    //rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){doThing(data[i*2], 1, Math.floor(i/2), 0);};
                    //rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){doThing(data[(i*2)+1], 1, Math.floor(i/2), 0);};
                    rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){winners.setRoundWinner(data[i*2], 0);};
                    rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){winners.setRoundWinner(data[(i*2)+1], 0);};
                //}
                //else {
                //    rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){doThing(data[i*2], 1, Math.floor(i/2), 1);};
                //    rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){doThing(data[(i*2)+1], 1, Math.floor(i/2), 1);};
                //}

            }

            
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q="+branch, true);
    xmlhttp.send();
}

let button = document.getElementById("start");
button.setAttribute("onclick", "showBracket(0)");

button = document.getElementById("debug");
button.setAttribute("onclick", "debug()");

//button = document.getElementById("toggleButton");
//button.onclick = toggleOverlay;

//button = document.getElementById("bracketButton");
//button.setAttribute("onclick", "getCardNameAndFill(\"bracket\", \"\")");

let toggleableElements = [];
var winners;
//let winners = new mtgBracketWinners();