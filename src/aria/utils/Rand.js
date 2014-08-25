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
 * Pseudo random number generator.
 * Generates random numbers from a seed using a linear congruential generator.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.Rand",
    $singleton : true,
    $constructor : function (seed) {
        /**
         * Modulus. Period length
         * @type Number
         */
        this.m = Math.pow(2, 48);

        /**
         * Multiplier, must be greater than 0 and smaller than the modulus
         * @type Number
         */
        this.a = 25214903917;

        /**
         * Increment
         * @type Number
         */
        this.c = 11;

        /**
         * Last random number generated
         * @type Number
         */
        this.last = (seed == null) ? 12483 : seed;
    },
    $prototype : {
        /**
         * Returns an integer number between 0 and 2^48 - 1
         * Uniform distribution
         * @return {Number}
         */
        rand : function () {
            var next = (this.a * this.last + this.c) % this.m;

            this.last = next;

            return next;
        },

        /**
         * Returns a number between 0 and 1
         * Uniform distribution
         * @return {Number}
         */
        rand01 : function () {
            var integer = this.rand();

            return integer / this.m;
        }
    }
});
