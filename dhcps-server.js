"use strict";
var __namespace__, __super__, Message, MSGTYPES;

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

DHCPSServer.prototype.offer = function(discovery) {
	var msg = new Message(discovery.xid, +MSGTYPES.DHCP_OFFER),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}

DHCPSServer.prototype.ack = function(request) {
	var msg = new Message(request.xid, +MSGTYPES.DHCP_ACK),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}

DHCPSServer.prototype.nak = function(request) {
	var msg = new Message(request.xid, +MSGTYPES.DHCP_NAK),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}
