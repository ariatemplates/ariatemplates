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

Aria.classDefinition({
    $classpath : "test.aria.templates.css.cssMgr.issue722.CSSMgrIssue722TestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.CSSMgr", "test.aria.templates.css.cssMgr.issue722.HelperIssue722"],
    $prototype : {
        testCSSLoad : function () {
            var document = Aria.$window.document;
            this._count = document.getElementsByTagName("head")[0].children.length;

            for (var i = 0; i < 5; i++) {
                var helper = new test.aria.templates.css.cssMgr.issue722.HelperIssue722();
                this._checkHead();
                helper.$dispose();
                this._checkHead();
            }

            var helper1 = new test.aria.templates.css.cssMgr.issue722.HelperIssue722();
            this._checkHead();
            var helper2 = new test.aria.templates.css.cssMgr.issue722.HelperIssue722();
            this._checkHead();
            helper1.$dispose();
            this._checkHead();
            helper2.$dispose();
            this._checkHead();
        },

        _checkHead: function () {
            var document = Aria.$window.document;
            this.assertEquals(document.getElementsByTagName("head")[0].children.length, this._count + 1);
        }
    }
});
