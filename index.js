"use strict";
module.exports = () => {
	return DHCPS;
}
var __NAMESPACE__  = Object.create(null),
    DHCPS = __NAMESPACE__;

var Enum = require('./util/enum');
__NAMESPACE__.protocol = require('./codec/protocol')(__NAMESPACE__, Enum);
__NAMESPACE__.MessageOption = require('./codec/dhcp-message-option')(__NAMESPACE__);
__NAMESPACE__.Message = require('./codec/dhcp-message')(__NAMESPACE__, Enum);
__NAMESPACE__.DHCP = {};
__NAMESPACE__.DHCP.Host = require('./dhcp/dhcp-host')(__NAMESPACE__);
__NAMESPACE__.Server = require('./dhcps-server')(__NAMESPACE__, __NAMESPACE__.DHCP.Host);
__NAMESPACE__.Client = require('./dhcps-client')(__NAMESPACE__, __NAMESPACE__.DHCP.Host);
__NAMESPACE__.createServer = (options) => {
	return new __NAMESPACE__.Server(options);
};
__NAMESPACE__.createClient = (options) => {
	return new __NAMESPACE__.Client(options);
};
Object.freeze(__NAMESPACE__);
