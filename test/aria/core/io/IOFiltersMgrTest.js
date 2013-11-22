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
 * Test for the IOFiltersMgr singleton.
 */
Aria.classDefinition({
    $classpath : "test.aria.core.io.IOFiltersMgrTest",
    $dependencies : ["test.aria.core.test.IOFilterSample"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        testAddRemoveFilter : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var filterInstance = new test.aria.core.test.IOFilterSample();

            this.assertFalse(ioFiltersMgr.isFilterPresent(filterInstance));
            this.assertFalse(ioFiltersMgr.isFilterPresent("test.aria.core.test.IOFilterSample"));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : null
            }));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : "test"
            }));

            ioFiltersMgr.addFilter("test.aria.core.test.IOFilterSample");

            this.assertTrue(ioFiltersMgr._filters != null);
            this.assertFalse(ioFiltersMgr.isFilterPresent(filterInstance));
            this.assertTrue(ioFiltersMgr.isFilterPresent("test.aria.core.test.IOFilterSample"));
            this.assertTrue(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : null
            }));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : "test"
            }));

            var res = ioFiltersMgr.removeFilter("test.aria.core.test.WrongIOFilterSample");
            this.assertFalse(res);
            res = ioFiltersMgr.removeFilter({
                classpath : "test.aria.core.test.WrongIOFilterSample",
                initArgs : null
            });
            this.assertFalse(res);
            res = ioFiltersMgr.removeFilter(filterInstance);
            this.assertFalse(res);

            res = ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertTrue(res);
            res = ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertFalse(res);
            this.assertTrue(ioFiltersMgr._filters == null);

            this.assertFalse(ioFiltersMgr.isFilterPresent(filterInstance));
            this.assertFalse(ioFiltersMgr.isFilterPresent("test.aria.core.test.IOFilterSample"));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : null
            }));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : "test"
            }));

            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : "test"
            });

            this.assertTrue(ioFiltersMgr._filters != null);
            this.assertFalse(ioFiltersMgr.isFilterPresent(filterInstance));
            this.assertTrue(ioFiltersMgr.isFilterPresent("test.aria.core.test.IOFilterSample"));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : null
            }));
            this.assertTrue(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : "test"
            }));

            res = ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertTrue(res);
            res = ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertFalse(res);
            this.assertTrue(ioFiltersMgr._filters == null);

            ioFiltersMgr.addFilter(filterInstance);
            this.assertTrue(ioFiltersMgr._filters != null);
            this.assertTrue(ioFiltersMgr.isFilterPresent(filterInstance));
            this.assertTrue(ioFiltersMgr.isFilterPresent("test.aria.core.test.IOFilterSample"));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : null
            }));
            this.assertFalse(ioFiltersMgr.isFilterPresent({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : "test"
            }));

            res = ioFiltersMgr.removeFilter(filterInstance);
            this.assertTrue(res);
            res = ioFiltersMgr.removeFilter(filterInstance);
            this.assertFalse(res);

            // check we can add twice the same filter:
            ioFiltersMgr.addFilter("test.aria.core.test.IOFilterSample");
            this.assertTrue(ioFiltersMgr._filters != null);
            ioFiltersMgr.addFilter("test.aria.core.test.IOFilterSample");
            res = ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertTrue(res);
            this.assertTrue(ioFiltersMgr._filters != null);
            res = ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertTrue(res);
            this.assertTrue(ioFiltersMgr._filters == null);
            res = ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertFalse(res);
        },

        testAddRemoveFilterErrors : function () {
            aria.core.IOFiltersMgr.addFilter(1);
            this.assertErrorInLogs(aria.core.IOFiltersMgr.INVALID_PARAMETER_FOR_ADDFILTER);
            this.assertLogsEmpty();

            // add at least a valid filter so that we do check parameters:
            aria.core.IOFiltersMgr.addFilter("test.aria.core.test.IOFilterSample");

            var res = aria.core.IOFiltersMgr.removeFilter(1);
            this.assertFalse(res);
            this.assertErrorInLogs(aria.core.IOFiltersMgr.INVALID_PARAMETER_FOR_REMOVEFILTER);
            this.assertLogsEmpty();

            res = aria.core.IOFiltersMgr.isFilterPresent(1);
            this.assertFalse(res);
            this.assertErrorInLogs(aria.core.IOFiltersMgr.INVALID_PARAMETER_FOR_ISFILTERPRESENT);
            this.assertLogsEmpty();

            res = aria.core.IOFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertTrue(res);

            // try to add twice the same instance:
            var filterInstance = new test.aria.core.test.IOFilterSample();
            res = aria.core.IOFiltersMgr.addFilter(filterInstance);
            this.assertTrue(res);
            this.assertLogsEmpty();
            // try to add the same filter instance:
            res = aria.core.IOFiltersMgr.addFilter(filterInstance);
            this.assertFalse(res);
            this.assertErrorInLogs(aria.core.IOFiltersMgr.FILTER_INSTANCE_ALREADY_PRESENT);
            res = aria.core.IOFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertTrue(res);
            this.assertFalse(aria.core.IOFiltersMgr.isFilterPresent(filterInstance));
            res = aria.core.IOFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
            this.assertFalse(res);
        },

        _createCheckOrderFilter : function (index, request) {
            var oSelf = this;
            return {
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        try {
                            oSelf.assertTrue(req == request);
                            var sender = req.sender;
                            oSelf.assertFalse(sender.responseReceived);
                            sender.requestStep++;
                            oSelf.assertTrue(sender.requestStep == index);
                        } catch (e) {
                            oSelf.handleAsyncTestError(e);
                        }
                    },
                    onResponse : function (req) {
                        try {
                            oSelf.assertTrue(req == request);
                            var sender = req.sender;
                            sender.responseReceived = true;
                            oSelf.assertTrue(sender.responseStep == index);
                            sender.responseStep--;
                        } catch (e) {
                            oSelf.handleAsyncTestError(e);
                        }
                    }
                }
            };
        },

        testAsyncCheckFilterCallOrder : function () {
            var req = {
                sender : {
                    classpath : this.$classpath,
                    responseReceived : false,
                    requestStep : 0,
                    responseStep : 3
                },
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/TestFile.txt", true),
                method : "GET",
                callback : {
                    fn : function () {
                        try {
                            this.assertTrue(req.sender.requestStep === 3);
                            this.assertTrue(req.sender.responseStep === 0);
                        } catch (e) {
                            this.handleAsyncTestError(e, false);
                        }
                        ioFiltersMgr.removeFilter(filter1);
                        ioFiltersMgr.removeFilter(filter2);
                        ioFiltersMgr.removeFilter(filter3);
                        this.notifyTestEnd("testAsyncCheckFilterCallOrder");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var filter1 = this._createCheckOrderFilter(1, req);
            var filter2 = this._createCheckOrderFilter(2, req);
            var filter3 = this._createCheckOrderFilter(3, req);
            ioFiltersMgr.addFilter(filter1);
            ioFiltersMgr.addFilter(filter2);
            ioFiltersMgr.addFilter(filter3);
            aria.core.IO.asyncRequest(req);
        }
    }
});
