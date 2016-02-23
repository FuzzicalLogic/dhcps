"use strict";
var __namespace__;

var attribute = require('attribute');

module.exports = (namespace) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);

	return DHCPAMessageOption;
}




function DHCPAMessageOption(key, value, size, fnRead, fnWrite) {
	var config = {
		value: {
			initial: value,
			validator: (v) => {
				return 'number' === typeof v;
			}
		},
		key: {
			initial: key,
			validator: (v) => {
				return 'string' === typeof v;
			}
		},
		size: {
			initial: size,
			validator: (v) => {
				return 'string' === typeof v;
			}
		}
	};
	Object.keys(config).forEach((key) => {
		attribute(this, key, config[key]);
	});


	this.read = fnRead || function(buffer, offset) {

	},
	this.write = fnWrite || function(buffer, offset) {

	},

}
DHCPAMessageOption.TYPES = Object.create(null)

DHCPAMessageOption.prototype = Object.create(null);



function DHCPAMessageOptionType(name, value, size, read, write) {
	this.name = name;
	this.value = value;
	this.size = size;
	this.read = (buffer) => {
		read.call(this, buffer);
	};
	this.write = (buffer) => {
		write.call(this, buffer);
	};
}
DHCPAMessageOption.prototype = Object.create(null);
DHCPAMessageOption.prototype.valueOf = function() {
	return this.value;
}
DHCPAMessageOption.prototype.toString = function() {
	return this.name;
};
