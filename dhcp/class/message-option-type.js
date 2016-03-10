"use strict";
var __namespace__,
	Base = require('./base');

var attribute = require('attribute');

module.exports = (namespace) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);

	var DHCPOptionType = class __class__ extends Base {
		constructor(name, read, write) {
			super();

			this.name = name;
			this.getData = read;
			this.putData = write;
		}

		toBuffer(option, buffer, offset) {

		}

		fromBuffer(option, buffer, offset) {

		}
	}

	return DHCPOptionType;
};
