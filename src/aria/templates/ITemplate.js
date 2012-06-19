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
 * Interface exposed from a template context to its template.
 * @class aria.templates.ITemplate
 */
Aria.interfaceDefinition({
    $classpath : 'aria.templates.ITemplate',
    $extends : 'aria.templates.IBaseTemplate',
    $events : {
        "SectionRefreshed" : {
            description : "Raised when a section in the template has been refreshed",
            properties : {
                sectionID : "{String} ID of the section which has been refreshed - if defined, null otherwise."
            }
        }
    },
    $interface : {
        /**
         * Data available for the template.
         * @type Object
         */
        data : "Object",

        /**
         * Module controller of the template.
         * @type Object
         */
        moduleCtrl : "Object",

        /**
         * Flow controller linked to the module controller of the template.
         * @type Object
         */
        flowCtrl : "Object",

        /**
         * Resources from the module controller of the template.
         * @type Object
         */
        moduleRes : "Object",

        /**
         * Do a partial or whole refresh of the template, using the specified macro and section. This method can be
         * called from templates and template scripts.
         * @param {aria.templates.CfgBeans.RefreshCfg} args macro and section for the refresh. If not specified, do a
         * complete refresh.
         */
        $refresh : function (args) {},

        /**
         * Returns an HTMLElement wrapped in DomElementWrapper. This method can be called from templates and template
         * scripts.
         * @param {String} id specified in the templates
         * @param {Number} Index of child element to return
         */
        $getChild : function (id, index) {},

        /**
         * Returns an HTMLElement wrapped in DomElementWrapper. This method can be called from templates and template
         * scripts.
         * @param {String} id specified in the templates
         */
        $getElementById : function (id) {},

        /**
         * Focus a widget with a specified id programmatically. This method can be called from templates and template
         * scripts. It throws an error if the focus fails
         * @param {String} template id of the widget to focus
         */
        $focus : function (id) {},

        /**
         * Return a computed horizontal size. This method can be called from templates and template scripts.
         * @param {Number} min the size of the element (in pixels) when the template has its minimum size
         * @param {Number} incrementFactor [optional, default: 1] the proportion of the extra space (if available) which
         * should be added to the previous min argument
         * @param {Number} max [optional] the maximum size of the element (in pixels)
         */
        $hdim : function (min, incrementFactor, max) {},

        /**
         * Return a computed vertical size. This method can be called from templates and template scripts.
         * @param {Number} min the size of the element (in pixels) when the template has its minimum size
         * @param {Number} incrementFactor [optional, default: 1] the proportion of the extra space (if available) which
         * should be added to the previous min argument
         * @param {Number} max [optional] the maximum size of the element (in pixels)
         */
        $vdim : function (min, incrementFactor, max) {},

        /**
         * Return a global id from an id specified in a template. It adds a template-specific suffix or prefix so that
         * there is no name collision between several instances of the same template, or different templates.
         * @param {String} id specified in the template
         * @return {String} global id which should not collide with ids from other templates
         */
        $getId : function (id) {},

        /**
         * Return an object with the scrollTop and the scrollLeft values of the HTMLElement that contains the div of the
         * template
         * @return {Object} scrollTop and scrollLeft of the div that contains the template
         */
        getContainerScroll : function () {},

        /**
         * Set the scrollTop and the scrollLeft values of the HTMLElement that contains the div of the template
         * @param {Object} contains the desired scrollTop and scrollLeft values
         */
        setContainerScroll : function (scrollPositions) {},

        /*
         * All the remaining methods in this interface are internal methods of the framework which need to be used from
         * the template generated code. They are not intended to be used from anywhere else and could change from one
         * release to another.
         */

        /**
         * Write generated ID to DOM Element. This method is intended to be called only from the generated code of
         * templates (created in aria.templates.ClassGenerator) and never directly from developper code. A call to this
         * method is generated for the {id ...} statement
         * @private
         * @param {String} id specified in the template
         */
        __$writeId : function (id) {},

        /**
         * Write the markup for a widget not used as a container. This method is intended to be called only from the
         * generated code of templates (created in aria.templates.ClassGenerator) and never directly from developper
         * code. A call of this method is generated for widget statements: <code>{@libraryName:widgetName {...}/}</code>
         * @private
         * @param {String} lib library name
         * @param {String} widget widget name in the library
         * @param {Object} cfg widget configuration
         * @param {Number} lineNbr line number in the template where the widget is
         */
        __$processWidgetMarkup : function (lib, widget, cfg, lineNbr) {},

        /**
         * Write the beginning of the markup for a widget used as a container. This method is intended to be called only
         * from the generated code of templates (created in aria.templates.ClassGenerator) and never directly from
         * developper code. A call of this method is generated for opening widget statements:
         * <code>{@libraryName:widgetName {...}}...{/@libraryName:widgetName}</code>
         * @private
         * @param {String} lib library name
         * @param {String} widget widget name in the library
         * @param {Object} cfg widget configuration
         * @param {Number} lineNbr line number in the template where the widget is
         */
        __$beginContainerWidget : function (lib, widget, cfg, lineNbr) {},

        /**
         * Write the end of the markup for a widget used as a container. This method is intended to be called only from
         * the generated code of templates (created in aria.templates.ClassGenerator) and never directly from developper
         * code. A call of this method is generated for closing widget statements:
         * <code>{@libraryName:widgetName {...}}...{/@libraryName:widgetName}</code>
         * @private
         */
        __$endContainerWidget : function () {},

        /**
         * Write markup to handle dom events. This method is intended to be called only from the generated code of
         * templates (created in aria.templates.ClassGenerator) and never directly from developper code. A call to this
         * method is generated for {on .../} statements.
         * @private
         * @param {String} eventName name of the event
         * @param {aria.core.JsObject.Callback} callback callback to be called when the event is raised
         * @param {String} lineNumber
         */
        __$statementOnEvent : function (eventName, callback, lineNumber) {},

        /**
         * Create a repeater. This method is intended to be called only from the generated code of templates (created in
         * aria.templates.ClassGenerator) and never directly from developper code. A call to this method is generated
         * for {repeater .../} statements.
         * @private
         * @param {Number} lineNumber
         * @param {aria.templates.CfgBeans.RepeaterCfg} param
         */
        __$statementRepeater : function (lineNumber, param) {},

        /**
         * Create a view if it does not exist already. This method is intended to be called only from the generated code
         * of templates (created in aria.templates.ClassGenerator) and never directly from developper code. A call to
         * this method is generated for the {createView ...} statement.
         * @private
         * @param {String} viewName
         * @param {Object} parameters
         * @param {Array} array
         */
        __$createView : function (viewName, parameters, array) {},

        /**
         * Begin a section. This method is intended to be called only from the generated code of templates (created in
         * aria.templates.ClassGenerator) and never directly from developper code. A call to this method is generated
         * for the {section ...} opening statement.
         * @param {Number} lineNumber line number at which the section begins, used for error reporting
         * @param {Boolean} container true if the section statement is used as a container, false otherwise
         * @param {Object/String} sectionParam section id, or configuration object
         * @param {String} Dom element wrapper type to be created.
         * @private
         */
        __$beginSection : function (lineNumber, container, sectionParam, domType) {},

        /**
         * End a section previously started with a call to __$beginSection. This method is intended to be called only
         * from the generated code of templates (created in aria.templates.ClassGenerator) and never directly from
         * developper code. A call to this method is generated for the {/section} closing statement.
         * @private
         */
        __$endSection : function () {},

        /**
         * Bind an automatic refresh to a section or the template. This method is intended to be called only from the
         * generated code of templates (created in aria.templates.ClassGenerator) and never directly from developper
         * code. A call to this method is generated for the bindRefreshTo statement.
         * @private
         * @param {Object} container object containing the parameter a section or template is bound to, or data
         * @param {String} param parameter on which to bind, or null if binding to data
         * @param {Number} linNumber
         */
        __$bindAutoRefresh : function () {}
    }
});