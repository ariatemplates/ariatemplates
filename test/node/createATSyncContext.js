/*
 * Copyright 2016 Amadeus s.a.s.
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
var fs = require("fs");
var path = require("path");
var assert = require("assert");
var atVersion = require("../../package.json").version;
var createATSyncContext = require("../../src/node").createATSyncContext;

// This test checks that Aria Templates can be used from node.js with createATSyncContext
describe("Aria Templates with createATSyncContext in node.js", function () {
    it("should work with no option", function () {
        var context = createATSyncContext();
        assert.equal(context.Aria.version, 'ARIA-SNAPSHOT');
        context.Aria.load({
           classes : ["aria.templates.TplClassGenerator"]
        });
        context.execTimeouts(); // executes any timeout synchronously
        var classDef;
        context.aria.templates.TplClassGenerator.parseTemplate("{Template {$classpath:'a.b.C'}} {macro main()}It works!{/macro}{/Template}", true, function(response) {
            classDef = response.classDef;
        });
        context.execTimeouts(); // executes any timeout synchronously
        assert.ok(classDef, "Expecting classDef to be defined.");
        assert.ok(/It works!/.test(classDef), "Expecting classDef to contain 'It works!'.");
    });

    it("should work with bootstrapFile and rootFolderPath options", function () {
        var context = createATSyncContext({
            bootstrapFile: path.join(__dirname, "..", "..", "build/target/production/aria/ariatemplates-" + atVersion + ".js"),
            rootFolderPath: path.join(__dirname, "..", "..", "build/target/production/")
        });
        var onCompleteCalled = false;
        context.Aria.load({
            classes : ["aria.templates.TplClassGenerator"],
            oncomplete : function () {
                onCompleteCalled = true;
            }
        });
        assert.ok(!onCompleteCalled, "Expecting oncomplete not to have been called yet!");
        context.execTimeouts();
        assert.ok(onCompleteCalled, "Expecting oncomplete to have been called.");
        assert.ok(context.aria.templates.TplClassGenerator, "Expecting aria.templates.TplClassGenerator to be defined.");
        assert.equal(context.Aria.version, atVersion);
    });

    it("should work with bootstrapFile and readFileSync options", function () {
        var context = createATSyncContext({
            bootstrapFile: "aria/ariatemplates-" + atVersion + ".js",
            readFileSync: function (fileName) {
                return fs.readFileSync(path.join(__dirname, "..", "..", "build/target/production", fileName), "utf-8");
            }
        });
        var onCompleteCalled = false;
        context.Aria.load({
            classes : ["aria.templates.TplClassGenerator"],
            oncomplete : function () {
                onCompleteCalled = true;
            }
        });
        assert.ok(!onCompleteCalled, "Expecting oncomplete not to have been called yet!");
        context.execTimeouts();
        assert.ok(onCompleteCalled, "Expecting oncomplete to have been called.");
        assert.ok(context.aria.templates.TplClassGenerator, "Expecting aria.templates.TplClassGenerator to be defined.");
        assert.equal(context.Aria.version, atVersion);
    });
});
