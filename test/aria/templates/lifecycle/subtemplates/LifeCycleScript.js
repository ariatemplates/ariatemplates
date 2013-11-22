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
 * @class test.aria.templates.lifecycle.subtemplates.LifeCycleScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.templates.lifecycle.subtemplates.LifeCycleScript',
    $constructor : function () {
        if (this.constructorCalled) {
            throw "Constructor was called twice!";
        } else {
            this.constructorCalled = true;
        }
    },
    $destructor : function () {
        if (this.destructorCalled) {
            throw "Destructor was called twice!";
        } else {
            this.destructorCalled = true;
        }
        this.data.testCase.scriptDestructor(this);
    },
    $prototype : {
        $viewReady : function () {
            if (this.constructorCalled) {
                this.data.testCase.viewReady(this);
            }
        },

        $displayReady : function () {
            if (this.constructorCalled) {
                this.data.testCase.displayReady(this);
            }
        },

        $afterRefresh : function () {
            if (this.constructorCalled) {
                this.data.testCase.afterRefresh(this);
            }
        },

        $dataReady : function () {
            if (this.constructorCalled) {
                this.data.testCase.dataReady(this);
            }
        }
    }
});
