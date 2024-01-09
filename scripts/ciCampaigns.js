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
var ci = process.env.CI === "true";

process.env.PLAYWRIGHT_INSTANCES = process.env.PLAYWRIGHT_INSTANCES || "4";

var headlessBrowser = "Chrome Headless";
var visibleBrowser = "Chrome";

var campaigns = [
    testConfigBuilder.buildTestConfig({
        campaign: "classic",
        browsers: [headlessBrowser],
        noFlash: true,
        headless: true
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "unpackaged",
        browsers: [headlessBrowser]
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "testSkin",
        browsers: [headlessBrowser]
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "flatSkin",
        browsers: [headlessBrowser]
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "visible",
        noFlash: ci,
        browsers: [visibleBrowser]
    })
];

var robotServerProcess = robotServer.exec();
process.on("exit", function () {
    robotServerProcess.kill();
});

var options = {
    "max-task-restarts": 3,
    "task-restart-on-failure": true,
    "colors": true,
    "env": attester.config.readFile("package.json"),
    "launcher-config": "test/ciLauncher.yml"
};
attester.config.set(options);
campaigns.forEach(function (campaign, n) {
    attester.campaign.create(campaign, {}, n+1);
});

require("./startAttester");
