"use strict";
module.exports = () => {
	return DHCP;
}
var __namespace__  = Object.create(null),
    DHCP = __namespace__;
	var Enum = require('../util/enum');
var protocol = require('./protocol')(__namespace__, Enum);

Object.defineProperty(__namespace__, 'MessageOption', {
	value: require('./class/message-option')
		(__namespace__)
});
Object.defineProperty(__namespace__, 'MessageOptionType', {
	value: require('./class/message-option-type')
		(__namespace__)
});
Object.defineProperty(__namespace__.MessageOption, 'TYPES', {
	value: require('./dhcp-optiontypes')
		(__namespace__.MessageOptionType)
});

Object.defineProperty(__namespace__, 'Message', {
	value: require('./class/message')
		(__namespace__, Enum, protocol)
});
Object.defineProperty(__namespace__.Message, 'OPTIONS', {
	value: require('./dhcp-options')
		(__namespace__.Message, __namespace__.MessageOption)
});

Object.defineProperty(__namespace__, 'Host', {
	value: require('./class/host')(__namespace__)
});
Object.freeze(__namespace__);
