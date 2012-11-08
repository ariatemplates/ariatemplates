/*
 * Copyright 2012 Amadeus s.a.s. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and limitations under the
 * License.
 */

/**
 * Test case for aria.utils.HashManager
 * @class test.aria.utils.HashManager
 */
Aria.classDefinition({
  $classpath : "test.aria.utils.History",
  $extends : "aria.jsunit.TestCase",
  $dependencies : ["aria.utils.History", "aria.utils.FrameATLoader"],
  $prototype : {
    testAsyncLoadIFrame : function () {
      var ifrm = Aria.$window.document.createElement("IFRAME");
      ifrm.setAttribute("id", "myIframe");
      ifrm.style.width = 1 + "px";
      ifrm.style.height = 1 + "px";
      Aria.$window.document.body.appendChild(ifrm);
      this.iframe = ifrm;
      aria.utils.FrameATLoader.loadAriaTemplatesInFrame(ifrm, {
        fn : this._iframeDone,
        scope : this
      });
    },

    _iframeDone : function () {
      this.waitFor({
        condition : function () {
          try {
            return !!this.iframe.contentWindow.Aria.load;
          } catch (ex) {
            return false;
          }
        },
        callback : {
          fn : this._waitForAriaLoad,
          scope : this
        }
      });
    },

    _waitForAriaLoad : function () {
      this.iframe.contentWindow.Aria.load({
        classes : ['aria.utils.History'],
        oncomplete : {
          fn : this.startTest,
          scope : this
        }
      });
    },

    startTest : function () {
      this._iFrameUrl = [];
      this._iFrameUrl.push(this.iframe.contentWindow.Aria.$window.location.href);
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[0]);

      this.iframe.contentWindow.aria.utils.History.pushState({
        state : 1
      }, "Title", '?testClasspath=test.aria.utils.History&state=1');
      this._iFrameUrl.push(this.iframe.contentWindow.Aria.$window.location.href);
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[1]);

      this.iframe.contentWindow.aria.utils.History.pushState(null, null, '?testClasspath=test.aria.utils.History&state=2');
      this._iFrameUrl.push(this.iframe.contentWindow.Aria.$window.location.href);
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[2]);

      this.iframe.contentWindow.aria.utils.History.back();

      aria.core.Timer.addCallback({
        fn : this._waitForBack,
        scope : this,
        delay : 200
      });
    },

    _waitForBack : function () {

      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[1]);

      this.iframe.contentWindow.aria.utils.History.forward();

      aria.core.Timer.addCallback({
        fn : this._waitForForward,
        scope : this,
        delay : 200
      });
    },

    _waitForForward : function () {

      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[2]);

      this.iframe.contentWindow.aria.utils.History.go(-1);

      aria.core.Timer.addCallback({
        fn : this._waitForGoNegative,
        scope : this,
        delay : 200
      });
    },

    _waitForGoNegative : function () {

      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[1]);

      this.iframe.contentWindow.aria.utils.History.go(1);

      aria.core.Timer.addCallback({
        fn : this._waitForGoPositive,
        scope : this,
        delay : 200
      });
    },

    _waitForGoPositive : function () {

      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[2]);

      this.iframe.contentWindow.aria.utils.History.replaceState(null, null, '?testClasspath=test.aria.utils.History&state=3');
      this._iFrameUrl.push(this.iframe.contentWindow.Aria.$window.location.href);
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[3]);

      this.iframe.contentWindow.aria.utils.History.back();

      aria.core.Timer.addCallback({
        fn : this._waitForLastBack,
        scope : this,
        delay : 200
      });
    },

    _waitForLastBack : function () {
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[1]);

      this.iframe.contentWindow.aria.utils.History.forward();

      aria.core.Timer.addCallback({
        fn : this._waitForLastForward,
        scope : this,
        delay : 200
      });
    },

    _waitForLastForward : function () {
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[3]);

      this.iframe.contentWindow.aria.utils.History.pushState(null, null, '?testClasspath=test.aria.utils.History&state=4');
      this._iFrameUrl.push(this.iframe.contentWindow.Aria.$window.location.href);
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[4]);

      this.iframe.contentWindow.aria.utils.History.go(-2);

      aria.core.Timer.addCallback({
        fn : this._waitForLastGoNegative,
        scope : this,
        delay : 500
      });
    },

    _waitForLastGoNegative : function () {
      this.assertTrue(this.iframe.contentWindow.Aria.$window.location.href == this._iFrameUrl[1]);

      var state = this.iframe.contentWindow.aria.utils.History.getState();

      this.assertTrue(state.data.state == 1);
      this.assertTrue(state.title == "Title");

      Aria.$window.document.body.removeChild(this.iframe);
      this.iframe = null;
      this.notifyTestEnd("testAsyncLoadIFrame");
    }
  }
});