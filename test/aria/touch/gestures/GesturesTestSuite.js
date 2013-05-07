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
 * Test suite for Touch Gestures
 */
Aria.classDefinition({
    $classpath : "test.aria.touch.gestures.GesturesTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.touch.gestures.Tap");
        this.addTests("test.aria.touch.gestures.SingleTap");
        this.addTests("test.aria.touch.gestures.DoubleTap");
        this.addTests("test.aria.touch.gestures.LongPress");
        this.addTests("test.aria.touch.gestures.Drag");
        this.addTests("test.aria.touch.gestures.Swipe");
        this.addTests("test.aria.touch.gestures.Pinch");
        this.addTests("test.aria.touch.gestures.DoubleSwipe");
    }
});
