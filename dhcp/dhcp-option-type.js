"use strict";
var __namespace__,
	__class__ = DHCPOptionType, __proto__ = __class__.prototype;

var attribute = require('attribute');

module.exports = (namespace) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);

	return __class__;
}

__class__.prototype = Object.create(null);
function DHCPOptionType(name, read, write) {
	this.name = name;
	this.read = (buffer) => {
		read.call(this, buffer);
	};
	this.write = (buffer) => {
		write.call(this, buffer);
	};
}
__proto__.toBuffer = function(option, buffer, offset) {

};
__proto__.fromBuffer = function(option, buffer, offset) {

};
