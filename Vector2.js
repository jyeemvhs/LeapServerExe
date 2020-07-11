module.exports = class Vector2 {
	constructor(x=0,y=0) {
		this.x = x;
		this.y = y;
	}

	Magnitude() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	Normalized() {
		var mag = this.Magnitude();
		return (new Vector2(this.x/mag,this.y/mag));
	}

//Below means that OtherVect is of type Vector2.	
//	Distance(OtherVect - Vector2) {
	Distance(OtherVect) {
		var direction = new Vector2();
		direction.x = OtherVect.x - this.x;
		direction.y = OtherVect.y - this.y;
		return (direction.Magnitude());
	}
	ConsoleOutput() {
		return ('(' + this.x + "," + this.y + ')');
	}
}