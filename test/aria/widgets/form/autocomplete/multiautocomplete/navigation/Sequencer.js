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
 * Helper to build a hierarchy of tasks. Tasks are instance of
 * <code>test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Task</code>. A tree of tasks can be built
 * using tasks containers, which are instances of
 * <code>test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Sequence</code>. What this current class
 * does if acting like a factory. It holds default properties for the tasks to be created. Thanks to the specification
 * of the scope, the way functions are passed to the tasks can be improved: the name of the corresponding property can
 * be used instead of the actual reference to the function. It is able to build a hierarchy of tasks from a hierarchy of
 * objects: when an object has a <code>children</code> property it builds a list of children tasks (a sequence). This
 * property can directly hold the subgraph of task or be the name of a property inside the default scope. In turns, this
 * property can either directly hold the subgraph, or be a method that return it (allows scoping).
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Sequencer",
    $dependencies : ["aria.utils.Type", "aria.utils.Array",
            "test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Sequence",
            "test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Task",
            "test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Helpers"],
    /**
     * Builds a new Sequencer. Default properties:
     * <ul>
     * <li><code>scope</code>: default to an empty object</li>
     * <li><code>asynchronous</code> / <code>Boolean</code>: </li>
     * <li><code>trace</code>: tracing configuration</li>
     * </ul>
     * @param[in] defaults {Object} Default properties. See full description for more information.
     */
    $constructor : function (defaults) {
        this.HELPERS = test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Helpers;
        this.__methods = {};

        // defaults ------------------------------------------------------------

        // --------------------------------------------------------------- scope

        var scope = defaults.scope;
        if (scope == null) {
            scope = {};
        }
        this.scope = scope;

        // -------------------------------------------------------- asynchronous

        var asynchronous = defaults.asynchronous;
        if (asynchronous != null) {
            asynchronous = !!asynchronous;
            this.asynchronous = asynchronous;
        }

        // --------------------------------------------------------------- trace

        this.trace = defaults.trace;

        // --------------------------------------------------------------- onend

        var onend = defaults.onend;

        if (onend != null) {
            onend = this.resolveMethod(onend);
            this.onend = onend;
        }
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
         * Builds and runs the whole tree of tasks. Specifications:
         * <ul>
         * <li> <code>onend</code> / <code>Object</code>: arguments corresponding to
         * <code>test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Sequence.run</code>
         * <ul>
         * <li><code>fn</code>: argument 0</li>
         * <li><code>scope</code>: argument 1</li>
         * </ul>
         * </li>
         * <li><code>tasks</code>: the list of tasks as expected by <code>root</code></li>
         * </ul>
         * @param[in] spec {Object} The specifications to build to root sequence and how to run it. See full description
         * for more details.
         * @return The root sequence.
         * @see root
         */
        run : function (spec) {
            // ----------------------------------------------------------- onend

            var onend = spec.onend;

            if (onend == null) {
                onend = this.onend;

                if (onend == null) {
                    throw new Error('No end callback provided!');
                }
            } else {
                onend = this.resolveMethod(onend);
            }

            // ----------------------------------------------------------- tasks

            var tasks = spec.tasks;

            // Run -------------------------------------------------------------

            var sequence = this.root(tasks);
            sequence.run(onend.fn, onend.scope);

            // Return -------------------------------------------------------------

            return sequence;
        },

        /**
         * Builds the whole tree of tasks.
         * @param[in] {Array} tasks The list of root tasks as expected by the method <code>sequence</code>.
         * @return The root sequence.
         * @see sequence
         */
        root : function (tasks) {
            return this.sequence('Root', tasks);
        },

        /**
         * Sequence factory. A sequence contains a list of tasks. There are two types of tasks:
         * <ul>
         * <li>the normal task let's say</li>
         * <li>the sequence itself: this enables to build a hierarchy to be able to build a hierarchy of tasks, some of
         * those can be Sequences</li>
         * </ul>
         * This method will recursively build the elements of the sequence that it is expected to create. The rule is
         * simple: if an element contains a <code>children</code> property, it will be turned into a sequence,
         * otherwise a simple task. This <code>children</code> property corresponds to the elements of the
         * sub-sequence, and so on. Here is what you can pass to specify them:
         * <ul>
         * <li>a task spec as expected by the method <code>task</code></li>
         * <li>a <code>Function</code> that will return this task spec</li>
         * <li>the name of the property (<code>String</code>) in the <code>scope</code> that contains either
         * directly the task spec or a function that will return it (as above)</li>
         * </ul>
         * @param[in] {String} name The name of the sequence.
         * @param[in] {Array} specs The list of elements to populate the sequence. It can be either a sequence
         * specifications or a task specifications. See full description for more details.
         */
        sequence : function (name, specs) {
            // Sequence creation -----------------------------------------------

            var sequence = new test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Sequence({
                name : name,
                trace : this.trace
            });
            this._toDispose.push(sequence);

            // Children addition -----------------------------------------------

            aria.utils.Array.forEach(specs, function (spec) {
                // -------------------------------------------------------- Task
                if (spec.children == null) {
                    sequence.addTask(this.task(spec));
                } else {
                    // ---------------------------------------------------- Sequence
                    var children = spec.children;

                    if (aria.utils.Type.isString(children)) {
                        children = this.scope[children];
                    }

                    if (aria.utils.Type.isFunction(children)) {
                        children = children.apply(this.scope, spec.args || []);
                    }

                    sequence.addSequence(this.sequence(spec.name, children));
                }
            }, this);

            // Return ----------------------------------------------------------

            return sequence;
        },

        /**
         * Task factory. Non processed properties:
         * <ul>
         * <li><code>name</code></li>
         * <li><code>args</code></li>
         * </ul>
         * <ul>
         * <li><code>method</code> / <code>String</code>: correspond to the <code>fn</code> property of the
         * actual task. The name of the property of the <code>scope</code> object that contains the reference to the
         * actual function.</li>
         * <li><code>asynchronous</code> / <code>Boolean</code>: uses default one if not specified</li>
         * </ul>
         * Non-customizable options (uses the values given to the sequencer):
         * <ul>
         * <li><code>scope</code></li>
         * <li><code>trace</code></li>
         * </ul>
         * @param[in] spec Enhanced task specifications. Defaults and method resolution can be applied. See full
         * description for more details.
         */
        task : function (spec) {
            var cb = this.resolveMethod(spec);

            var task = new test.aria.widgets.form.autocomplete.multiautocomplete.navigation.Task({
                name : spec.name,

                fn : cb.fn,
                scope : cb.scope,
                args : cb.args,
                asynchronous : cb.asynchronous,

                trace : this.trace
            });

            this._toDispose.push(task);

            return task;
        },

        /**
         * Gives a "normalized" callback specifications from the input specifications. Defaults and so on are applied.
         * @param[in] {Object} spec The specifications of a task, or anything embedding a callback specifications
         */
        resolveMethod : function (spec) {
            if (aria.utils.Type.isString(spec)) {
                spec = {
                    fn : spec
                };
            }

            // Input arguments processing --------------------------------------

            // ------------------------------------------------------------ args

            var args = spec.args;

            // -------------------------------------- fn (registered properties)

            var fn = spec.fn;

            if (fn == null) {
                fn = spec.method;
            }

            var registeredProperties;
            if (aria.utils.Type.isString(fn)) {
                registeredProperties = this.__methods[fn];
            }

            if (registeredProperties == null) {
                registeredProperties = {};
            }

            // ----------------------------------------------------------- scope

            var scope = spec.scope;

            if (scope == null) {
                scope = registeredProperties.scope;
            }
            if (scope == null) {
                scope = this.scope;
            }

            // -------------------------------------------- fn (actual callback)

            if (aria.utils.Type.isString(fn)) {
                fn = scope[fn];
            }

            if (!aria.utils.Type.isFunction(fn)) {
                throw new Error('Wrong function definition, got: ' + fn);
            }

            // ---------------------------------------------------- asynchronous

            var asynchronous = spec.asynchronous;

            if (asynchronous == null) {
                asynchronous = registeredProperties.asynchronous;
            }

            if (asynchronous == null) {
                asynchronous = this.asynchronous;
            }

            asynchronous = !!asynchronous;

            // Return ----------------------------------------------------------

            return {
                fn : fn,
                scope : scope,
                args : args,
                asynchronous : asynchronous
            };
        },

        registerMethodsProperties : function (specs) {
            specs = this.HELPERS.arrayFactory(specs);

            aria.utils.Array.forEach(specs, function (spec) {
                var name = spec.name;
                var asynchronous = spec.asynchronous;
                var scope = spec.scope;

                this.__methods[name] = {
                    fn : name,
                    asynchronous : asynchronous,
                    scope : scope
                };
            }, this);
        }
    }
});
