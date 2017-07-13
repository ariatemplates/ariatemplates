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
    $classpath : "test.aria.utils.overlay.loadingIndicator.zindex.IndexTestCase",
    $extends : "aria.jsunit.TemplateTestCase",

    $constructor: function () {
        this.$TemplateTestCase.constructor.apply(this, arguments);

        this.setTestEnv({
            iframe : true
        });
    },

    $prototype : {
        runTemplateTest : function () {
            var document = this.testDocument;
            // overlay is last element inserted in DOM
            var bodyChilds = document.body.childNodes;
            var overlay = bodyChilds[bodyChilds.length - 1];
            // IE text nodes
            if (overlay.nodeType != 1) {
                overlay = overlay.previousSibling;
            }
            overlay.style.backgroundColor = '#000'; // to make it visible for manual testing
            this.assertTrue(parseInt(overlay.style.zIndex, 10) >= 40000, "overlay zIndex is not high enough and thus not visible, should be more than 40000 but has " + overlay.style.zIndex + " instead");

            this.notifyTemplateTestEnd();
        }
    }
});
