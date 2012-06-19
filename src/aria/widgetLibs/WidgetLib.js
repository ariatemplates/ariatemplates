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
 * Base class for widget libraries.
 */
Aria.classDefinition({
    $classpath : 'aria.widgetLibs.WidgetLib',
    $statics : {
        UNKWOWN_WIDGET : "Unknown widget name in the library.",
        ERROR_WIDGET_INIT : "Template %1, line %2: an error occurred while initializing widget %3. Please check the name and classpath of the widget in the library, the constructor of the widget and its %4 method."
    },
    $prototype : {

        /**
         * Map of all the widgets in the library. Keys in the map are widget names as they can be used in templates.
         * Values are the corresponding classpaths.
         * @type Object
         */
        widgets : {},

        /**
         * Return a list of dependencies which must be loaded before a widget can be used.
         * @param {String} widgetName the name of the widget - e.g. TextField
         * @param {Boolean} includeLoaded [optional, default: false] if true, also include dependencies which are
         * already loaded
         * @return {Array} array of classpaths which should be loaded so that the widget can be used. Must return null
         * if the widget does not exist. Return an empty array if the widget is already usable and includeLoaded is
         * false.
         */
        getWidgetDependencies : function (widgetName, includeLoaded) {
            var classpath = this.widgets[widgetName];
            if (classpath == null) {
                return null;
            }
            if (includeLoaded || Aria.getClassRef(classpath) == null) {
                return [classpath];
            }
            return [];
        },

        /**
         * Function called by the template engine to process a widget markup
         * @param {String} widgetName the name of the widget - e.g. TextField
         * @param {aria.templates.MarkupWriter} out the output writer
         * @param {Object} cfg
         * @param {Number} lineNbr line number of the widget in the template
         */
        processWidgetMarkup : function (widgetName, out, cfg, lineNbr) {
            var classpath = this.widgets[widgetName];
            try {
                if (classpath) {
                    // default object if cfg was null
                    if (!cfg) {
                        cfg = {};
                    }
                    var widgetClass = Aria.getClassRef(classpath);
                    var instance = new widgetClass(cfg, out.tplCtxt, lineNbr);
                    out.registerBehavior(instance);
                    instance.writeMarkup(out);
                } else {
                    // This should normally never happen, as the error will probably be caught after the call
                    // of getWidgetDependencies by the TplClassGenerator (see the "@" statement in
                    // aria.templates.Statements).
                    throw this.UNKWOWN_WIDGET;
                }
            } catch (error) {
                out.write("#Error in widget:" + widgetName + "#");
                this.$logError(this.ERROR_WIDGET_INIT, [out.tplCtxt.tplClasspath, lineNbr, widgetName, "writeMarkup"], error);
            }
        },

        /**
         * Function called by the template engine to process a container widget markup
         * @param {String} widgetName the name of the widget - e.g. TextField
         * @param {aria.templates.MarkupWriter} out the output writer
         * @param {Object} cfg
         * @param {Number} lineNbr line number of the widget in the template
         */
        processWidgetMarkupBegin : function (widgetName, out, cfg, lineNbr) {
            var classpath = this.widgets[widgetName];
            try {
                if (classpath) {
                    // default object if cfg was null
                    if (!cfg) {
                        cfg = {};
                    }
                    var widgetClass = Aria.getClassRef(classpath);
                    var instance = new widgetClass(cfg, out.tplCtxt, lineNbr);
                    out.registerBehavior(instance);
                    instance.writeMarkupBegin(out);
                    return instance;
                } else {
                    // This should normally never happen, as the error will probably be caught after the call
                    // of getWidgetDependencies by the TplClassGenerator (see the "@" statement in
                    // aria.templates.Statements).
                    throw this.UNKWOWN_WIDGET;
                }
            } catch (error) {
                out.write("#Error in widget:" + widgetName + "#");
                this.$logError(this.ERROR_WIDGET_INIT, [out.tplCtxt.tplClasspath, lineNbr, widgetName,
                        "writeMarkupBegin"], error);
            }
        }

    }
});
