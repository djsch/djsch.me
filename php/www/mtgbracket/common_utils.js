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