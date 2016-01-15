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
var options = {
    "phantomjs-instances": 0
};
var browser = "phantomjs";
var testsToExecute = process.argv.slice(2).filter(function (arg) {
    if (/^--browser=/.test(arg)) {
        browser = arg.substr(10);
        return false;
    }
    return true;
});

if (browser == "phantomjs") {
    options["phantomjs-instances"] = 1;
} else if (browser != "none") {
    options["robot-browser"] = browser;
}

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

attester.config.set(options);
attester.campaign.create(campaign, {}, 1);

attester.start();
