/*
 * Copyright 2014 Amadeus s.a.s.
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

var attester = require("attester");
var middleware = require("./middleware");

middleware.forEach(function (fn) {
    attester.server.use(fn);
});

var optionRegExp = /^--([^=]+)=(.*)$/;
var commandLineOptions = {};
var testsToExecute = process.argv.slice(2).filter(function (arg) {
    var match = optionRegExp.exec(arg);
    if (match) {
        commandLineOptions[match[1]] = match[2];
        return false;
    }
    return true;
});

var attesterOptions = {
//    "task-restart-on-failure": true,
//    "max-task-restarts": 5,
    "phantomjs-instances": 0
};

var campaign = {
    resources : {
        "/" : ["src"],
        "/test" : ["test"]
    },
    tests : {
        "aria-templates" : {
            bootstrap : "/aria/bootstrap.js",
            extraScripts : "/aria/css/atskin.js",
            classpaths : {
                includes : testsToExecute
            }
        }
    }
};

var browsers = commandLineOptions.browsers;
var browser = commandLineOptions.browser;
if (browsers) {
    campaign.browsers = browsers.trim().split(/\s*,\s*/);
    var launcherConfig = commandLineOptions["launcher-config"] || process.env.npm_package_config_attesterLauncherConfig;
    if (launcherConfig) {
        attesterOptions["launcher-config"] = launcherConfig;
    }
} else if (browser == "phantomjs" || browser == null) {
    attesterOptions["phantomjs-instances"] = commandLineOptions["phantomjs-instances"] || 1;
} else if (browser != "none") {
    attesterOptions["robot-browser"] = browser;
}

// Called when the campaign completes successfully
attester.event.once("attester.core.idle", function () {
    attester.dispose().then(function () {
        process.exit(0);
    });
});

// Called when the campaign fails
attester.event.once("attester.core.fail", function () {
    attester.dispose().then(function () {
        process.exit(1);
    });
});

console.log("Using the following options:");
console.log(JSON.stringify(attesterOptions, null, " "));
attester.config.set(attesterOptions);
attester.campaign.create(campaign, {}, 1);

attester.start();
