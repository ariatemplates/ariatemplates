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
 * Report emitted by a controller on a check for a controller that support dropdown
 * @class aria.widgets.controllers.reports.DropDownControllerReport
 * @extends aria.widgets.controllers.reports.ControllerReport
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.controllers.reports.DropDownControllerReport',
    $extends : 'aria.widgets.controllers.reports.ControllerReport',
    $dependencies : [],
    $constructor : function () {

        this.$ControllerReport.constructor.call(this);

        /**
         * Report notifies that dropdown has to be opened or closed
         * null value is for the case where nothing has to be done.
         * @type {Boolean}
         */
        this.displayDropDown = null;

    },
    $destructor : function () {
        this.displayDropDown = null;
        this.$ControllerReport.$destructor.call(this);
    }

});