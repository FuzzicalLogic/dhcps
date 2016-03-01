"use strict";
module.exports = () => {
	return DHCPS;
}
var __namespace__  = Object.create(null),
    DHCPS = __namespace__;

var Enum = require('./util/enum');
Object.defineProperty(__namespace__, 'protocol', {
	value: require('./codec/protocol')(__namespace__, Enum)
});
Object.defineProperty(__namespace__, 'DHCP', {
	value: Object.create(null)
});
	Object.defineProperty(__namespace__.DHCP, 'MessageOption', {
		value: require('./dhcp/dhcp-message-option')
			(__namespace__.DHCP)
	});
	Object.defineProperty(__namespace__.DHCP, 'MessageOptionType', {
		value: require('./dhcp/dhcp-option-type')
			(__namespace__.DHCP)
	});
	Object.defineProperty(__namespace__.DHCP.MessageOption, 'TYPES', {
		value: require('./dhcp/dhcp-optiontypes')
			(__namespace__.DHCP.MessageOptionType)
	});

	Object.defineProperty(__namespace__.DHCP, 'Message', {
		value: require('./dhcp/dhcp-message')
			(__namespace__.DHCP, Enum, __namespace__.protocol)
	});
	Object.defineProperty(__namespace__.DHCP.Message, 'OPTIONS', {
		value: require('./dhcp/dhcp-options')
			(__namespace__.DHCP.Message, __namespace__.DHCP.MessageOption)
	});


	Object.defineProperty(__namespace__.DHCP, 'Host', {
		value: require('./dhcp/dhcp-host')(__namespace__.DHCP)
	});
Object.defineProperty(__namespace__, 'Server', {
	value: require('./dhcps-server')(__namespace__, __namespace__.DHCP.Host)
});
Object.defineProperty(__namespace__, 'Client', {
	value: require('./dhcps-client')(__namespace__, __namespace__.DHCP.Host)
});
Object.defineProperty(__namespace__, 'createServer', {
	value: (options) => {
		return new __namespace__.Server(options);
	}
});
Object.defineProperty(__namespace__, 'createClient', {
	value: (options) => {
		return new __namespace__.Client(options);
	}
});
Object.freeze(__namespace__);
