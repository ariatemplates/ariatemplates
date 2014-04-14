/*
 * Copyright 2013 Amadeus s.a.s.
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

/**
 * Test dynamic sections
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.repeater.testOne.RepeaterOne",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this._templateClasspath = this._templateClasspath || "test.aria.templates.repeater.testOne.RepeaterTestOne";
        this.testData = {
            refCount : {},
            items : [],
            myArray : ["just", "an", "array"]
        };
        this.setTestEnv({
            template : this._templateClasspath,
            data : this.testData
        });
    },
    $prototype : {
        /**
         * Test repeater in case of array loopType. Test the new aria.utils.json methods to manipulate arrays. Test the
         * cssClass callback for pyjama tables. Test that the ct field of the item is correctly updated.
         */
        runTemplateTest : function () {
            var myArray = this.testData.myArray;
            var items = this.testData.items;
            var json = aria.utils.Json;
            var tableBody = this.testDiv.children[0].children[0].children[0];

            this._checkDisplay(tableBody, ["just", "an", "array"]);
            this._testAttributes(tableBody, 3);

            json.setValue(myArray, 0, "quite");
            this._checkDisplay(tableBody, ["quite", "an", "array"]);

            json.add(myArray, "not", 1);

            this._checkDisplay(tableBody, ["quite", "not", "an", "array"]);

            this._testAttributes(tableBody, 4);

            this.assertEquals(items[0].ct, 1);
            this.assertEquals(items[1].ct, 3);
            this.assertEquals(items[2].ct, 4);
            this.assertEquals(items[3].ct, 2);

            json.add(myArray, "of");

            this._checkDisplay(tableBody, ["quite", "not", "an", "array", "of"]);

            this._testAttributes(tableBody, 5);

            this.assertEquals(items[4].ct, 5);

            json.removeAt(myArray, 2);
            this._checkDisplay(tableBody, ["quite", "not", "array", "of"]);

            this._testAttributes(tableBody, 4);

            this.assertEquals(items[2].ct, 3);
            this.assertEquals(items[4].ct, 4);

            json.splice(myArray, 1, 1);
            this._checkDisplay(tableBody, ["quite", "array", "of"]);
            this._testAttributes(tableBody, 3);

            aria.templates.RefreshManager.stop();
            json.splice(myArray, 0, 0, "this", "is");

            this._checkDisplay(tableBody, ["quite", "array", "of"]);
            this._testAttributes(tableBody, 3);

            aria.templates.RefreshManager.resume();

            this._checkDisplay(tableBody, ["this", "is", "quite", "array", "of"]);
            this._testAttributes(tableBody, 5);

            json.setValue(myArray, 7, "nonsense");
            this._checkDisplay(tableBody, ["this", "is", "quite", "array", "of", "", "", "nonsense"]);

            this.assertEquals(items.length, 10);
            this.assertEquals(this.testData.refCount[items[0].sectionId], 2);

            this._testAttributes(tableBody, 8);

            this._beforeTestEnd();

            this.end();
        },

        _checkDisplay : function (tableBody, contents) {
            this.assertEquals(tableBody.children.length, contents.length);
            for (var i = 0, len = contents.length; i < len; i++) {
                this.assertEquals(tableBody.children[i].children[0].innerHTML, contents[i]);
            }
        },

        _beforeTestEnd : function () {
            this.assertLogsEmpty();
        },

        _testAttributes : function (tableBody, count) {
            var cssClasses = ["oddRow", "evenRow"], element;
            for (var j = 0; j < count; j++) {
                element = tableBody.children[j];
                this.assertEquals(element.getAttribute("data-index"), (j + 1) + "");
                this.assertEquals(element.className, cssClasses[j % 2]);
            }
        }
    }
});
