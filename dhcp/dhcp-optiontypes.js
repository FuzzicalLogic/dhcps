"use strict";
var OptionType;

module.exports = (OptionTypeClass) => {
	OptionType = OptionTypeClass;

	items.forEach((i) => {
		Object.defineProperty(types, i.name, {
			value: new OptionType(i.name, i.getData, i.putData)
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
			console.log('Reading option at: ' + offset.toString(16));
			var data,
			// Cast, in case, a numeric string or property is sent.
				pos = +offset;
			console.log('Length at: ' + pos.toString(16));
			var len = this.readLength(buffer, pos++);
			console.log('Length: ' + len.toString(16));

			console.log('Value at: ' + pos.toString(16));
			if (+this.size === 4)
				data = buffer.readUInt32BE(pos);
			else if (+this.size === 2)
				data = buffer.readUInt16BE(pos);
			else if (+this.size === 1)
				data = buffer.readUInt8(pos);

			return {
				length: len + 1,
				value: data
			};
		},
		putData: function() {

		}
	},
	{	name: 'ipaddress',
		getData: function(buffer, offset) {
			var i, data,
			// Cast in the case that a numeric string or property is sent.
				pos = +offset,
				len = this.readLength(buffer, pos++);

			var segments = [];
			for (i = 0; i < 4; i++)
				segments.push(buffer.readUInt8(pos + i));
			data = segments.join('.');

			return {
				length: len + 1,
				value: data
			};
		},
		putData: function() {

		}
	},
	{	name: 'string',
		getData: function(buffer, offset) {
		// Cast in the case that a numeric string or property is sent.
			var pos = +offset,
				len = this.readLength(buffer, pos++);

			return {
				length: len + 1,
				value: buffer.toString('ascii', pos, pos + len)
			};
		},
		putData: function() {

		}
	}
];
