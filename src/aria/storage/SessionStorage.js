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
 * Storage class using HTML5 session storage as data storage/retrieval mechanism.<br />
 * Creating an instance of this class in a browser that doesn't support session storage will raise an error. <br />
 * Web Storage API limit the acceptable values to strings. For json objects a serializer could be passed to the class
 * constructor in order to have serialization and de-serialization of objects. <br />
 * An optional namespace string can be given to avoid collisions between different instances of session storage. <br />
 * Being stored in session storage, the information is available in all pages until the browser is closed.
 */
Aria.classDefinition({
    $classpath : "aria.storage.SessionStorage",
    $extends : "aria.storage.HTML5Storage",
    /**
     * Create an instance of SessionStorage
     * @param {aria.storage.Beans:ConstructorArgs} options Constructor options
     */
    $constructor : function (options) {
        this.$HTML5Storage.constructor.call(this, options, "sessionStorage");
    }
});
