/*
 * Copyright 2013 Amadeus s.a.s.
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
 * A task is a processing run and managed by a sequence.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.navigation.Task",
    $dependencies : ["aria.utils.Type", "aria.core.Browser",
            "test.aria.widgets.form.multiautocomplete.navigation.Helpers"],
    /**
     * Builds a new Task. The specifications object is more or less the same as what
     * <code>aria.core.Sequencer.addTask</code> expects. General properties:
     * <ul>
     * <li><code>parent</code> /
     * <code>test.aria.widgets.form.multiautocomplete.navigation.Sequence</code>: the container of the
     * task (only one type supported for now)</li>
     * <li><code>name</code>,<code>desc</code> / <code>String</code>: the name (or description) of the task</li>
     * </ul>
     * Callback properties:
     * <ul>
     * <li><code>scope</code>, <code>context</code>: the context (<code>this</code>) of the function invoked
     * by the task</li>
     * <li><code>args</code> / <code>Array</code>: the arguments list of the function invoked by the task</li>
     * <li><code>asynchronous</code> / <code>Boolean</code>: tells whether the function invoked by the task is
     * asynchronous (<code>true</code>) or not (<code>false</code)</li>
     *     <li><code>fn</code> / <code>Function</code>: the function to be invoked by the task</li>
     * </ul>
     *
     * Tracing properties:
     * <ul>
     *     <li><code>hasChildren</code> / <code>Boolean</code>: kind of a hack, since a sequence uses a Task to run all of its children tasks the task needs to now if it has children or not, for tracing purposes</li>
     *     <li>
     *         <code>trace</code> / <code>Object</code>:
     *         <ul>
     *             <li><code>enable</code>, <code>activate</code> / <code>Boolean</code>: activates tracing or not</li>
     *             <li><code>collapsed</code> / <code>Boolean</code>: for browsers which support it, whether to log groups initially collasped or not</li>
     *             <li><code>logTask</code> / <code>Boolean</code>: tells whether to log the task object itself or not</li>
     *             <li><code>color</code> / <code>String</code>: supported by WebKit, a CSS color declaration for the name of the task</li>
     *         </ul>
     *     </li>
     * </ul>
     *
     * @param[in] {Object} spec Specifications of the task. See full description for more information.
     */
    $constructor : function (spec) {
        this.HELPERS = test.aria.widgets.form.multiautocomplete.navigation.Helpers;

        // -------------------------------------------------------------- parent

        var parent = spec.parent;
        if (parent != null) {
            this.parent = parent;
        }

        // Description ---------------------------------------------------------

        // ---------------------------------------------------------------- name

        var name = spec.name;
        if (name == null) {
            name = spec.desc;
        }
        name = "" + name;
        this.name = name;

        // Callback ------------------------------------------------------------

        // --------------------------------------------------------------- scope

        var scope = spec.scope;
        if (scope == null) {
            scope = spec.context;
        }
        if (scope == null) {
            scope = this;
        }
        this.scope = scope;

        // ---------------------------------------------------------------- args

        var args = spec.args;
        args = this.HELPERS.arrayFactory(args);
        this.args = args;

        // -------------------------------------------------------- asynchronous

        var asynchronous = spec.asynchronous;
        if (asynchronous == null) {
            asynchronous = true;
        }
        asynchronous = !!asynchronous;
        this.asynchronous = asynchronous;

        // ------------------------------------------------------------------ fn

        var fn = spec.fn;
        if (!aria.utils.Type.isFunction(fn)) {
            throw Error('The function to be used by the task is not properly specified. Got: ' + fn);
        }
        this.fn = fn;

        // --------------------------------------------------------------- trace

        var trace = spec.trace;
        this.trace = {};
        if (aria.utils.Type.isObject(trace)) {
            // ---------------------------------------------------------- enable

            var enable = trace.enable;
            if (enable == null) {
                enable = trace.activate;
            }
            enable = !!enable;
            this.trace.enable = enable;

            // --------------------------------------------------------collapsed

            var collapsed = trace.collapsed;
            if (collapsed == null) {
                collapsed = false;
            }
            collapsed = !!collapsed;
            this.trace.collapsed = collapsed;

            // --------------------------------------------------------- logTask

            var logTask = trace.logTask;
            if (logTask == null) {
                logTask = false;
            }
            logTask = !!logTask;
            this.trace.logTask = logTask;

            // ----------------------------------------------------------- color

            var color = spec.color;
            if (color == null) {
                color = 'black';
            }
            color = "" + color;
            this.trace.color = color;
        }

        // --------------------------------------------------------- hasChildren

        var hasChildren = spec.hasChildren;
        if (hasChildren == null) {
            hasChildren = false;
        }
        hasChildren = !!hasChildren;
        this.hasChildren = hasChildren;
    },
    $prototype : {
        /**
         * Returns the function to be passed the actual underlying task. Behind the scenes a task definition as expected
         * by <code>aria.core.Sequencer.addTask</code> is used. This method return a wrapper function around the one
         * given in the specifications of the task, in order to take care of things such as:
         * <ul>
         * <li>proper arguments passing</li>
         * <li>tracing</li>
         * <li>states recording</li>
         * </ul>
         */
        getFn : function () {
            var self = this;

            return function (task) {
                // Tracing -----------------------------------------------------

                if (self.trace.enable) {
                    var console = Aria.$window.console;

                    // ------------------------------------------------- message

                    var message;
                    if (aria.core.Browser.isWebkit) {
                        message = ['%c' + self.name, 'color: ' + self.trace.color];
                    } else {
                        message = [self.name];
                    }

                    // ---------------------------------------------- Log method

                    var logMethod;
                    if (!self.hasChildren) {
                        logMethod = console.log;
                    } else {
                        if (self.trace.collapsed) {
                            logMethod = console.groupCollapsed;
                        } else {
                            logMethod = console.group;
                        }
                    }

                    // ----------------------------------------------------- Log

                    logMethod.apply(console, message);

                    if (self.trace.logTask) {
                        console.log(self);
                    }
                }

                // State update ------------------------------------------------

                self.__isRunning = true;
                self.task = task;

                // Callback call -----------------------------------------------

                var args = [self].concat(self.args);
                var result = self.fn.apply(self.scope, args);

                // Synchronous tasks: automatic end call -----------------------

                if (!self.asynchronous) {
                    self.end();
                }

                // Return ------------------------------------------------------

                return result;
            };
        },

        /**
         * Tells whether the task is running or not. A task is considered being running as soon as the function returned
         * by <code>getFn</code> has been invoked and until the method <code>end</code> has not been called.
         * @return {Boolean} <code>true</code> if the task is running, <code>false</code> otherwise.
         */
        isRunning : function () {
            var runs = this.__isRunning;

            if (runs == null) {
                runs = false;
            }

            return runs;
        },

        /**
         * To be called by any underlying function to notify that it has finished, and thus that the task can be
         * considered finished too.
         */
        end : function () {
            if (this.asynchronous) {
                this.parent.notifyEnd(this);
            }

            if (this.trace.enable && this.hasChildren) {
                Aria.$window.console.groupEnd();
            }

            this.__isRunning = false;
        }
    }
});
