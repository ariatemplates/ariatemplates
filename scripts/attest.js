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

var optionRegExp = /^--([^=]+)=(.*)$/;
var classpathRegExp = /^\w+(\.\w+)*$/;
var commandLineOptions = {};
var classpathsToExecute = [];
var patternsToExecute = [];
process.argv.slice(2).forEach(function (arg) {
    var match = optionRegExp.exec(arg);
    if (match) {
        commandLineOptions[match[1]] = match[2];
    } else if (classpathRegExp.test(arg)) {
        classpathsToExecute.push(arg);
    } else {
        patternsToExecute.push(arg);
    }
});

var attesterOptions = {
//    "task-restart-on-failure": true,
//    "max-task-restarts": 5
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
                includes : classpathsToExecute
            }
        }
    }
};

if (patternsToExecute.length > 0) {
    campaign.tests["aria-templates"].files = {
        rootDirectory : ".",
        includes : patternsToExecute
    };
}

var browsers = commandLineOptions.browsers;
var browser = commandLineOptions.browser;
if (browsers) {
    campaign.browsers = browsers.trim().split(/\s*,\s*/);
    var launcherConfig = commandLineOptions["launcher-config"] || process.env.npm_package_config_attesterLauncherConfig;
    if (launcherConfig) {
        attesterOptions["launcher-config"] = launcherConfig;
    }
} else if (browser == null) {
    process.env.PUPPETEER_INSTANCES = commandLineOptions["puppeteer-instances"] || process.env.PUPPETEER_INSTANCES || '1';
    attesterOptions["launcher-config"] = "test/ciLauncher.yml";
    campaign.browsers = ["Chrome with Puppeteer"];
} else if (browser != "none") {
    attesterOptions["robot-browser"] = browser;
}

console.log("Using the following options:");
console.log(JSON.stringify(attesterOptions, null, " "));
attester.config.set(attesterOptions);
attester.campaign.create(campaign, {}, 1);

require("./startAttester");
