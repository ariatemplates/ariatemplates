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
    $classpath : "test.aria.widgets.skin.button.verticalAlign.VerticalAlignParentBase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.widgets.AriaSkinInterface"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.skin.button.verticalAlign.VerticalAlign"
        });

    },

    $prototype : {

        getFrame : function() {
            return aria.widgets.AriaSkinInterface.getSkinClasses("Button").std.states.normal.frame;
        },

        getElements : function() {
            var tpl = this.tpl = this.testDiv.getElementsByTagName("div")[0];
            var widgetDom = this.getElementsByClassName(tpl, "xWidget")[0];
            var spans = widgetDom.getElementsByTagName("span");
            var innerDom = this.getElementsByClassName(tpl, "xFrameContent")[0] || spans[1];
            var skinName = aria.widgets.AriaSkin.skinName;

            return {
                skinName : skinName,
                widgetDom : widgetDom,
                innerDom : innerDom
            };

        },
        checkPosition : function(position) {

            var elements = this.getElements();
            var widgetDom = elements.widgetDom;
            var innerDom = elements.innerDom;

            // Check the position
            var height = widgetDom.offsetHeight;
            var difference;
            var errorMargin = 10;
            if (position == 'top') {
                difference = innerDom.offsetTop;
            } else if (position == 'bottom') {
                difference = height - (innerDom.offsetTop + innerDom.offsetHeight);
            } else if  (position == 'middle') {
                difference = innerDom.offsetTop - ((height / 2) - (innerDom.offsetHeight / 2));
                errorMargin = 5;
            } else {
                this.assertTrue(false, 'Position ' + position + ' not managed');
                return;
            }

            this.assertTrue(innerDom.offsetHeight < 25, "The inner dom height is too high (" + innerDom.offsetHeight + " pixels found)");
            this.assertTrue(
                    difference >= 0 && difference <= errorMargin,
                    "The position of the button label should be on the " + position + " in the skin " + elements.skinName
            );

        },

        checkInnerHeight : function(height) {
            var elements = this.getElements();
            var widgetDom = elements.widgetDom;
            var innerDom = elements.innerDom;

            this.assertEquals(innerDom.offsetHeight, height, "The inner dom height should be %2, %1 found");
            var lineHeight = aria.utils.Dom.getStyle(innerDom, 'lineHeight');
            this.assertEquals(lineHeight, height + "px", "The inner dom line-height should be %2, %1 found");


        }
    }
});
