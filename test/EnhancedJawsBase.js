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

var ariaUtilsType = require('ariatemplates/utils/Type');
var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsObject = require('ariatemplates/utils/Object');
var ariaUtilsFunction = require('ariatemplates/utils/Function');



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

function autoBindAndAlias(container, spec) {
    var method = ariaUtilsFunction.bind(container[spec.name], container);

    ariaUtilsArray.forEach(spec.aliases, function(alias) {
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
        {name: 'addStep', aliases: ['step']},
        {name: 'addToHistory', aliases: ['entry', 'says']},
        {name: 'addDelay', aliases: ['delay']},
        {name: 'pressKey', aliases: ['key']},
        {name: 'pressSpecialKey', aliases: ['specialKey']},
        {name: 'clickLeft', aliases: ['leftClick', 'click']}
    ], function (spec) {
        autoBindAndAlias(this, spec);
    }, this);

    // -------------------------------------------------------------------------

    ariaUtilsArray.forEach([
        'down',
        'up',
        'right',
        'left',
        {key: 'tab', aliases: ['tabulation']},
        {key: 'escape', aliases: ['esc']},
        'enter',
        'space',
        {key: 'backspace', aliases: ['back']}
    ], function (spec) {
        this.createAndStoreSpecialKeyFunction(spec);
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

ScenarioAPI.prototype.shiftTab = function (element) {
    return this.pressKey('[<shift>][tab][>shift<]');
};

ScenarioAPI.prototype.pressKey = function (key) {
    return this.addStep(['type', null, key]);
};

ScenarioAPI.prototype.pressSpecialKey = function (key) {
    return this.pressKey('[' + key + ']');
};

ScenarioAPI.prototype.createSpecialKeyFunction = function (key) {
    var self = this;
    return function () {
        self.specialKey(key);
    };
};

ScenarioAPI.prototype.createAndStoreSpecialKeyFunction = function (spec) {
    // ---------------------------------------------- input arguments processing

    if (!ariaUtilsType.isObject(spec)) {
        spec = {key: spec};
    }

    var key = spec.key;
    key = '' + key;

    var name = spec.name;
    if (name == null) {
        name = key;
    }
    name = '' + name;

    var aliases = spec.aliases;
    if (aliases == null) {
        aliases = [];
    }

    // -------------------------------------------------------------- processing

    var method = this.createSpecialKeyFunction(key);

    var names = [name].concat(aliases);
    ariaUtilsArray.forEach(names, function(name) {
        this[name] = method;
    }, this);

    // ------------------------------------------------------------------ return

    return method;
};
