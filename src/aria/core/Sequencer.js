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
var ariaCoreTimer = require("./Timer");


/**
 * This class allows to sequence several tasks in an asynchronous way. This is particularly useful for long-running
 * processes that need to notify HTML-based UIs of process progression (HTML UIs are only refreshed when the main thread
 * pauses)
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.Sequencer",
    $events : {
        "start" : "raised when the sequencer starts",
        "end" : "raised when all taks have been completed",
        "taskStart" : {
            description : "raised when a task starts: note task processors will automatically receive such events but will not be registered as listeners, so that they only receive the event for their own task",
            properties : {
                taskId : "{Number} task id (position in task list: first is 0)",
                taskName : "{String} name of the task",
                taskArgs : "{Object} arguments associated to the task"
            }
        },
        "taskError" : {
            description : "raised when an exception is caught during a task execution",
            properties : {
                taskId : "{Number} task id (position in task list: first is 0)",
                taskName : "{String} name of the task",
                taskArgs : "{Object} arguments associated to the task",
                exception : "{Error} the exception object",
                continueProcessing : "{Boolean} tells if processing should stop or not: can be changed by the listener - default:true"
            }
        }
    },
    $constructor : function () {
        /**
         * State of the Sequencer, either STATE_IDLE or STATE_PROCESSING
         * @type Integer
         * @protected
         */
        this._state = this.STATE_IDLE;

        /**
         * List of task to be performed
         * @type Array
         * @protected
         */
        this._tasks = [];
    },
    $destructor : function () {
        this._tasks = null;
        this._state = null;
    },
    $statics : {
        /**
         * Enum to qualify the sequencer state. No tasks running
         * @type Number
         */
        STATE_IDLE : 0,

        /**
         * Enum to qualify the sequencer state. Pending task completion
         * @type Number
         */
        STATE_PROCESSING : 1,

        // ERROR MESSAGE:
        INVALID_TASKDESC : "Invalid task description",
        ALREADY_PROCESSING : "Sequencer is in state PROCESSING, cannot start() again"
    },
    $prototype : {
        /**
         * Append a task to the task list. Tasks will be triggered through events - as such task processors are
         * considered as special listeners for the Sequencer object <br />
         * Note: asynchronous tasks should call the notifyTaskEnd() method of the sequencer
         * @example
         *
         * <pre>
         * addTask({
         *      name: 'task name'
         *      fn: obj.doTask,
         *      scope: obj,
         *      args: {x:'Sample Argument&quot;,y:123}
         *      asynchronous: true
         * });
         * </pre>
         *
         * @param {Object} taskDesc the task description object
         *
         * <pre>
         * {
         *      name: {String} task name - mandatory,
         *      fn: {Function} function to be executed - mandatory,
         *      scope: {Object} scope for the task object - mandatory,
         *      args: {Object} arguments passed to the task function - optional,
         *      asynchronous: {Boolean} Whether or not the task is asynchronous
         * });
         * </pre>
         */
        addTask : function (taskDesc) {
            if (!taskDesc || typeof(taskDesc.name) != 'string' || !taskDesc.name || typeof(taskDesc.fn) != 'function'
                    || typeof(taskDesc.scope) != 'object') {
                return this.$logError(this.INVALID_TASKDESC);
            }

            this._tasks.push(taskDesc);
        },

        /**
         * Start the task sequence
         */
        start : function () {
            if (this._state == this.STATE_PROCESSING) {
                return this.$logWarn(this.ALREADY_PROCESSING);
            }

            this._state = this.STATE_PROCESSING;
            this.$raiseEvent("start");

            if (this._tasks.length > 0) {
                ariaCoreTimer.addCallback({
                    fn : this._execTask,
                    scope : this,
                    delay : 12,
                    args : {
                        taskId : 0
                    }
                });
            } else {
                // raises the end event and ends the process
                this._end();
                // It may be found that it is better to call it
                // asynchronously so that it is always true that
                // immediately after calling the start method
                // the end event has not yet been called (which could
                // be a problem sometimes)
                /*
                 * aria.core.Timer.addCallback({ fn:this._end, scope:this, delay:1 })
                 */
            }
        },

        /**
         * Internal method called through the Time callback to execute a specific task
         * @param {Integer} taskId
         * @protected
         */
        _execTask : function (args) {
            var taskId = args.taskId;
            var sz = this._tasks.length;
            if (taskId == null || taskId > sz - 1) {
                return;
            }
            var task = this._tasks[taskId];
            var continueProcessing = true;
            var evt = {
                name : "taskStart",
                src : this,
                taskId : taskId,
                taskName : task.name,
                taskArgs : task.args
            };

            try {
                // raise event (for object listeners)
                this.$raiseEvent(evt);

                // call task processor (note: task processor are not registered as listeners)
                task.id = taskId;
                task.taskMgr = this;
                task.fn.call(task.scope, task, task.args);

            } catch (ex) {
                evt.name = "taskError";
                evt.exception = ex;
                evt.continueProcessing = true;

                this.$raiseEvent(evt);
                if (!evt.continueProcessing) {
                    continueProcessing = false;
                }
            }

            if (task.asynchronous !== true) {
                this.notifyTaskEnd(taskId, !continueProcessing);
            }
        },

        /**
         * Notifies the sequencer of the end of a task. This is automatically called for synchronous task - but must be
         * called by asynchronous tasks
         * @param {Integer} taskId the task id passed when the task processor is called
         * @param {Boolean} terminate force the sequencer termination [optional - default: false]
         */
        notifyTaskEnd : function (taskId, terminate) {
            // note: we have to check if object has not already been disposed as end task
            // may call the dispose method - however this should be done on the sequencer
            // 'end' event and not in the last task
            if (this._tasks == null) {
                return;
            }

            var sz = this._tasks.length;
            if (terminate !== true) {
                if (taskId < sz - 1) {
                    // this is not the last task
                    ariaCoreTimer.addCallback({
                        fn : this._execTask,
                        scope : this,
                        delay : 1,
                        args : {
                            taskId : taskId + 1
                        }
                    });
                } else {
                    // last task
                    terminate = true;
                }
            }
            if (terminate === true) {
                this._end();
            }
        },

        /**
         * Internal function called to notify of the end of the process
         * @protected
         */
        _end : function () {
            // end task processing
            this.$raiseEvent("end");
            this._state = this.STATE_IDLE;
        }
    }
});
