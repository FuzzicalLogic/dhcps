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
	util.inherits(DHCPSClient, __SUPER__);

	return DHCPSClient;
}

var util = require('util');
var V4Address = require('ip-address').Address4;
var hex = require('hex');

function DHCPSClient(options) {
	options = options || { };
	options.hostname = options.hostname || 'client.ntmobiledev.local';
	options.address = options.address || '127.0.0.1';
	options.port = options.port || 68;

	__SUPER__.call(this, options);
}

DHCPSClient.prototype.start = function(callback) {
	__SUPER__.prototype.start.call(() => {
		this.broadcast(this.discover(1));

		if (typeof callback === 'function')
			callback();
	});
}

DHCPSClient.prototype.broadcast = function(pkt, cb) {
	__SUPER__.prototype.broadcast.call(this, pkt, cb);
}

DHCPSClient.prototype.discover = function(xid) {
	var msg = new Message(xid, +MSGTYPES.DHCP_DISCOVER),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}

DHCPSClient.prototype.request = function(offer) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_REQUEST),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}

DHCPSClient.prototype.decline = function(offer) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_DECLINE),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}

DHCPSClient.prototype.release = function(xid) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_RELEASE),
		pkt = new Buffer(1500);
	msg.encode(pkt);

	return this.send(pkt);
}
