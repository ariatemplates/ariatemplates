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

Aria.classDefinition({
    $classpath : "test.aria.utils.Profiling",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Profiling"],
    $prototype : {
        testCounter : function () {
            var profile = aria.utils.Profiling;

            this.assertEquals(profile.getCounterValue("a"), 0);

            profile.incrementCounter("a");
            this.assertEquals(profile.getCounterValue("a"), 1);
            this.assertEquals(profile.getCounterValue("b"), 0);
            this.assertEquals(profile.getAvgSplitCounterValue("a"), 0);

            profile.incrementCounter("a", 3);
            this.assertEquals(profile.getCounterValue("a"), 4);

            profile.incrementCounter("a");
            this.assertEquals(profile.getCounterValue("a"), 5);

            profile.incrementCounter("b", 2);
            this.assertEquals(profile.getCounterValue("b"), 2);
            this.assertEquals(profile.getCounterValue("a"), 5);

            // Do some splits
            profile.resetCounter("a");
            this.assertEquals(profile.getCounterValue("a"), 0);
            this.assertEquals(profile.getCounterValue("b"), 2);
            this.assertEquals(profile.getAvgSplitCounterValue("a"), 5);
            this.assertEquals(profile.getAvgSplitCounterValue("b"), 0);

            profile.incrementCounter("a", 11);
            this.assertEquals(profile.getCounterValue("a"), 11);
            profile.resetCounter("a");
            this.assertEquals(profile.getAvgSplitCounterValue("a"), 8);

            // Do some empty splits
            profile.resetCounter("a");
            profile.resetCounter("a");
            profile.resetCounter("a");
            profile.resetCounter("a");
            this.assertEquals(profile.getAvgSplitCounterValue("a"), 8);

            profile.incrementCounter("a");
            profile.incrementCounter("a", 1);
            this.assertEquals(profile.getCounterValue("a"), 2);
            profile.resetCounter("a");
            this.assertEquals(profile.getAvgSplitCounterValue("a"), 6);

        }
    }
});