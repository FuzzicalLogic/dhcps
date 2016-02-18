"use strict";
var __NAMESPACE__;
module.exports = (namespace) => {
	__NAMESPACE__ = 'object' === typeof namespace
		? namespace
		: Object.create(null);

	return DHCPAMessageOption;
}

function DHCPAMessageOption(key, value, type) {

}
DHCPAMessageOption.TYPES = Object.create(null)

DHCPAMessageOption.prototype = Object.create(null);



function DHCPAMessageOptionType(name, value, size, read, write) {
	this.name = name;
	this.value = value;
	this.size = size;
	this.read = (buffer) => {
		read.call(this, buffer);
	};
	this.write = (buffer) => {
		write.call(this, buffer);
	};
}
DHCPAMessageOption.prototype = Object.create(null);
DHCPAMessageOption.prototype.valueOf = function() {
	return this.value;
}
DHCPAMessageOption.prototype.toString = function() {
	return this.name;
};
