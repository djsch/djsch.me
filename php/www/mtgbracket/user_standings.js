function displayStandings() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            //console.log(data);

            let ele = document.getElementById("standings");
            
            for (i = 0; i < data.length; i++) {
                let output = "";
                output += data[i].name;
                output += " ";
                output += data[i].score;
                output += "\n";

                let p = document.createElement("p");
                p.innerHTML = output;
                ele.appendChild(p);
            }
        }
    };
    xmlhttp.open("GET","get_user_standings.php", true);
    xmlhttp.send();
}

displayStandings();