/*
 * Copyright 2016 Amadeus s.a.s.
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

var Aria = require('ariatemplates/Aria');

var EnhancedRobotTestCase = require('test/EnhancedRobotBase');
var ariaJsunitJawsTestCase = require('ariatemplates/jsunit/JawsTestCase');

var ariaUtilsFunction = require('ariatemplates/utils/Function');
var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsObject = require('ariatemplates/utils/Object');



////////////////////////////////////////////////////////////////////////////////
// Model
////////////////////////////////////////////////////////////////////////////////

module.exports = Aria.classDefinition({
    $classpath : 'test.EnhancedJawsBase',
    $extends : ariaJsunitJawsTestCase,

    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);

        this._history = [];
        this._filter = null;
    },



    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $prototype : {
        $init : function (prototype) {
            ariaUtilsObject.defaults(prototype, EnhancedRobotTestCase.prototype);
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _checkHistory : function (callback) {
            // --------------------------------------------------- destructuring

            var history = this._history;
            var filter = this._filter;

            // ------------------------------------------------------ processing

            history = history.join('\n');
            this.assertJawsHistoryEquals(history, callback, filter);
        },

        _executeStepsAndWriteHistory : function (callback, builder, thisArg) {
            // -------------------------------------- input arguments processing

            if (thisArg === undefined) {
                thisArg = this;
            }

            // --------------------------------------------------- destructuring

            var history = this._history;

            // ------------------------------------------------------ processing

            var api = new ScenarioAPI();
            builder.call(thisArg, api);

            history.push.apply(history, api.history);

            var steps = api.steps;
            this.synEvent.execute(steps, {
                scope: this,
                fn: callback
            });
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _createLineRegExp : function (content) {
            return new RegExp('^' + content + '\n?', 'gm');
        },

        _applyRegExps : function (regexps, content) {
            return ariaUtilsArray.reduce(regexps, function (content, regexp) {
                return content.replace(regexp, '');
            }, content);
        }
    }
});



////////////////////////////////////////////////////////////////////////////////
// API for test scenario
////////////////////////////////////////////////////////////////////////////////

function autoBindAndAlias(container, name) {
    var aliases = Array.prototype.slice.call(arguments, 2);

    var method = container[name];
    method = ariaUtilsFunction.bind(method, container);

    ariaUtilsArray.forEach(aliases, function(alias) {
        container[alias] = method;
    });

    return method;
}

function ScenarioAPI() {
    // -------------------------------------------------------------------------

    this.history = [];
    this.steps = [];
    this.defaultDelay = 1000;

    // -------------------------------------------------------------------------

    ariaUtilsArray.forEach([
        ['addStep', 'step'],
        ['addToHistory', 'entry', 'says'],
        ['addDelay', 'delay'],
        ['pressKey', 'key'],
        ['pressSpecialKey', 'specialKey'],
        ['clickLeft', 'leftClick', 'click']
    ], function (args) {
        autoBindAndAlias.apply(null, [this].concat(args));
    }, this);

    // -------------------------------------------------------------------------

    ariaUtilsArray.forEach([
        'down',
        'up',
        'right',
        'left',
        ['tab', 'tabulation'],
        'escape',
        'enter',
        'space',
        'backspace'
    ], function (args) {
        this.createAndStoreSpecialKeyFunction.apply(this, ariaUtilsArray.ensureWrap(args));
    }, this);
}

ScenarioAPI.prototype.addStep = function (step, delay) {
    this.steps.push(step);

    if (delay !== null) {
        this.addDelay(delay);
    }

    return this;
};

ScenarioAPI.prototype.addToHistory = function () {
    var history = this.history;
    history.push.apply(history, arguments);

    return this;
};

ScenarioAPI.prototype.addDelay = function (delay) {
    if (delay == null) {
        delay = this.defaultDelay;
    }

    if (delay > 0) {
        this.steps.push(['pause', delay]);
    }

    return this;
};

ScenarioAPI.prototype.clickLeft = function (element) {
    return this.addStep(['click', element]);
};

ScenarioAPI.prototype.pressKey = function (key) {
    return this.addStep(['type', null, key]);
};

ScenarioAPI.prototype.pressSpecialKey = function (key) {
    return this.pressKey('[' + key + ']');
};

ScenarioAPI.prototype.createSpecialKeyFunction = function (key) {
    return ariaUtilsFunction.bind(this.pressSpecialKey, this, key);
};

ScenarioAPI.prototype.createAndStoreSpecialKeyFunction = function (key) {
    var aliases = Array.prototype.slice.call(arguments, 1);

    var method = this.createSpecialKeyFunction(key);
    var names = [key].concat(aliases);
    ariaUtilsArray.forEach(names, function(name) {
        this[name] = method;
    }, this);

    return method;
};
