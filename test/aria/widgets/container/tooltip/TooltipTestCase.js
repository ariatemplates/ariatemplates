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
    $classpath : "test.aria.widgets.container.tooltip.TooltipTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.container.tooltip.InnerTemplate",
            iframe : true,
            cssText : "width:200px;height:200px;border:1px solid blue;"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var tooltipDiv = this.testWindow.aria.utils.Dom.getElementById("mouseOverMe");

            this.testWindow.aria.jsunit.SynEvents.move({
                to : tooltipDiv,
                duration : 500
            }, {
                x : 0,
                y : 0
            }, {
                fn : function () {
                    // Wait for the tooltip to appear
                    aria.core.Timer.addCallback({
                        fn : this._afterMove,
                        scope : this,
                        delay : 100
                    });
                },
                scope : this
            });
        },

        _afterMove : function () {
            var DomUtil = this.testWindow.aria.utils.Dom;

            var tooltipAnchor = DomUtil.getElementById("mouseOverMe");
            var tooltipContent = DomUtil.getElementById("testMe");
            var contentGeometry = DomUtil.getGeometry(tooltipContent);
            var anchorGeometry = DomUtil.getGeometry(tooltipAnchor);

            var distance = Math.abs(contentGeometry.y - anchorGeometry.y);
            this.assertTrue(distance < 60, "Tooltip is too far from the anchor");

            this.end();
        }
    }
});