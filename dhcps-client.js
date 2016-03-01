"use strict";
var __class__ = DHCPSClient,
	__namespace__, __super__,
	Message, MSGTYPES;

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
	options.hostName = options.hostName || 'client.ntmobiledev.local';
	options.address = options.address || '127.0.0.1';
	options.port = options.port || 68;

	__super__.call(this, options);
}

__class__.prototype.start = function(callback) {
	var packet = this.discover(1);
	__super__.prototype.start.call(this, () => {
		this.broadcast(packet, () => {
			console.log('DHCPS Client: Broadcast sent');
			hex(packet)
		});

		if (typeof callback === 'function')
			process.nextTick(callback);
	});
}

__class__.prototype.discover = function(xid, options) {
	return this.createMessage(xid, +MSGTYPES.DHCP_DISCOVER, options || {});
}
__class__.prototype.request = function(offer, options) {
	return this.createMessage(offer.xid, +MSGTYPES.DHCP_REQUEST, options || {});
}
__class__.prototype.decline = function(offer, options) {
	return this.createMessage(offer.xid, +MSGTYPES.DHCP_DECLINE, options || {});
}
__class__.prototype.release = function(xid, options) {
	return this.createMessage(xid, +MSGTYPES.DHCP_RELEASE, options || {});
}
