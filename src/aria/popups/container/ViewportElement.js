/*
 * Copyright 2015 Amadeus s.a.s.
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
var Aria = require("ariatemplates/Aria");
var DomUtils = require("../../utils/Dom");
var Viewport = require("./Viewport");

module.exports = Aria.classDefinition({
    $classpath : "aria.popups.container.ViewportElement",
    $extends : require("./DomElement"),
    $constructor : function (parentContainer) {
        this.parentContainer = parentContainer;
        var childContainer = parentContainer.ownerDocument.createElement("div");
        childContainer.style.position = "absolute";
        parentContainer.appendChild(childContainer);
        this.$DomElement.$constructor.call(this, childContainer);
        this._updateChildPosition();
    },
    $destructor : function () {
        this.parentContainer.removeChild(this.container);
        this.parentContainer = null;
        this.$DomElement.$destructor.call(this);
    },
    $prototype : {
        _updateChildPosition : function () {
            var viewportSize = Viewport.getClientSize();
            var parentPosition = DomUtils.calculatePosition(this.parentContainer);
            var containerStyle = this.container.style;
            containerStyle.left = (-parentPosition.left) + "px";
            containerStyle.top = (-parentPosition.top) + "px";
            containerStyle.width = viewportSize.width + "px";
            containerStyle.height = viewportSize.height + "px";
        },

        _getGeometry : function () {
            this._updateChildPosition();
            return this.$DomElement._getGeometry.call(this);
        }
    }
});
