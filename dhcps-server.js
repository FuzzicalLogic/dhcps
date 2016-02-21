"use strict";
var __NAMESPACE__, __SUPER__, Message, MSGTYPES;

module.exports = (namespace, ParentClass) => {
	__NAMESPACE__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	Message = __NAMESPACE__.Message;
	MSGTYPES = Message.TYPES;

	__SUPER__ = 'function' === typeof ParentClass
		? ParentClass
		: () => {};
	util.inherits(DHCPSServer, __SUPER__);

	return DHCPSServer;
}

var util = require('util');

function DHCPSServer(options) {
	options = options || { };
	options.hostname = options.hostname || 'dhcps.ntmobiledev.local';
	options.address = options.address || '127.0.0.1';
	options.port = options.port || 67;

	__SUPER__.call(this, options);
}

DHCPSServer.prototype.offer = function(discovery) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_OFFER),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}

DHCPSServer.prototype.ack = function(request) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_ACK),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}

DHCPSServer.prototype.nak = function(request) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_NAK),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}
