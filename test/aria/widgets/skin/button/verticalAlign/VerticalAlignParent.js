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
    $classpath : "test.aria.widgets.skin.button.verticalAlign.VerticalAlignParent",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.skin.button.verticalAlign.VerticalAlign"
        });

    },

    $prototype : {
        checkPosition : function(position) {
            var tpl = this.tpl = this.testDiv.getElementsByTagName("div")[0];
            var widgetDom = this.getElementsByClassName(tpl, "xWidget")[0];

            //var top = widgetDom.offsetTop;
            var height = widgetDom.offsetHeight;

            var skinName = aria.widgets.AriaSkin.skinName;
            var spans = widgetDom.getElementsByTagName("span");
            var innerDom;
            if (skinName == "atskin") {
                innerDom = this.getElementsByClassName(tpl, "xFrameContent")[0];
            } else {
                innerDom = spans[1];
            }

            // Check the position
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

            this.assertTrue(
                    difference >= 0 && difference <= errorMargin,
                    "The position of the button label should be on the " + position + " in the skin " + skinName
            );

        }
    }
});
