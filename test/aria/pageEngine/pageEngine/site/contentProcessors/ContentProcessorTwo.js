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
 * Content processor
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.site.contentProcessors.ContentProcessorTwo",
    $constructor : function () {
        this.count = 0;
    },
    $prototype : {
        processContent : function (content) {
            this.count++;
            if (this.count % 2 === 0) {
                return {
                    value : content.value.replace(/<\/div>/, "CP2<\/div>"),
                    contentType : "does not exist"
                };
            } else {
                return {
                    value : content.value.replace(/<\/div>/, "CP2<\/div>")
                };
            }
        }
    }
});