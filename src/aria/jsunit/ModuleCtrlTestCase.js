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
 * Test case for module controllers should extend this class. It provides a log of connection requests and responses and
 * a log of events.
 */
Aria.classDefinition({
    $classpath : 'aria.jsunit.ModuleCtrlTestCase',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.jsunit.TestMsgHandler', 'aria.modules.RequestMgr'],
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        // a module controller test case manages an additional kind of logs for connection sessions
        /**
         * Array of aria.jsunit.ConnectionSession objects each containing a request to the server and its associated
         * response.
         * @type Array
         */
        this.cxLogs = [];

        // we pass a reference to this so the TestMsgHandler can access it during initialization
        aria.core.IOFiltersMgr.addFilter({
            classpath : 'aria.jsunit.TestMsgHandler',
            initArgs : this
        });
    },

    $destructor : function () {
        aria.core.IOFiltersMgr.removeFilter({
            classpath : 'aria.jsunit.TestMsgHandler',
            initArgs : this
        });
        this.cxLogs = null;
        this.evtLogs = null;
        this.$TestCase.$destructor.call(this);
    },

    $prototype : {
        /**
         * Clears both connection logs and call the parent's implementation.
         */
        clearLogs : function () {
            while (this.cxLogs.length > 0) {
                this.cxLogs.pop().$dispose();
            }
            this.$TestCase.clearLogs.apply(this);
        },

        /**
         * Use registerObject defined in aria.jsunit.Assert
         * @deprecated
         */
        registerController : function (mc) {
            this.registerObject(mc);
        },

        /**
         * See assertEventFired and assertEventNotFired
         * @deprecated
         */
        assertEvent : function (evtName, msg) {
            msg = msg || "Event " + evtName + " not fired";
            this.assertEventFired(evtName, msg);
        },

        /**
         * Asserts that there is no error in the logs (connection and event)
         */
        assertLogsClean : function (msg) {
            msg = msg || "assertLogsClean failed";
            this.assertFalse(this.__hasErrorInLogs(), msg);
        },

        /**
         * Negative version of assertLogsClean
         */
        assertLogsNotClean : function (msg) {
            msg = msg || "assertLogsNotClean failed";
            this.assertTrue(this.__hasErrorInLogs(), msg);
        },

        /**
         * Returns true if an error is found in the logs.
         * @private
         * @return {Boolean}
         */
        __hasErrorInLogs : function () {
            for (var i = 0; i < this.evtLogs.length; i++) {
                if (this.evtLogs[i].name == "error") {
                    return true;
                }
            }
            for (var j = 0; j < this.cxLogs.length; j++) {
                if (this.cxLogs[j].ioResponse.error != null) {
                    return true;
                }
            }
            return false;
        }
    }
});
