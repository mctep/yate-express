var yate = require('yate');
var fs = require('fs');
//var runtime = require('yate/lib/runtime')

var settings = {
	'caching': false
};

exports.set = function(setting, val) {
	if (1 == arguments.length) {
		if (settings.hasOwnProperty(setting)) {
			return settings[setting];
		}
	} else {
		settings[setting] = val;
		return this;
	}
	return exports;
};

exports.__express = function(path, options, fn) {

	if (!settings.caching || (settings.caching && !this.yateFn)) {
		var runtimeJS = fs.readFileSync(__dirname + '/node_modules/yate/lib/runtime.js');
		var compiledJS = yate.compile(path).js;

		this.yateFn = this.yateFn || function(data) {
			var yateJS = [
				runtimeJS,
				compiledJS,
				'var data = ' + JSON.stringify(data),
				'return yr.run("main", data, "")'
			].join(';');
			return new Function(yateJS)();
		};
	}

	if ('function' == typeof options) {
		fn = options, options = {};
	}

	try {
		fn(null, this.yateFn(options));
	} catch (err) {
		fn(err);
	}
}