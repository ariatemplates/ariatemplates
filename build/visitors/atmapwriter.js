var fs = require("fs");

function getATLoaderPackage(config) {
    var loader = null;
    Object.keys(config.packages).forEach(function(value, index, packages) {
        var packageConfig = config.packages[value];
        if(packageConfig.appendUrlMap) {
            loader = value;
        }
    });
    return loader;
};

module.exports.onEnd = function(callback, config) {
    // Find which is the ariatemplates's loader based on the fact that it has the atmapwriter's visitor
    var atLoader = getATLoaderPackage(config);
    if(atLoader) {
        var fd = fs.openSync(atLoader, "a");
        fs.writeSync(fd, "\n\naria.core.DownloadMgr.updateUrlMap(" + JSON.stringify(config.urlmap) + ");");
    } else {
        logger.logError("Could not find any package configured with the atmapwriter.js visitor, so could not add the urlMap anywhere.");
    }
};
