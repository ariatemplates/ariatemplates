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

var Aria = require('../../Aria');

var ariaUtilsFunction = require('../Function');
var nop = ariaUtilsFunction.empty;



////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

function assignPropertyWithDefault(destination, source, property, defaultValue) {
    var value = source[property];

    if (value == null) {
        value = defaultValue;
    }

    destination[property] = value;

    return value;
}



////////////////////////////////////////////////////////////////////////////////
// Model: Debouncer
////////////////////////////////////////////////////////////////////////////////

 module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.async.Debouncer',

    $constructor : function (spec) {
        this.delay = spec.delay;
        this.state = spec.state;

        assignPropertyWithDefault(this, spec, 'onStart', nop);
        assignPropertyWithDefault(this, spec, 'onEnd', nop);

        this._currentTimeout = null;
    },
    $destructor : function () {
        this._stopWaitingForTimeout();
    },

    $prototype : {
        run : function () {
            var state = this.state;
            var onStart = this.onStart;

            if (!this._isWaitingForTimeout()) {
                onStart(state);
            }

            this._stopWaitingForTimeout();
            this._startWaitingForTimeout();
        },

        _isWaitingForTimeout : function () {
            return this._currentTimeout != null;
        },

        _stopWaitingForTimeout : function () {
            if (this._isWaitingForTimeout()) {
                clearTimeout(this._currentTimeout);
                this._currentTimeout = null;
            }
        },

        _startWaitingForTimeout : function () {
            this._currentTimeout = setTimeout(
                ariaUtilsFunction.bind(this._afterTimeout, this),
                this.delay
            );
        },

        _afterTimeout : function () {
            var state = this.state;
            var onEnd = this.onEnd;

            this._currentTimeout = null;
            onEnd(state);
        }
    }
});
