/*
 * Copyright 2016 Amadeus s.a.s.
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
  * Base class for IO tests
  */
 Aria.classDefinition({
     $classpath : "test.aria.core.io.IOBase",
     $extends : "aria.jsunit.TestCase",
     $prototype : {
         tearDown : function () {
             // Check that we didn't forget any timer on IO
             var timeOut = aria.core.IO._timeOut;
             var timers = 0, id;
             for (id in timeOut) {
                 if (timeOut.hasOwnProperty(id)) {
                     timers += 1;
                 }
             }
             this.assertEquals(timers, 0, "Undisposed pending timers on aria.core.IO");

             // Check that we don't have pending requests
             var pendingRequests = aria.core.IO.pendingRequests;
             var requests = 0;
             for (id in pendingRequests) {
                 if (pendingRequests.hasOwnProperty(id)) {
                     requests += 1;
                 }
             }

             this.assertEquals(requests, 0, "Undisposed pending requests on aria.core.IO");
         }
     }
 });
