var vm = require("vm"), fs = require("fs"), path = require("path");

/* aria and Aria are going to be global */
aria = {};

Aria = {
    rootFolderPath : __dirname + "/../"
};

/* This is the global load method used by the framework, it's common to Rhino */
load = function (filePath) {
    filePath = path.normalize(filePath);

    var fileContent = fs.readFileSync(filePath, "utf-8");
    vm.runInThisContext(fileContent);
};

try {
    load(__dirname + "/bootstrap.js");

    // For all the other classes we use IO, define our node transport
    Aria.classDefinition({
        $classpath : "aria.node.Transport",
        $implements : ["aria.core.transport.ITransports"],
        $singleton : true,
        $prototype : {
            isReady : true,
            init : Aria.empty,
            request : function (request, callback) {
                fs.readFile(uri, "utf-8", function (err, data) {
                    if (err) {
                        callback.fn.call(callback.scope, err, callback.args);
                    } else {
                        var responseObject = {
                            reqId : reqId,
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
} catch (ex) {
    console.error('\n[Error] Aria Templates framework not loaded.', ex);
    process.exit(0);
}