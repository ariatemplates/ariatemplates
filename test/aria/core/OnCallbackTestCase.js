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
 * Test for the $on callback
 */
Aria.classDefinition({
    $classpath : "test.aria.core.OnCallbackTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Callback", "test.aria.core.FakeEvent"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.callback = {};
    },
    $destructor : function () {
        this.callback.$dispose();
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {

        testOnCallback : function () {
            this.callback = new aria.utils.Callback({
                fn : this._internalCallback,
                scope : {test : this},
                args : 15
            });

            test.aria.core.FakeEvent.$on({
                'fakeevent' : this.callback,
                scope : this
            });

            test.aria.core.FakeEvent.$raiseEvent({
                name : 'fakeevent',
                arg : 12
            });
        },

        _internalCallback : function (evt, args) {
            this.test.assertTrue(evt.arg == 12);
            this.test.assertTrue(args == 15);
        }
    }
});
