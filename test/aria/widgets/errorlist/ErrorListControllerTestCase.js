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

/**
 * Test case for aria.widgets.errorlist.ErrorListController
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.errorlist.ErrorListControllerTestCase",
    $dependencies : ["aria.widgets.errorlist.ErrorListController", "aria.templates.ModuleCtrlFactory"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        divCfg : {},

        _simpleMessagesList : function () {
            return [{
                        localizedMessage : "My message 1",
                        code : "CODE1",
                        type : "WARNING"
                    }, {
                        localizedMessage : "My message 2",
                        code : "CODE2",
                        type : "ERROR"
                    }, {
                        localizedMessage : "My message 3",
                        code : "CODE3",
                        type : "ERROR"
                    }, {
                        localizedMessage : "My message 4",
                        code : "CODE4",
                        type : "WARNING"
                    }];
        },

        _simpleMessagesListErrorFiltered : function () {
            return [{
                        localizedMessage : "My message 2",
                        code : "CODE2",
                        type : "ERROR"
                    }, {
                        localizedMessage : "My message 3",
                        code : "CODE3",
                        type : "ERROR"
                    }];
        },

        _structuredMessagesList : function () {
            return [{
                        localizedMessage : "My structured message 1",
                        code : "SMLCODE1",
                        type : "INFO",
                        subMessages : this._simpleMessagesList()
                    }, {
                        localizedMessage : "My structured message 2",
                        code : "SMLCODE2",
                        type : "WARNING",
                        subMessages : this._simpleMessagesList()
                    }, {
                        localizedMessage : "My structured message 3",
                        code : "SMLCODE3",
                        type : "ERROR",
                        subMessages : [{
                                    type : "UNKNOWN",
                                    code : "SMLCODE31",
                                    localizedMessage : "My sub message 3"
                                }]
                    }, {
                        localizedMessage : "My structured message 4",
                        code : "SMLCODE4",
                        type : "WARNING"
                    }];
        },

        _structuredMessagesListErrorFiltered : function () {
            return [{
                        localizedMessage : "My structured message 1",
                        code : "SMLCODE1",
                        type : "INFO",
                        subMessages : this._simpleMessagesListErrorFiltered()
                    }, {
                        localizedMessage : "My structured message 2",
                        code : "SMLCODE2",
                        type : "WARNING",
                        subMessages : this._simpleMessagesListErrorFiltered()
                    }, {
                        localizedMessage : "My structured message 3",
                        code : "SMLCODE3",
                        type : "ERROR",
                        subMessages : []
                    }];
        },

        testAsyncNullMessages : function () {
            this._errorListTestMessages(null, null, []);
        },

        testAsyncEmptyMessages : function () {
            this._errorListTestMessages([], null, []);
        },

        testAsyncNullMessagesWithFilterTypes : function () {
            this._errorListTestMessages(null, ['ERROR'], []);
        },

        testAsyncEmptyMessagesWithFilterTypes : function () {
            this._errorListTestMessages([], ['ERROR'], []);
        },

        testAsyncSimpleList : function () {
            this._errorListTestMessages(this._simpleMessagesList(), null, this._simpleMessagesList());
        },

        testAsyncSimpleListWithNonPresentFilterTypes : function () {
            this._errorListTestMessages(this._simpleMessagesList(), ['NOMESSAGEOFSUCHTYPE'], []);
        },

        testAsyncSimpleListWithEmptyFilterTypes : function () {
            this._errorListTestMessages(this._simpleMessagesList(), [], []);
        },

        testAsyncSimpleListWithErrorFilterTypes : function () {
            this._errorListTestMessages(this._simpleMessagesList(), ['ERROR'], this._simpleMessagesListErrorFiltered());
        },

        testAsyncSimpleListWithSeveralFilterTypes : function () {
            this._errorListTestMessages(this._simpleMessagesList(), ['ERROR', 'WARNING'], this._simpleMessagesList());
        },

        testAsyncStructuredMessagesListFilterInfo : function () {
            this._errorListTestMessages(this._structuredMessagesList(), ['INFO'], [{
                        localizedMessage : "My structured message 1",
                        code : "SMLCODE1",
                        type : "INFO",
                        subMessages : []
                    }]);
        },

        testAsyncStructuredMessagesListFilterError : function () {
            this._errorListTestMessages(this._structuredMessagesList(), ['ERROR'], this._structuredMessagesListErrorFiltered());
        },

        _errorListTestMessages : function (messages, filterTypes, expectedAnswer) {
            this.callAsyncMethod(aria.templates.ModuleCtrlFactory, "createModuleCtrl", [{
                        classpath : "aria.widgets.errorlist.ErrorListController",
                        initArgs : {
                            title : "MYTITLE",
                            divCfg : this.divCfg,
                            filterTypes : filterTypes,
                            displayCodes : true,
                            messages : messages

                        }
                    }], {
                fn : "_errorListTestMessagesCb",
                scope : this,
                args : {
                    expectedMessages : expectedAnswer,
                    filterTypes : filterTypes
                }
            });
        },

        _errorListTestMessagesCb : function (res, args) {
            var moduleCtrl = res.moduleCtrl;
            var data = moduleCtrl.getData();
            this.assertTrue(data.divCfg == this.divCfg);
            this.assertTrue(data.title === "MYTITLE");
            this.assertTrue(data.displayCodes === true);
            this.assertTrue(data.filterTypes == args.filterTypes);
            this.assertTrue(aria.utils.Json.equals(data.messages, args.expectedMessages));
            res.moduleCtrlPrivate.$dispose();
        }

    }
});
