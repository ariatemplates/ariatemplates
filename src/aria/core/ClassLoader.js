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
 * With the migration to noder-js, this class is no longer supported.
 */
Aria.classDefinition({
    $classpath : "aria.core.ClassLoader",
    $constructor : function () {
        this.$logError(this.NODER_MIGRATION);
    },
    $statics : {
        NODER_MIGRATION : "With the migration to noder-js, this class is no longer supported.",
        CLASS_LOAD_ERROR : aria.core.MultiLoader.LOAD_ERROR,
        CLASS_LOAD_FAILURE : aria.core.MultiLoader.LOAD_ERROR,
        MISSING_CLASS_DEFINITION : aria.core.MultiLoader.LOAD_ERROR
    }
});
