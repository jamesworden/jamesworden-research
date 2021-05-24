const fs = require('fs'),
	{ join } = require('path');

export default (fileName: string, content: string): boolean => {
	var path: string = join('./src/json', fileName + '.json');
	fs.writeFile(path, content, (err) => {
		if (err) {
			console.error(err);
			return false;
		}
	});
	return true;
};
