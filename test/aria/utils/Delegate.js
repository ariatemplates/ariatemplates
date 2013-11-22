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
 * Test case for aria.utils.Delegate
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Delegate",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Delegate", "aria.utils.Dom", "aria.utils.Function"],
    $constructor : function () {
        /**
         * Testing area
         * @protected
         * @type HTMLElement
         */
        this._testArea = null;

        this._delegateFlag1 = 0;
        this._delegateFlag2 = 0;
        this._delegateFlag3 = 0;

        this.$TestCase.constructor.call(this);

        // used to raise an error
        this.myData = {
            myProperty : 0
        };
    },
    $prototype : {
        setUp : function () {
            this._testArea = aria.utils.Dom.getElementById("TESTAREA");
        },

        tearDown : function () {
            if (this._testArea) {

                this._testArea.innerHTML = '';
                this._testArea = null;
            }
        },

        /**
         * Test delegation : add element in the dom,
         */
        test_delegate : function () {
            /**
             * <pre>
             *
             *  STRUCTURE:
             * - div with event delegation (1)
             *     - Div with event delegation blocking event propagation (2)
             *         - Div with event delegation (3)
             *             - input with id delegateTest
             * </pre>
             */

            var delegationId1 = aria.utils.Delegate.add({
                fn : this._delegate1,
                scope : this
            });
            var delegationId2 = aria.utils.Delegate.add({
                fn : this._delegate2,
                scope : this
            });
            var delegationId3 = aria.utils.Delegate.add({
                fn : this._delegate3,
                scope : this
            });
            this._testArea.innerHTML = "<div " + aria.utils.Delegate.getMarkup(delegationId1) + ">" + "<div "
                    + aria.utils.Delegate.getMarkup(delegationId2) + ">" + "<div "
                    + aria.utils.Delegate.getMarkup(delegationId3) + ">"
                    + "<input type='button' id='test.aria.utils.Delegate.test_delegate' />" + "</div></div></div>";

            // Check delegation -> markup is ok
            var input = aria.utils.Dom.getElementById("test.aria.utils.Delegate.test_delegate");
            input.click();

            this.assertEquals(this._delegateFlag1, 0);
            this.assertEquals(this._delegateFlag2, 1);
            this.assertEquals(this._delegateFlag3, 1);

            // remove blocking one
            aria.utils.Delegate.remove(delegationId2);
            input.click();

            this.assertEquals(this._delegateFlag1, 1);
            this.assertEquals(this._delegateFlag2, 1);
            this.assertEquals(this._delegateFlag3, 2);

            aria.utils.Delegate.remove(delegationId1);

            this.myData = null;
            input.click();

            this.assertErrorInLogs(aria.utils.Delegate.DELEGATE_UTIL_CALLBACK_FAIL);

            aria.utils.Delegate.remove(delegationId3);

        },

        _delegate1 : function () {
            this._delegateFlag1++;
        },

        _delegate2 : function () {
            this._delegateFlag2++;
            // stop bubbling
            return false;
        },

        _delegate3 : function () {
            // this will fail
            var a = this.myData.myProperty;
            this._delegateFlag3++;
        }

    }
});
