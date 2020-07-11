var shortID = require('shortid');
var Vector2 = require('./Vector2.js')
var Quaternion = require('./Quaternion.js')
module.exports = class Player {
	constructor() {
		this.username = '';
		this.id = shortID.generate();
		this.position = new Vector2();
		this.rotation = new Quaternion();
	}
}



