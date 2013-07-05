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
    $classpath : "test.aria.widgets.icon.IconTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {

        runTemplateTest : function () {

            var icon = this.getWidgetInstance("testIcon").getDom();

            this.synEvent.move({
                from : this.testWindow.aria.utils.Dom.getElementById("testSpan"),
                to : icon
            }, this.testWindow.aria.utils.Dom.getElementById("testSpan"), {
                fn : this._afterFirstMove,
                scope : this
            });
        },

        _afterFirstMove : function () {

            aria.core.Timer.addCallback({
                fn : this._afterFirstMoveWait,
                scope : this,
                delay : 500
            });
        },
        _afterFirstMoveWait : function () {

            this.assertEquals(this.getWidgetInstance("testTooltip")._popup.isOpen, true, "The tooltip was not displayed");

            var icon = this.getWidgetInstance("testIcon").getDom();

            this.synEvent.move({
                to : this.testWindow.aria.utils.Dom.getElementById("testSpan"),
                from : icon
            }, icon, {
                fn : this._afterSecondMove,
                scope : this
            });
        },

        _afterSecondMove : function () {
            aria.core.Timer.addCallback({
                fn : this._afterSecondMoveWait,
                scope : this,
                delay : 200
            });
        },
        _afterSecondMoveWait : function () {
            this.assertEquals(this.getWidgetInstance("testTooltip")._popup, null, "The tooltip was not closed");
            this.end();
        }

    }
});
