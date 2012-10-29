var jshint = require('jshint').JSHINT;
var options = require("./options/lint-options.js");
var exclude = require("./options/lint-exclude.js");

/**
 * Some JSHint errors are not configurable, but we don't want them reported. This is a way to do it. For now, the
 * implementation is to check for the presence of the *exact* reason message in the array. Expand this array as you see
 * fit.
 */
var _ignoredJSHintErrors = ["Confusing use of '!'."];

var _generateLogErrorEntry = function (config, fileObject) {
    config.errors = config.errors || 0;
    var errorMsgs = [], errorsIgnored = 0;

    jshint.errors.forEach(function (result) {
        if (!result)
            return;

        if (_ignoredJSHintErrors.indexOf(result.reason) !== -1) {
            errorsIgnored++;
        } else {
            errorMsgs.push(["  [E] line ", result.line, ", col ", result.character, ", ", result.reason, "\n"].join(""));
        }
    });

    var ignoredMsg = (errorsIgnored > 0) ? (" [ignored: " + errorsIgnored + "]") : "";
    var errorsReported = errorMsgs.length;
    if (errorsReported > 0) {
        config.errors += errorsReported;
        var reportedMsg = " [errors: " + errorsReported + "]", bar = "\n=====================================\n";
        return "\n[FAIL] " + fileObject.path + reportedMsg + ignoredMsg + bar + errorMsgs.join("") + "\n";
    } else {
        return "[OK]   " + fileObject.path + ignoredMsg + " \n";
    }
};

module.exports.onFileContent = function (callback, config, fileObject) {
    if (exclude.isExcluded(fileObject.path)) {
        fileObject.content = "[SKIP] " + fileObject.path + " excluded from JSHint\n";
    } else {
        var valid = jshint(fileObject.content, options, {});
        if (valid) {
            fileObject.content = "[OK]   " + fileObject.path + "\n";
        } else {
            fileObject.content = _generateLogErrorEntry(config, fileObject);
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
