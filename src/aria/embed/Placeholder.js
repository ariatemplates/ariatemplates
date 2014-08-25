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
var ariaCoreJsonValidator = require("../core/JsonValidator");
var ariaHtmlTemplate = require("../html/Template");
var ariaEmbedPlaceholderManager = require("./PlaceholderManager");
var ariaUtilsArray = require("../utils/Array");
var ariaWidgetLibsBaseWidget = require("../widgetLibs/BaseWidget");
var ariaUtilsType = require("../utils/Type");


/**
 * Placeholder widget
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.embed.Placeholder",
    $extends : ariaWidgetLibsBaseWidget,
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.apply(this, arguments);

        this._cfgOk = ariaCoreJsonValidator.validateCfg(this._cfgBeanName, cfg);

        /**
         * Path of the placeholder that is recognized by the PlaceholderManager
         * @type String
         * @private
         */
        this._placeholderPath = this._getPlaceholderPath(context);

        /**
         * Id to give to the section that represents the container of the placeholder
         * @type String
         * @protected
         */
        this._sectionId = "p_" + this._createDynamicId();

        /**
         * Listener for the contentChange event raised by the Placeholdermanager
         * @type aria.core.CfgBeans:Callback
         * @private
         */
        this._onContentChangeListener = {
            fn : this._onContentChange,
            scope : this
        };

        /**
         * Shortcut to the aria.embed.PlaceholderManager singleton
         * @type aria.embed.PlaceholderManager
         * @private
         */
        this._placeholderManager = ariaEmbedPlaceholderManager;

        this._placeholderManager.$addListeners({
            "contentChange" : this._onContentChangeListener
        });

    },
    $destructor : function () {

        this._placeholderManager.$removeListeners({
            "contentChange" : this._onContentChangeListener
        });
        this._onContentChangeListener = null;

        this.$BaseWidget.$destructor.apply(this, arguments);
    },
    $prototype : {

        /**
         * Name of the bean for the configuration
         * @type String
         * @private
         */
        _cfgBeanName : "aria.embed.CfgBeans.PlaceholderCfg",

        /**
         * Main widget entry-point. Write the widget markup for a non-container widget.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkup : function (out) {
            if (this._cfgOk) {
                var cfg = this._cfg;
                var sectionCfg = {
                    id : this._sectionId,
                    type : cfg.type,
                    attributes : cfg.attributes
                };

                out.beginSection(sectionCfg);
                this._writePlaceholderContent(out);
                out.endSection();
            }
        },

        /**
         * Write the content of the placeholder
         * @param {aria.templates.MarkupWriter} out
         * @private
         */
        _writePlaceholderContent : function (out) {
            var typeUtil = ariaUtilsType, placeholderManager = ariaEmbedPlaceholderManager;
            var placeholderPath = this._placeholderPath;
            var contents = placeholderManager.getContent(placeholderPath);
            for (var i = 0, ii = contents.length; i < ii; i++) {
                var content = contents[i];
                if (typeUtil.isString(content)) {
                    out.write(content);
                } else {
                    // Assume json here (aria.html.beans.TemplateCfg)
                    var template = new ariaHtmlTemplate(content, this._context, this._lineNumber);
                    template.subTplCtxt.placeholderPath = placeholderPath;
                    out.registerBehavior(template);
                    template.writeMarkup(out);
                }
            }
        },

        /**
         * Method that is called when the Placeholder Manager raises the contentChange event
         * @param {Object} event Contains the placeholderpaths whose content has changed
         * @private
         */
        _onContentChange : function (event) {
            var paths = event.placeholderPaths;
            if (ariaUtilsArray.contains(paths, this._placeholderPath)) {
                var newSection = this._context.getRefreshedSection({
                    section : this._sectionId,
                    writerCallback : {
                        fn : this._writePlaceholderContent,
                        scope : this
                    }
                });
                this._context.insertSection(newSection);
            }
        },

        /**
         * Computes the path of the placeholder by combining context information with the placeholder name
         * @return {String} path of the placeholder
         * @private
         */
        _getPlaceholderPath : function () {
            var placeholderPath = "";
            var currentContext = this._context;
            while (currentContext) {
                if (currentContext.placeholderPath) {
                    placeholderPath = currentContext.placeholderPath + ".";
                    break;
                }
                currentContext = currentContext.parent;
            }
            return placeholderPath + this._cfg.name;
        }
    }
});
