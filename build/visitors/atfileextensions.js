var extensions = [
	".js",
	".tpl",
	".tpl.css",
	".tml",
	".tpl.txt"
];

module.exports = function(fileName) {
	for(var i = 0; i < extensions.length; i ++) {
		if(fileName.substring(fileName.length - extensions[i].length) === extensions[i]) {
			return true;
		}
	}
	return false;
};
