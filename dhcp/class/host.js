"use strict";
var __namespace__,
	Message, MSGTYPES;

var hex = require('hex'),
	util = require('util'),
 	dgram = require('dgram');

var V4Address = require('ip-address').Address4,
	EventEmitter = require('events').EventEmitter;


var attribute = require('attribute');
var SYSTEM_BROADCAST_ADDRESS = '127.255.255.255',
	LOCALAREA_BROADCAST_ADDRESS = '192.255.255.255';
var VALID_IP4_ADDRESS = /^(?:(25[0-5]|(?:2[0-4]|1[0-9]|[1-9])?[0-9])\.){3}(25[0-5]|(?:2[0-4]|1[0-9]|[1-9])?[0-9])$/;

module.exports = (namespace) => {
	var DHCPHost;

	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	Message = __namespace__.Message;
	MSGTYPES = Message.TYPES;


	DHCPHost = class __class__ extends EventEmitter {
	// STATIC CONSTANTS
		static get SYSTEM_BROADCAST_ADDRESS() {
			return SYSTEM_BROADCAST_ADDRESS;
		}
		static get LOCALAREA_BROADCAST_ADDRESS() {
			return LOCALAREA_BROADCAST_ADDRESS;
		}

		constructor(opts) {
			super();

			var config = {
				address: {
					initial: (opts && opts.address) || '127.0.0.1',
					validator: (v) => {
						return v == ""+v && VALID_IP4_ADDRESS.exec(v);
					},
					onChange: 'addressChanged'
				},
				port: {
					initial: (opts && +opts.port) || 0,
					validator: (v) => {
						return v == +v && v >= 0 && v < 65536;
					},
					onChange: 'addressChanged'
				},
				hostname: {
					initial: (opts && opts.hostname) || 'dhcp',
					validator: (v) => {
						return v !== "" && v == ""+v;
					}
				}
			};

			Object.keys(config).forEach((key) => {
				attribute(this, key, config[key]);
			});

			this.on('addressChanged', () => {

			});

		    this.socket = dgram.createSocket('udp4');
		    this.socket.on('listening', () => {
		        var address = this.socket.address();
		        this.emit('listening', address.address + ':' + address.port);
		    });
			this.socket.on('message', (pkt, rinfo) => {
				var msg = Message.decode(pkt, rinfo);
				this.socket.emit('dhcpmessage', rinfo, msg);
			});
		}

		bind(callback) {
			this.socket.bind(this.port(), this.address(), () => {
				this.socket.setBroadcast(true);
				if ('function' === typeof callback)
					process.nextTick(callback);
			});
		}

		start(callback) {
			this.bind(callback);
		}

		createMessage(xid, type, opts) {
			var msg = new __namespace__.Message(xid, type);

			Object.keys(opts).forEach((key) => {
				msg.options[key] = opts[key];
			});
			return msg;
		}

		broadcast(packet, callback) {
			//var pack = this.createPacket(msg);
			this.socket.setBroadcast(true);
			this.socket.send(
				packet,
				0, packet.length,
			// RFC 2131 4.1
				this.destinationPort || 68,
				__class__.SYSTEM_BROADCAST_ADDRESS,
				(error) => {
					this.socket.setBroadcast(false);
					if ('function' === typeof callback)
						process.nextTick(callback, error);
				}
			);
		}

		send(msg, host, port, cb) {
			var packet = msg.encode();
			this.socket.send(packet, 0, packet.length, port, host, cb);
		}

		close() {
			this.socket.close();
		}
	};

	return DHCPHost;
}
