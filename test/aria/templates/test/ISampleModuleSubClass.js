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
 * Public interface for the sample module sub class used for tests.
 */
Aria.interfaceDefinition({
    $classpath : "test.aria.templates.test.ISampleModuleSubClass",
    $interface : {
        /**
         * Sample method added to the public interface
         * @return {Object} the contstructor argument (test purpose)
         */
        samplePublicMethod : function () {}
    }
});
