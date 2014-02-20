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
 * Test case for aria.widgets.form.InputValidationHandlerTest
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.InputValidationHandlerTest",
    $dependencies : ["aria.widgets.form.InputValidationHandler", "aria.widgets.AriaSkinInterface",
            "aria.templates.TemplateCtxt", "aria.utils.Dom"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        _checkPosition : function (validationHandler, left, top) {
            var viewport = this._viewport;
            // Call getDom to be sure the dom element is set on the frame:
            var divDom = validationHandler._div.getDom();
            // Get the dom element of the frame.
            // We previously used divDom to compute the position, but
            // in IE9, it does not give the correct position,
            // that's why we are now using frameDom instead.
            var frameDom = validationHandler._div._frame._domElt;
            var position = aria.utils.Dom.getGeometry(frameDom);
            var x = left ? position.x : viewport.width - (position.x + position.width);
            var y = top ? position.y : viewport.height - (position.y + position.height);
            this.assertTrue(y >= 16 && x >= 26, "Wrong distance: " + x + " " + y + " (" + left + " " + top + ")");
        },

        testPositioning : function () {
            var document = Aria.$window.document;
            var viewport = aria.utils.Dom._getViewportSize();
            this._viewport = viewport;

            var anchor = document.createElement("div"), position = "";
            anchor.style.cssText = "position:absolute;width:50px;height:10px;background:#CC1406;border:dotted 1px black;margin:0;";
            document.body.appendChild(anchor);

            // creates something that looks like an input for the inputValidation
            var fakeInput = {
                _context : new aria.templates.TemplateCtxt(),
                _cfg : {
                    formatError : true,
                    formatErrorMessages : ["<div id='error'>this is an error</div>"],
                    errorTipPosition : "top right"
                },
                getDom : function () {
                    return anchor;
                },
                getValidationPopupReference : function () {
                    return this.getDom();
                }
            };

            var validationHandler = new aria.widgets.form.InputValidationHandler(fakeInput);

            // TOP LEFT
            anchor.style.top = "5px";
            anchor.style.left = "5px";
            validationHandler.show();
            this._checkPosition(validationHandler, true, true);
            validationHandler.hide();

            // TOP RIGHT
            anchor.style.top = "5px";
            anchor.style.left = (viewport.width - 56) + "px";
            validationHandler.show();
            this._checkPosition(validationHandler, false, true);
            validationHandler.hide();

            // BOTTOM RIGHT
            anchor.style.top = (viewport.height - 16) + "px";
            anchor.style.left = (viewport.width - 56) + "px";
            validationHandler.show();
            this._checkPosition(validationHandler, false, false);
            validationHandler.hide();

            // BOTTOM LEFT
            anchor.style.top = (viewport.height - 16) + "px";
            anchor.style.left = "5px";
            validationHandler.show();
            this._checkPosition(validationHandler, true, false);
            validationHandler.hide();

            validationHandler.$dispose();
            fakeInput._context.$dispose();
            document.body.removeChild(anchor);
        }
    }
});
