"use strict";
var __namespace__, __super__, Message, MSGTYPES;

module.exports = (namespace, SuperClass) => {
	var DHCPSServer;

	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	Message = __namespace__.DHCP.Message;
	console.log(__namespace__);
	MSGTYPES = Message.TYPES;

	__super__ = 'function' === typeof SuperClass
		? SuperClass
		: Object;

	DHCPSServer = class __class__ extends __super__ {
		constructor(options) {
			options = options || { };
			options.hostname = options.hostname || 'dhcps.ntmobiledev.local';
			options.address = options.address || '127.0.0.1';
			options.port = options.port || 67;
			super(options);

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

		offer(discovery, options) {
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

		ack(request, options) {
			var cfg = options || {};
		// RFC 2132 3.17
			cfg.domainName = cfg.domainName || this.domainName;

			var msg = this.createMessage(request.xid, +MSGTYPES.DHCP_ACK, cfg);
			msg.siaddr(''+this.address);
			return msg;
		}

		nak(request, options) {
			return this.createMessage(request.xid, +MSGTYPES.DHCP_NAK, options || {});
		}

	};

	return DHCPSServer;
}

var ALLOWED_MESSAGES = [ 'discover', 'request', 'decline', 'release', 'inform' ];
