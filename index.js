"use strict";
module.exports = () => {
	return DHCPS;
}
var __namespace__  = Object.create(null),
    DHCPS = __namespace__;

var Enum = require('./util/enum');
Object.defineProperty(__namespace__, 'DHCP', {
	value: require('./dhcp')()
});
Object.defineProperty(__namespace__, 'Server', {
	value: require('./class/server')(__namespace__, __namespace__.DHCP.Host)
});
Object.defineProperty(__namespace__, 'Client', {
	value: require('./class/client')(__namespace__, __namespace__.DHCP.Host)
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
