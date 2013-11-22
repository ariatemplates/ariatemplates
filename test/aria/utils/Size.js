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
 * Test case for aria.utils.Size
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Size",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Size", "aria.core.JsonValidator", "aria.utils.DomBeans"],
    $prototype : {
        test_getFreeSize : function () {
            var document = Aria.$window.document;
            var element = document.createElement("div");

            element.style.cssText = ['display:block;', 'visibility:hidden;', 'width:36px;', 'height:36px;'].join('');

            var size = aria.utils.Size.getFreeSize(element);
            var isValidReturn = aria.core.JsonValidator.check(size, "aria.utils.DomBeans.Size");

            this.assertTrue(isValidReturn);

            // check the returned size is correct 25,25
            this.assertTrue((size.height == 36) && (size.width == 36));

            element = document.createElement("div");

            element.style.cssText = ['display:block;', 'visibility:hidden;'].join('');

            size = aria.utils.Size.getFreeSize(element);
            isValidReturn = aria.core.JsonValidator.check(size, "aria.utils.DomBeans.Size");
            this.assertTrue(isValidReturn);
            // check the returned size is correct 0, 0
            this.assertEquals(size.height, 0);
            this.assertEquals(size.width, 0);
        }
    }
});
