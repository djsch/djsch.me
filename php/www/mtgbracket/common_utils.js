// Given the exact name of a card and an img HTML element,
// gets the image for that card name and sets the src for that img.
function getAndSetCardImage(card_name, img) {
	// We don't need to get an image for byes.
	if (card_name == "(bye)") {
		return;
	}
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            img.src = data[0];
        }
    };
    let escaped_card_name = card_name.replace(/'/g,"\\\'");
    xmlhttp.open("GET","get_card_image.php?q="+escaped_card_name,true);
    xmlhttp.send();
}

// Given an HTML element 'bracket' representing the currently displayed
// bracket, return the card image denoted by the col, row, pos arguments.
// pos == 0 is interpreted to mean 'left', and pos == 1 is interpreted
// to mean 'right'.
function getImageFromBracket(bracket, col, row, pos) {
    return bracket[col*2].childNodes[row].childNodes[pos].childNodes[0];
}

// Given an HTML element 'bracket' representing the currently displayed
// bracket, return the red X image denoted by the col, row, pos arguments.
// pos == 0 is interpreted to mean 'left', and pos == 1 is interpreted
// to mean 'right'.
function getXFromBracket(bracket, col, row, pos) {
    return bracket[col*2].childNodes[row].childNodes[pos].childNodes[1];
}

// Given an HTML element 'bracket' representing the currently displayed
// bracket, return the green check mark image denoted by the col, row, pos
// arguments. pos == 0 is interpreted to mean 'left', and pos == 1 is interpreted
// to mean 'right'.
function getCheckMarkFromBracket(bracket, col, row, pos) {
    return bracket[col*2].childNodes[row].childNodes[pos].childNodes[3];
}

// Given an HTML element 'bracket' representing the currently displayed
// bracket, return the purple '?' image denoted by the col, row, pos arguments.
// pos == 0 is interpreted to mean 'left', and pos == 1 is interpreted
// to mean 'right'.
function getQuestionMarkFromBracket(bracket, col, row, pos) {
    return bracket[col*2].childNodes[row].childNodes[pos].childNodes[4];
}