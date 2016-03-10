"use strict";
var __namespace__,
	Base = require('./base');

var attribute = require('attribute');

module.exports = (namespace) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);

	var DHCPOption = class __class__ extends Base {
		constructor(key, value, size, fnRead, fnWrite, type) {
			super();

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

		readLength(buffer, offset) {
			return buffer.readUInt8(offset);
		}

	};
	DHCPOption.TYPES = {};

	return DHCPOption;
}
