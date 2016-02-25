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
	util.inherits(DHCPSClient, __super__);

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

	__super__.call(this, options);
}

DHCPSClient.prototype.start = function(callback) {
	var packet = this.discover(1);
	__super__.prototype.start.call(this, () => {
		this.broadcast(packet, () => {
			console.log('DHCPS Client: Broadcast sent');
		});

		if (typeof callback === 'function')
			process.nextTick(callback);
	});
}

DHCPSClient.prototype.broadcast = function(pkt, cb) {
	return __super__.prototype.broadcast.call(this, pkt, cb);
}

DHCPSClient.prototype.discover = function(xid) {
	var msg = new Message(xid, +MSGTYPES.DHCP_DISCOVER),
		pkt = new Buffer(1500);
	msg.options.timeOffset = -3600 >>> 0;
	msg.options.hostName = 'ntmobiledev';
	return msg.encode(pkt);
}

DHCPSClient.prototype.request = function(offer) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_REQUEST),
		pkt = new Buffer(1500);
	return msg.encode(pkt);
}

DHCPSClient.prototype.decline = function(offer) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_DECLINE),
		pkt = new Buffer(1500);
	return msg.encode(pkt);
}

DHCPSClient.prototype.release = function(xid) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_RELEASE),
		pkt = new Buffer(1500);
	return msg.encode(pkt);
}
