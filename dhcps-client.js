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
		this.broadcast(
			this.createDiscoverPacket(),
			__SUPER__.SYSTEM_BROADCAST_ADDRESS
		);

		if (typeof callback === 'function')
			callback();
	});
}

DHCPSClient.prototype.broadcast = function(pkt, cb) {
	__SUPER__.prototype.broadcast.call(this, pkt, cb);
}

DHCPSClient.prototype.discover = function(xid) {
	var msg = new Message(xid, +MSGTYPES.DHCP_DISCOVER);

    var opts = {
        op:     0x01,
        htype:  0x01,
        hlen:   0x06,
        hops:   0x00,
        xid:    0x00000000,
        secs:   0x0000,
        flags:  0x0000,
        ciaddr: '0.0.0.0',
        yiaddr: '0.0.0.0',
        siaddr: '0.0.0.0',
        giaddr: '0.0.0.0',
    };
    if ('xid' in user) pkt.xid = user.xid;
    if ('chaddr' in user) pkt.chaddr = user.chaddr;
    if ('options' in user) pkt.options = user.options;

	var pkt = msg.encode();

	return this.send(pkt);
}

DHCPSClient.prototype.request = function(offer) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_REQUEST),
		pkt = msg.encode();

	return this.send(pkt);
}

DHCPSClient.prototype.decline = function(offer) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_DECLINE),
		pkt = msg.encode();

	return this.send(pkt);
}

DHCPSClient.prototype.release = function(xid) {
	var msg = new Message(offer.xid, +MSGTYPES.DHCP_RELEASE),
		pkt = msg.encode();

	return this.send(pkt);
}
