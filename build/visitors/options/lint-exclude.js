// List of files/folders to be excluded from JSLint
var toBeExcluded = [
    // Resources can be enabled again when https://github.com/jshint/jshint/issues/494 is fixed
	"aria/resources/*",
    // enable when https://github.com/ariatemplates/ariatemplates/issues/23 is fixed
    "aria/templates/NavigationManager.js",
    // https://github.com/ariatemplates/ariatemplates/issues/23
    "aria/utils/Mouse.js",
    // https://github.com/ariatemplates/ariatemplates/issues/33
    "aria/utils/SynEvents.js",
    // I was just bored of fixing all these equality
    "aria/jsunit/*",
    // Using node.js globals:
    "aria/node.js"
];

exports.isExcluded = function (path) {
	var found = false;
	toBeExcluded.forEach(function (base) {
		if (base.charAt(base.length - 1) === "*") {
			found = found || path.indexOf(base.slice(0, -1)) === 0;
		} else {
			found = found || base === path;
		}
	});

	return found;
};