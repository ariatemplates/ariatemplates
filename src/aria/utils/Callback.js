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
 * Object representing a callback. Does normalization on creation, and expose a simple call method
 * @class aria.utils.Callback
 */
Aria.classDefinition({
    $classpath : 'aria.utils.Callback',
    $statics : {
        INVALID_CALLBACK : "The call method was called after $dispose."
    },
    /**
     * Creates a callback instance
     * @param {Object} callbackDefinition, an object or directly a function reference.
     *
     * <pre>
     *     {
     *         fn : ..., // a function reference
     *      scope : ..., // Object to use as a scope, optional
     *      args : ... // callback second argument, optional
     *     }
     * </pre>
     */
    $constructor : function (callbackDefinition) {

        // normalise definition
        callbackDefinition = this.$normCallback(callbackDefinition);

        /**
         * Scope for callback execution
         * @type Object
         */
        this._scope = callbackDefinition.scope;

        /**
         * Function to execute
         * @type Function
         */
        this._function = callbackDefinition.fn;

        /**
         * Arguments given when creating the callback
         */
        this._args = callbackDefinition.args;

    },
    $destructor : function () {
        this._scope = null;
        this._function = this._warnDisposed;
        this._args = null;
    },
    $prototype : {

        /**
         * Execute the callback
         * @param {Object} event
         */
        call : function (evt) {
            return this._function.call(this._scope, evt, this._args);
        },

        _warnDisposed : function () {
            this.$logError(this.INVALID_CALLBACK);
        }
    }
});