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
 * Mock for the DownloadMgr class
 */
Aria.classDefinition({
    $classpath : "test.aria.core.DownloadMgrMock",
    $singleton : true,
    $events : {
        'loadFileContent' : {
            'description' : 'raised when the loadFileContent method is called',
            'properties' : {
                'logicalPath' : 'logicalPath parameter of loadFileContent',
                'content' : 'content parameter of loadFileContent',
                'hasErrors' : 'hasErrors parameter of loadFileContent'
            }
        }
    },
    $constructor : function () {},
    $prototype : {
        // To be completed with other functions when needed
        loadFileContent : function (logicalPath, content, hasErrors) {
            if (content) {
                content = content.replace(/\r\n|\r/g, '\n');
            }
            this.$raiseEvent({
                name : 'loadFileContent',
                logicalPath : logicalPath,
                content : content,
                hasErrors : hasErrors
            });
        },

        getURLWithTimestamp : function (url) {
            return url;
        }
    }
});
