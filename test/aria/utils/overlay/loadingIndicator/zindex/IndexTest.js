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
    $classpath : "test.aria.utils.overlay.loadingIndicator.zindex.IndexTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            var document = Aria.$window.document;
            // overlay is last element inserted in DOM
            var bodyChilds = document.body.childNodes;
            var overlay = bodyChilds[bodyChilds.length - 1];
            // IE text nodes
            if (overlay.nodeType != 1) {
                overlay = overlay.previousSibling;
            }
            this.assertTrue(parseInt(overlay.style.zIndex, 10) > 40000, "overlay zIndex makes it non visible");

            this.notifyTemplateTestEnd();
        }
    }
});
