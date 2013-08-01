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
 * Object representing a callback. Does normalization on creation, and expose a simple call method.<br />
 * The callback must at least contain a function, it can optionally specify the scope and arguments for the called
 * method.<br />
 * The following example creates a simple callback and calls it passing a result object
 *
 * <pre><code>
 * // create the callback
 * var callback = new aria.utils.Callback({
 *     fn : function (result) {}
 * });
 *
 * // later in the code, call the callback
 * callback.call('my result here');
 * </code></pre>
 *
 * The callback definition can also specify scope and arguments
 *
 * <pre><code>
 * // create the callback
 * var callback = new aria.utils.Callback({
 *     fn : function (result, anotherObject) {
 *         // here 'this' corresponds to myObject
 *         // and 'anotherObject' is whatever object was passed to args
 *     },
 *     scope : myObject,
 *     args : anotherObject
 * });
 *
 * // later in the code, call the callback
 * callback.call('my result here');
 * </code></pre>
 *
 * The position in which 'result' is passed to the callback can be configured using 'resIndex'
 *
 * <pre><code>
 * // create the callback
 * var callback = new aria.utils.Callback({
 *     fn : function (anotherObject) {
 *         // 'anotherObject' is whatever object was passed to args
 *         // with a negative resIndex we don't receive the result object
 *     },
 *     scope : myObject,
 *     args : anotherObject,
 *     resIndex : -1
 * });
 *
 * // later in the code, call the callback
 * callback.call('my result here');
 * </code></pre>
 *
 * By default the callback passes 'args' as it was orginally defined, but if 'args' is an array and 'apply' is set to
 * true, the 'args' are exploded
 *
 * <pre><code>
 * // create the callback
 * var callback = new aria.utils.Callback({
 *     fn : function (one, two, three) {
 *         // 'one' is 'first argument'
 *         // 'two' is 'second argument'
 *         // 'three' is 'my result here'
 *     },
 *     scope : myObject,
 *     args : ['first argument', 'second argument'],
 *     resIndex : 2
 * });
 *
 * // later in the code, call the callback
 * callback.call('my result here');
 * </code></pre>
 */
Aria.classDefinition({
    $classpath : "aria.utils.Callback",
    $dependencies : ["aria.utils.Type"],
    $statics : {
        INVALID_CALLBACK : "The callback function is invalid or missing or it was called after $dispose."
    },
    /**
     * Creates a callback instance
     * @param {aria.core.CfgBeans:Callback|Function} callbackDefinition, an object or directly a function reference.
     *
     * <pre>
     * {
     *      fn : ...,       // a function reference
     *      scope : ...,    // Object to use as a scope, optional
     *      args : ...,     // callback second argument, optional
     *      resIndex : ..., // index of the result object
     *      apply : ...     // whether args is passed as in Function.call or Function.apply
     * }
     * </pre>
     */
    $constructor : function (callbackDefinition) {

        // normalise definition
        callbackDefinition = this.$normCallback(callbackDefinition);

        var valid = aria.utils.Type.isFunction(callbackDefinition.fn);

        /**
         * Scope for callback execution
         * @type Object
         */
        this._scope = valid ? callbackDefinition.scope : this;

        /**
         * Function to execute
         * @type Function
         */
        this._function = valid ? callbackDefinition.fn : this._warnDisposed;

        /**
         * Arguments given when creating the callback
         * @type Object
         */
        this._args = callbackDefinition.args;

        /**
         * Index of the result or event object in the arguments passed to the callback function
         * @type Integer
         */
        this._resIndex = callbackDefinition.resIndex;

        /**
         * Whether we should use Function.call or Function.apply for args. Used only if args is an array
         * @type Boolean
         * @protected
         */
        this._apply = callbackDefinition.apply;

    },
    $destructor : function () {
        // scope : this, ensure that we can still log in case we re-use the callback
        this._scope = this;
        this._function = this._warnDisposed;
        this._args = null;
    },
    $prototype : {

        /**
         * Execute the callback. It is equivalent to Callback.apply
         * @param {Object} event
         */
        call : function (evt) {
            var args = (this._apply === true && aria.utils.Type.isArray(this._args)) ? this._args.slice() : [this._args];
            var resIndex = (this._resIndex === undefined) ? 0 : this._resIndex;

            if (resIndex > -1) {
                args.splice(resIndex, 0, evt);
            }

            return this._function.apply(this._scope, args);
        },

        /**
         * Log an error in case the callback function is invalid
         * @protected
         */
        _warnDisposed : function () {
            this.$logError(this.INVALID_CALLBACK);
        },

        /**
         * Execute the callback. It is equivalent to Callback.call
         * @param {Object} event
         */
        apply : function (evt) {
            this.call(evt);
        }
    }
});