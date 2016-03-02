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
var ALLOWED_MESSAGES = [ 'discover', 'request', 'decline', 'release', 'inform' ];

function DHCPSServer(options) {
	options = options || { };
	options.hostname = options.hostname || 'dhcps.ntmobiledev.local';
	options.address = options.address || '127.0.0.1';
	options.port = options.port || 67;

	__super__.call(this, options);
// RFC 2131 4.1
	this.destinationPort = 68;
	this.leaseDuration = 86400;
	this.domainName = 'ntmobiledev.local';

	this.socket.on('dhcpmessage', (from, message) => {
		var type = MSGTYPES.get(message.options.dhcpMessageType),
			event = type.name.toLowerCase().replace('dhcp_', '');

		event = ALLOWED_MESSAGES.indexOf(event) > -1 ? event : 'unhandled';
		console.log('[DHCP/S] ' + type.name + ': ' + this.address);
		this.emit(event, message);
	});
}

__class__.prototype.offer = function(discovery, options) {
	var cfg = options || {};
// RFC 2132 9.2
	cfg.ipAddressLeaseTime = cfg.ipAddressLeaseTime || this.leaseDuration;
// RFC 2132 3.14
	cfg.hostName = this.domainName;
// RFC 2132 9.7
	cfg.serverIdentifier = ''+this.address;

	var msg = this.createMessage(discovery.xid, +MSGTYPES.DHCP_OFFER, cfg);
// RFC 2131 2
	msg.siaddr(''+this.address);
	return msg;
}
__class__.prototype.ack = function(request, options) {
	var cfg = options || {};
// RFC 2132 3.17
	cfg.domainName = cfg.domainName || this.domainName;

	return this.createMessage(request.xid, +MSGTYPES.DHCP_ACK, cfg);
}
__class__.prototype.nak = function(request, options) {
	return this.createMessage(request.xid, +MSGTYPES.DHCP_NAK, options || {});
}
