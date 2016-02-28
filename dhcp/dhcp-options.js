var Message, Option;

module.exports = (MessageClass, OptionClass) => {
	Message = MessageClass;
	Option = OptionClass;

	items.forEach((item) => {
		var option = new Option(
			item.key,
			item.code,
			item.size,
			item.read,
			item.write,
			Option.TYPES[item.type]
		);

		Object.defineProperty(options, item.key, {
			value: option
		});
		Object.defineProperty(options, item.code, {
			value: option
		});
	});

	return options;
}

var assert = require('assert');
var options = {};
var items = [
	{ code: 1, key: 'subnetMask', type: 'ipaddress', size: 1 },
	{ code: 2, key: 'timeOffset', type: 'uint', size: 4 },
	{ code: 3, key: 'routerOption', type: 'ipaddress', size: 0 },
	{ code: 4, key: 'timeServerOption', type: 'ipaddress', size: 0 },
	{ code: 5, key: 'nameServers', type: 'ipaddress', size: 0 },
	{ code: 6, key: 'domainNameServerOption', type: 'ipaddress', size: 0 },
	{ code: 7, key: 'logServerOption', type: 'ipaddress', size: 0 },
	{ code: 8, key: 'cookieServerOption', type: 'ipaddress', size: 0 },
	{ code: 9, key: 'LPRServerOption', type: 'ipaddress', size: 0 },
	{ code: 10, key: 'impressServerOption', type: 'ipaddress', size: 0 },
	{ code: 11, key: 'resourceLocationServerOption', type: 'ipaddress', size: 0 },
	{ code: 12, key: 'hostName', type: 'string', size: 0 },
	{ code: 15, key: 'domainName', type: 'string', size: 0 },
	{ code: 16, key: 'swapServerOption', type: 'ipaddress', size: 1 },
	{ code: 50, key: 'requestedIpAddress', type: 'ipaddress', size: 1 },
	{ code: 51, key: 'ipAddressLeaseTime', type: 'uint', size: 4 },
	{ code: 52, key: 'optionOverload', type: 'uint', size: 1 },
	{
		code: 53, key: 'dhcpMessageType', size: 1,
		read: function(buffer, offset) {
			assert.strictEqual(buffer.readUInt8(offset++), 1);
			return {
				length: 2,
				value: Message.TYPES.get(buffer.readUInt8(offset))
			};
		},
		write: function(buffer, offset, value) {
			var pos = +offset;

			buffer.writeUInt8(+this.code, pos++);
			buffer.writeUInt8(+this.size, pos++);
			buffer.writeUInt8(value, pos);

			return 3;
		}
	},
	{ code: 54, key: 'serverIdentifier', type: 'ipaddress', size: 4},
	{ code: 57, key: 'maximumMessageSize', type: 'uint', size: 2 },
	{ code: 58, key: 'renewalTimeValue', type: 'uint', size: 4	},
	{ code: 59, key: 'rebindingTimeValue', type: 'uint', size: 4 },
	{ code: 60, key: 'vendorClassIdentifier', type: 'string', size: 0 },
	//{ code: 81, key: 'fullyQualifiedDomainName', type: 'string', size: 0 }
	{ code: 118, key: 'subnetSelection', type: 'ipaddress', size: 4}

];
