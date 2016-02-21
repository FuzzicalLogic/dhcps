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

    var pkt = {
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

	return this.createPacket(pkt);
}

DHCPSClient.prototype.request = function(msg) {
	var msg = new Message();

	msg.addOption('dhcpMessageType', MSGTYPES.DHCP_REQUEST.value);
	this.send()
    return this.createPacket(msg);
}

DHCPSClient.prototype.decline = function(msg) {
	msg.options.dhcpMessageType = MSGTYPES.DHCP_DECLINE.value;
    return this.createPacket(msg);
}

DHCPSClient.prototype.release = function(msg) {
	msg.options.dhcpMessageType = MSGTYPES.DHCP_RELEASE.value;
    return this.createPacket(msg);
}
