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

/**
 * To test that the sandbox is clean correctly, we force it to be disposed.<br>
 * After that we assert that any stubbed element is back to its original behavior.
 */
Aria.classDefinition({
    $classpath: "test.aria.jsunit.sinon.Sandbox",
    $extends: "aria.jsunit.SinonTestCase",
    $prototype: {
        testSandboxClean: function () {
            var object = {
                say : function (number) {
                    return number;
                }
            };

            // We always want to return 1 in the sandbox
            this.$sinon.stub(object, "say").returns(1);

            this.assertEquals(object.say(2), 1, "Stub should return %2, got %1");

            // Now restore the sandbox, this shouldn't be called directly, it's exposed only for testing
            this.__restoreSandbox();

            this.assertEquals(object.say(3), 3, "Stub after restore should return %2, got %1");
        }
    }
});
