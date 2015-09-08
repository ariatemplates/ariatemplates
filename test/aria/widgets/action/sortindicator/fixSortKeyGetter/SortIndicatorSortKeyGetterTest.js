/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.action.sortindicator.fixSortKeyGetter.SortIndicatorSortKeyGetterTest",
    $extends : "aria.jsunit.RobotTestCase",
    $prototype : {
        getCurrentOrder : function() {
            var tableBody = this.getElementById("tableBody");
            var rows = tableBody.rows;
            var res = [];
            for (var i = 0, l = rows.length; i < l; i++) {
                res[i] = rows[i].cells[0].innerHTML;
            }
            return res.join(",");
        },

        runTemplateTest : function () {
            this.assertEquals(this.getCurrentOrder(), "Jeremy,Timothee,Marie,Anne-Claire,Mathilde");
            this.assertEquals(this.templateCtxt._tpl.sortByFieldCalls, 0);
            this.assertEquals(this.templateCtxt._tpl.refreshes, 1);
            this.synEvent.click(this.getSortIndicator("sortIndicatorFirstName"), this.waitForRefresh(2, this._step1));
        },

        _step1 : function () {
            this.assertEquals(this.getCurrentOrder(), "Anne-Claire,Jeremy,Marie,Mathilde,Timothee");
            this.assertEquals(this.templateCtxt._tpl.sortByFieldCalls, 5);
            this.assertEquals(this.templateCtxt._tpl.sortByFieldArgs.field, "firstName");
            this.templateCtxt._tpl.sortByFieldCalls = 0;
            this.templateCtxt._tpl.sortByFieldArgs = null;
            this.synEvent.click(this.getSortIndicator("sortIndicatorFirstName"), this.waitForRefresh(3, this._step2));
        },

        _step2: function () {
            this.assertEquals(this.getCurrentOrder(), "Timothee,Mathilde,Marie,Jeremy,Anne-Claire");
            this.assertEquals(this.templateCtxt._tpl.sortByFieldCalls, 0);
            this.assertEquals(this.templateCtxt._tpl.sortByFieldArgs, null);
            this.synEvent.click(this.getSortIndicator("sortIndicatorBirthDate"), this.waitForRefresh(4, this._step3));
        },

        _step3: function () {
            this.assertEquals(this.getCurrentOrder(), "Anne-Claire,Jeremy,Mathilde,Marie,Timothee");
            this.assertEquals(this.templateCtxt._tpl.sortByFieldCalls, 5);
            this.assertEquals(this.templateCtxt._tpl.sortByFieldArgs.field, "birthDate");
            this.templateCtxt._tpl.sortByFieldCalls = 0;
            this.templateCtxt._tpl.sortByFieldArgs = null;
            this.synEvent.click(this.getLink("linkBirthDate"), this.waitForRefresh(5, this._step4));
        },

        _step4: function () {
            this.assertEquals(this.getCurrentOrder(), "Timothee,Marie,Mathilde,Jeremy,Anne-Claire");
            this.assertEquals(this.templateCtxt._tpl.sortByFieldCalls, 0);
            this.assertEquals(this.templateCtxt._tpl.sortByFieldArgs, null);
            this.synEvent.click(this.getSortIndicator("sortIndicatorBirthDate"), this.waitForRefresh(6, this._step5));
        },

        _step5: function () {
            this.assertEquals(this.getCurrentOrder(), "Anne-Claire,Jeremy,Mathilde,Marie,Timothee");
            this.assertEquals(this.templateCtxt._tpl.sortByFieldCalls, 0);
            this.assertEquals(this.templateCtxt._tpl.sortByFieldArgs, null);
            this.end();
        },

        waitForRefresh : function (refreshNumber, cb) {
            var self = this;
            return function () {
                self.waitFor({
                    condition: function () {
                        return this.templateCtxt._tpl.refreshes === refreshNumber;
                    },
                    callback: cb
                });
            };
        }
    }
});
