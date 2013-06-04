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
    $classpath : "test.aria.templates.printing.PrintTestCase",
    $extends : "aria.jsunit.TemplateUITestCase",
    $constructor : function () {
        this.$TemplateUITestCase.constructor.call(this);
    },
    $prototype : {

        _enablePrintRenderingForTag : function (tag) {
            // comparisons to null are important as the empty string should not pass the comparison
            var currentMediaAttribute = tag.getAttribute("media");
            var originalMediaAttribute = tag['aria:originalMedia'] != null
                    ? tag['aria:originalMedia']
                    : currentMediaAttribute;
            if (originalMediaAttribute != null) {
                var newMediaAttribute = originalMediaAttribute;
                if (!/(^|,)all($|,)/.test(originalMediaAttribute)) {
                    // the style sheet does not apply to all media, so we need either to enable it or to disable it
                    var enable = /(^|,)print($|,)/.test(originalMediaAttribute);
                    newMediaAttribute = enable ? "all" : "";
                }
                if (currentMediaAttribute !== newMediaAttribute) {
                    tag.setAttribute("media", newMediaAttribute);
                }
                if (newMediaAttribute === originalMediaAttribute) {
                    delete tag['aria:originalMedia'];
                } else {
                    tag['aria:originalMedia'] = originalMediaAttribute;
                }
            }
        },

        _disablePrintRenderingForTag : function (tag) {
            // comparisons to null are important as the empty string should not pass the comparison
            var oldMediaAttribute = tag['aria:originalMedia'];
            if (oldMediaAttribute != null) {
                // restore original media setting
                tag.setAttribute("media", oldMediaAttribute);
                delete tag['aria:originalMedia'];
            }
        },

        _setPrintRendering : function (enable) {
            var document = Aria.$window.document;
            var fn = (enable ? this._enablePrintRenderingForTag : this._disablePrintRenderingForTag);
            var tags = document.getElementsByTagName("link");
            for (var i = 0, l = tags.length; i < l; i++) {
                var tag = tags[i];
                if (tag.getAttribute("rel") != "stylesheet") {
                    continue;
                }
                fn.call(this, tag);
            }
            tags = document.getElementsByTagName("style");
            for (var i = 0, l = tags.length; i < l; i++) {
                var tag = tags[i];
                fn.call(this, tag);
            }
        },

        runTemplateTest : function () {
            this._setPrintRendering(true);
            this.capture("printing", {
                fn : this._runTemplateTestEnd,
                scope : this,
                width : 800,
                height : 800
            });
        },

        _runTemplateTestEnd : function () {
            this._setPrintRendering(false);
            this.notifyTemplateTestEnd();
        }
    }
});
