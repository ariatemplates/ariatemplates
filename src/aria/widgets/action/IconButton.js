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
var Aria = require("../../Aria");
var ariaWidgetsIcon = require("../Icon");
var ariaWidgetsActionButton = require("./Button");


/**
 * Class definition for the button widget.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.action.IconButton",
    $extends : ariaWidgetsActionButton,
    /**
     * ActionWidget constructor
     * @param {aria.widgets.CfgBeans:ActionWidgetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt, lineNumber) {
        this.$Button.constructor.apply(this, arguments);

        /**
         * Instance of the Icon widget used by this widget.
         * @type aria.widgets.Icon
         * @protected
         */
        this._icon = new ariaWidgetsIcon({
            icon : cfg.icon,
            sourceImage : cfg.sourceImage
        }, ctxt, lineNumber);
    },
    $destructor : function () {
        this._icon.$dispose();
        this.$Button.$destructor.call(this);
    },
    $prototype : {
        /**
         * Overwrite the Button class content markup method to write the icon
         * @param {aria.templates.MarkupWriter} out Markup writer
         * @private
         */
        _widgetMarkupContent : function (out) {
            this._icon.writeMarkup(out);
        }
    }
});
