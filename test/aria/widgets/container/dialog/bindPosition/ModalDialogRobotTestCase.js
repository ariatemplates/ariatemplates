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
 * Test the binding of xpos, ypos and center for dialog widgets
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.bindPosition.ModalDialogTestCase",
    $extends : "test.aria.widgets.container.dialog.bindPosition.DialogTestCase",
    $constructor : function () {
        this.$DialogTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.bindPosition.ModalDialogTemplate",
            data : this.data
        });

    },
    $prototype : {

}
});
