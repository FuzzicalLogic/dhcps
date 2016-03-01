"use strict";
var __class__ = DHCPSServer,
	__namespace__, __super__, Message, MSGTYPES;

module.exports = (namespace, ParentClass) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	Message = __namespace__.DHCP.Message;
	MSGTYPES = Message.TYPES;

	__super__ = 'function' === typeof ParentClass
		? ParentClass
		: () => {};
	util.inherits(DHCPSServer, __super__);

	return DHCPSServer;
}

var util = require('util');

function DHCPSServer(options) {
	options = options || { };
	options.hostname = options.hostname || 'dhcps.ntmobiledev.local';
	options.address = options.address || '127.0.0.1';
	options.port = options.port || 67;

	__super__.call(this, options);
}

__class__.prototype.offer = function(discovery, options) {
	return this.createMessage(discovery.xid, +MSGTYPES.DHCP_OFFER, options || {});
}
__class__.prototype.ack = function(request, options) {
	return this.createMessage(request.xid, +MSGTYPES.DHCP_ACK, options || {});
}
__class__.prototype.nak = function(request, options) {
	return this.createMessage(request.xid, +MSGTYPES.DHCP_NAK, options || {});
}
