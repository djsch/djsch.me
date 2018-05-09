"use strict"

class SetCard {
	constructor(number, type, color, shape) {
		this.number = number;
		this.type = type;
		this.color = color;
		this.shape = shape;
	}

	get number() {
		return this._number;
	}

	set number(value) {
		this._number = value;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	get color() {
		return this._color;
	}

	set color(value) {
		this._color = value;
	}

	get shape() {
		return this._shape;
	}

	set shape(value) {
		this._shape = value;
	}

	getFilename(color) {
		let s = ""
		if (color == "red") {
			s += "red_border/";
		} else if (color == "black") {
			s += "black_border/";
		}

		if (this._number == 0) {
			s += "one_";
		} else if(this._number == 1) {
			s += "two_";
		} else if(this._number == 2) {
			s += "three_";
		}

		if (this._type == 0) {
			s += "hollow_";
		} else if(this._type == 1) {
			s += "shaded_";
		} else if(this._type == 2) {
			s += "solid_";
		}

		if (this._color == 0) {
			s += "green_";
		} else if(this._color == 1) {
			s += "purple_";
		} else if(this._color == 2) {
			s += "red_";
		}

		if (this._shape == 0) {
			s += "diamond";
		} else if(this._shape == 1) {
			s += "oval";
		} else if(this._shape == 2) {
			s += "squiggly";
		}
		s += ".jpg";
		return s;
	}

	debugString() {
		return "" + this._number + this._type + this._color + this._shape;
	}
}