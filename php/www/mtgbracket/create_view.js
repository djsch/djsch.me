"use strict"

function printFullBracket() {
    console.log("printing the normal bracket");
    for (let i = 0; i < 9; i++) {
        let branch_winners = bracket_winners.getBranchWinners(i)
        if (branch_winners) {
            branch_winners.printDebugString();
        }
    }

    console.log("printing the results bracket");
    if (actual_bracket_winners != null) {
        for (let i = 0; i < 9; i++) {
            let branch_winners = actual_bracket_winners.getBranchWinners(i)
            if (branch_winners) {
                branch_winners.printDebugString();
            }
        }
    }
}

function changeXVisible(col, row, pos, visible) {
    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;

    if (visible) {
        rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[1].style.visibility = "visible";
    }
    else {
        rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[1].style.visibility = "hidden";
    }
}

function updateImageAndSetOnclick(card_name, branch_num, col, row, pos) {
    // Check what the last column is -- if it's the top 8, there are 3 columns. The divisions have 4.
    var last_col;
    if (isTop8()) {
        last_col = 3;
    }
    else {
        last_col = 4;
    }

    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;

    if (card_name == "") {
        getImageFromBracket(rounds_and_bracket, col, row, pos).src="";
        return;
    }
    else if (col < last_col) {
        getAndSetCardImage(card_name, getImageFromBracket(rounds_and_bracket, col, row, pos));
    }

    // If we've finished filling out this bracket, un-hide the continue dialogue.
    if (bracket_winners.getBranchWinners(branch_num).isComplete()) {
        let cont = document.getElementById("continue");
        cont.style.display = "block";
        let winning_card = document.getElementById("winning_card");
        getAndSetCardImage(bracket_winners.getBranchWinners(branch_num).getWinner(), winning_card);
        if (branch_num < 8) {
            let button = document.getElementById("continue_button");
            button.setAttribute("onclick", "showBranch(" + (branch_num+1) + ", true, bracket_winners)");
        }
        else {
            let button = document.getElementById("continue_button");
            button.style.visibility = "hidden";
        }

        // Scroll the screen to the top, only the first time this happens.
        if (!bracket_winners.getBranchWinners(branch_num).hasScreenScrolled()) {
            scroll(0,0);
            bracket_winners.getBranchWinners(branch_num).setScreenScrolled();
        }

    }

    // Set an onclick function, unless this is the last column in which case there's no point.
    if (col < last_col) {
        getImageFromBracket(rounds_and_bracket, col, row, pos).onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(card_name, col);};
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
    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;
    let cards = new Array();
    for (let i = 0; i < 8; i++) {
        cards.push(bracket_winners.getBranchWinners(i).getWinner());
    }
    let branch_winners = new mtgBranchWinners(cards, 8);
    bracket_winners.setBranchWinners(branch_winners, 8);

    for (let i = 0; i < 4; i++) {
        getAndSetCardImage(cards[i*2], getImageFromBracket(rounds_and_bracket, 0, i, 0));
        getAndSetCardImage(cards[(i*2)+1], getImageFromBracket(rounds_and_bracket, 0, i, 1));

        getImageFromBracket(rounds_and_bracket, 0, i, 0).onclick = function(){bracket_winners.getBranchWinners(8).setRoundWinner(cards[i*2], 0);};
        getImageFromBracket(rounds_and_bracket, 0, i, 1).onclick = function(){bracket_winners.getBranchWinners(8).setRoundWinner(cards[(i*2)+1], 0);};

    }
}

function showBranchFromSelect() {
    let ele = document.getElementById("division_selector");
    showBranch(ele.selectedIndex, is_create, bracket_winners);
}

// Returns whether the array contains a particular element AFTER a particular index (not including that index)
function arrayContainsAfterIndex(arr, ele, index) {
    for (let i = index + 1; i < arr.length; i++) {
        if (arr[i] == ele) {
            return true;
        }
    }
    return false;
}

// bracket is bracket_winners, or actual_bracket_winners if we're displaying the actual bracket.
// is_building is true if we are still building the bracket. it's false if we're displaying a completed bracket.
// show_compare is if I should compare between the two brackets. there are some unreal hacks to make this happen.
function showBranch(branch_num, is_building, bracket, show_compare=false) {
    clearPage();

    // Hide 'continue' elements.
    let cont = document.getElementById("continue");
    cont.style.display = "none";
    let winning_card = document.getElementById("winning_card");
    winning_card.src = "";

    let ele = document.getElementById("division_selector");
    ele.value = branch_num;

    if (branch_num == 8) {
        fillBracketDom(3, 14); // show 3 rounds, last round is 14
        bracket.updateTop8();
        //showTop8();
    }
    else {
        fillBracketDom(4, 11); // show 4 rounds, last round is 11
    }

    let branch_winners = bracket.getBranchWinners(branch_num);
    let cards = branch_winners.getFullBranch();

    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;
    let num_cols = rounds_and_bracket.length;
    console.log("doing columns: " + num_cols);
    let counter = 0;
    for (let col = 0; col*2 < num_cols; col++) {
        console.log("col is: " + col);
        let num_rows = rounds_and_bracket[col*2].childNodes.length;
        for (let row = 0; row < num_rows; row++) {
            if (cards[counter] != "") {
                let card = cards[counter];
                getAndSetCardImage(card, getImageFromBracket(rounds_and_bracket, col, row, 0));
                if (is_building) {
                    getImageFromBracket(rounds_and_bracket, col, row, 0).onclick = function(){bracket.getBranchWinners(branch_num).setRoundWinner(card, col);};
                }
            }
            if (cards[counter+1] != "") {
                let card = cards[counter+1];
                getAndSetCardImage(card, getImageFromBracket(rounds_and_bracket, col, row, 1))
                
                if (is_building) {
                    getImageFromBracket(rounds_and_bracket, col, row, 1).onclick = function(){bracket.getBranchWinners(branch_num).setRoundWinner(card, col);};
                }
            }


            // This is the part where I try to compare the two brackets. Maybe get rid of or change this.
            if (!is_building && show_compare) {
                if (col > 0) { // i is the col; don't want to do this for the first column
                    if (actual_bracket_winners.getCard(branch_num, col, row*2) == "") {
                        getQuestionMarkFromBracket(rounds_and_bracket, col, row, 0).style.visibility = "visible";
                    }
                    else if (bracket_winners.getCard(branch_num, col, row*2) == actual_bracket_winners.getCard(branch_num, col, row*2)) {
                        getCheckMarkFromBracket(rounds_and_bracket, col, row, 0).style.visibility = "visible";
                    }
                    else {
                        getXFromBracket(rounds_and_bracket, col, row, 0).style.visibility = "visible";
                    }

                    if (actual_bracket_winners.getCard(branch_num, col, (row*2)+1) == "") {
                        getQuestionMarkFromBracket(rounds_and_bracket, col, row, 1).style.visibility = "visible";
                    }
                    else if (bracket_winners.getCard(branch_num, col, (row*2)+1) == actual_bracket_winners.getCard(branch_num, col, (row*2)+1)) {
                        getCheckMarkFromBracket(rounds_and_bracket, col, row, 1).style.visibility = "visible";
                    }
                    else {
                        getXFromBracket(rounds_and_bracket, col, row, 1).style.visibility = "visible";
                    }
                }
            }
            counter += 2;
        }
    }
}

function initialize() {
    clearPage();

    is_create = true;
    bracket_winners = new mtgBracketWinners();

    // Hide 'continue' elements.
    let cont = document.getElementById("continue");
    cont.style.display = "none";
    let winning_card = document.getElementById("winning_card");
    winning_card.src = "";


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            console.log(data);

            bracket_winners.initialize(data);
            showBranch(0, true, bracket_winners);
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q=all", true);
    xmlhttp.send();
}

function undoCompression() {
    is_create = false;

    let saved_bracket = document.getElementById("saved_bracket");

    let ele = document.getElementById("division_selector");
    let division = ele.selectedIndex;
    if (actual_bracket_winners == null) {
        actual_bracket_winners = new mtgBracketWinners();
        fillActualMtgBracketWinners(division, actual_bracket_winners, saved_bracket.value, bracket_winners);
    }
    else {
        fillMtgBracketWinners(saved_bracket.value, bracket_winners, 0, "", null);
    }
}

// Given two cards, return the card which was beat the other in the bracket
// represented by the data.
function getWinner(data, card, opp) {
    console.log("looking for the winner between " + card + " and " + opp);
    // TODO: make this not O(n)
    for (let i = 0; i < data.length; i++) {
        //console.log("checking: " + data[i].name);
        if (data[i].name == card) {
            // TODO: This is disgusting. Do this better.
            if (data[i].round_8_opponent == opp) {
                if (data[i].round_8_score == null) {
                    return "";
                }
                else if (data[i].round_8_score > 50) {
                    return card;
                }
                else {
                    return opp;
                }
            }
            else if (data[i].round_9_opponent == opp) {
                if (data[i].round_9_score == null) {
                    return "";
                }
                else if (data[i].round_9_score > 50) {
                    return card;
                }
                else {
                    return opp;
                }
            }
            else if (data[i].round_10_opponent == opp) {
                if (data[i].round_10_score == null) {
                    return "";
                }
                else if (data[i].round_10_score > 50) {
                    return card;
                }
                else {
                    return opp;
                }
            }
            else if (data[i].round_11_opponent == opp) {
                if (data[i].round_11_score == null) {
                    return "";
                }
                else if (data[i].round_11_score > 50) {
                    return card;
                }
                else {
                    return opp;
                }
            }
            else if (data[i].round_12_opponent == opp) {
                if (data[i].round_12_score == null) {
                    return "";
                }
                else if (data[i].round_12_score > 50) {
                    return card;
                }
                else {
                    return opp;
                }
            }
            else if (data[i].round_13_opponent == opp) {
                if (data[i].round_13_score == null) {
                    return "";
                }
                else if (data[i].round_13_score > 50) {
                    return card;
                }
                else {
                    return opp;
                }
            }
            else if (data[i].round_14_opponent == opp) {
                if (data[i].round_14_score == null) {
                    return "";
                }
                else if (data[i].round_14_score > 50) {
                    return card;
                }
                else {
                    return opp;
                }
            }
            else {
                return "";
                //throw "Couldn't find the named card's opponent."
            }
        }
    }
    //return "";
    throw "Couldn't find the named card at all."
}

// data is all database rows for cards that have made it to the top 128.
function showActualResultsHelper(data) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            let list = JSON.parse(this.responseText);
            console.log(list);

            let final_list = new Array();

            let index = 0;
            // For each division...
            for (let i = 0; i < 8; i++) {
                let start_index = index;
                let end_index = index + 16;
                let division_array = new Array();
                
                // First add the first round...
                for (let j = start_index; j < end_index; j++) {
                    division_array.push(list[j]);
                }

                // ...then the rest of the rounds.
                for (let j = 16; j < 31; j++) {
                    // If both spots feeding this spot are taken, check if there's a winner.
                    if (division_array[(j-16)*2] != "" && division_array[((j-16)*2)+1] != "") {
                        let card = getWinner(data, division_array[(j-16)*2], division_array[((j-16)*2)+1]);
                        division_array.push(card);
                    }
                    else {
                        division_array.push("");
                    }
                }

                index += 16;
                final_list = final_list.concat(division_array);
            }

            let division_array = new Array();
            // Don't forget to do the top 8!
            // Do the first round of the top 8
            for (let j = 1; j < 9; j++) {
                //final_list.push(list[j]);
                console.log("adding to the top 8: " + final_list[(31*j)-1]);
                division_array.push(final_list[(31*j)-1]);
            }
            // Then the rest of the rounds in the top 8.
            for (let j = 8; j < 15; j++) {
                // If both spots feeding this spot are taken, check if there's a winner.
                if (division_array[(j-8)*2] != "" && division_array[((j-8)*2)+1] != "") {
                    let card = getWinner(data, division_array[(j-8)*2], division_array[((j-8)*2)+1]);
                    division_array.push(card);
                }
                else {
                    division_array.push("");
                }
            }

            final_list = final_list.concat(division_array);

            // Finish up and display the result.
            bracket_winners.update(final_list);
            showBranch(0, false, bracket_winners);
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q=all", true);
    xmlhttp.send();
}

function showActualResults() {
    is_create = false;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            console.log(data);

            showActualResultsHelper(data);
        }
    };
    xmlhttp.open("GET","get_128_results.php", true);
    xmlhttp.send();
}

// division is 0-8
// 8 is top 8
function viewActualBracket() {
    let ele = document.getElementById("division_selector");
    let division = ele.selectedIndex;
    if (actual_bracket_winners == null) {
        actual_bracket_winners = new mtgBracketWinners();
        fillActualMtgBracketWinners(division, actual_bracket_winners, "", null);
    }
    else {
        showBranch(division, false, actual_bracket_winners);
    }
}

let button = document.getElementById("start");
button.setAttribute("onclick", "initialize()");

button = document.getElementById("select_division");
button.setAttribute("onclick", "showBranchFromSelect()");

button = document.getElementById("debug");
button.setAttribute("onclick", "printFullBracket()");

button = document.getElementById("actual");
button.setAttribute("onclick", "viewActualBracket()");

button = document.getElementById("get_compression");
button.setAttribute("onclick", "createAndDisplayCompression(bracket_winners)");

button = document.getElementById("undo_compression");
button.setAttribute("onclick", "undoCompression()");

button = document.getElementById("see_results");
button.setAttribute("onclick", "showActualResults()");

let toggleableElements = [];
let is_create = true;
let bracket_winners = new mtgBracketWinners();
let actual_bracket_winners = null;

initialize();