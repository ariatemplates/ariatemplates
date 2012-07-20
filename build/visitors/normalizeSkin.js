var AT = require("../../src/aria/node.js");

var evalClassDefinition = function (fileContent) {
    var res = null;
    var Aria = {
        classDefinition : function (classDef) {
            res = classDef;
        }
    };
    eval(fileContent);
    return res;
};

var processSkin = function (fileContent) {
    var skinClasspath = "aria.widgets.AriaSkin";
    if (fileContent.indexOf(skinClasspath) == -1) {
        return fileContent;
    }
    var skinClassDef = evalClassDefinition(fileContent);
    if (skinClassDef.$classpath == skinClasspath) {
        var skinObject = skinClassDef.$prototype.skinObject;
        aria.widgets.AriaSkinNormalization.normalizeSkin(skinObject);
        return "Aria.classDefinition(" + JSON.stringify(skinClassDef) + ");";
    } else {
        return fileContent;
    }
};

module.exports.onFileContent = function (callback, config, fileObject) {
    Aria.load({
        classes : ['aria.widgets.AriaSkinNormalization'],
        oncomplete : function () {
            // console.log(fileObject.content);
            fileObject.content = processSkin(fileObject.content);
            callback();
        }
    });
};

module.exports.onEnd = function (callback, config) {
    if (config.errors) {
        logger.logError("Normalize Skin errors found " + config.errors + " errors during normalization! Please check "
                + Object.keys(config.packages)[0] + " for the complete logs");
        process.exit(1);
    } else {
        callback();
    }
};