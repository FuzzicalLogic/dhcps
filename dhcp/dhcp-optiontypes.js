"use strict";
var OptionType;

module.exports = (OptionTypeClass) => {
	OptionType = OptionTypeClass;

	items.forEach((i) => {
		Object.defineProperty(types, i.name, {
			value: new OptionType(i.name, i.read, i.write)
		});
	});

	return types;
}

var assert = require('assert');
var types = {};
var items = [
	{	name: 'fixed',
		getData: function() {
			return {
				length: 0, data: undefined
			}
		},
		putData: function() {

		}
	},
	{	name: 'uint',
		getData: function(buffer, offset) {
			var data,
				len = this.readLength(buffer, +offset++);

			if (+this.size === 4)
				data = buffer.readUInt32BE(buffer, +offset);
			else if (+this.size === 2)
				data = buffer.readUInt16BE(buffer, +offset);
			else if (+this.size === 1)
				data = buffer.readUInt8(buffer, +offset);

			return {
				length: len + 1,
				value: data
			};
		},
		putData: function() {

		}
	},
	{	name: 'ipaddress',
		getData: function() {

		},
		putData: function() {

		}
	},
	{	name: 'string',
		getData: function(buffer, offset) {
			var data,
				len = this.readLength(buffer, offset++);

			return {
				length: len + 1,
				data: buffer.toString('ascii', offset, offset + len)
			};
		},
		putData: function() {

		}
	}
];
