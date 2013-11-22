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

Aria.tplScriptDefinition({
    $classpath : 'test.aria.templates.issue348.animation.AnimationScript',
    $prototype : {
        $dataReady : function () {
            this.data['iteration'] = 0;
            this.data['startTxt'] = "sample";
            this.data['endTxt'] = "sample";
        },
        animationIterationHandler : function (index) {
            var iteration = this.data.iteration + 1;
            this.$json.setValue(this.data, "iteration", iteration);
        },
        animationStartHandler : function (index) {
            var startTxt = "Animation Started";
            this.$json.setValue(this.data, "startTxt", startTxt);
        },
        animationEndHandler : function (index) {
            var endTxt = "Animation Ended";
            this.$json.setValue(this.data, "endTxt", endTxt);
        }
    }
});
