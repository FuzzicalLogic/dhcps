"use strict";
var __namespace__;
module.exports = (namespace) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);

	return DHCPHost;
}

var attribute = require('attribute');
var SYSTEM_BROADCAST_ADDRESS = '127.255.255.255',
	LOCALAREA_BROADCAST_ADDRESS = '192.255.255.255';
var VALID_IP4_ADDRESS = /^(?:(25[0-5]|(?:2[0-4]|1[0-9]|[1-9])?[0-9])\.){3}(25[0-5]|(?:2[0-4]|1[0-9]|[1-9])?[0-9])$/;

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var dgram = require('dgram');
var V4Address = require('ip-address').Address4;
var hex = require('hex');

util.inherits(DHCPHost, EventEmitter);
function DHCPHost(opts) {
	EventEmitter.call(this);

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
		console.log('DHCP Host\'s address has changed');
	});

    this.socket = dgram.createSocket('udp4');
    this.socket.on('message', (pkt, rinfo) => {
		var msg = __namespace__.Message.decode(pkt, rinfo);
    	this.emit('message', rinfo, msg);

		console.log('DHCP/A Message received from: ' + rinfo.address + ':' + rinfo.port );
		var type = __namespace__.Message.TYPES.get(msg.options.dhcpMessageType);
		if (!!type) {
			var event = type.name.toLowerCase().replace('dhcp_', '');
			this.emit(event, rinfo, msg);
		}
		else this.emit('unhandled', rinfo, msg);
    });
    this.socket.on('listening', () => {
        var address = this.socket.address();
        this.emit('listening', address.address + ':' + address.port);
    });
}

Object.defineProperties(DHCPHost, {
	SYSTEM_BROADCAST_ADDRESS: { value: '127.255.255.255' },
	LOCALAREA_BROADCAST_ADDRESS: { value: '192.255.255.255' },
});

Object.defineProperties(DHCPHost.prototype, {
	start: { value: startServer },
	send: { value: sendMessage },
	broadcast: { value: broadcastPacket },
	close: { value: closeServer }
});

DHCPHost.prototype.bind = function(callback) {
    this.socket.bind(this.port(), this.address(), () => {
    	this.socket.setBroadcast(true);
		if ('function' === typeof callback)
			process.nextTick(callback);
    });
}

function startServer(callback) {
	this.bind(callback);
}

function broadcastPacket(packet, callback) {
	//var pack = this.createPacket(msg);
	this.socket.setBroadcast(true);
	this.socket.send(
		packet,
		0, packet.length,
		67, DHCPHost.SYSTEM_BROADCAST_ADDRESS,
		(error) => {
			this.socket.setBroadcast(false);
			if ('function' === typeof callback)
				process.nextTick(callback, error);
		}
	);
}

function sendMessage(msg, host, port, cb) {
	console.log('Sending Message to: ' + host + ':' + port);

	var packet = msg.encode();
	this.socket.send(packet, 0, packet.length, port, host, cb);
}

function closeServer() {
	this.socket.close();
}
