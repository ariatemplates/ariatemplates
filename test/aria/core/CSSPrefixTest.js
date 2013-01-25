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
    $classpath : 'test.aria.core.CSSPrefixTest',
    $dependencies : ['aria.core.Browser', 'aria.utils.Delegate'],
    $extends : "aria.jsunit.TestCase",
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $destructor : function () {
        this.$TestCase.$destructor.call(this)
    },
    $prototype : {
        setUp : function () {
            this.Browser = aria.core.Browser;
            this.Delegate = aria.utils.Delegate;

        },
        tearDown : function () {
            this.Browser = null;
            this.Delegate = null;
        },
        testAgainstBrowser : function () {
            if (this.Browser.isChrome) {
                this.assertTrue(this.Delegate.vendorPrefix == "Webkit", "The CSS Prefix went wrong for IE10");
            }
            if (this.Browser.isFirefox) {
                this.assertTrue(this.Delegate.vendorPrefix == "Moz", "The CSS Prefix went wrong for FireFox");
            }
            if (this.Browser.isIE10) {
                this.assertTrue(this.Delegate.vendorPrefix == "ms", "The CSS Prefix went wrong for IE10");
            }
        }
    }

})