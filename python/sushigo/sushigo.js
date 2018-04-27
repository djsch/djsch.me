"use strict"

function getCardPath(card) {
    return "images/" + card + "_card.jpg";
}

function setChopsticks() {
    chopsticks.push("chopsticks");
}

// Takes a SushigoResponse object.
function displayCards(response) {
	//console.log("displaying cards");
    if (response.getStatus() != "OK") {
        throw "We're trying to display cards with a non-OK status!";
    }
	let to_clear = document.getElementById("played_cards");
	while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);
	to_clear = document.getElementById("hand_cards");
	while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);
    to_clear = document.getElementById("opponent_cards");
    while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);

	let played_cards = document.getElementById("played_cards");
	let hand_cards = document.getElementById("hand_cards");
    let hand = response.getHand();
    let played = response.getPlayed();
    console.log("hand is: " + hand);
    console.log("hand length is: " + hand.length);
    console.log("played is: " + played);
    console.log("played length is: " + played.length);
	for (let i = 0; i < played.length; i++) {
		let img = document.createElement("img");
        img.className = "card_image_small";
		img.src = getCardPath(played[i]);
        if (played[i] == "chopsticks") {
            img.onclick = function(){setChopsticks();};
        }
		played_cards.appendChild(img);
	}
	for (let i = 0; i < hand.length; i++) {
		let img = document.createElement("img");
        img.classname = "card_image";
		img.src = getCardPath(hand[i]);
		img.onclick = function(){playCard(hand[i]);};
		hand_cards.appendChild(img);
	}
    let num_opp = response.getNumOpponents();
    // TODO: add more html elements for more opponents
    for (let i = 0; i < num_opp; i++) {
        let opp_played = response.getOppPlayed(i);
        for (let j = 0; j < opp_played.length; j++) {
            let img = document.createElement("img");
            img.className = "card_image_small";
            img.src = getCardPath(opp_played[j]);
            opponent_cards.appendChild(img);
        }
    }
}

// response is a SushigoResponse object.
function displayResponse(response) {
    console.log("Server response is: " + response.getText());
    if (response.getStatus() == "ERROR") {
        let ele = document.getElementById("error_status_display");
        ele.innerHTML = response.getError();
        ele = document.getElementById("ok_status_display");
        ele.innerHTML = "";
    }
    else if (response.getStatus() == "DEBUG") {
        let ele = document.getElementById("ok_status_display");
        ele.innerHTML = response.getDebug();
        ele = document.getElementById("error_status_display");
        ele.innerHTML = "";
    }
    else if (response.getStatus() == "OK") {
        let ele = document.getElementById("ok_status_display");
        ele.innerHTML = "";
        ele = document.getElementById("error_status_display");
        ele.innerHTML = "";
        displayCards(response);
    }
    else if (response.getStatus() == "WAIT") {
        let ele = document.getElementById("ok_status_display");
        ele.innerHTML = "Waiting...";
        ele = document.getElementById("error_status_display");
        ele.innerHTML = "";
    }
    else {
        throw "Unexpected response type.";
    }
}

function resetGame() {
	var xmlhttp = new XMLHttpRequest();
	let pwd = document.getElementById("passwordTextbox").value;

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = new SushigoResponse(this.responseText);
            displayResponse(response);
        }
    };

    xmlhttp.open("GET","test_server?action=resetGame&password=" + pwd, true);
    xmlhttp.send();
}

function update(tries) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = new SushigoResponse(this.responseText);
            displayResponse(response);
            if (response.getStatus() == "WAIT") {
                if (tries < 60) {
                    console.log("still going to try again in 1 second, done tries: " + tries);
                    setTimeout(function () {
    				  update(tries+1)
	           		}, 1000);
                }
                else {
                    console.log("waited 60 seconds, no response");
                }
        	}
        	else {
        		console.log("finally finished");
                // TODO see if this needs to happen anywhere else.
                chopsticks.length = 0;
        	}
        }
    };

    xmlhttp.open("GET","test_server?action=update&player=" + player_name, true);
    xmlhttp.send();
}

function playCard(card="") {
	if (card == "") {
		card = document.getElementById("playCardTextbox").value;
	}

    var extra_args = "";

    // Check to see if this is the first or second 'chopsticks' card.
    if (chopsticks.length == 1) {
        if (chopsticks[0] != "chopsticks") {
            throw "Unexpected element in 'chopsticks'";
        }
        chopsticks.push(card);
        // 
        return;
    }
    else if (chopsticks.length == 2) {
        extra_args = (chopsticks[1] + "," + card);
    }
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = new SushigoResponse(this.responseText);
            displayResponse(response);
        	//console.log("this is the response text: " + this.responseText);
            if (response.getStatus() == "WAIT") {
        		console.log("going to try again in 1 second");
        		setTimeout(function () {
				  update(0)
				}, 1000);
        	}
        	else {
                //displayCards(response);
        	}
        }
    };
    let arg_string = ("test_server?action=playCard&card=" + card + "&player=" + player_name);
    if (extra_args != "") {
        args_string += ("&extra_args=" + extra_args);
    }
    xmlhttp.open("GET", arg_string, true);
    xmlhttp.send();
}

function startGame() {
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	console.log("this is the response text: " + this.responseText);
            let response = new SushigoResponse(this.responseText);
            displayCards(response);
        }
    };

    xmlhttp.open("GET","test_server?action=startGame&player=" + player_name, true);
    xmlhttp.send();
}

function submitPlayerName() {
	if (player_name != "") {
		alert("your name is already: " + player_name);
		return;
	}
	var xmlhttp = new XMLHttpRequest();
	let name = document.getElementById("playerNameText").value;
	//console.log("name is: " + name);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = new SushigoResponse(this.responseText);
            displayResponse(response);
        	console.log("now name is: " + name);
        	player_name = name;
        	document.getElementById("your_name").innerHTML = "Your name is: " + player_name;
        }
    };

    xmlhttp.open("GET","test_server?action=addPlayer&player=" + name, true);
    xmlhttp.send();
}

function getPlayers() {
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
    	console.log("on readystatechange");
        if (this.readyState == 4 && this.status == 200) {
            let response = new SushigoResponse(this.responseText);
            displayResponse(response);
        }
    };
    xmlhttp.open("GET","test_server?action=debug",true);
    xmlhttp.send();
}

let button = document.getElementById("getPlayers");
button.onclick = getPlayers;

button = document.getElementById("resetGame");
button.onclick = resetGame;

button = document.getElementById("submitPlayerName");
button.onclick = submitPlayerName;

button = document.getElementById("startGame");
button.onclick = startGame;

button = document.getElementById("playCardButton");
button.onclick = playCard;

let player_name = "";
let chopsticks = new Array();