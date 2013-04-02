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
    $classpath : "test.aria.core.CacheTest",
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        testAsyncGetFileName : function () {
            // Load a template
            Aria.load({
                templates : ["test.aria.core.test.TemplateWithCSS"],
                oncomplete : {
                    fn : this._assertGetFileName,
                    scope : this
                }
            });
        },

        _assertGetFileName : function () {
            var classpaths = ["test.aria.core.test.TemplateWithCSS", "test.aria.core.test.TemplateWithCSSScript",
                    "test.aria.core.test.CSSOfATemplate", "test.aria.core.test.MacroLibrary",
                    "test.aria.core.test.CSSOfATemplateCSSLib", "test.aria.core.test.TextOfATemplate",
                    "test.aria.core.test.ResourceOfATemplate", "some.other.class", null];

            var expected = ["test/aria/core/test/TemplateWithCSS.tpl", "test/aria/core/test/TemplateWithCSSScript.js",
                    "test/aria/core/test/CSSOfATemplate.tpl.css", "test/aria/core/test/MacroLibrary.tml",
                    "test/aria/core/test/CSSOfATemplateCSSLib.cml", "test/aria/core/test/TextOfATemplate.tpl.txt",
                    "test/aria/core/test/ResourceOfATemplate.js", null, null];
            try {
                for (var i = 0, len = classpaths.length; i < len; i += 1) {
                    this.assertTrue(aria.core.Cache.getFilename(classpaths[i]) == expected[i], "Classpath "
                            + classpaths[i] + " doesn't match the expected value");
                }
            } catch (ex) {}

            this.notifyTestEnd("testAsyncGetFileName");
        }
    }
});
