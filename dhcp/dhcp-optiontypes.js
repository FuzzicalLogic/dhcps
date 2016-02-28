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
		getData: function() { return { length: 0, data: undefined }; },
		putData: function(buffer, offset, value) { return 0; }
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
		putData: function(buffer, offset, value) {
			var written = 0,
				pos = +offset,
				size = +this.size;

			pos = offset + (written += (buffer.writeUInt8(+this.code, pos) - pos));
			pos = offset + (written += (buffer.writeUInt8(size, pos) - pos));

			pos = offset + (written += ((size === 4)
				? buffer.writeUInt32BE(value, pos)
				: (size === 2)
					? buffer.writeUInt16BE(value, pos)
					: buffer.writeUInt8(value, pos)) - pos);
			console.log('Setting DHCP Option: ' + this.key + '(' + value + ') - ' + written + 'B');
			return written;
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
		putData: function(buffer, offset, value) {
			console.log('Setting DHCP Option: ' + this.key + '(' + value + ')');
			return 0;
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
		putData: function(buffer, offset, value) {
			var written = 0,
				pos = +offset,
				len = +((''+value).length),
				size = +this.size;

			pos = offset + (written += (buffer.writeUInt8(+this.code, pos) - pos));
			pos = offset + (written += (buffer.writeUInt8(len, pos) - pos));

			pos = offset + (written += buffer.write(value, pos, len, 'ascii'));

			console.log('Setting DHCP Option: ' + this.key + '(' + value + ') - ' + written + 'B');
			return written;
		}
	}
];
