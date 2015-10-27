/*
 * Copyright 2015 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var child_process = require("child_process");

var outputHandler = function (prefix) {
    var output = "";
    return function (data) {
        output += data.toString();
        var lines = output.split("\n");
        output = lines.pop();
        lines.forEach(function (line) {
            console.log(prefix + line);
        });
    };
};

module.exports = function (modulePath, args) {
    var child = child_process.fork(modulePath, args, {
        silent: true
    });
    var pid = child.pid;
    console.log("\n[" + pid + "] " + modulePath + " " + args.join(" "));
    child.stdout.on("data", outputHandler("[" + pid + "][out] "));
    child.stderr.on("data", outputHandler("[" + pid + "][err] "));
    child.on("exit", function (code, signal) {
        console.log("[" + pid + "] Exited with " + (code != null ? "code " + code : "signal " + signal) + "\n");
    });
    return child;
};
