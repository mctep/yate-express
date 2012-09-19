var fs = require('fs');
var yatePath = __dirname + '/node_modules/yate/lib/';

var yate = require(yatePath + 'yate.js');
require(yatePath + 'actions.js');

exports.__express = function(path, options, fn) {

	if ('function' == typeof options) {
		fn = options, options = {};
	}

	try {
		fn(null, yate.run(path, { data: options }));
	} catch (err) {
		fn(err);
	}
}