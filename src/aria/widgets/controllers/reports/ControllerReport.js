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
 * Report emitted by a controller on a check
 * @class aria.widgets.controllers.reports.ControllerReport
 * @extends aria.core.JsObject
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.controllers.reports.ControllerReport',
    $dependencies : [],
    $constructor : function () {
        /**
         * Specifies if the value given to the controller was correct
         * @type {Boolean}
         */
        this.ok = null;

        /**
         * Controller specifies if the keystroke has to be canceled
         * @type {}
         */
        this.cancelKeyStroke = false;

        /**
         * true if the displayed value matches the begining of a correct value
         * @type {Boolean}
         */
        this.matchCorrectValueStart = false;

        /**
         * Propose a best value for the input
         * @type {String}
         */
        this.text = null;

        /**
         * Internal value associated to the display
         * @type {Object}
         */
        this.value;

        /**
         * used to return any error messages associated to an internal validation
         * @type {Array}
         */
        this.errorMessages = [];

        /**
         * Position of caret start
         * @type {Number}
         */
        this.caretPosStart = null;

        /**
         * Position of caret end
         * @type {Number}
         */
        this.caretPosEnd = null;

    },
    $destructor : function () {
        this.ok = null;
        this.internalValue = null;
        this.errorMessages = null;
    }

});
