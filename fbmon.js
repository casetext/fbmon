'use strict';

var Firebase = require('firebase'),
	dgram = require('dgram');

var root = new Firebase('https://' + process.env.FIREBASE_URL),
	graphite = dgram.createSocket('udp4');

function check() {
	var start = process.hrtime(),
		timestamp = Math.round(Date.now() / 1000);

	root.child('_').once('value', function(snap) {

		var time = process.hrtime(start);

		var ms = (time[0] * 1000) + (time[1] / 1e6);

		graphite.send(process.env.GRAPHITE_METRIC + ' ' + ms + ' ' + timestamp, parseInt(process.env.GRAPHITE_PORT) || 2003, process.env.GRAPHITE_HOST);

	});
}

setInterval(check, parseInt(process.env.FBMON_FREQ) || 1000);
