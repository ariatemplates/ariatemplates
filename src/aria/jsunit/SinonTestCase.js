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
    $classpath: "aria.jsunit.SinonTestCase",
    $extends: "aria.jsunit.TestCase",
    $dependencies: ["aria.jsunit.Sinon"],
    $constructor : function () {
        /**
         * Exposes the Sinon sandbox properties. A Sinon sandbox is injected here.<br>
         * It provides:
         * <ul>
         *     <li>spy</li>
         *     <li>mocks</li>
         *     <li>stub</li>
         * </ul>
         * For more information refer to http://sinonjs.org/docs
         * @type {Object}
         */
        this.$sinon = {};

        this.$TestCase.constructor.apply(this, arguments);
    },
    $prototype: function () {
        /**
         * Sinon Sandbox, it's kept private in this closure
         */
        var sandbox;

        return {
            /**
             * This is the start method, create a sandbox before executing any test method
             */
            run : function () {
                sandbox = aria.jsunit.Sinon.sandbox.create({
                    injectInto: this.$sinon,
                    properties: ["spy", "stub", "mock"],
                    useFakeTimers: false,
                    useFakeServer: false
                });

                this.$TestCase.run.apply(this, arguments);
            },

            /**
             * This is called when the last test method completes. Restore the previously created sandbox
             * @protected
             */
            _onSequencerEnd : function () {
                this.__restoreSandbox();

                this.$TestCase._onSequencerEnd.apply(this, arguments);
            },

            /**
             * Restore the sandbox. This method shouldn't be called manually, it's exposed only for the sake
             * of testing.
             * @private
             */
            __restoreSandbox : function () {
                if (sandbox) {
                    sandbox.restore();
                    sandbox = null;
                }
                this.$sinon = null;
            }
        };
    }
});
