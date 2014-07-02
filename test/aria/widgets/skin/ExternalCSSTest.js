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
 * Test case for aria.widgets.Icon
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.skin.ExternalCSSTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.widgets.AriaSkinInterface"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        testAsyncExternalCSSTest : function () {
            var head = Aria.$window.document.getElementsByTagName('head')[0].innerHTML;
            this.assertTrue(head.search('ExternalStyle.css') !== -1, 'The external css file has not been loaded');
            this.notifyTestEnd();
        }
    }
});
