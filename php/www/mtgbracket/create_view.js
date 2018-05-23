"use strict"

function printFullBracket() {
    for (let i = 0; i < 9; i++) {
        let foo = bracket_winners.getBranchWinners(i)
        if (foo) {
            foo.printDebugString();
        }
    }
}

function changeXVisible(col, row, pos, visible) {
    let rounds_and_bracket = document.getElementById("bracket_span").childNodes;

    if (visible) {
        rounds_and_bracket[col*2].childNodes[row].childNodes[pos].childNodes[1].style.visibility = "visible";
    }
    else {
        console.log("SETTING HIDDEN");
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
        if (branch_num < 8) {
            let button = document.getElementById("continue_button");
            button.setAttribute("onclick", "showBranch(" + (branch_num+1) + ", true)");
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

        rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(8).setRoundWinner(cards[i*2], 0);};
        rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(8).setRoundWinner(cards[(i*2)+1], 0);};
    }
}

function showBranchFromSelect() {
    let ele = document.getElementById("division_selector");
    showBranch(ele.selectedIndex, is_create);
}

function showBranch(branch_num, set_onclick) {
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
        bracket_winners.updateTop8();
        //showTop8();
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
        //console.log("doing rows: " + num_rows);
        for (let j = 0; j < num_rows; j++) {
            //console.log("adding card " + cards[counter]);
            if (cards[counter] != "") {
                let card = cards[counter];
                getAndSetCardImage(card, rounds_and_bracket[i].childNodes[j].childNodes[0].childNodes[0]);
                if (set_onclick) {
                    rounds_and_bracket[i].childNodes[j].childNodes[0].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(card, i/2);};
                }
            }
            if (cards[counter+1] != "") {
                let card = cards[counter+1];
                getAndSetCardImage(card, rounds_and_bracket[i].childNodes[j].childNodes[1].childNodes[0])
                if (set_onclick) {
                    rounds_and_bracket[i].childNodes[j].childNodes[1].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(card, i/2);};
                }
            }
            counter += 2;
        }
    }

    if (set_onclick) {
        let num_rows = rounds_and_bracket[0].childNodes.length;
        for (let i = 0; i < num_rows; i++) {
            // horizontal, vertical, left, image (not x)
            // TODO: cache the image somehow so I don't need to request it over and over and over again
            //rounds_and_bracket[0].childNodes[i].childNodes[0].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(cards[i*2], 0);};
            //rounds_and_bracket[0].childNodes[i].childNodes[1].childNodes[0].onclick = function(){bracket_winners.getBranchWinners(branch_num).setRoundWinner(cards[(i*2)+1], 0);};
        }
    }
}

function initialize() {
    clearPage();

    is_create = true;

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
            showBranch(0, true);
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q=all", true);
    xmlhttp.send();
}

function fooBracket() {
    let saved_bracket = document.getElementById("saved_bracket");
    
    //console.log("before update");
    //bracket_winners.printDebugString();
    is_create = false;
    fillMtgBracketWinners(saved_bracket.value, bracket_winners);
    //console.log("after update");
    //bracket_winners.printDebugString();


    //debug();

    //showBranch(0);
}

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

// data is the json data from the database
function testResultsStepTwo(data) {
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

                // Then the rest
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

                console.log("intermediate array: " + division_array);
                console.log("length is: " + division_array.length);

                index += 16;
                final_list = final_list.concat(division_array);
            }

            /****/

            let division_array = new Array();
            // Don't forget to do the top 8!
            // Do the first round of the top 8
            for (let j = 1; j < 9; j++) {
                //final_list.push(list[j]);
                console.log("adding to the top 8: " + final_list[(31*j)-1]);
                division_array.push(final_list[(31*j)-1]);
            }
            // Then the rest
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

            console.log("intermediate array: " + division_array);
            console.log("length is: " + division_array.length);
            final_list = final_list.concat(division_array);

            /***/

            // Finish up and display the result.
            bracket_winners.update(final_list);
            showBranch(0, false);
        }
    };
    xmlhttp.open("GET","get_bracket_128.php?q=all", true);
    xmlhttp.send();
}

function testResults() {
    is_create = false;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            let data = JSON.parse(this.responseText);
            console.log(data);

            //console.log(data[0]);
            //console.log(data[0].name);

            testResultsStepTwo(data);
        }
    };
    xmlhttp.open("GET","get_128_results.php", true);
    xmlhttp.send();
}

// How is showing the score going to work? I need to:
//
// * decompress the string, which requires the full 128
// * 

let button = document.getElementById("start");
button.setAttribute("onclick", "initialize()");

button = document.getElementById("select_division");
button.setAttribute("onclick", "showBranchFromSelect()");

button = document.getElementById("debug");
button.setAttribute("onclick", "printFullBracket()");

button = document.getElementById("get_compression");
button.setAttribute("onclick", "createAndDisplayCompression(bracket_winners)");

button = document.getElementById("undo_compression");
button.setAttribute("onclick", "fooBracket()");

button = document.getElementById("see_results");
button.setAttribute("onclick", "testResults()");

//button = document.getElementById("toggleButton");
//button.onclick = toggleOverlay;

//button = document.getElementById("bracketButton");
//button.setAttribute("onclick", "getCardNameAndFill(\"bracket\", \"\")");

let toggleableElements = [];
let is_create = true;
//var winners;
let bracket_winners = new mtgBracketWinners();

initialize();