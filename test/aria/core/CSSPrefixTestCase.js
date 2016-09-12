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
    $classpath : "test.aria.core.CSSPrefixTest",
    $dependencies : ["aria.core.Browser", "aria.utils.Delegate"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        testAgainstBrowser : function () {
            if (aria.core.Browser.isChrome) {
                this.assertEquals(aria.utils.Delegate.vendorPrefix, "Webkit", "The CSS Prefix went wrong for Chrome");
            }
            if (aria.core.Browser.isFirefox) {
                // FF3 doesn't support animations
                if (aria.core.Browser.majorVersion !== 3) {
                    this.assertEquals(aria.utils.Delegate.vendorPrefix, "Moz", "The CSS Prefix went wrong for FireFox");
                }
            }
            if (aria.core.Browser.isIE10) {
                this.assertEquals(aria.utils.Delegate.vendorPrefix, "ms", "The CSS Prefix went wrong for IE10");
            }
        }
    }
});
