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


/**
 * Default interface for a content provider
 */
module.exports = Aria.interfaceDefinition({
    $classpath : "aria.embed.IContentProvider",
    $events : {
        "contentChange" : {
            description : "Raised when the content associated to one or more placeholder paths changes.",
            properties : {
                contentPaths : "{Array} contains the paths whose corresponding content has changed."
            }
        }
    },
    $interface : {
        /**
         * Called by the placeholder manager to get the content configuration, which will be used by the placehoder to
         * build its content
         * @param {String} contentPath The content path which will be used to retrieve the configuration
         * @return {String|Object|Array} the content configuration
         */
        getContent : function (contentPath) {}
    }
});
