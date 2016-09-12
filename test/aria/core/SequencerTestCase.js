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
 * Test case for the sequencer
 */
Aria.classDefinition({
    $classpath : "test.aria.core.SequencerTest",
    $extends : "aria.jsunit.TestCase",
    $destructor : function () {
        if (this.seq != null) {
            this.seq.$dispose();
            this.seq = null;
        }
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {
        setUp : function () {
            if (this.seq != null) {
                this.seq.$dispose();
            }
            this.seq = new aria.core.Sequencer();
            this.seq.$on({
                '*' : this.checkEvent,
                'start' : this.onEvents,
                'taskStart' : this.onEvents,
                'taskError' : this.onEvents,
                'end' : this.onEvents,
                scope : this
            });
        },
        onEvents : function (evt) {
            try {
                this.checkExpectedEvent(evt);
                if (evt.name == 'taskError' && this.stopProcessingOnError === true) {
                    evt.continueProcessing = false;
                } else if (evt.name == 'end') {
                    // check it is still processing in the last event (end)
                    this.assertTrue(this.seq._state == this.seq.STATE_PROCESSING);
                    // check with a timer that it is no longer processing later
                    aria.core.Timer.addCallback({
                        fn : this.endTheTest,
                        scope : this,
                        delay : 1
                    });
                }
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },
        endTheTest : function () {
            try {
                var seq = this.seq;
                this.assertTrue(seq._state == seq.STATE_IDLE);
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
            this.notifyTestEnd(this.testName);
        },

        tasks : {
            mySimpleTask : function (args) {
                this.onEvents({
                    name : 'test:mySimpleTask',
                    src : this,
                    args : args
                });
            },
            myAsyncTask : function (args) {
                this.onEvents({
                    name : 'test:myAsyncTask',
                    src : this,
                    args : args
                });
                aria.core.Timer.addCallback({
                    fn : this.tasks.myAsyncTaskEnd,
                    args : args,
                    scope : this,
                    delay : 5
                });
            },
            myAsyncTaskEnd : function (args) {
                this.onEvents({
                    name : 'test:myAsyncTaskEnd',
                    src : this,
                    args : args
                });
                this.seq.notifyTaskEnd(args.id, this.stopProcessingOnAsyncTask);
            },
            myErrorTask : function (args) {
                this.onEvents({
                    name : 'test:myErrorTask',
                    src : this,
                    args : args
                });
                throw 'ErrorRaised';
            }
        },

        /**
         * Call the sequencer with an empty task list and check that the begin and end events of the sequencer are
         * correctly raised.
         */
        testAsyncEmptyTaskList : function () {
            var seq = this.seq;
            this.stopProcessingOnError = false;
            this.stopProcessingOnAsyncTask = false;
            this.testName = 'testAsyncEmptyTaskList';
            this.registerExpectedEventsList([{
                        name : 'start',
                        src : this.seq
                    }, {
                        name : 'end',
                        src : this.seq
                    }]);
            this.assertTrue(seq._tasks.length === 0);
            this.assertTrue(seq._state == seq.STATE_IDLE);
            seq.start();
        },

        /**
         * Call the sequencer with synchronous and asynchronous tasks and check that these tasks are correctly called
         * and that the events of the sequencer are correctly raised.
         */
        testAsyncSimpleSequencer : function () {
            var seq = this.seq;
            this.stopProcessingOnError = false;
            this.stopProcessingOnAsyncTask = false;
            this.testName = 'testAsyncSimpleSequencer';
            this.registerExpectedEventsList([{
                        name : 'start',
                        src : this.seq
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 0,
                        taskName : 'MySimpleTask1',
                        taskArgs : 'mySimpleTaskParam1'
                    }, {
                        name : 'test:mySimpleTask',
                        src : this,
                        args : {
                            name : 'MySimpleTask1',
                            id : 0,
                            args : 'mySimpleTaskParam1'
                        }
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 1,
                        taskName : 'MyAsyncTask',
                        taskArgs : 'myAsyncTaskParam'
                    }, {
                        name : 'test:myAsyncTask',
                        src : this,
                        args : {
                            name : 'MyAsyncTask',
                            id : 1,
                            args : 'myAsyncTaskParam'
                        }
                    }, {
                        name : 'test:myAsyncTaskEnd',
                        src : this,
                        args : {
                            name : 'MyAsyncTask',
                            id : 1,
                            args : 'myAsyncTaskParam'
                        }
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 2,
                        taskName : 'MySimpleTask2',
                        taskArgs : 'mySimpleTaskParam2'
                    }, {
                        name : 'test:mySimpleTask',
                        src : this,
                        args : {
                            name : 'MySimpleTask2',
                            id : 2,
                            args : 'mySimpleTaskParam2'
                        }
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 3,
                        taskName : 'MyErrorTask',
                        taskArgs : 'MyErrorTaskParam'
                    }, {
                        name : 'test:myErrorTask',
                        src : this,
                        args : {
                            name : 'MyErrorTask',
                            id : 3,
                            args : 'MyErrorTaskParam'
                        }
                    }, {
                        name : 'taskError',
                        src : this.seq,
                        taskId : 3,
                        taskName : 'MyErrorTask',
                        taskArgs : 'MyErrorTaskParam',
                        exception : 'ErrorRaised'
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 4,
                        taskName : 'MySimpleTask3',
                        taskArgs : 'mySimpleTaskParam3'
                    }, {
                        name : 'test:mySimpleTask',
                        src : this,
                        args : {
                            name : 'MySimpleTask3',
                            id : 4,
                            args : 'mySimpleTaskParam3'
                        }
                    }, {
                        name : 'end',
                        src : this.seq
                    }]);

            seq.addTask({
                name : "MySimpleTask1",
                fn : this.tasks.mySimpleTask,
                scope : this,
                args : "mySimpleTaskParam1"
            });
            seq.addTask({
                name : "MyAsyncTask",
                fn : this.tasks.myAsyncTask,
                scope : this,
                args : "myAsyncTaskParam",
                asynchronous : true
            });
            seq.addTask({
                name : "MySimpleTask2",
                fn : this.tasks.mySimpleTask,
                scope : this,
                args : "mySimpleTaskParam2"
            });
            seq.addTask({
                name : "MyErrorTask",
                fn : this.tasks.myErrorTask,
                scope : this,
                args : "MyErrorTaskParam"
            });
            seq.addTask({
                name : "MySimpleTask3",
                fn : this.tasks.mySimpleTask,
                scope : this,
                args : "mySimpleTaskParam3"
            });
            this.assertTrue(seq._tasks.length == 5);
            this.assertTrue(seq._state == seq.STATE_IDLE);
            seq.start();
            this.assertTrue(seq._state == seq.STATE_PROCESSING);
        },

        /**
         * Call the sequencer with three tasks, but the second one stops the process by calling notifyTaskEnd with false
         * as a second parameter Check that the events of the sequencer are correctly raised.
         */
        testAsyncAsyncTaskStopProcessing : function () {
            var seq = this.seq;
            this.testName = 'testAsyncAsyncTaskStopProcessing';
            this.stopProcessingOnError = false;
            this.stopProcessingOnAsyncTask = true;
            this.registerExpectedEventsList([{
                        name : 'start',
                        src : this.seq
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 0,
                        taskName : 'MySimpleTask1',
                        taskArgs : 'mySimpleTaskParam1'
                    }, {
                        name : 'test:mySimpleTask',
                        src : this,
                        args : {
                            name : 'MySimpleTask1',
                            id : 0,
                            args : 'mySimpleTaskParam1'
                        }
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 1,
                        taskName : 'MyAsyncTask',
                        taskArgs : 'myAsyncTaskParam'
                    }, {
                        name : 'test:myAsyncTask',
                        src : this,
                        args : {
                            name : 'MyAsyncTask',
                            id : 1,
                            args : 'myAsyncTaskParam'
                        }
                    }, {
                        name : 'test:myAsyncTaskEnd',
                        src : this,
                        args : {
                            name : 'MyAsyncTask',
                            id : 1,
                            args : 'myAsyncTaskParam'
                        }
                    },
                    // MySimpleTask3 is not executed
                    {
                        name : 'end',
                        src : this.seq
                    }]);
            seq.addTask({
                name : "MySimpleTask1",
                fn : this.tasks.mySimpleTask,
                scope : this,
                args : "mySimpleTaskParam1"
            });
            seq.addTask({
                name : "MyAsyncTask",
                fn : this.tasks.myAsyncTask,
                scope : this,
                args : "myAsyncTaskParam",
                asynchronous : true
            });
            seq.addTask({
                name : "MySimpleTask3",
                fn : this.tasks.mySimpleTask,
                scope : this,
                args : "mySimpleTaskParam3"
            });
            this.assertTrue(seq._tasks.length == 3);
            this.assertTrue(seq._state == seq.STATE_IDLE);
            seq.start();
            this.assertTrue(seq._state == seq.STATE_PROCESSING);
        },

        /**
         * Call the sequencer with three synchronous tasks, but the second one raises an exception and the process is
         * stopped Check that the events of the sequencer are correctly raised.
         */
        testAsyncErrorStopProcessing : function () {
            var seq = this.seq;
            this.testName = 'testAsyncErrorStopProcessing';
            this.stopProcessingOnError = true;
            this.registerExpectedEventsList([{
                        name : 'start',
                        src : this.seq
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 0,
                        taskName : 'MySimpleTask1',
                        taskArgs : 'mySimpleTaskParam1'
                    }, {
                        name : 'test:mySimpleTask',
                        src : this,
                        args : {
                            name : 'MySimpleTask1',
                            id : 0,
                            args : 'mySimpleTaskParam1'
                        }
                    }, {
                        name : 'taskStart',
                        src : this.seq,
                        taskId : 1,
                        taskName : 'MyErrorTask',
                        taskArgs : 'MyErrorTaskParam'
                    }, {
                        name : 'test:myErrorTask',
                        src : this,
                        args : {
                            name : 'MyErrorTask',
                            id : 1,
                            args : 'MyErrorTaskParam'
                        }
                    }, {
                        name : 'taskError',
                        src : this.seq,
                        taskId : 1,
                        taskName : 'MyErrorTask',
                        taskArgs : 'MyErrorTaskParam',
                        exception : 'ErrorRaised'
                    },
                    // MySimpleTask3 is not executed
                    {
                        name : 'end',
                        src : this.seq
                    }]);
            seq.addTask({
                name : "MySimpleTask1",
                fn : this.tasks.mySimpleTask,
                scope : this,
                args : "mySimpleTaskParam1"
            });
            seq.addTask({
                name : "MyErrorTask",
                fn : this.tasks.myErrorTask,
                scope : this,
                args : "MyErrorTaskParam"
            });
            seq.addTask({
                name : "MySimpleTask3",
                fn : this.tasks.mySimpleTask,
                scope : this,
                args : "mySimpleTaskParam3"
            });
            this.assertTrue(seq._tasks.length == 3);
            this.assertTrue(seq._state == seq.STATE_IDLE);
            seq.start();
            this.assertTrue(seq._state == seq.STATE_PROCESSING);
        },
        /**
         * Check that errors are correctly raised when addTask is called with an invalid parameter. Don't really start
         * the sequencer.
         */
        testAddTaskErrors : function () {
            var seq = this.seq;

            // Errors:
            seq.addTask();
            this.assertErrorInLogs(seq.INVALID_TASKDESC);
            seq.addTask({});
            this.assertErrorInLogs(seq.INVALID_TASKDESC);
            seq.addTask({
                name : '',
                fn : this.testAddTaskErrors,
                scope : ''
            });
            this.assertErrorInLogs(seq.INVALID_TASKDESC);
            seq.addTask({
                name : 'testTask',
                fn : '',
                scope : this
            });
            this.assertErrorInLogs(seq.INVALID_TASKDESC);
            seq.addTask({
                name : 'testTask',
                fn : this.testAddTaskErrors,
                scope : ''
            });
            this.assertErrorInLogs(seq.INVALID_TASKDESC);

            // No error:
            seq.addTask({
                name : 'testTask',
                fn : this.testAddTaskErrors,
                scope : this
            });
        }
    }
});
