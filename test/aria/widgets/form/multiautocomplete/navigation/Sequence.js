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

var Aria = require('ariatemplates/Aria');

var ariaCoreSequencer = require('ariatemplates/core/Sequencer');

var ariaUtilsType = require('ariatemplates/utils/Type');
var ariaUtilsArray = require('ariatemplates/utils/Array');

var Task = require('./Task');



/**
 * A sequence is a list of tasks. It can automatically be run itself as a task when it is added to another sequence.
 * Otherwise it can be run as is, with a classical callback definition to be invoked when the sequence has finished.
 */
module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.form.multiautocomplete.navigation.Sequence',
    $constructor : function (input) {
        // ------------------------------------------ input arguments processing

        var spec;

        if (ariaUtilsType.isString(input)) {
            spec = {
                name : input
            };
        } else {
            spec = input;
        }

        // ---------------------------------------------------------- properties

        this.parent = spec.parent;
        this.name = spec.name;
        this.trace = spec.trace;

        // ------------------------------------------------- internal attributes

        this.__tasks = [];
        this._toDispose = [];
    },
    $destructor : function () {
        ariaUtilsArray.forEach(this._toDispose, function (instance) {
            instance.$dispose();
        });
    },
    $prototype : {
        /**
         * Adds a child task. If it's not already one, builds it.
         *
         * @return The given or built task
         */
        addTask : function (input) {
            // ------------------------------------------------------ processing

            // task creation ---------------------------------------------------

            var task;
            if (ariaUtilsType.isInstanceOf(input, Task)) {
                task = input;
            } else {
                task = new Task(input);
                this._toDispose.push(task);
            }

            // update & Push ---------------------------------------------------

            task.parent = this;
            task.trace = this.trace;

            this.__tasks.push(task);

            // ---------------------------------------------------------- return

            return task;
        },

        /**
         * Adds multiple tasks. Uses <code>addTask</code> behind.
         *
         * @return An array containing the results of the calls to <code>addTask</code>.
         */
        addTasks : function (input) {
            return ariaUtilsArray.map(ariaUtilsArray.ensureWrap(input), function (item) {
                return this.addTask(item);
            });
        },

        /**
         * Adds a child sequence, wrapped as a new task. If it's not already a sequence, builds it. Uses
         * <code>addTask</code> to add the wrapping task.
         *
         * @return The given or built sequence
         */
        addSequence : function (input) {
            var sequence;
            if (ariaUtilsType.isInstanceOf(input, this.constructor)) {
                sequence = input;
            } else {
                sequence = new this.constructor(input);
                this._toDispose.push(sequence);
            }

            this.addTask({
                name : sequence.name,
                scope : sequence,
                fn : sequence.runAsTask,
                asynchronous : true,
                trace : this.trace,
                hasChildren : true
            });

            return sequence;
        },

        /**
         * Function to run the sequence when the latter is itself wrapped in a task. The difference is what to do when
         * the sequence has finished: notify the end of the wrapping task. Uses <code>run</code> behind.
         * @param[in] task The underlying task of the wrapping task.
         */
        runAsTask : function (task) {
            this.run(task.end, task);
        },

        /**
         * Runs the sequence of tasks.
         *
         * @param[in] {Function} onEnd The callback to be called when the sequence has completely finished. Defaults to
         * a non-op.
         * @param[in] scope The scope of the callback. Defaults to <code>this</code>.
         * @param[in] arg The argument to be passed to the callback. Only one argument is supported, so if you need
         * multiple manage yourself the use of an array or an object.
         */
        run : function (onEnd, scope, arg) {
            // -------------------------------------- input arguments processing

            if (!ariaUtilsType.isFunction(onEnd)) {
                onEnd = Aria.empty;
            }

            if (scope == null) {
                scope = this;
            }

            // ------------------------------------------------------ processing

            // actual sequence creation ----------------------------------------

            var sequence = new ariaCoreSequencer();
            this._toDispose.push(sequence);
            this.__sequence = sequence;

            ariaUtilsArray.forEach(this.__tasks, function (task) {
                sequence.addTask({
                    name : task.name,
                    fn : task.getFn(),
                    scope : task.scope,
                    asynchronous : task.asynchronous
                });
            }, this);

            // on end callback registration ------------------------------------

            var cb = {
                fn : onEnd,
                scope : scope
            };

            if (arg != null) {
                cb.arg = arg;
            }

            sequence.$on({
                end : cb
            });

            // run -------------------------------------------------------------

            sequence.start();
        },

        /**
         * A method to be called by the asynchronous tasks contained in this sequence to tell that they have finished.
         * This should be called only when the sequence is actually running, but anyway a check is made for this.
         *
         * @param[in] task The task that has ended.
         */
        notifyEnd : function (task) {
            if (task.isRunning()) {
                this.__sequence.notifyTaskEnd(task.task.id);
            }
        }
    }
});
