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

var browsers = [
    "Firefox 3",
    "Firefox 11",
    "Firefox >=62 as Firefox",
    "Chrome >=69 as Chrome",
    "Safari",
    "IE 8",
    "IE 9",
    "IE 10",
    "IE 11",
    "Edge"
];

var campaigns = [
    testConfigBuilder.buildTestConfig({
        campaign: "classic",
        browsers: browsers,
        phantomjs: false,
        noFlash: true
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "unpackaged",
        browsers: browsers
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "testSkin",
        browsers: browsers
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "flatSkin",
        browsers: browsers
    }),
    testConfigBuilder.buildTestConfig({
        campaign: "jawsTests",
        browsers: ["IE 11 with JAWS18", "IE 11 with JAWS16"]
    })
];

var options = {
    "max-task-restarts": 15,
    "task-restart-on-failure": true,
    "colors": true,
    "env": attester.config.readFile("package.json"),
    "phantomjs-instances": 0
};
attester.config.set(options);
campaigns.forEach(function (campaign, n) {
    attester.campaign.create(campaign, {}, n+1);
});

require("./startAttester");
