"use strict";
var __namespace__;

var attribute = require('attribute');

module.exports = (namespace) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);

	return DHCPOption;
}


DHCPOption.prototype = Object.create(null);
function DHCPOption(key, value, size, fnRead, fnWrite, type) {
	var config = {
		code: {
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

	this.read = (!!type && !!type.getData)
		? type.getData
		: fnRead || function(buffer, offset) {

		};
	this.write = (!!type && !!type.putData)
		? type.putData
		: fnWrite || function(buffer, offset) {

		};
}
DHCPOption.prototype.readLength = function(buffer, offset) {
	return buffer.readUInt8(offset);
};
DHCPOption.TYPES = {}
