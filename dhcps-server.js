"use strict";
var __NAMESPACE__, __SUPER__;
module.exports = (namespace, ParentClass) => {
	__NAMESPACE__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	__SUPER__ = 'function' === typeof ParentClass
		? ParentClass
		: () => {};
	util.inherits(DHCPSServer, __SUPER__);

	return DHCPSServer;
}

var util = require('util');

function DHCPSServer(options) {
	options = options || { };
	options.address = options.address || '127.0.0.1';
	options.port = options.port || 67;

	__SUPER__.call(this, options);
}

DHCPSServer.prototype.createOfferPacket = function(msg) {
	msg.options.dhcpMessageType = __NAMESPACE__.Message.TYPES.DHCP_OFFER.value;
    return this.createPacket(msg);
}

DHCPSServer.prototype.createAckPacket = function(msg) {
	msg.options.dhcpMessageType = __NAMESPACE__.Message.TYPES.DHCP_ACK.value;
    return this.createPacket(msg);
}

DHCPSServer.prototype.createNakPacket = function(msg) {
	msg.options.dhcpMessageType = __NAMESPACE__.Message.TYPES.DHCP_NAK.value;
    return this.createPacket(msg);
}
