"use strict";
var __namespace__, __super__,
	Message, MSGTYPES;


var attribute = require('attribute');
var V4Address = require('ip-address').Address4;
var hex = require('hex');
var ALLOWED_MESSAGES = [ 'discover', 'offer', 'ack', 'nak', 'inform' ];

module.exports = (namespace, SuperClass) => {
	var DHCPSClient;
	const DEFAULT_OPTIONS = {
		hostName: 'client.ntmobiledev.local',
		address: '127.0.0.1',
		port: 68
	};

	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	Message = __namespace__.DHCP.Message;
	MSGTYPES = Message.TYPES;

	__super__ = 'function' === typeof SuperClass
		? SuperClass
		: Object;

	DHCPSClient = class __class__ extends __super__ {
		constructor(options) {
			super(__class__.setDefaults(options));

			var config = {
				state: {
					initial: 'INIT',
					validator: (v) => {
						return __class__.STATES.indexOf(v) > -1;
					},
					onChange: 'stateChanged'
				}
			};

			Object.keys(config).forEach((key) => {
				attribute(this, key, config[key]);
			});

		// RFC 2131 4.1
			this.destinationPort = 67;

			this.socket.on('dhcpmessage', (from, message) => {
				var type = MSGTYPES.get(message.options.dhcpMessageType),
					event = type.name.toLowerCase().replace('dhcp_', '');

				event = ALLOWED_MESSAGES.indexOf(event) > -1 ? event : 'unhandled';
				console.log('[DHCP/S] ' + type.name + ': ' + this.address);
				this.emit(event, message);
			});
		}

		static setDefaults(options) {
			var config = 'object' === typeof options
				? options || {} : {};

			Object.keys(DEFAULT_OPTIONS).forEach((prop) => {
				if (!!!config[prop])
					config[prop] = DEFAULT_OPTIONS[prop];
			});
			return config;
		}

		start(callback) {
			var packet = this.discover(1).encode(new Buffer(1500));
			super.start(() => {
				this.broadcast(packet, () => {
					console.log('DHCPS Client: Broadcast sent');
					hex(packet)
				});

				if (typeof callback === 'function')
					process.nextTick(callback);
			});
		}

		discover(xid, options) {
			return this.createMessage(xid, +MSGTYPES.DHCP_DISCOVER, options || {});
		}
		request(offer, options) {
			return this.createMessage(offer.xid, +MSGTYPES.DHCP_REQUEST, options || {});
		}
		decline(offer, options) {
			return this.createMessage(offer.xid, +MSGTYPES.DHCP_DECLINE, options || {});
		}
		release(xid, options) {
			return this.createMessage(xid, +MSGTYPES.DHCP_RELEASE, options || {});
		}

		static get STATES() {
			return dhcpClientStates;
		}
	}

	return DHCPSClient;
}

var dhcpClientStates = [
	'INIT',
	'SELECTING',
	'REQUESTING',
	'INIT-REBOOT',
	'REBOOTING',
	'BOUND',
	'RENEWING',
	'REBINDING'
];
