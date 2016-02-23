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
		value: require('./dhcp/dhcp-message-option')(__namespace__.DHCP)
	});
	Object.defineProperty(__namespace__.DHCP, 'Message', {
		value: require('./dhcp/dhcp-message')(__namespace__.DHCP, Enum)
	});
	Object.defineProperty(__namespace__.DHCP, 'Host', {
		value: require('./dhcp/dhcp-host')(__namespace__.DHCP)
	});
Object.defineProperty(__namespace__, 'Server', {
	value: require('./dhcps-server')(__namespace__, __namespace__.DHCP.Host)
});
Object.defineProperty(__namespace__, 'Client', {
	value: (__namespace__, __namespace__.DHCP.Host)
});
Object.defineProperty(__namespace__, 'DHCP', {
	value: (options) => {
		return new __namespace__.Server(options);
	}
});
Object.defineProperty(__namespace__, 'DHCP', {
	value: (options) => {
		return new __namespace__.Client(options);
	}
});
Object.freeze(__namespace__);
