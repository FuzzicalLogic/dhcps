var Message, Option;

module.exports = (MessageClass, OptionClass) => {
	Message = MessageClass;
	Option = OptionClass;

	items.forEach((item) => {
		var option = new Option(
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
		key: 'ipAddressLeaseTime',
		value: 51,
		size: 5,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 4);
			return buffer.readUInt32BE(offset);
		},
		write: function() {}
	},
	{
		key: 'optionOverload',
		value: 52,
		size: 2,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 1);
			return buffer.readUInt8(offset);
		},
		write: function() {}
	},
	{
		key: 'dhcpMessageType',
		value: 53,
		size: 2,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 1);
			return Message.TYPES.get(buffer.readUInt8(offset));
		},
		write: function() {

		}
	},
	{
		key: 'maximumMessageSize',
		value: 57,
		size: 3,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 2);
			return buffer.readUInt16BE(offset);
		},
		write: function() {

		}
	},
	{
		key: 'renewalTimeValue',
		value: 58,
		size: 5,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 4);
			return buffer.readUInt32BE(offset);
		},
		write: function() {

		}
	},
	{
		key: 'rebindingTimeValue',
		value: 59,
		size: 5,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 4);
			return buffer.readUInt32BE(offset);
		},
		write: function() {

		}
	}];
