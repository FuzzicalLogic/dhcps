var __namespace__, Option;

module.exports = (namespace, OptionClass) {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	Option = OptionClass;

	items.forEach((item) => {
		var option = new OptionClass(
			item.key,
			item.value,
			item.size,
			item.read,
			item.write
		);

		Object.defineProperty(options, item.key, {
			value: option
		});
		Object.defineProperty(options, item.value, {
			value: option
		});
	});

	return options;
}

var assert = require('assert');
var options = {};
var items = [{
		key: 'timeOffset',
		value: 2,
		size: 5,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 4);
			return buffer.readUInt32BE(offset) << 0;
		},
		write: function() {

		}
	},
	{
		key: 'dhcpMessageType',
		value: 53,
		size: 2,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 1);
			return DHCPSMessage.TYPES.get(buffer.readUInt8(offset));
		},
		write: function() {

		}
	}]
