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
var testConfigBuilder = require("../test/testConfigBuilder");
var robotServer = require("robot-server");
var travis = process.env.TRAVIS === "true";

var campaigns = [
    testConfigBuilder.buildTestConfig({
        campaign: "classic",
        browsers: ["PhantomJS"],
        phantomjs: true
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "unpackaged",
        browsers: ["PhantomJS"]
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "testSkin",
        browsers: ["PhantomJS"]
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "flatSkin",
        browsers: ["PhantomJS"]
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "nophantom",
        noFlash: travis,
        browsers: ["Firefox"]
    })
];

var robotServerProcess = robotServer.exec();
process.on("exit", function () {
    robotServerProcess.kill();
});

var options = {
    "colors": true,
    "env": attester.config.readFile("package.json"),
    "phantomjs-instances": 0,
    "launcher-config": "test/ciLauncher.yml"
};
attester.config.set(options);
campaigns.forEach(function (campaign, n) {
    attester.campaign.create(campaign, {}, n+1);
});

require("./startAttester");
