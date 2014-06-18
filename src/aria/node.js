/* global Aria:true, aria:true */
var vm = require("vm"), fs = require("fs"), path = require("path");

/* aria and Aria are going to be global */
aria = {};

// DownloadMgr is not yet available, set rootFolderPath temporarily to load the framework
Aria = {
    rootFolderPath : __dirname + "/../"
};

/* This is the global load method used by the framework, it's common to Rhino */
global.load = function (filePath) {
    filePath = path.normalize(filePath);

    var fileContent = fs.readFileSync(filePath, "utf-8");
    vm.runInThisContext(fileContent);
};

try {
    global.load(__dirname + "/bootstrap.js");

    // For all the other classes we use IO, define our node transport
    Aria.classDefinition({
        $classpath : "aria.node.Transport",
        $implements : ["aria.core.transport.ITransports"],
        $singleton : true,
        $prototype : {
            isReady : true,
            init : Aria.empty,
            request : function (request, callback) {
                fs.readFile(request.url, "utf-8", function (err, data) {
                    if (err) {
                        callback.fn.call(callback.scope, err, callback.args);
                    } else {
                        var responseObject = {
                            status : 200,
                            responseText : data
                        };
                        callback.fn.call(callback.scope, false, callback.args, responseObject);
                    }
                });
            }
        }
    });

    aria.core.IO.updateTransports({
        "sameDomain" : "aria.node.Transport"
    });

    // Update the root map, so `aria.*` is always served from AT npm installation, regardless of `rootFolderPath`
    // (and so that the user can change `Aria.rootFolderPath` without breaking framework's classes loading).
    aria.core.DownloadMgr.updateRootMap({
        aria : {
            "*" : __dirname + "/../"
        }
    });

    // Update root folder to point to the user's repo root folder;
    // assuming we're in "<projectFolder>/node_modules/ariatemplates/src/aria"
    Aria.rootFolderPath = __dirname + "/../../../../";

} catch (ex) {
    console.error('\n[Error] Aria Templates framework not loaded.', ex);
    process.exit(1);
}
