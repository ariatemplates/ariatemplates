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
 * Sample class defining some events
 */
Aria.classDefinition({
    $classpath : 'test.aria.core.test.ClassA',
    $events : {
        "start" : "sample event raised when start() begins",
        "end" : {
            description : "sample event raised when start() ends",
            properties : {
                endCount : "{Integer} the counter value"
            }
        },
        "countChange" : {
            description : "raised when count property changes",
            properties : {
                oldCountValue : "{Integer} the previous value of the count property",
                newCountValue : "{Integer} the new value of the count property"
            }
        }
    },
    $constructor : function () {
        this.count = 0;
    },
    $prototype : {
        /**
         * Sample method raising start and end events
         */
        start : function () {
            // start event with no arg
            this.$raiseEvent("start");

            // end argument
            this.$raiseEvent({
                name : "end",
                endCount : this.count
            });
        },
        /**
         * Sample method that increments the count property
         * @param {Integer} incr increment value (can be negative)
         */
        incrementCount : function (incr) {
            if (incr != 0) {
                var prevCount = this.count;
                this.count += incr;
                this.$raiseEvent({
                    name : "countChange",
                    oldCountValue : prevCount,
                    newCountValue : this.count
                });
            }
        },
        /**
         * Sample method to test errors if invalid event names are used
         */
        raiseInvalidEvent : function () {
            this.$raiseEvent("sampleInvalidEvent");
        }
    }
});
