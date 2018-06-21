const { exec } = window.require('child_process');

export default (command, options) => {
	return new Promise((resolve, reject) => {
		exec(command, options, (error, stdout, stderr) => {
			if (error)
				return reject(stderr);
			return resolve(stdout);
		});
	});
};