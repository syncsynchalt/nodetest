#!/usr/bin/env node

let fs = require('fs');
let exec = require('child_process');

fs.readdir('./tests', function(err, items) {
	if (err) {
		throw err;
	}

	for (let item of items) {
		if (item.startsWith('.')) {
			continue;
		}
		exec.exec('node tests/' + item, (err, stdout, stderr) => {
			if (stdout) {
				console.log(stdout);
			}
			if (stderr) {
				console.warn(stderr);
			}
			if (err) {
				throw err;
			}
		});
	}
	console.log('Success');
});
