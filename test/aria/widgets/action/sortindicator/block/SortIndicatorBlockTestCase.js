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
    $classpath : "test.aria.widgets.action.sortindicator.block.SortIndicatorBlockTestCase",
    $dependencies : ["aria.templates.View", "aria.widgets.action.SortIndicator"],
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {

        runTemplateTest : function () {

            this.checkBlockProperty(this.getWidgetInstance('mySIBlock'), true);
            this.checkBlockProperty(this.getWidgetInstance('mySINoBlock'), false);

            this.templateCtxt._tpl.aview.$dispose();
            this.end();

        },

        checkBlockProperty : function (widget, isBlock) {

            var domElt = widget.getDom();

            if (isBlock) {
                this.assertTrue(aria.utils.Dom.getStyle(domElt, "display") == 'block', "display should be 'block'");
            } else {
                this.assertTrue(aria.utils.Dom.getStyle(domElt, "display") == 'inline-block', "display should be 'inline-block'");
            }
        }

    }
});
