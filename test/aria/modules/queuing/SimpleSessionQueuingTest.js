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
 * Test for the SimpleSessionQueuing class
 */
Aria.classDefinition({
    $classpath : 'test.aria.modules.queuing.SimpleSessionQueuingTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.modules.queuing.SimpleSessionQueuing', 'test.aria.core.mock.IOMock',
            'aria.modules.urlService.PatternURLCreationImpl', 'aria.modules.RequestMgr',
            /* The following class must be loaded before this test starts because when using IOMock
             * no request can be done later. */
            'aria.modules.requestHandler.JSONRequestHandler'],

    $constructor : function () {
        this.$TestCase.constructor.call(this);

        /**
         * Status for request (check that everything have been called)
         * @type Object
         */
        this.finishStatus = {
            req1 : false,
            req3 : false
        };

        /**
         * test instance
         * @type aria.modules.queuing.SimpleSessionQueuing
         */
        this._simpleActionQueuingInstance = null;

    },
    $prototype : {

        setUp : function () {
            this.overrideClass('aria.core.IO', test.aria.core.mock.IOMock);
        },

        tearDown : function () {
            this.resetClassOverrides();
            this._simpleActionQueuingInstance.$dispose();
        },

        testAsyncQueuing : function () {
            this._simpleActionQueuingInstance = new aria.modules.queuing.SimpleSessionQueuing();
            var session = {
                id : '1234'
            };

            // first request : should go through
            var status = this._simpleActionQueuingInstance.pushRequest({
                moduleName : "",
                actionName : 'req1',
                session : session
            }, {}, {
                fn : this._testAsyncQueuingResponse,
                scope : this
            });

            this.assertTrue(status === aria.modules.RequestMgr.EXECUTE_STATUS, "Wrong status for first request. Expected EXECUTE_STATUS, get " +
                    status);

            // second request on same session id should be delayed
            status = this._simpleActionQueuingInstance.pushRequest({
                moduleName : "",
                actionName : 'req2',
                session : session
            }, {}, {
                fn : this._testAsyncQueuingResponse2,
                scope : this
            });

            this.assertTrue(status === aria.modules.RequestMgr.QUEUE_STATUS, "Wrong status for second request. Expected QUEUE_STATUS, get " +
                    status);

            session.id = '3456';

            // third request on different session id should go through
            status = this._simpleActionQueuingInstance.pushRequest({
                moduleName : "",
                actionName : 'req3',
                session : session
            }, {}, {
                fn : this._testAsyncQueuingResponse3,
                scope : this
            });

            this.assertTrue(status === aria.modules.RequestMgr.EXECUTE_STATUS, "Wrong status for third request. Expected EXECUTE_STATUS, get " +
                    status);

        },

        _testAsyncQueuingResponse : function () {
            this.finishStatus.req1 = true;
        },

        _testAsyncQueuingResponse2 : function () {
            // this one should be the last
            this.assertTrue(this.finishStatus.req1, "First request did not finished");
            this.assertTrue(this.finishStatus.req3, "Third request did not finished");
            this.notifyTestEnd("testAsyncQueuing");
        },

        _testAsyncQueuingResponse3 : function () {
            this.finishStatus.req3 = true;
        }

    }
});
