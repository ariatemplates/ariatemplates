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
var ariaJsunitHelpersOutObj = require("./helpers/OutObj");
var ariaJsunitTestCase = require("./TestCase");


module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.WidgetTestCase",
    $extends : ariaJsunitTestCase,
    $destructor : function () {
        this.outObj.clean();
        this.outObj = null;

        this.$TestCase.$destructor.call(this);
    },
    $prototype : {

        /**
         * Override the default behavior to create a test area in the DOM
         */
        run : function () {
            this.outObj = ariaJsunitHelpersOutObj;
            this.outObj.createPlayground(this.$class);

            this.$TestCase.run.apply(this, arguments);
        },

        /**
         * Create and initialize a widget instance.<br />
         * It can be used only for self closing widgets because it calls the writeMarkup of the widget
         * @param {String} widget Widget classpath
         * @param {Object} config Widget configuration
         * @return {Object} Widget instance
         */
        createAndInit : function (widget, config) {
            var ref = Aria.getClassRef(widget);
            var instance = new ref(config, this.outObj.tplCtxt);
            instance.writeMarkup(this.outObj);
            this.outObj.putInDOM();
            instance.initWidget();
            return instance;
        },

        /**
         * Create and initialize a widget instance as a container.<br />
         * It can be used only for simple container widgets, the innerMarkup is inserted
         * between the writeMarkupBegin and writeMarkupEnd
         * @param {String} widget Widget classpath
         * @param {Object} config Widget configuration
         * @param {String} innerMarkup Markup inside the widget
         * @return {Object} Widget instance
         */
        createContainerAndInit : function (widget, config, innerMarkup) {
            var ref = Aria.getClassRef(widget);
            var instance = new ref(config, this.outObj.tplCtxt);
            instance.writeMarkupBegin(this.outObj);
            this.outObj.write(innerMarkup || "");
            instance.writeMarkupEnd(this.outObj);
            this.outObj.putInDOM();
            instance.initWidget();
            return instance;
        },

        clearAll : function () {
            this.outObj.clearAll();
        }
    }
});
