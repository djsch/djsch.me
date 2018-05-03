class mtgBracketWinners {
    constructor() {
        // Store the mtgBranchWinners that feed the top8.
        this.branches = new Array();
        for (let i = 0; i < 9; i++) {
            this.branches.push(null);
        }
/*
        let cards = new Array();
        //for (let i = 0; i < 8; i++) {
        //    cards.push(this.branches[i].getWinner());
        //}

        this.rounds = new Array();
        this.rounds.push(cards);

        let round2 = new Array()
        for (let i = 0; i < 4; i++) {
            round2.push("");
        }
        this.rounds.push(round2);

        let round3 = new Array();
        for (let i = 0; i < 2; i++) {
            round3.push("");
        }
        this.rounds.push(round3);

        let round4 = new Array();
        round4.push("");
        this.rounds.push(round4);

        this.screen_scrolled = false;
        */
    }

    update() {
        /*
        let cards = new Array();
        for (let i = 0; i < 8; i++) {
            cards.push(this.branches[i].getWinner());
        }
        this.rounds[0] = cards;
        */
    }
/*
    setRoundWinner(card, round) {
        var last_col = 3;

        console.log("setRoundWinner called for: " + card);
        let index = this.rounds[round].indexOf(card);
        let row = Math.floor(index/2);
        // Get the name of the opposing card that we might need to remove from
        // future rounds.
        var opp_card = "";
        if (index%2 == 0) {
            opp_card = this.rounds[round][index+1];
        }
        else {
            opp_card = this.rounds[round][index-1];
        }
        // Set the winning card to the next round.
        if (round < last_col) {
            this.rounds[round+1][row] = card;
            updateImageAndSetOnclick(card, 8, round+1, Math.floor(row/2), row%2);
        }
        // If there are further rounds that need to be changed, change them.
        if (round < (last_col - 1)) {
            for (let i = round+2; i < 4; i++) {
                row = Math.floor(row/2);
                //if (this.rounds[i][row] != card && this.rounds[i][row] != "") {
                if (this.rounds[i][row] == opp_card) {
                    this.rounds[i][row] = "";
                    updateImageAndSetOnclick("", 8, i, Math.floor(row/2), row%2);
                }
            }
        }
    }

    isComplete() {
        for (let i = 0; i < this.rounds.length; i++) {
            for (let j = 0; j < this.rounds[i].length; j++) {
                if (this.rounds[i][j] == "") {
                    return false;
                }
            }
        }
        return true;
    }

    hasScreenScrolled() {
        return this.screen_scrolled;
    }

    setScreenScrolled() {
        this.screen_scrolled = true;
    }

    getWinner() {
        return this.rounds[3][0];
    }

    getBranchNum() {
        return 8;
    }
    */

    printDebugString() {
        for (let i = 0; i < this.rounds.length; i++) {
            console.log(this.rounds[i]);
        }
    }

    setBranchWinners(branch, i) {
        this.branches[i] = branch;
    }

    getBranchWinners(i) {
        //if (i == 8) {
        //    return this;
        //}
        //else {
            return this.branches[i];
        //}
    }
}

class mtgBranchWinners {
    constructor(cards, branch_n) {
        // In the top 8, we want to create 1 fewer round.
        let div_factor = 1;
        if (cards.length == 8) {
            div_factor = 2;
            if (branch_n != 8) {
                throw "Tried to create a top8 in the wrong slot.";
            }
        }
        else if (cards.length != 16) {
            throw "Tried to construct an mtgBracketWinners object with the wrong number of cards: " + cards.length;
        }
        this.branch_num = branch_n;
        this.rounds = new Array();
        this.rounds.push(cards);

        let round2 = new Array()
        for (let i = 0; i < 8/div_factor; i++) {
            round2.push("");
        }
        this.rounds.push(round2);

        let round3 = new Array();
        for (let i = 0; i < 4/div_factor; i++) {
            round3.push("");
        }
        this.rounds.push(round3);

        let round4 = new Array();
        for (let i = 0; i < 2/div_factor; i++) {
            round4.push("");
        }
        this.rounds.push(round4);

        // Only create this round in non-top8 rounds.
        if (div_factor == 1) {
            let round5 = new Array();
            round5.push("");
            this.rounds.push(round5);
        }

        this.screen_scrolled = false;
    }

    // 'card' is the card that wins
    // 'round' is the round that is won (0-indexed)
    //   (therefore we alter round+1)
    setRoundWinner(card, round) {
        var last_col;
        if (isTop8()) {
            last_col = 3;
        }
        else {
            last_col = 4;
        }

        console.log("setRoundWinner called for: " + card);
        let index = this.rounds[round].indexOf(card);
        let row = Math.floor(index/2);
        // Get the name of the opposing card that we might need to remove from
        // future rounds.
        var opp_card = "";
        if (index%2 == 0) {
            opp_card = this.rounds[round][index+1];
        }
        else {
            opp_card = this.rounds[round][index-1];
        }
        // Set the winning card to the next round.
        if (round < last_col) {
            this.rounds[round+1][row] = card;
            updateImageAndSetOnclick(card, this.branch_num, round+1, Math.floor(row/2), row%2);
        }
        // If there are further rounds that need to be changed, change them.
        if (round < (last_col - 1)) {
            for (let i = round+2; i < 4; i++) {
                row = Math.floor(row/2);
                //if (this.rounds[i][row] != card && this.rounds[i][row] != "") {
                if (this.rounds[i][row] == opp_card) {
                    this.rounds[i][row] = "";
                    updateImageAndSetOnclick("", this.branch_num, i, Math.floor(row/2), row%2);
                }
            }
        }
        //round_next[Math.floor(index/2)] = card;
        //this.round2[Math.floor(pos/2)] = card;
        //doThing(card, 1, Math.floor(pos/2), pos%2);
        //refresh display
    }

    isComplete() {
        for (let i = 0; i < this.rounds.length; i++) {
            for (let j = 0; j < this.rounds[i].length; j++) {
                if (this.rounds[i][j] == "") {
                    return false;
                }
            }
        }
        return true;
    }

    getFullBranch() {
        let ret = new Array();
        for (let i = 0; i < this.rounds.length; i++) {
            for (let j = 0; j < this.rounds[i].length; j++) {
                ret.push(this.rounds[i][j]);
            }
        }
        return ret;
    }


    hasScreenScrolled() {
        return this.screen_scrolled;
    }

    setScreenScrolled() {
        this.screen_scrolled = true;
    }

    getWinner() {
        if (isTop8()) {
            return this.rounds[3][0];
        }
        else {
            return this.rounds[4][0];
        }
    }

    getBranchNum() {
        return this.branch_num;
    }

    printDebugString() {
        for (let i = 0; i < this.rounds.length; i++) {
            console.log(this.rounds[i]);
        }
    }
}