"use strict"

function debug() {
    for (let i = 0; i < 8; i++) {
        let foo = bracket_winners.getBranchWinners(i)
        if (foo) {
            foo.printDebugString();
        }
    }
}

function updateImageAndSetOnclick(card_name, branch_num, col, row, pos) {
    console.log("card_name is: " + card_name);
    console.log("col is: " + col);
    console.log("row is: " + row);
    console.log("pos is: " + pos);

    // Check what the last column is -- if it's the top 8, there are 3 columns. The divisions have 4.
    var last_col;
    if (isTop8()) {
        last_col = 3;
    }
    else {
        last_col = 4;
    }

    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;

    // horizontal, vertical, left, image (not x)
    if (card_name == "") {
        rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[0].src="";
        return;
    }
    else if (col < last_col) {
        getAndSetCardImage(card_name, rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[0]);
    }

    // If we've finished filling out this bracket, un-hide the continue dialogue.
    if (bracket_winners.getBranchWinners(branch_num).isComplete()) {
        let cont = document.getElementById("continue");
        cont.style.display = "block";
        let winning_card = document.getElementById("winning_card");
        getAndSetCardImage(bracket_winners.getBranchWinners(branch_num).getWinner(), winning_card);
        let button = document.getElementById("continue_button");
        button.setAttribute("onclick", "createBranch(" + (branch_num+1) + ")");

        // Scroll the screen to the top, only the first time this happens.
        if (!bracket_winners.getBranchWinners(branch_num).hasScreenScrolled()) {
            scroll(0,0);
            bracket_winners.getBranchWinners(branch_num).setScreenScrolled();
        }

    }

    // If this is the last column, and there's no point in setting an onclick.
    if (col < last_col) {
        rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(card_name, col);};
    }
}

function isTop8() {
    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;
    if (rounds_and_bracket.length == 5) {
        return true;
    }
    else if (rounds_and_bracket.length == 7) {
        return false;
    }
    else {
        throw "Couldn't determine if we're displaying the top8 or not.";
    }
}

function showTop8() {
    fillBracketDom(3, 14); // show 3 rounds, last round is 14
    //bracket_winners.update();
    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;
    let cards = new Array();
    for (let i = 0; i < 8; i++) {
        cards.push(bracket_winners.getBranchWinners(i).getWinner());
    }
    let branch_winners = new mtgBranchWinners(cards, 8);
    bracket_winners.setBranchWinners(branch_winners, 8);

    for (let i = 0; i < 4; i++) {
        // horizontal, vertical, left, image (not x)
        getAndSetCardImage(cards[i*2], rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0]);
        getAndSetCardImage(cards[(i*2)+1], rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0])

        //if ((i % 2) == 0) {
            //rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){doThing(data[i*2], 1, Math.floor(i/2), 0);};
            //rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){doThing(data[(i*2)+1], 1, Math.floor(i/2), 0);};
            rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(8).setRoundWinner(cards[i*2], 0);};
            rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(8).setRoundWinner(cards[(i*2)+1], 0);};
        //}
        //else {
        //    rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){doThing(data[i*2], 1, Math.floor(i/2), 1);};
        //    rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){doThing(data[(i*2)+1], 1, Math.floor(i/2), 1);};
        //}

    }
}

function showBranch(branch_num) {
    if (branch_num == 8) {
        fillBracketDom(3, 14); // show 4 rounds, last round is 11
    }
    else {
        fillBracketDom(4, 11); // show 4 rounds, last round is 11
    }

    let branch_winners = bracket_winners.getBranchWinners(branch_num);
    let cards = branch_winners.getFullBranch();
    console.log("cards are: ");
    console.log(cards);

    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;
    let num_cols = rounds_and_bracket.length;
    console.log("doing columns: " + num_cols);
    let counter = 0;
    for (let i = 0; i < num_cols; (i=(i+2))) {
        let num_rows = rounds_and_bracket[i].childNodes.length;
        console.log("doing rows: " + num_rows);
        for (let j = 0; j < num_rows; j++) {
            console.log("adding card " + cards[counter]);
            if (cards[counter] != "") {
                getAndSetCardImage(cards[counter], rounds_and_bracket[i].childNodes[j].childNodes[0].childNodes[0]);
            }
            if (cards[counter+1] != "") {
                getAndSetCardImage(cards[(counter+1)], rounds_and_bracket[i].childNodes[j].childNodes[1].childNodes[0])
            }
            counter += 2;
        }
    }
}

// branches 0-7 are the individual branches
// branch 8 is the top 8
function createBranch(branch_num) {
	clearPage();
	//let card_name;

    // Hide 'continue' elements.
    let cont = document.getElementById("continue");
    cont.style.display = "none";
    let winning_card = document.getElementById("winning_card");
    winning_card.src = "";

    if (branch_num == 8) {
        showTop8();
        return;
    }
    else {
        fillBracketDom(4, 11); // show 4 rounds, last round is 11
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
        	console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            console.log(data);

            let branch_winners = new mtgBranchWinners(data, branch_num);
            bracket_winners.setBranchWinners(branch_winners, branch_num);

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
                    rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(data[i*2], 0);};
                    rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(data[(i*2)+1], 0);};
                //}
                //else {
                //    rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){doThing(data[i*2], 1, Math.floor(i/2), 1);};
                //    rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){doThing(data[(i*2)+1], 1, Math.floor(i/2), 1);};
                //}

            }

            
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q="+branch_num, true);
    xmlhttp.send();
}

function fooBracket() {
    let saved_bracket = document.getElementById("saved_bracket");
    
    console.log("before update");
    bracket_winners.printDebugString();
    fillMtgBracketWinners(saved_bracket.value, bracket_winners);
    console.log("after update");
    bracket_winners.printDebugString();


    //debug();

    showBranch(0);
}

let button = document.getElementById("start");
button.setAttribute("onclick", "createBranch(0)");

button = document.getElementById("debug");
button.setAttribute("onclick", "debug()");

button = document.getElementById("get_compression");
button.setAttribute("onclick", "createAndDisplayCompression(bracket_winners)");

button = document.getElementById("undo_compression");
button.setAttribute("onclick", "fooBracket()");

//button = document.getElementById("toggleButton");
//button.onclick = toggleOverlay;

//button = document.getElementById("bracketButton");
//button.setAttribute("onclick", "getCardNameAndFill(\"bracket\", \"\")");

let toggleableElements = [];
//var winners;
let bracket_winners = new mtgBracketWinners();