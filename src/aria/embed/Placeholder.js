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
 * Placeholder widget
 * @class aria.embed.Placeholder
 * @extends aria.widgetLibs.BaseWidget
 */
Aria.classDefinition({
    $classpath : "aria.embed.Placeholder",
    $extends : "aria.widgetLibs.BaseWidget",
    $dependencies : ['aria.embed.CfgBeans', 'aria.utils.Html', 'aria.core.JsonValidator', 'aria.core.Log',
            'aria.utils.Dom', 'aria.html.Template', 'aria.html.HtmlLibrary', 'aria.embed.PlaceholderManager'],
    $statics : {
        INVALID_CONFIGURATION : "%1Configuration for widget is not valid."
    },
    $constructor : function (cfg, context, lineNumber) {
        // The parent constructor takes care of storing the config in this._cfg, the template context in this._context
        // and the line number in this._lineNumber
        this.$BaseWidget.constructor.apply(this, arguments);

        try {
            this._cfgOk = aria.core.JsonValidator.normalize({
                json : cfg,
                beanName : this._cfgBeanName
            }, true);
        } catch (e) {
            var logs = aria.core.Log;
            if (logs) {
                var error;
                for (var index = 0, l = e.errors.length; index < l; index++) {
                    error = e.errors[index];
                    error.message = logs.prepareLoggedMessage(error.msgId, error.msgArgs);
                }
                this.$logError(this.INVALID_CONFIGURATION, null, e);
            }
        }

        // Here, we build the path for the nested placeholder, for example placeholder1.placeholder2. ...
        var placeholderPath = "";
        var currentContext = context;
        while (currentContext) {
            if (currentContext.placeholderPath) {
                placeholderPath = currentContext.placeholderPath + ".";
                break;
            }
            currentContext = currentContext.parent;
        }
        this._placeholderPath = placeholderPath + this._cfg.name;

    },
    $destructor : function () {
        this.$BaseWidget.$destructor.apply(this, arguments);
    },
    $prototype : {

        _cfgBeanName : "aria.embed.CfgBeans.PlaceholderCfg",

        /**
         * Main widget entry-point. Write the widget markup for a non-container widget.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkup : function (out) {
            var placeholderManager = aria.embed.PlaceholderManager;
            if (this._cfgOk) {
                var typeUtil = aria.utils.Type;
                var htmlLibrary = aria.html.HtmlLibrary;

                var tagName = this._cfg.type;
                var markup = ['<', tagName];
                if (this._cfg.attributes) {
                    markup.push(' ' + aria.utils.Html.buildAttributeList(this._cfg.attributes));
                }
                markup.push('>');
                out.write(markup.join(''));

                // Process contents
                var placeholderPath = this._placeholderPath;
                var contents = placeholderManager.getContent(placeholderPath);

                for (var i = 0, ii = contents.length; i < ii; i++) {
                    var content = contents[i];
                    if (typeUtil.isString(content)) {
                        out.write(content);
                    } else {
                        // Assume json here (aria.html.beans.TemplateCfg)
                        var template = new aria.html.Template(content, this._context, this._lineNumber);
                        template.subTplCtxt.placeholderPath = placeholderPath;
                        out.registerBehavior(template);
                        template.writeMarkup(out);
                    }
                }

                // End tag
                out.write('</' + tagName + '>');
            }
        }
    }
});