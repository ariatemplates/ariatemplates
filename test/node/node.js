/*
 * Copyright 2012 Amadeus s.a.s.
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
var assert = require("assert");

// This test checks that Aria Templates can be used from node.js
describe("Aria Templates in node.js", function () {
    it("should load classes correctly", function (callback) {
        require("../.."); // this refers to the root of Aria Templates
        assert.ok(Aria, "Expecting Aria variable to be defined.");
        assert.ok(aria, "Expecting aria variable to be defined.");
        Aria.load({
            classes : ["aria.utils.Xml"],
            oncomplete : function () {
                assert.ok(aria.utils.Xml, "Expecting aria.utils.Xml to be defined.");
                callback();
            }
        });
    });
});
