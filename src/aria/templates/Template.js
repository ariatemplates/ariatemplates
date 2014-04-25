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

var Aria = require('../Aria');
var ArrayUtils = require('../utils/Array');
var contextualEnvironment = require('../tools/contextual/environment/ContextualMenu');
var AppEnvironment = require('../core/AppEnvironment');
var ITemplate = require('./ITemplate');

(function () {
    /**
     * This function handles environment change. When the contextual menu is enabled it loads the required classes.
     */
    var changingEnvironment = function (evt) {
        if (!evt || !evt.changedProperties || ArrayUtils.contains(evt.changedProperties, "contextualMenu")) {
            Aria.load({
                classes : [contextualClasspath]
            });
        }
    };

    /**
     * Checks if the Contextual Menu is enable. This function should be used only before loading the class definition.
     * It would be nice to use aria.tools.contextual.environment.ContextualMenu, but it might not be loaded yet.
     */
    var isEnabled = function () {
        var settings = aria.core.AppEnvironment.applicationSettings.contextualMenu;
        return settings && settings.enabled;
    };

    /**
     * Classpath of the ContextualMenu class
     */
    var contextualClasspath = "aria.tools.contextual.ContextualMenu";

    if (isEnabled()) {
        // FIXME: pb of really dynamically loading contextualClasspath
        require('../tools/contextual/ContextualMenu');
    }
    require("../utils/environment/VisualFocus");

    /**
     * Base class from which all templates inherit. Some methods will be added to instances of this class, from the
     * TemplateCtxt class.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.templates.Template",
        $extends : require("./BaseTemplate"),
        $statics : {
            // ERROR MESSAGES:
            EXCEPTION_IN_CONTROL_PARAMETERS : "line %2: Uncaught runtime exception in control %3 for parameters '%1'",
            EXCEPTION_IN_REPEATER_PARAMETER : "line %2: Uncaught runtime exception in repeater parameter '%1'"
        },
        $onload : function () {
            if (!contextualEnvironment.getContextualMenu().enabled) {
                // since it's disabled, add a listener to load a class when it's enabled
                AppEnvironment.$on({
                    "environmentChanged" : changingEnvironment,
                    scope : {}
                });
            }
        },
        $prototype : {
            // $width and $height are the current values for width and height
            $width : undefined,
            $height : undefined,

            /**
             * Prototype init method called at prototype creation time Allows to store class-level objects that are
             * shared by all instances
             * @param {Object} p the prototype object being built
             * @param {Object} def the class definition
             */
            $init : function (p, def) {
                // The prototype should be an instance of Template, that inheriths from BaseTemplate
                p.$BaseTemplate.constructor.classDefinition.$prototype.$init(p, def);

                // copy the prototype of ITemplate:
                var itf = ITemplate.prototype;
                for (var key in itf) {
                    if (itf.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                        // copy methods which are not already on this object (this avoids copying $classpath and
                        // $destructor)
                        p[key] = itf[key];
                    }
                }

                // get shortcuts to necessary functions in other classes,
                // so that templates work even in a sandbox
                p.$json = require('../utils/Json');
            },

            /**
             * Function to be overriden by subclasses to receive events from the module controller.
             * @param {Object} evt the event object (depends on the module event)
             */
            onModuleEvent : function (evt) {
                // default implementation: just ignore the events
            },

            /**
             * Function to be overriden by subclasses to receive events from the flow controller.
             * @param {Object} evt the event object (depends on the flow event)
             */
            onFlowEvent : function (evt) {
                // default implementation: just ignore the events
            },

            /**
             * This function can be overridden by Template Scripts. It is called by the TemplateLoader when data is
             * ready for use by the template.
             */
            $dataReady : function () {
                // default implementation
            },

            /**
             * This function can be overridden by Template Scripts. It is called by the TemplateLoader when the template
             * has been succesfully rendered.
             */
            $viewReady : function () {
                // default implementation
            },

            /**
             * This function can be overridden by Template Scripts. It is called after any refresh when all elements
             * from the view are displayed, including subtemplates.
             */
            $displayReady : function () {
                // default implementation
            }
        }
    });
})();
