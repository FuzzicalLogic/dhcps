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
__namespace__.MessageOption = require('./codec/dhcp-message-option')(__namespace__);
__namespace__.Message = require('./codec/dhcp-message')(__namespace__, Enum);
__namespace__.DHCP = {};
__namespace__.DHCP.Host = require('./dhcp/dhcp-host')(__namespace__);
__namespace__.Server = require('./dhcps-server')(__namespace__, __namespace__.DHCP.Host);
__namespace__.Client = require('./dhcps-client')(__namespace__, __namespace__.DHCP.Host);
__namespace__.createServer = (options) => {
	return new __namespace__.Server(options);
};
__namespace__.createClient = (options) => {
	return new __namespace__.Client(options);
};
Object.freeze(__namespace__);
