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
 * TestCommunicator is a DOM element that will be used to communicated with the test shell (for instance selenium).<br />
 * A TestCommunicator is defined by a contract made of the HTML id (which is expected by the shell) and the content
 * (only certain values might be accepted for instance)
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.TestCommunicator",
    $constructor : function (conf) {
        /**
         * The HTML id to use for the communicator
         * @type String
         */
        this.id = conf.id;

        /**
         * Text content that will be inserted inside the communicator
         * @type String
         */
        this.content = "";

        this.init(conf);
    },
    $destructor : function () {
        // Empty because we didn't call the JsObject constructor
    },
    $prototype : {
        /**
         * @private
         */
        init : function (conf) {
            var document = Aria.$window.document;
            var domElement = document.createElement("div");

            // Hide the element while still allowing for webdriver to retrieve it
            domElement.style.cssText = ["display:block", "visibility:visible", "height:1px", "width:1px",
                    "overflow:hidden"].join(";");

            domElement.id = this.id;
            document.body.appendChild(domElement);

            var content = conf.content;
            this.content = content;

            // Insert the content as textContent/innerText to avoid interpretation
            domElement.appendChild(document.createTextNode(content));
        }
    }
});
