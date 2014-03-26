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

Aria.classDefinition({
    $classpath : 'test.aria.templates.tableRefresh.TableRefreshTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.tableRefresh.TableRefresh",
            data : {
                refreshNbr : 0
            }
        });
    },
    $prototype : {
        /*
         * This test checks that it is possible to refresh tbody, thead and tfoot sections. This is especially important
         * in IE, as IE does not support setting the innerHTML property on those elements.
         */
        runTemplateTest : function () {
            // do a first check before the refresh:
            var table = this.getElementById("myTable");

            // refreshNbr is 0
            this._checkTableElement(table.children[0], "head", "thead", 0);
            this._checkTableElement(table.children[1], "foot", "tfoot", 0);
            this._checkTableElement(table.children[2], "section1", "tbody", 0);
            this._checkTableElement(table.children[3], "section2", "tbody", 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh only section 1:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 1);
            this.templateCtxt.$refresh({
                section : "section1"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 0);
            this._checkTableElement(table.children[1], "foot", "tfoot", 0);
            this._checkTableElement(table.children[2], "section1", "tbody", 1);
            this._checkTableElement(table.children[3], "section2", "tbody", 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh again only section 1:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 2);
            this.templateCtxt.$refresh({
                section : "section1"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 0);
            this._checkTableElement(table.children[1], "foot", "tfoot", 0);
            this._checkTableElement(table.children[2], "section1", "tbody", 2);
            this._checkTableElement(table.children[3], "section2", "tbody", 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh only section thead:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 3);
            this.templateCtxt.$refresh({
                section : "head"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 3);
            this._checkTableElement(table.children[1], "foot", "tfoot", 0);
            this._checkTableElement(table.children[2], "section1", "tbody", 2);
            this._checkTableElement(table.children[3], "section2", "tbody", 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh again only section thead:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 4);
            this.templateCtxt.$refresh({
                section : "head"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 4);
            this._checkTableElement(table.children[1], "foot", "tfoot", 0);
            this._checkTableElement(table.children[2], "section1", "tbody", 2);
            this._checkTableElement(table.children[3], "section2", "tbody", 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh only section tfoot:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 5);
            this.templateCtxt.$refresh({
                section : "foot"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 4);
            this._checkTableElement(table.children[1], "foot", "tfoot", 5);
            this._checkTableElement(table.children[2], "section1", "tbody", 2);
            this._checkTableElement(table.children[3], "section2", "tbody", 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh again only section tfoot:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 6);
            this.templateCtxt.$refresh({
                section : "foot"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 4);
            this._checkTableElement(table.children[1], "foot", "tfoot", 6);
            this._checkTableElement(table.children[2], "section1", "tbody", 2);
            this._checkTableElement(table.children[3], "section2", "tbody", 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh only a TR in section 2:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 7);
            this.templateCtxt.$refresh({
                section : "section2_1"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 4);
            this._checkTableElement(table.children[1], "foot", "tfoot", 6);
            this._checkTableElement(table.children[2], "section1", "tbody", 2);
            this._checkTableElement(table.children[3], "section2", "tbody", 7, 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            // change refresh number and refresh again only a TR in section 2:
            aria.utils.Json.setValue(this.env.data, "refreshNbr", 8);
            this.templateCtxt.$refresh({
                section : "section2_1"
            });
            // check that only section 1 was refreshed
            this._checkTableElement(table.children[0], "head", "thead", 4);
            this._checkTableElement(table.children[1], "foot", "tfoot", 6);
            this._checkTableElement(table.children[2], "section1", "tbody", 2);
            this._checkTableElement(table.children[3], "section2", "tbody", 8, 0);
            this._checkTableElement(table.children[4], "section3", "tbody", 0);

            this.notifyTemplateTestEnd();
        },

        _checkTableElement : function (domElt, sectionName, tagName, refreshNbr1, refreshNbr2) {
            if (refreshNbr2 == null) {
                refreshNbr2 = refreshNbr1;
            }
            this.assertTrue(domElt.tagName.toLowerCase() == tagName.toLowerCase(), "tagName");
            this._checkTR(domElt.children[0], sectionName + "_1", refreshNbr1);
            this._checkTR(domElt.children[1], sectionName + "_2", refreshNbr2);
        },

        _checkTR : function (domElt, sectionName, refreshNbr) {
            this.assertTrue(domElt.tagName.toLowerCase() == "tr", "TR tagName in " + sectionName);
            this.assertTrue(domElt.children[0].innerHTML == sectionName + ".1-" + refreshNbr, "wrong " + sectionName
                    + ".1-" + refreshNbr);
            this.assertTrue(domElt.children[1].innerHTML == sectionName + ".2-" + refreshNbr, "wrong " + sectionName
                    + ".2-" + refreshNbr);
        }

    }
});
