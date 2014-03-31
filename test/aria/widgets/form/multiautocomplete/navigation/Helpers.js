/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Various generic functions.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.navigation.Helpers",
    $dependencies : ["aria.utils.Type", "aria.utils.Array"],
    $singleton : true,
    $statics : {
        /***************************************************************************************************************
         * Array
         **************************************************************************************************************/

        /**
         * Repeats an item a certain number of times to build an array. This results of an array whose size corresponds
         * to the number of times the item was repeated.
         * @param[in] {Number} times The number of times to repeat the item.
         * @return {Array} The array with the same item repeated the given number of times.
         */
        repeat : function (item, times) {
            var result = [];

            for (var i = 0; i < times; i++) {
                result.push(item);
            }

            return result;
        },

        /**
         * As for each but builds an array with the return value at each iteration and returns the whole. See
         * <code>aria.utils.Array.forEach</code> for more information on the parameters. The only thing which is
         * different here is that the return value of the provided callback function is meaningful since it is used to
         * populate the output array.
         * @return {Array} The transformed array.
         * @see aria.utils.Array.forEach
         */
        map : function (collection, cb, scope) {
            var array = [];

            aria.utils.Array.forEach(collection, function (item) {
                array.push(cb.apply(this, arguments));
            }, scope);

            return array;
        },

        /**
         * A factory for array creation. This function ensures to gave an array at output. However, the resulting array
         * depends on the type of the output:
         * <ul>
         * <li><code>Null</code> or <code>Undefined</code>: a new empty array is returned</li>
         * <li><code>Array</code>: the input is returned as is, without any copy</li>
         * <li>anything else: the input value is wrapped by a new array which is returned</li>
         * </ul>
         * @param[in] input Any input. See full description for more details.
         * @return {Array} An array for sure. See full description for more details.
         */
        arrayFactory : function (input) {
            if (!aria.utils.Type.isArray(input)) {
                if (input == null) {
                    return [];
                }

                return [input];
            }

            return input;
        },

        /**
         * Inserts the given item at the given index into the given array. The native <code>splice</code> method is
         * used behind, and in a generic way: this means that the given array object only has to behave like an array,
         * not necessarily be an instance of it.
         * @param[in,out] {~Array} The array to modify
         * @param[in] item The item to insert.
         * @param[in] index The index at which to insert the item.
         * @return {Array} The modified array
         */
        insertInArray : function (array, item, index) {
            Array.prototype.splice.call(array, index, 0, item);
            return array;
        }
    }
});
