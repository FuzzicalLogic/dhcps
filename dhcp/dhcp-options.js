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
			item.write,
			Option.TYPES[item.type]
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
var items = [
	{ value: 2, key: 'timeOffset', type: 'uint', size: 4 },
	{ value: 12, key: 'hostName', type: 'string', size: 0 },
	{ value: 15, key: 'domainName', type: 'string', size: 0 },
	{ value: 51, key: 'ipAddressLeaseTime', type: 'uint', size: 4 },
	{ value: 52, key: 'optionOverload', type: 'uint', size: 1 },
	{
		value: 53,
		key: 'dhcpMessageType',
		size: 1,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 1);
			return {
				length: 2,
				value: Message.TYPES.get(buffer.readUInt8(offset))
			};
		},
		write: function() {

		}
	},
	{ value: 57, key: 'maximumMessageSize', type: 'uint', size: 2 },
	{ value: 58, key: 'renewalTimeValue', type: 'uint', size: 4	},
	{ value: 59, key: 'rebindingTimeValue', type: 'uint', size: 4 },
	{ value: 60, key: 'vendorClassIdentifier', type: 'string', size: 0 }
];
