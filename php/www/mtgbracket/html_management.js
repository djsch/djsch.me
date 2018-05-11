// Code here is primarily responsible for creating new HTML elements. Other code
// handles filling in those elements with the appropriate objects.

"use strict"

// Clears the curent page of all HTML elements.
function clearPage() {
	let to_clear = document.getElementById("rounds");
	while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);
	to_clear = document.getElementById("bracket_span");
	while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);
	to_clear = document.getElementById("bracket_rounds");
	while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);
	to_clear = document.getElementById("error");
	while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);
	to_clear = document.getElementById("change_bracket_bounds");
	while (to_clear.firstChild) to_clear.removeChild(to_clear.firstChild);
	toggleableElements = [];	
}

// Gets the height of the given rule from the css style.
function getHeight(ruleName){
    var mysheet=document.styleSheets[0];
    var myrules=mysheet.cssRules? mysheet.cssRules: mysheet.rules
    let targetrule;
    for (let i = 0; i < myrules.length; i++){
        if(myrules[i].selectorText.toLowerCase() == ruleName){
             targetrule=myrules[i];
             break;
        }
    }
    let str_height = targetrule.style.height;
    return parseInt(str_height.slice(0, -2));
}

// Gets the width of the given rule from the css style.
function getWidth(ruleName){
    var mysheet=document.styleSheets[0];
    var myrules=mysheet.cssRules? mysheet.cssRules: mysheet.rules
    let targetrule;
    for (let i = 0; i < myrules.length; i++){
        if(myrules[i].selectorText.toLowerCase() == ruleName){
             targetrule=myrules[i];
             break;
        }
    }
    let str_width = targetrule.style.width;
    return parseInt(str_width.slice(0, -2));
}

// Creates a pair of images representing two Magic cards matched
// against each other. Also creates display elements on top of the
// images, such as x's and percentages, which can be toggled on or off.
//
// args:
// -- view: Which view we are generating this round for. Should be
//    either 'bracket' or 'matchups'.
// -- round: Which numbered round we are generating this round for.
//    Should always be included for 'bracket'.
function createRound(view, round=-1) {
	if (view != "bracket" && view != "matchups") {
		throw "unrecognized 'view' option.";
	}

	var img_classname;
	var x_classname;
	if (view == "bracket") {
		img_classname = "bracket_image";
		x_classname = "x_bracket_image toggleable";
	}
	else if (view == "matchups") {
		img_classname = "card_image";
		x_classname = "x_image toggleable";
	}
	let round_span = document.createElement("span");
	let left_div = document.createElement("div");
	left_div.className = "parent";
	left_div.style.display = "inline-block";
	if (view == "bracket") {
		left_div.style.position = "absolute";
		left_div.style.left = "0px";
		left_div.style.top = "0px";
	}
	let left_img = document.createElement("img");
	left_img.className = img_classname;
	let left_x = document.createElement("img");
	left_x.className = x_classname;
	left_x.src = "images/redxtransparent.png";
	left_x.style.visibility = "hidden";
	let left_percent = document.createElement("p");
	left_percent.className = "percent_text text_shadow toggleable";
	left_percent.style.visibility = "visible";
	left_div.appendChild(left_img);
	left_div.appendChild(left_x);
	left_div.appendChild(left_percent);

	let right_div = document.createElement("div");
	right_div.className = "parent";
	right_div.style.display = "inline-block";
	if (view == "bracket") {
		right_div.style.position = "absolute";
		right_div.style.left = "163px";
		right_div.style.top = "0px";
	}
	let right_img = document.createElement("img");
	right_img.className = img_classname;
	let right_x = document.createElement("img");
	right_x.className = x_classname;
	right_x.src = "images/redxtransparent.png";
	right_x.style.visibility = "hidden";
	let right_percent = document.createElement("p");
	right_percent.className = "percent_text text_shadow toggleable";
	right_percent.style.visibility = "visible";
	let right_bye = document.createElement("p");
	right_bye.className = "bye_text";
	right_bye.innerHTML = "Bye";
	right_bye.style.visibility = "hidden";
	right_div.appendChild(right_img);
	right_div.appendChild(right_x);
	right_div.appendChild(right_percent);
	right_div.appendChild(right_bye);

	if (view == "matchups") {
		let p = document.createElement("p");
		p.className = "round_text";
		p.innerHTML = "Round " + round;	
		round_span.appendChild(p);
	}

	round_span.appendChild(left_div);
	round_span.appendChild(right_div);

	return round_span;
}

// Creates the HTML structure for the bracket view. Generates the
// card views and bracket images and offsets them appropriately.
//
// args:
// -- rounds: The number of rounds to include in this view.
//    defaults to 4.
// -- last_round: The numerical value of the last round in
//    this view.
function fillBracketDom(rounds, last_round) {
	clearPage();

	let bracket_span = document.getElementById("bracket_span");

	let height = getHeight('.bracket_image');
	let width = getWidth('.bracket_image') * 2;

	let vertical_offset = 0;
	let num_rounds;
	if (rounds == -1) {
		num_rounds = 4;
	}
	else {
		num_rounds = rounds;
	}

	let cur_round = last_round - rounds + 1;
	for (let i = 0; i < rounds; i++) {
		let p = document.createElement("p");
		p.className = "round_text";
		p.innerHTML = "Round " + cur_round;
		p.style.position = "absolute";
		p.style.left = "" + i*426 + "px";

		let bracket_rounds = document.getElementById("bracket_rounds");
		bracket_rounds.appendChild(p);

		cur_round += 1;
	}

	for (let i = 0; i < num_rounds; i++) {
		vertical_offset += i*(height/2);
		let round_div = document.createElement("div");
		round_div.style.position = "absolute";
		round_div.style.left = "" + i*426 + "px";

		// Offset the bracket to account for "Round X" text.
		let vertical_round_offset = 100;

		for (let j = 0; j < Math.pow(2, num_rounds-i-1); j++) {
			let elem = createRound("bracket");
			elem.style.position = "absolute";

			let round_height = j*height*Math.pow(2, i) + vertical_round_offset;
			if (i == 1) {
				round_height += Math.pow(2, i-1);
				round_height += height/2;
			}
			else if (i != 0) {
				round_height += Math.pow(2, i-1) * height;
				round_height -= height/2;
			}
			elem.style.top = round_height + "px";
			round_div.appendChild(elem);
		}
		bracket_span.appendChild(round_div);

		let bracket_div = document.createElement("div");
		bracket_div.style.position = "absolute";
		bracket_div.style.left = "" + ((i+1)*326 + (i*100)) + "px";
		for (let j = 0; j < Math.pow(2, num_rounds-i-2); j++) {
			let foo_span = document.createElement("span");
			let round_height = j*height*Math.pow(2, i+1) + vertical_round_offset;
			round_height += Math.pow(2, i-1) * height;
			foo_span.style.position = "absolute";
			foo_span.style.top = round_height + "px";

			let bracket = document.createElement("img");
			bracket.src = "images/bracketcropped.png";
			bracket.setAttribute("height", height* Math.pow(2, (i)));
			bracket.setAttribute("width", 100);
			
			foo_span.appendChild(bracket);
			bracket_div.appendChild(foo_span);
		}
		
		// There shouldn't be a bracket image after the last round.
		if (i != num_rounds-1) {
			bracket_span.appendChild(bracket_div);
		}	
	}
}