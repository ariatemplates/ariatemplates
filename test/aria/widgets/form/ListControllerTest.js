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
    $classpath : "test.aria.widgets.form.ListControllerTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.widgets.form.list.ListController", "aria.DomEvent"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.items = [{
                    value : 'a',
                    label : 'aItem1',
                    disabled : false
                }, {
                    value : 'c',
                    label : 'bItem2',
                    disabled : false
                }, {
                    value : 'b',
                    label : 'cItem3',
                    disabled : false
                }, {
                    value : 'd',
                    label : 'dItem4',
                    disabled : false
                }, {
                    value : 'e',
                    label : 'eItem5',
                    disabled : true
                }];

        this.selectedValues = ['e'];
        this.selectedIndex = [4];
    },
    $prototype : {
        setUp : function () {

            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "aria.widgets.form.list.ListController",
                initArgs : {
                    // In the external interface of the widget, the item data and the selected state is separated.
                    // In the internal data model, items and selection status are merged so that each list item
                    // hold info if it's selected or not. The conversion is done in the ListController module
                    itemsInfo : {
                        items : this.items
                    },
                    dataModel : {
                        activateSort : false,
                        multipleSelect : true,
                        maxSelectedCount : 5,
                        disabled : false,
                        displayOptions : {
                            flowOrientation : "vertical",
                            tableMode : false
                        },
                        // skin : skinObj,
                        // cfg : divCfg,
                        numberOfColumns : 0,
                        numberOfRows : 0
                    }
                }
            }, {
                fn : "_loadListControllerCallback",
                scope : this
            });

        },

        _loadListControllerCallback : function (res, args) {
            this.listController = res.moduleCtrl;
            this.listControllerPrivate = res.moduleCtrlPrivate;
            this.data = this.listController.getData();
        },

        tearDown : function () {
            this.listControllerPrivate.$dispose();
            this.listControllerPrivate = null;
            this.listController = null;
        },

        _doTest : function (params, results) {
            this.listControllerPrivate._calcRowCols(params[0], params[1], params[2], params[3]);
            var data = this.data;
            this.assertTrue(data.numberOfRows == results[0]);
            this.assertTrue(data.numberOfColumns == results[1]);
        },

        /**
         * When an item is disabled it should not be selectable.
         */
        testMultiSelectDisabledItemsNotSelectable : function () {
            var test = this.listControllerPrivate._mergeItemsAndSelectionInfo(this.items, this.selectedValues, this.selectedIndex);
            this.assertTrue(test.items[4].selected === false);
            this.assertTrue(test.items[4].currentlyDisabled);
            this.assertTrue(test.selectedCount === 0);
            this.assertTrue(test.selectedIndex === -1);
        },

        testVerticle1 : function () {
            var params = ['vertical', 2, 3, 5];
            var results = [2, 3];

            this._doTest(params, results);
        },

        testVerticle2 : function () {
            var params = ['vertical', 2, 4, 5];
            var results = [2, 3];

            this._doTest(params, results);
        },

        testVerticle3 : function () {
            var params = ['vertical', 2, 3, 6];
            var results = [2, 3];

            this._doTest(params, results);
        },

        testVerticle4 : function () {
            var params = ['vertical', 2, 3, 5];
            var results = [2, 3];

            this._doTest(params, results);
        },

        testVerticle5 : function () {
            var params = ['vertical', 0, 4, 5];
            var results = [2, 3];

            this._doTest(params, results);
        },

        testVerticle6 : function () {
            var params = ['vertical', 0, 0, 5];
            var results = [5, 1];

            this._doTest(params, results);
        },

        testVerticle7 : function () {
            var params = ['vertical', 2, 2, 3];
            var results = [2, 2];

            this._doTest(params, results);
        },

        testVerticle8 : function () {
            var params = ['vertical', 2, 2, 4];
            var results = [2, 2];

            this._doTest(params, results);
        },

        testVerticle9 : function () {
            var params = ['vertical', 1, 1, 4];
            var results = [1, 4];

            this._doTest(params, results);
        },

        testVerticle10 : function () {
            var params = ['vertical', 0, 0, 4];
            var results = [4, 1];

            this._doTest(params, results);
        },

        testVerticle11 : function () {
            var params = ['vertical', 0, 0, 0];
            var results = [0, 1];

            this._doTest(params, results);
        },

        testVerticle12 : function () {
            var params = ['vertical', 0, 1, 5];
            var results = [5, 1];

            this._doTest(params, results);
        },

        testVerticle13 : function () {
            var params = ['vertical', 3, 0, 7];
            var results = [3, 3];

            this._doTest(params, results);
        },

        testVerticle14 : function () {
            var params = ['vertical', 0, 3, 7];
            var results = [3, 3];

            this._doTest(params, results);
        },

        testVerticle14b : function () {
            var params = ['vertical', 0, 2, 7];
            var results = [4, 2];

            this._doTest(params, results);
        },

        testVerticle15 : function () {
            var params = ['vertical', 0, 4, 7];
            var results = [2, 4];

            this._doTest(params, results);
        },

        testVerticle15b : function () {
            var params = ['vertical', 0, 5, 7];
            var results = [2, 4];

            this._doTest(params, results);
        },

        testHorizontal1 : function () {
            var params = ['horizontal', 3, 2, 5];
            var results = [3, 2];

            this._doTest(params, results);
        },

        testHorizontal2 : function () {
            var params = ['horizontal', 4, 2, 5];
            var results = [3, 2];

            this._doTest(params, results);
        },

        testHorizontal3 : function () {
            var params = ['horizontal', 3, 2, 6];
            var results = [3, 2];

            this._doTest(params, results);
        },

        testHorizontal4 : function () {
            var params = ['horizontal', 3, 2, 5];
            var results = [3, 2];

            this._doTest(params, results);
        },

        testHorizontal5 : function () {
            var params = ['horizontal', 4, 0, 5];
            var results = [3, 2];

            this._doTest(params, results);
        },

        testHorizontal6 : function () {
            var params = ['horizontal', 0, 0, 5];
            var results = [1, 5];

            this._doTest(params, results);
        },

        testHorizontal7 : function () {
            var params = ['horizontal', 2, 2, 3];
            var results = [2, 2];

            this._doTest(params, results);
        },

        testHorizontal8 : function () {
            var params = ['horizontal', 2, 2, 4];
            var results = [2, 2];

            this._doTest(params, results);
        },

        testHorizontal9 : function () {
            var params = ['horizontal', 1, 1, 4];
            var results = [4, 1];

            this._doTest(params, results);
        },

        testHorizontal10 : function () {
            var params = ['horizontal', 0, 0, 4];
            var results = [1, 4];

            this._doTest(params, results);
        },

        testHorizontal11 : function () {
            var params = ['horizontal', 0, 0, 0];
            var results = [1, 0];

            this._doTest(params, results);
        },

        testHorizontal12 : function () {
            var params = ['horizontal', 1, 0, 5];
            var results = [1, 5];

            this._doTest(params, results);
        },

        testHorizontal13 : function () {
            var params = ['horizontal', 0, 3, 7];
            var results = [3, 3];

            this._doTest(params, results);
        },

        testHorizontal14 : function () {
            var params = ['horizontal', 3, 0, 7];
            var results = [3, 3];

            this._doTest(params, results);
        },

        testHorizontal14b : function () {
            var params = ['horizontal', 2, 0, 7];
            var results = [2, 4];

            this._doTest(params, results);
        },

        testHorizontal15 : function () {
            var params = ['horizontal', 4, 0, 7];
            var results = [4, 2];

            this._doTest(params, results);
        },

        testHorizontal15b : function () {
            var params = ['horizontal', 5, 0, 7];
            var results = [4, 2];

            this._doTest(params, results);
        },

        testMaxSelectedCount : function () {
            // test that selecting the maximum number of items results in other items being disabled
            // and other maxSelectedCount-related things
            var json = aria.utils.Json;
            var lc = this.listController;
            var data = this.data;
            // set the maximum number of selected items:
            lc.setMaxSelectedCount(4);
            // set the items:
            lc.setItems([{
                        value : 'a',
                        label : 'aItem1',
                        disabled : false
                    }, {
                        value : 'c',
                        label : 'bItem2',
                        disabled : true
                    }, {
                        value : 'b',
                        label : 'cItem3',
                        disabled : false
                    }, {
                        value : 'd',
                        label : 'dItem4',
                        disabled : false
                    }, {
                        value : 'e',
                        label : 'eItem5',
                        disabled : false
                    }, {
                        value : 'g',
                        label : 'dItem4',
                        disabled : false
                    }, {
                        value : 'h',
                        label : 'eItem5',
                        disabled : true
                    }]);
            // set the selected values:
            lc.setSelectedValues(['a', 'c', 'd', 'e']);
            var items = data.items;
            // check things in the data model:
            var checkItems = [{
                        value : 'a',
                        initiallyDisabled : false,
                        currentlyDisabled : false,
                        selected : true
                    }, {
                        value : 'c',
                        initiallyDisabled : true,
                        currentlyDisabled : true,
                        selected : true
                    }, {
                        value : 'b',
                        initiallyDisabled : false,
                        currentlyDisabled : true,
                        selected : false
                    }, {
                        value : 'd',
                        initiallyDisabled : false,
                        currentlyDisabled : false,
                        selected : true
                    }, {
                        value : 'e',
                        initiallyDisabled : false,
                        currentlyDisabled : false,
                        selected : true
                    }, {
                        value : 'g',
                        initiallyDisabled : false,
                        currentlyDisabled : true,
                        selected : false
                    }, {
                        value : 'h',
                        initiallyDisabled : true,
                        currentlyDisabled : true,
                        selected : false
                    }]
            this.assertTrue(json.contains(items, checkItems));
            this.assertTrue(data.selectedCount == 4);
            this.assertTrue(data.selectedIndex == null);
            json.setValue(items[0], 'selected', false);
            checkItems[0].selected = false;
            checkItems[2].currentlyDisabled = false;
            checkItems[5].currentlyDisabled = false;
            this.assertTrue(data.selectedCount == 3);
            this.assertTrue(data.selectedIndex == null);
            this.assertTrue(json.contains(items, checkItems));
            json.setValue(items[1], 'initiallyDisabled', false);
            checkItems[1].initiallyDisabled = false;
            checkItems[1].currentlyDisabled = false;
            this.assertTrue(json.contains(items, checkItems));
            // try to select more values than possible:
            lc.setSelectedValues(['h', 'g', 'a', 'b', 'd']);
            // check that only 4 are actually selected:
            this.assertTrue(data.selectedCount == 4);
            this.assertTrue(data.selectedIndex == null);
            this.assertTrue(lc.getSelectedValues().length == 4);

            // when 4 values are selected:
            lc.setSelectedValues(['a', 'c', 'd', 'e']);
            // try to select another value:
            json.setValue(items[2], 'selected', true); // selecting 'b'
            // check that only 4 values are still selected:
            this.assertTrue(data.selectedCount == 4);
            this.assertTrue(data.selectedIndex == null);
            this.assertTrue(lc.getSelectedValues().length == 4);
            // and that 'b' is among them:
            this.assertTrue(aria.utils.Array.contains(lc.getSelectedValues(), 'b'));
            this.assertTrue(items[2].selected == true);

            // check that changing the maximum number of selected values changes the selected values:
            lc.setMaxSelectedCount(2);
            this.assertTrue(data.selectedCount == 2);
            this.assertTrue(data.selectedIndex == null);
            this.assertTrue(lc.getSelectedValues().length == 2);
        },

        testCalcMoveFocus : function () {
            var flowOrientation = "horizontal";
            var focusIndex = 0;
            var numberOfRows = 3;
            var numberOfColumns = 3;
            var keyCode = 40;
            var numberItems = 9;

            var moveFocus = this.listControllerPrivate.calcMoveFocus(flowOrientation, focusIndex, numberOfRows, numberOfColumns, keyCode, numberItems);
            this.assertTrue(moveFocus == 3);

        },

        testSelectDeselectAll : function () {
            var data = this.data;
            var listController = this.listController;
            var items = [{
                        value : 'I1',
                        label : 'Item1',
                        disabled : false
                    }, {
                        value : 'I2',
                        label : 'Item2',
                        disabled : true
                    }, {
                        value : 'I3',
                        label : 'Item3',
                        disabled : false
                    }, {
                        value : 'I4',
                        label : 'Item4',
                        disabled : false
                    }, {
                        value : 'I5',
                        label : 'Item5',
                        disabled : false
                    }, {
                        value : 'I6',
                        label : 'Item4',
                        disabled : false
                    }, {
                        value : 'I7',
                        label : 'Item5',
                        disabled : true
                    }];

            listController.setItems(items);

            listController.selectAll({
                "items" : data.items
            });

            for (var i = 0; i < data.items.length; i++) {
                if (items[i].disabled) {
                    this.assertFalse(data.items[i].selected);
                } else {
                    this.assertTrue(data.items[i].selected);
                }
            }

            listController.deselectAll();

            for (var j = 0; j < data.items.length; j++) {
                this.assertFalse(data.items[j].selected);
            }
        },

        testPreSelect : function () {
            var data = this.data;
            var listController = this.listControllerPrivate;
            this.assertTrue(listController._checkPreselect() === null);
            data.preselect = "always";
            this.assertTrue(listController._checkPreselect() === 0);
        },

        testEventCallback : function () {
            this.data.testEventCallback = true;
        },

        testClose : function () {
            var data = this.data;
            var listController = this.listController;
            listController.$on({
                'close' : {
                    fn : this.testEventCallback
                },
                scope : this
            });
            listController.close();
            this.assertTrue(this.data.testEventCallback);
        }
    }
});
