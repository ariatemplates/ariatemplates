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
 * A sequence is a list of tasks. It can automatically be run itself as a task when it is added to another sequence.
 * Otherwise it can be run as is, with a classical callback definition to be invoked when the sequence has finished.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.navigation.Sequence",
    $dependencies : ["aria.utils.Type", "aria.utils.Array", "aria.core.Sequencer",
            "test.aria.widgets.form.multiautocomplete.navigation.Task",
            "test.aria.widgets.form.multiautocomplete.navigation.Helpers"],
    $constructor : function (input) {
        this.HELPERS = test.aria.widgets.form.multiautocomplete.navigation.Helpers;

        // Factory -------------------------------------------------------------

        var spec;

        if (aria.utils.Type.isString(input)) {
            spec = {
                name : input
            };
        } else {
            spec = input;
        }

        // Properties ----------------------------------------------------------

        this.parent = spec.parent;
        this.name = spec.name;
        this.trace = spec.trace;

        // Internal properties -------------------------------------------------

        this.__tasks = [];
        this._toDispose = [];
    },
    $destructor : function () {
        var toDispose = this._toDispose;
        for (var i = 0, len = toDispose.length; i < len; i++) {
            toDispose[i].$dispose();
        }
    },
    $prototype : {
        /**
         * Adds a child task. If it's not already one, builds it.
         * @return The given or built task
         */
        addTask : function (input) {
            // Task creation ---------------------------------------------------

            var task;
            if (!aria.utils.Type.isInstanceOf(input, "test.aria.widgets.form.multiautocomplete.navigation.Task")) {
                task = new test.aria.widgets.form.multiautocomplete.navigation.Task(input);
                this._toDispose.push(task);
            } else {
                task = input;
            }

            // Update & Push ---------------------------------------------------

            task.parent = this;
            task.trace = this.trace;

            this.__tasks.push(task);

            // Return ----------------------------------------------------------

            return task;
        },

        /**
         * Adds multiple tasks. Uses <code>addTask</code> behind.
         *
         * @return An array containing the results of the calls to <code>addTask</code>.
         */
        addTasks : function (input) {
            return this.HELPERS.map(this.HELPERS.arrayFactory(input), function (item) {
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
            // Factory ---------------------------------------------------------

            var sequence;
            if (!aria.utils.Type.isInstanceOf(input, "test.aria.widgets.form.multiautocomplete.navigation.Sequence")) {
                sequence = new test.aria.widgets.form.multiautocomplete.navigation.Sequence(input);
                this._toDispose.push(sequence);
            } else {
                sequence = input;
            }

            // Push ------------------------------------------------------------

            this.addTask({
                name : sequence.name,
                scope : sequence,
                fn : sequence.runAsTask,
                asynchronous : true,
                trace : this.trace,
                hasChildren : true
            });

            // Return ----------------------------------------------------------

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
         * @param[in] {Function} onEnd The callback to be called when the sequence has completely finished. Defaults to
         * a non-op.
         * @param[in] scope The scope of the callback. Defaults to <code>this</code>.
         * @param[in] arg The argument to be passed to the callback. Only one argument is supported, so if you need
         * multiple manage yourself the use of an array or an object.
         */
        run : function (onEnd, scope, arg) {
            // Input arguments processing --------------------------------------

            // ----------------------------------------------------------- onEnd

            if (!aria.utils.Type.isFunction(onEnd)) {
                onEnd = Aria.empty;
            }

            // ----------------------------------------------------------- scope

            if (scope == null) {
                scope = this;
            }

            // Actual sequence creation ----------------------------------------

            var sequence = new aria.core.Sequencer();
            this._toDispose.push(sequence);
            this.__sequence = sequence;

            aria.utils.Array.forEach(this.__tasks, function (task) {
                sequence.addTask({
                    name : task.name,
                    fn : task.getFn(),
                    scope : task.scope,
                    asynchronous : task.asynchronous
                });
            }, this);

            // On end callback registration ------------------------------------

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

            // Run -------------------------------------------------------------

            sequence.start();
        },

        /**
         * A method to be called by the asynchronous tasks conatined in this sequence to tell that they have finished.
         * This should be called only when the sequence is actually running, but anyway a chack is made for this.
         * @param[in] task The task that has ended.
         */
        notifyEnd : function (task) {
            if (task.isRunning()) {
                this.__sequence.notifyTaskEnd(task.task.id);
            }
        }
    }
});
