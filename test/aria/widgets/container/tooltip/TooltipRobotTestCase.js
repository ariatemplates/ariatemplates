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
    $classpath : "test.aria.widgets.container.tooltip.TooltipRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.container.tooltip.InnerTemplate",
            iframe : true,
            css : "top:0;left:0;width:200px;height:400px;"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // check that an error is raised because of the tooltip used as a container. Likewise, check that the
            // content has not been displayed
            this.assertErrorInLogs(this.testWindow.aria.widgets.container.Container.INVALID_USAGE_AS_CONTAINER);
            this.assertNull(this.testDiv.innerHTML.match(/TOOLTIP_AS_A_CONTAINER_IS_DEPRECATED/));

            var tooltipDiv = this.testWindow.aria.utils.Dom.getElementById("mouseOverMe");

            this.synEvent.move({
                to : tooltipDiv,
                duration : 500
            }, {
                x : 0,
                y : 0
            }, {
                fn : this._afterMove,
                scope : this
            });
        },

        _afterMove : function () {
            this.waitFor({
                condition : {
                    fn : this._checkTooltip,
                    scope : this
                },
                callback : {
                    fn : this._afterShowTooltip,
                    scope : this
                }
            });
        },

        _checkTooltip : function () {
            return this.testWindow.aria.utils.Dom.getElementById("testMe") != null;
        },

        _afterShowTooltip : function () {
            var DomUtil = this.testWindow.aria.utils.Dom;

            var tooltipAnchor = DomUtil.getElementById("mouseOverMe");
            var tooltipContent = DomUtil.getElementById("testMe");
            var contentGeometry = DomUtil.getGeometry(tooltipContent);
            var anchorGeometry = DomUtil.getGeometry(tooltipAnchor);
            var tooltipContainerWidth = DomUtil.getGeometry(tooltipContent.parentNode).width;

            var distance = Math.abs(contentGeometry.y - anchorGeometry.y);
            this.assertTrue(distance < 60, "Tooltip is too far from the anchor");
            this.assertTrue(tooltipContainerWidth >= 80, "Tooltip width is " + tooltipContainerWidth + " while minWidth was set to 80");
            this.assertTrue(tooltipContainerWidth <= 100, "Tooltip width is " + tooltipContainerWidth + " while maxWidth was set to 100");

            this.end();
        }
    }
});
