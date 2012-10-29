var jshint = require('jshint').JSHINT;
var options = require("./options/lint-options.js");
var exclude = require("./options/lint-exclude.js");

module.exports.onFileContent = function (callback, config, fileObject) {
    var valid;
    if (exclude.isExcluded(fileObject.path)) {
        fileObject.content = "[SKIP] " + fileObject.path + " excluded from jshint\n";
    } else {
        valid = jshint(fileObject.content, options, {});

        if (valid) {
            fileObject.content = "[OK]   " + fileObject.path + "\n";
        } else {
            fileObject.content = "\n[FAIL] " + fileObject.path + "\n=========================================\n";
            jshint.errors.forEach(function (result) {
                if (result) {
                    fileObject.content += '  [E] line ' + result.line + ', col ' + result.character + ', '
                            + result.reason + "\n";
                    if (!config.errors) {
                        config.errors = 1;
                    } else {
                        config.errors++;
                    }
                }
            });
            fileObject.content += "\n";
        }
    }

    callback();
};

module.exports.onEnd = function (callback, config) {
    if (config.errors) {
        logger.logError("JShint found " + config.errors + " errors in the code! Please check "
                + Object.keys(config.packages)[0] + " for the complete logs");
        // disabled to continue with the build regardless of JSHint warnings:
        process.exit(1);
    } else {
        callback();
    }
};
