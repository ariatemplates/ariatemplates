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
 * Application and performances profiling utility
 * @class aria.utils.Profiling
 * @singleton
 */
Aria.classDefinition({
    $classpath : 'aria.utils.Profiling',
    $singleton : true,
    $constructor : function () {
        /**
         * Date used to compare with time stamps
         * @type Date
         */
        this._startTime = null;

        /**
         * Array of profiling logs
         * @type Array
         */
        this._logs = null;

        /**
         * Maps of logs per classpath
         */
        this._logsPerClasspath = null;

        /**
         * Number of logs
         * @type Number
         */
        this._nbLogs = 0;

        /**
         * Ids used to match measures
         * @type Number
         */
        this._ids = 1;

        /**
         * Profiling display DIV
         * @type HTMLElement
         */
        this._displayDiv = null;

        /**
         * Map of counters
         * @type Object
         */
        this._counters = {};

        /**
         * Map of counter splits
         * @type Object
         */
        this._counterSplits = {};

        if (Aria.enableProfiling) {
            this.restartProfiling(true);
        }
    },
    $destructor : function () {
        this._logs = null;
        this._logsPerClasspath = null;
        this._displayDiv = null;
    },
    $prototype : {

        /**
         * Reinitialize the profiling
         * @param {Boolean} firstStart
         */
        restartProfiling : function (firstStart) {
            this._startTime = (firstStart) ? Aria._start : new Date();
            if (firstStart) {
                this._logs = [{
                            classpath : "Aria",
                            msg : "Framework initialization",
                            start : Aria._start
                        }, {
                            classpath : "Aria",
                            stop : (new Date()).getTime()
                        }];
                this._nbLogs = 2;
            } else {
                this._logs = [];
                this._nbLogs = 0;
            }

            // map function on JsObject prototype
            aria.core.JsObject.prototype.$logTimestamp = function (msg, classpath) {
                classpath = classpath ? classpath : this.$classpath;
                aria.utils.Profiling.logTimestamp(classpath, msg);
            };
            aria.core.JsObject.prototype.$startMeasure = function (msg, classpath) {
                classpath = classpath ? classpath : this.$classpath;
                return aria.utils.Profiling.startMeasure(classpath, msg);
            };
            aria.core.JsObject.prototype.$stopMeasure = function (id, classpath) {
                classpath = classpath ? classpath : this.$classpath;
                aria.utils.Profiling.stopMeasure(classpath, id);
            };
        },

        /**
         * Process measures to associate starts and stops, sort by classpath
         */
        process : function () {
            this._logsPerClasspath = {};
            var i, j, iLog, jLog, max, end;
            max = 0;
            for (i = 0; i < this._nbLogs; i++) {
                iLog = this._logs[i];
                if (iLog.start && !("length" in iLog)) {
                    for (j = i + 1; j < this._nbLogs; j++) {
                        jLog = this._logs[j];
                        if (jLog.stop && jLog.classpath == iLog.classpath) {
                            if (!jLog.id || iLog.id === jLog.id) {
                                this._logs.splice(j, 1);
                                this._nbLogs--;
                                iLog.length = jLog.stop - iLog.start;
                                iLog.start = iLog.start - this._startTime;
                                break;
                            }
                        }
                    }
                    if (!("length" in iLog)) {
                        // no matching call to $stopMeasure
                        iLog.length = 0;
                        iLog.start = iLog.start - this._startTime;
                    }
                } else if (iLog.timestamp) {
                    iLog.start = iLog.timestamp - this._startTime;
                    iLog.length = 0;
                    delete iLog.timestamp;
                }

                if (!"msg" in iLog) {
                    iLog.msg = 'NO MESSAGE';
                }

                end = iLog.start + iLog.length;
                if (end > max) {
                    max = end;
                }

                // add in processed logs object
                if (!this._logsPerClasspath[iLog.classpath]) {
                    this._logsPerClasspath[iLog.classpath] = {};
                }
                var cpLog = this._logsPerClasspath[iLog.classpath];
                if (!cpLog[iLog.msg]) {
                    cpLog[iLog.msg] = [0];
                }
                cpLog[iLog.msg].push(iLog);
                cpLog[iLog.msg][0] += iLog.length;
            }
            this._logsPerClasspath._max = max;
        },

        /**
         * Show an alert containing profiling data and then clears corresponding data.
         * @param {HTMLElement} div
         */
        showProfilingData : function (div) {

            if (this._displayDiv != null) {
                return;
            }

            this.process();

            var document = Aria.$window.document;
            this._displayDiv = document.createElement('div');
            this._displayDiv.style.cssText = "position:absolute;top:0px;left:0px;width:100%;height:100%; z-index:99999999;overflow:auto;background:white";

            document.body.appendChild(this._displayDiv);

            Aria.loadTemplate({
                classpath : 'aria.utils.ProfilingDisplay',
                div : this._displayDiv,
                data : aria.utils.Json.copy(this._logsPerClasspath, true)
            });
        },

        /**
         * Hide profiling display
         */
        hideProfilingData : function () {
            this._displayDiv.innerHTML = '';
            if (this._displayDiv != null) {
                aria.utils.Dom.removeElement(this._displayDiv);
            }
            this._displayDiv = null;
        },

        /**
         * Log a message with a time stamp
         * @param {String} classpath
         * @param {String} msg
         */
        logTimestamp : function (classpath, msg) {
            this._logs[this._nbLogs++] = {
                classpath : classpath,
                msg : msg,
                timestamp : (new Date()).getTime()
            };
        },

        /**
         * Starts a time measure. Returns the id used to stop the measure.
         * @param {String} classpath
         * @param {String} msg
         * @return {Number} profilingId
         */
        startMeasure : function (classpath, msg) {
            this._logs[this._nbLogs++] = {
                classpath : classpath,
                msg : msg,
                id : this._ids,
                start : (new Date()).getTime()
            };
            return this._ids++;
        },

        /**
         * Stops a time measure. If the id is not specified, stop the last measure with this classpath.
         * @param {String} classpath
         * @param {String} id
         */
        stopMeasure : function (classpath, id) {
            this._logs[this._nbLogs++] = {
                classpath : classpath,
                id : id,
                stop : (new Date()).getTime()
            };
        },

        /**
         * Increment a counter with a given name by an arbitrary value.
         * @param {String} name Name of the counter
         * @param {Number} step Value to be added, Default 1
         */
        incrementCounter : function (name, step) {
            if (this._counters.hasOwnProperty(name)) {
                this._counters[name] += (step || 1);
            } else {
                this._counters[name] = (step || 1);
            }
        },

        /**
         * Reset a counter with a given name to 0. The last value is saved as a split.
         * @param {String} name Name of the counter
         * @param {String} reason Additional information on the split, it is useful for computing averages
         */
        resetCounter : function (name, reason) {
            if (!this._counters[name]) {
                return;
            }

            if (!this._counterSplits[name]) {
                this._counterSplits[name] = [];
            }

            this._counterSplits[name].push({
                value : this._counters[name],
                reason : reason
            });

            this._counters[name] = 0;
        },

        /**
         * Get the current value of a counter.
         * @param {String} name Name of the counter
         * @return {Number}
         */
        getCounterValue : function (name) {
            return this._counters[name] || 0;
        },

        /**
         * Get the average value of the splits on a given counter. The current value of the counter is not taken into
         * account. If needed call a resetCounter before this method
         * @param {String} name Name of the counter
         * @param {String} reason Filter only the splits with this reason value
         * @return {Number}
         */
        getAvgSplitCounterValue : function (name, reason) {
            if (!this._counterSplits[name]) {
                return 0;
            }

            var total = 0;
            for (var i = 0, len = this._counterSplits[name].length; i < len; i += 1) {
                total += this._counterSplits[name][i].value;
            }

            return total / len;
        }

    }
});
