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
 * This interface is still experimental, it may change in the future without notice. It describes the features that
 * every robot implementation should provide.
 * @private
 */
Aria.interfaceDefinition({
    $classpath : "aria.jsunit.IRobot",
    $interface : {
        /**
         * Set of keys accepted by the keyPress and keyRelease methods.
         * @type Object
         */
        KEYS : {
            $type : "Object"
        },

        /**
         * Returns true if this implementation of the robot is probably usable, and false if it is not usable.
         */
        isUsable : function () {},

        /**
         * Initializes the robot. Do not call any other method of the robot (except isUsable) before calling this method
         * and waiting for it to call its callback.
         * @param {aria.core.CfgBeans.Callback} callback called when the robot is ready to be used.
         */
        initRobot : {
            $type : "Function",
            $callbackParam : 0
        },

        /**
         * Sets the mouse position, with screen coordinates.
         * @param {Object} position position where to set the mouse (given as an object with x and y properties, in
         * screen coordinates)
         * @param {aria.core.CfgBeans.Callback} callback
         */
        absoluteMouseMove : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Sets the mouse position, with coordinates relative to the viewport.
         * @param {Object} position position where to set the mouse (given as an object with x and y properties, in
         * viewport coordinates)
         * @param {aria.core.CfgBeans.Callback} callback
         */
        mouseMove : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Smoothly moves the mouse from one position to another, with coordinates relative to the viewport.
         * @param {Object} fromPosition initial position where to set the mouse first (given as an object with x and y
         * properties, in viewport coordinates)
         * @param {Object} toPosition final position of mouse (given as an object with x and y properties, in viewport
         * coordinates)
         * @param {Number} duration Time in ms for the mouse move.
         * @param {aria.core.CfgBeans.Callback} callback
         */
        smoothMouseMove : {
            $type : "Function",
            $callbackParam : 3
        },

        /**
         * Simulates a mouse button press.
         * @param {Number} button Button to be pressed (should be the value of aria.jsunit.Robot.BUTTONx_MASK, with x
         * replaced by 1, 2 or 3).
         * @param {aria.core.CfgBeans.Callback} callback
         */
        mousePress : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Simulates a mouse button released.
         * @param {Number} button Button to be released (should be the value of aria.jsunit.Robot.BUTTONx_MASK, with x
         * replaced by 1, 2 or 3).
         * @param {aria.core.CfgBeans.Callback} callback
         */
        mouseRelease : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Simulates a rotation of the mouse wheel.
         * @param {Number} amount Specifies the amount by which the mouse wheel was rotated.
         * @param {aria.core.CfgBeans.Callback} callback
         */
        mouseWheel : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Simulates a keyboard key press.
         * @param {MultiTypes} key specifies which key should be pressed. It can be any value among the ones in the KEYS
         * property.
         * @param {aria.core.CfgBeans.Callback} callback
         */
        keyPress : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Simulates a keyboard key release.
         * @param {MultiTypes} key specifies which key should be released. It can be any value among the ones in the
         * KEYS property.
         * @param {aria.core.CfgBeans.Callback} callback
         */
        keyRelease : {
            $type : "Function",
            $callbackParam : 1
        }
    }
});