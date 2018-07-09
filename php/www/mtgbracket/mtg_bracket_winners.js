// mtgBracketWinners is a class which holds Magic cards in a bracket structure. It is
// composed of 9 mtgBranchWinners objects -- 8 for each division of 16 cards, and 1 for
// the top 8. This division is used because only up to 16 cards are visible at one
// time, so we designate this as a 'branch', and the entire bracket is composed of branches.
class mtgBracketWinners {
    constructor() {
        // Store the mtgBranchWinners that feed the top8.
        this.branches = new Array();
        for (let i = 0; i < 9; i++) {
            let foo_array = new Array();
            let num_elems = 16;
            if (i == 8) {num_elems = 8;}
            for (let j = 0; j < num_elems; j++) {
                foo_array.push("");
            }
            let foo_branch = new mtgBranchWinners(foo_array, i);
            this.branches.push(foo_branch);
        }
    }

    // Initializes the first column of each branch; ie the state of the bracket before
    // any cards have been eliminated.
    initialize(cards) {
        if (cards.length != 128) {
            throw "tried to initialize with wrong number of cards: got " + cards.length;
        }
        for (let i = 0; i < 8; i++) {
            let start = 16 * i;
            let end = start + 16;
            this.branches[i].initialize(cards.slice(start, end));
        }
    }

    // Like initialize(), but updates all rounds of the bracket, rather than
    // just the first column.
    update(cards) {
        if (cards.length != 263) {
            throw "wrong number of cards in update(): got " + cards.length;
        }
        for (let i = 0; i < 9; i++) {
            let start = 31 * i;
            let end = start + 31;
            if (i == 8) {
                end -= 16;
            }
            this.branches[i].update(cards.slice(start, end));
        }
    }

    isComplete() {
        for (let i = 0; i < 9; i++) {
            if (!this.branches[i].isComplete()) {
                return false;
            }
        }
        return true;
    }

    // Gets the card in the given division, row, and column.
    getCard(division, row, col) {
        return this.branches[division].getCard(row, col);
    }

    // Updates the branch representing the top 8 with the winners of each division.
    updateTop8(){
        let winners = new Array();
        for (let i = 0; i < 8; i++) {
            winners.push(this.branches[i].getWinner());
        }
        this.branches[8].refresh(winners);
    }

    // Prints a debug string.
    printDebugString() {
        for (let i = 0; i < this.branches.length; i++) {
            if (this.branches[i] != null) {
                this.branches[i].printDebugString();
            }
            else {
                console.log("branch " + i + " hasn't been created yet.");
            }
        }
    }

    setBranchWinners(branch, i) {
        this.branches[i] = branch;
    }

    getBranchWinners(i) {
        return this.branches[i];

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

    // Set the given card to win the given round. This requires us to do the following:
    //
    // - Add this card to the next round (ie, round+1) in this mtgBranchWinners object.
    // - Update the image displayed in the HTML and update the onclick function of that image.
    // - If the card's opponent appears later in the bracket, remove it from those
    //   spots, as it's been defeated now.
    setRoundWinner(card, round) {
        var last_col;
        if (this.rounds.length == 4) {
            last_col = 3;
        }
        else {
            last_col = 4;
        }

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
            // Don't update anything if this card is already where it's supposed to be.
            if (this.rounds[round+1][row] != card) {
                this.rounds[round+1][row] = card;
                updateImageAndSetOnclick(card, this.branch_num, round+1, Math.floor(row/2), row%2);
                changeXVisible(round, row, ((index+1)%2), true);
                changeXVisible(round, row, index%2, false);
                if (round+1 < last_col) {
                    changeXVisible(round+1, Math.floor(row/2), (row+1)%2, false);
                }
            }
        }
        // TODO: this seems all wrong. why are we depending on hard values of 4/5? 
        // If there are further rounds that need to be changed, change them.
        if (round < (last_col - 1)) {
            for (let i = round+2; i < 4; i++) {
                row = Math.floor(row/2);
                if (this.rounds[i][row] == opp_card) {
                    this.rounds[i][row] = "";
                    updateImageAndSetOnclick("", this.branch_num, i, Math.floor(row/2), row%2);
                    changeXVisible(i, Math.floor(row/2), (row+1)%2, false);
                }
            }
        }
    }
    
    // Initializes the first column of each branch; ie the state of the bracket before
    // any cards have been eliminated.
    initialize(cards) {
        if ((this.rounds.length == 4) && (cards.length != 8)) {
            throw "wrong number of cards";
        }
        else if ((this.rounds.length == 5) && (cards.length != 16)) {
            throw "got the wrong number of cards";
        }

        // TODO: verify that the slice is necessary
        this.rounds[0] = cards.slice();
    }

    // Like initialize(), but updates all rounds of the bracket, rather than
    // just the first column.
    update(cards) {
        //console.log("calling update in branch");
        //console.log(cards);
        if ((this.rounds.length == 4) && (cards.length != 15)) {
            throw "wrong number of cards";
        }
        else if ((this.rounds.length == 5) && (cards.length != 31)) {
            throw "got the wrong number of cards";
        }

        let i = 0;
        for (let j = 0; j < this.rounds.length; j++) {
            for (let k = 0; k < this.rounds[j].length; k++) {
                this.rounds[j][k] = cards[i];
                i++;
            }
        }
        //console.log("printing rounds");
        for (let r = 0; r < this.rounds.length; r++) {
            //console.log(this.rounds[r]);
        }
    }

    // Like initialize, but doesn't overwrite. Used for updating the top8
    refresh(cards) {
        if (cards.length != this.rounds[0].length) {
            throw "unexpected cards length: " + cards;
        }
        for (let i = 0; i < this.rounds[0].length; i++) {
            if (cards[i] != "") {
                this.rounds[0][i] = cards[i];
            }
        }
    }

    // Gets the card in the given row and column.
    getCard(row, col) {
        return this.rounds[row][col];
    }

    // Returns whether or not this branch is completely filled out.
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

    // Returns an array representing the entire state of this branch.
    getFullBranch() {
        let ret = new Array();
        for (let i = 0; i < this.rounds.length; i++) {
            for (let j = 0; j < this.rounds[i].length; j++) {
                ret.push(this.rounds[i][j]);
            }
        }
        return ret;
    }

    // Returns whether this branch has auto-scrolled the screen to the top or not.
    // We track this because it should only happen once per branch.
    hasScreenScrolled() {
        return this.screen_scrolled;
    }

    setScreenScrolled() {
        this.screen_scrolled = true;
    }

    // Returns the winner of this branch.
    getWinner() {
        if (this.rounds.length == 4) {
            return this.rounds[3][0];
        }
        else {
            return this.rounds[4][0];
        }
    }

    // Returns the number of this branch.
    getBranchNum() {
        return this.branch_num;
    }

    // Prints a debug string representing this branch.
    printDebugString() {
        for (let i = 0; i < this.rounds.length; i++) {
            console.log(this.rounds[i]);
        }
    }
}