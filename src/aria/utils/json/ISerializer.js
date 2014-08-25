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
var Aria = require("../../Aria");


/**
 * Interface definition for JSON serializers. A Serializer is a class able to convert an object into a string and
 * vice-versa. Serializers are utility classes, this interface defines the method that might be required by their users.
 */
module.exports = Aria.interfaceDefinition({
    $classpath : "aria.utils.json.ISerializer",
    $interface : {
        /**
         * Convert a value to its string representation.
         * @param {Object|Array|String|Number|Boolean|Date|RegExp|Function} item Item to serialize
         * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeOptions} options Options for the serialization
         * @return {String} the serialized item. It is set to null if there is an error during the serialization
         * @throws SyntaxError
         */
        serialize : function (item, options) {},

        /**
         * Parse a string as JSON.
         * @param {String} string The string to parse as JSON
         * @return {Object} JSON object
         * @throws SyntaxError
         */
        parse : function (string) {}
    }
});
