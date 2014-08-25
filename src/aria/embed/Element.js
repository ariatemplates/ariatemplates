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
var Aria = require("../Aria");
require("./CfgBeans");
var ariaUtilsHtml = require("../utils/Html");
var ariaCoreJsonValidator = require("../core/JsonValidator");
require("../core/Log");
var ariaUtilsDom = require("../utils/Dom");
var ariaWidgetLibsBaseWidget = require("../widgetLibs/BaseWidget");


/**
 * Element widget for the Embed Lib
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.embed.Element",
    $extends : ariaWidgetLibsBaseWidget,
    $constructor : function (cfg, context, lineNumber) {
        // The parent constructor takes care of storing the config in this._cfg, the template context in this._context
        // and the line number in this._lineNumber
        this.$BaseWidget.constructor.apply(this, arguments);


        this._cfgOk = ariaCoreJsonValidator.validateCfg(this._cfgBeanName, cfg);

    },
    $destructor : function () {
        if (this._domId) {
            /* BACKWARD COMATIBILITY BEGIN */
            // typo on onEmbeddedElementDispose
            if (this._cfg.controller.onEmbededElementDispose) {
                this.$logWarn("onEmbededElementDispose has been deprecated, please use onEmbeddedElementDispose");
                this._cfg.controller.onEmbededElementDispose(ariaUtilsDom.getElementById(this._domId), this._cfg.args);
            } else {
            /* BACKWARD COMATIBILITY END */
                this._cfg.controller.onEmbeddedElementDispose(ariaUtilsDom.getElementById(this._domId), this._cfg.args);
            /* BACKWARD COMATIBILITY BEGIN */
            }
            /* BACKWARD COMATIBILITY END */
            // When the backward compatibility is removed, only the else should remain
        }
        this.$BaseWidget.$destructor.apply(this, arguments);
    },
    $prototype : {

    _cfgBeanName : "aria.embed.CfgBeans.ElementCfg",

        /**
         * Main widget entry-point. Write the widget markup for a non-container widget.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkup : function (out) {
            if (this._cfgOk) {
                this._domId = this._createDynamicId();
                var tagName = this._cfg.type;
                var markup = ['<', tagName, ' id="', this._domId, '"'];
                if (this._cfg.attributes) {
                    markup.push(' ' + ariaUtilsHtml.buildAttributeList(this._cfg.attributes));
                }
                markup.push('></' + tagName + '>');
                out.write(markup.join(''));
            }
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM.
         */
        initWidget : function () {
            if (this._cfgOk) {
                /* BACKWARD COMATIBILITY BEGIN */
                // typo on onEmbeddedElementDispose
                if (this._cfg.controller.onEmbededElementCreate) {
                    this.$logWarn("onEmbededElementCreate has been deprecated, please use onEmbeddedElementCreate");
                    this._cfg.controller.onEmbededElementCreate(ariaUtilsDom.getElementById(this._domId), this._cfg.args);
                } else {
                /* BACKWARD COMATIBILITY END */
                    this._cfg.controller.onEmbeddedElementCreate(ariaUtilsDom.getElementById(this._domId), this._cfg.args);
                /* BACKWARD COMATIBILITY BEGIN */
                }
                /* BACKWARD COMATIBILITY END */
                // When the backward compatibility is removed, only the else should remain
            }
        }
    }
});
