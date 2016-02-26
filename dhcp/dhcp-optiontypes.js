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
			var i, data = [],
			// Cast, in case, a numeric string or property is sent.
				pos = +offset, sz = +this.size,
				len = this.readLength(buffer, pos++);

			for (i = 0; i < len; i += sz) {
				data.push(readUInteger(buffer, pos, sz));
				pos += sz;
			}

			return {
				length: len + 1,
				value: (data.length > 1) ? data : data[0]
			};

			function readUInteger(buffer, offset, size) {
				return (size === 4)
					? buffer.readUInt32BE(offset)
					: (size === 2)
						? buffer.readUInt16BE(offset)
						: buffer.readUInt8(offset);
			}
		},
		putData: function() {

		}
	},
	{	name: 'ipaddress',
		getData: function(buffer, offset) {
			var i, data = [],
			// Cast in the case that a numeric string or property is sent.
				pos = +offset,
				len = this.readLength(buffer, pos++);

			for (i = 0; i < len; i += 4) {
				data.push(readIPAddress(buffer, pos));
			}

			return {
				length: len + 1,
				value: (data.length > 1) ? data : data[0]
			};

			function readIPAddress(buffer, offset) {
				var segments = [];
				for (i = 0; i < 4; i++)
					segments.push(buffer.readUInt8(offset + i));
				data = segments.join('.');
			}
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
