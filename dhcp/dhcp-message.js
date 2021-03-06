"use strict";
var __namespace__, _protocol_,
	Enum;
module.exports = (namespace, EnumClass, protocol) => {
	__namespace__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);
	Enum = EnumClass;
	_protocol_ = protocol;
	//addOptions();

	DHCPSMessage.TYPES = Object.freeze(new Enum()
		.add('DHCP_DISCOVER', 1)
		.add('DHCP_OFFER', 2)
		.add('DHCP_REQUEST', 3)
		.add('DHCP_DECLINE', 4)
		.add('DHCP_ACK', 5)
		.add('DHCP_NAK', 6)
		.add('DHCP_RELEASE', 7)
	);

	return DHCPSMessage;
}
var util = require('util'),
	assert = require('assert'),
	attribute = require('attribute'),
	V4Address = require('ip-address').Address4,
	EventEmitter = require('events').EventEmitter;

util.inherits(DHCPSMessage, EventEmitter);
function DHCPSMessage(xid, msgtype) {
	EventEmitter.call(this);

	this.xid = xid || 0x00000001;

	var config = {
		op : { initial: 0x01, validator: () => { return true;} },
		chaddr: {
			initial: '01:02:03:04:05:06',
			onChange: 'chaddrChanged',
			validator: (v) => {
				return v === ''+v;
			}
		},
		htype: { initial: 0x01, validator: (v) => { return 'number' === typeof v;} },
		hlen: { initial: 0x06, validator: (v) => { return 'number' === typeof v;} },
		hops: { initial: 0x00, validator: (v) => { return 'number' === typeof v;} },
		secs: { initial: 0x0000, validator: (v) => { return 'number' === typeof v;} },
		flags: { initial: 0x0000, validator: (v) => { return 'number' === typeof v;} },
		ciaddr: { initial: '0.0.0.0', validator: (v) => { return 'string' === typeof v;} },
		yiaddr: { initial: '0.0.0.0', validator: (v) => { return 'string' === typeof v;} },
		siaddr: { initial: '0.0.0.0', validator: (v) => { return 'string' === typeof v;} },
		giaddr: { initial: '0.0.0.0', validator: (v) => { return 'string' === typeof v;} },
		sname: { initial: '', validator: (v) => { return 'string' === typeof v;} },
		file: { initial: '', validator: (v) => { return 'string' === typeof v;} },
	// RFC2131 - Magic Cookie
		magic: { initial: '', validator: (v) => { return v === 0x63825363; } },
	};
	Object.keys(config).forEach((key) => {
		attribute(this, key, config[key]);
	});

	this.on('chaddrChanged', (newValue, oldValue) => {
		/*this.hw(new Buffer(newValue.split(':').map((part) => {
	        return parseInt(part, 16);
	    })));*/
	});
	/*this.hw = new Buffer(pkt.chaddr.split(':').map(function(part) {
        return parseInt(part, 16);
    }));*/

	this.options = {};
	this.options.dhcpMessageType = +msgtype;
}
DHCPSMessage.decode = decodePacket;
DHCPSMessage.OPTIONS = {};

//DHCPSMessage.prototype = Object.create(null);
DHCPSMessage.prototype.encode = encodeMessage;
DHCPSMessage.prototype.option = setOption;

function setOption(option, value) {

}

function encodeMessage(packet) {

    var ci = new Buffer(new V4Address(this.ciaddr()).toArray());
    var yi = new Buffer(new V4Address(this.yiaddr()).toArray());
    var si = new Buffer(new V4Address(this.siaddr()).toArray());
    var gi = new Buffer(new V4Address(this.giaddr()).toArray());

    if (!('chaddr' in this))
        throw new Error('pkt.chaddr required');
    var hw = new Buffer(this.chaddr().split(':').map(function(part) {
        return parseInt(part, 16);
    }));
    if (hw.length !== 6)
        throw new Error('pkt.chaddr malformed, only ' + hw.length + ' bytes');

    var i = 0;

    packet.writeUInt8(this.op,    i++);
    packet.writeUInt8(this.htype, i++);
    packet.writeUInt8(this.hlen,  i++);
    packet.writeUInt8(this.hops,  i++);
    packet.writeUInt32BE(this.xid,   i); i += 4;
    packet.writeUInt16BE(this.secs,  i); i += 2;
    packet.writeUInt16BE(this.flags, i); i += 2;
    ci.copy(packet, i); i += ci.length;
    yi.copy(packet, i); i += yi.length;
    si.copy(packet, i); i += si.length;
    gi.copy(packet, i); i += gi.length;
    hw.copy(packet, i); i += hw.length;

    packet.fill(0, i, i + 10); i += 10; // hw address padding
    packet.fill(0, i, i + 192); i += 192;
    packet.writeUInt32BE(0x63825363, i); i += 4;

	Object.keys(this.options).forEach((opt) => {
		if (opt in DHCPSMessage.OPTIONS)
			i += DHCPSMessage.OPTIONS[opt].write(packet, i, this.options[opt]);
	});

    if ('parameterRequestList' in this.options) {
        packet.writeUInt8(55, i++); // option 55
        var parameterRequestList = new Buffer(this.options.parameterRequestList);
        if (parameterRequestList.length > 16)
            throw new Error('pkt.options.parameterRequestList malformed');
        packet.writeUInt8(parameterRequestList.length, i++);
        parameterRequestList.copy(packet, i); i += parameterRequestList.length;
    }
    if ('clientIdentifier' in this.options) {
        var clientIdentifier = new Buffer(this.options.clientIdentifier);
        var optionLength = 1 + clientIdentifier.length;
        if (optionLength > 0xff)
            throw new Error('pkt.options.clientIdentifier malformed');
        packet.writeUInt8(61, i++);           // option 61
        packet.writeUInt8(optionLength, i++); // length
        packet.writeUInt8(0, i++);            // hardware type 0
        clientIdentifier.copy(packet, i); i += clientIdentifier.length;
    }

    // option 255 - end
    packet.writeUInt8(0xff, i++);

    // padding
    if ((i % 2) > 0) {
        packet.writeUInt8(0, i++);
    } else {
        packet.writeUInt16BE(0, i++);
    }

    var remaining = 300 - i;
    if (remaining) {
        packet.fill(0, i, i + remaining); i+= remaining;
    }

    //console.log('createPacket:', i, 'bytes');
    return packet.slice(0, i);
}

function decodePacket(packet, rinfo) {
	var op = _protocol_.BOOTPMessageType.get(packet.readUInt8(0)),
	    hlen = packet.readUInt8(2),
		hops = packet.readUInt8(3),
		msg = new DHCPSMessage(packet.readUInt32BE(4), DHCPSMessage.TYPES.DHCP_RELEASE);

	msg.secs(packet.readUInt16BE(8))
		  .flags(packet.readUInt16BE(10))
		  .ciaddr(readIpRaw(packet, 12))
		  .yiaddr(readIpRaw(packet, 16))
		  .siaddr(readIpRaw(packet, 20))
		  .giaddr(readIpRaw(packet, 24))
		  .chaddr('01:02:03:04:05:06')
		  .sname(trimNulls(packet.toString('ascii', 44, 108)))
		  .file(trimNulls(packet.toString('ascii', 108, 236)))
		  .magic(packet.readUInt32BE(236));

	msg.options = {};

    var offset = 240;
    var code = 0;
    while (code != 255 && offset < packet.length) {
        code = packet.readUInt8(offset++);
	// If the code is supported, it will have its own read function
		if (DHCPSMessage.OPTIONS.hasOwnProperty(code)) {
			var option = DHCPSMessage.OPTIONS[code],
				data = option.read(packet, offset);
			msg.options[option.key()] = data.value;
			offset += data.length;
			console.log('Option Found: ' + option.key + '(' + msg.options[option.key()]+ ')');
		}
		else switch (code) {
            case 0: continue;   // pad
            case 255: break;    // end
            case 3: {           // routerOption
                var len = packet.readUInt8(offset++);
                assert.strictEqual(len % 4, 0);
                msg.options.routerOption = [];
                while (len > 0) {
                    msg.options.routerOption.push(readIpRaw(packet, offset));
                    offset += 4;
                    len -= 4;
                }
                break;
            }
            case 4: {           // timeServerOption
                var len = packet.readUInt8(offset++);
                assert.strictEqual(len % 4, 0);
                msg.options.timeServerOption = [];
                while (len > 0) {
                    msg.options.timeServerOption.push(readIpRaw(packet, offset));
                    offset += 4;
                    len -= 4;
                }
                break;
            }
            case 6: {           // domainNameServerOption
                var len = packet.readUInt8(offset++);
                assert.strictEqual(len % 4, 0);
                msg.options.domainNameServerOption = [];
                while (len > 0) {
                    msg.options.domainNameServerOption.push(
                        readIpRaw(packet, offset));
                    offset += 4;
                    len -= 4;
                }
                break;
            }
            case 43: {          // vendorOptions
                var len = packet.readUInt8(offset++);
                msg.options.vendorOptions = {};
                while (len > 0) {
                    var vendop = packet.readUInt8(offset++);
                    var vendoplen = packet.readUInt8(offset++);
                    var buf = new Buffer(vendoplen);
                    packet.copy(buf, 0, offset, offset + vendoplen);
                    msg.options.vendorOptions[vendop] = buf;
                    len -= 2 + vendoplen;
                }
                break;
            }
            case 55: {          // parameterRequestList
                var len = packet.readUInt8(offset++);
                msg.options.parameterRequestList = [];
                while (len-- > 0) {
                    var option = packet.readUInt8(offset++);
                    msg.options.parameterRequestList.push(option);
                }
                break;
            }
            case 61: {          // clientIdentifier
                var len = packet.readUInt8(offset++);
                msg.options.clientIdentifier =
                    _protocol_.createHardwareAddress(
                        _protocol_.ARPHardwareType.get(packet.readUInt8(offset)),
                        readAddressRaw(packet, offset + 1, len - 1));
                offset += len;
                break;
            }
            case 81: {          // fullyQualifiedDomainName
                var len = packet.readUInt8(offset++);
                msg.options.fullyQualifiedDomainName = {
                    flags: packet.readUInt8(offset),
                    name: packet.toString('ascii', offset + 3, offset + len)
                };
                offset += len;
                break;
            }
            default: {
                var len = packet.readUInt8(offset++);
                console.log('Unhandled DHCP option ' + code + '/' + len + 'b');
                offset += len;
                break;
            }
        }
    }
    return msg;
}

function trimNulls(str) {
	var idx = str.indexOf('\u0000');
	return (-1 === idx) ? str : str.substr(0, idx);
}
function readIpRaw(buffer, offset) {
	//if (0 === msg.readUInt8(offset))
		//return undefined;
	return '' +
		buffer.readUInt8(offset++) + '.' +
		buffer.readUInt8(offset++) + '.' +
		buffer.readUInt8(offset++) + '.' +
		buffer.readUInt8(offset++);
}
function readIp(buffer, offset, msg, name) {
	var len = buffer.readUInt8(offset++);
	assert.strictEqual(len, 4);
	msg.options[name] = readIpRaw(msg, offset);
	return offset + len;
}
function readString(buffer, offset, msg, name) {
	var len = buffer.readUInt8(offset++);
	msg.options[name] = buffer.toString('ascii', offset, offset + len);
	offset += len;
	return offset;
}
function readAddressRaw(buffer, offset, len) {
	var addr = '';
	while (len-- > 0) {
		var b = buffer.readUInt8(offset++);
		addr += (b + 0x100).toString(16).substr(-2);
		if (len > 0) {
			addr += ':';
		}
	}
	return addr;
}
