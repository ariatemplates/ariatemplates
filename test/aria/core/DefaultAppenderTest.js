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
 * Test case for the logger
 */
Aria.classDefinition({
	$classpath : "test.aria.core.DefaultAppenderTest",
	$extends : "aria.jsunit.TestCase",
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
    tearDown : function () {
      Aria.$global.console = this._oldConsole;
    },

    testAsyncDefaultAppenderLogMessages : function () {
      // unload of DefaultAppender
      aria.core.ClassMgr.unloadClass('aria.core.log.DefaultAppender', false);

      // modification of the browser console
      var that = this;
      this._oldConsole = Aria.$global.console;
      Aria.$global.console = {
        log : function (args) {
          that._myTestLog.call(that, args);
        },

        dir : function (args) {
          that._myTestDir.call(that, args);
        },

        debug : function (args) {
          that._myTestDebug.call(that, args);
        },

        info : function (args) {
          that._myTestInfo.call(that, args);
        },

        warn : function (args) {
          that._myTestWarn.call(that, args);
        },

        error : function (args) {
          that._myTestError.call(that, args);
        }
      }

      Aria.load({
        classes : ['aria.core.log.DefaultAppender'],
        oncomplete : {
          fn : this._onDefaultAppenderLoaded,
          scope : this
        }
      });
    },

    _myTestLog : function (args) {
      this._storedLogMessage = args;
    },

    _myTestDir : function (args) {
      this._storedDirMessage = args;
    },

    _myTestDebug : function (args) {
      this._storedDebugMessage = args;
    },

    _myTestInfo : function (args) {
      this._storedInfoMessage = args;
    },

    _myTestWarn : function (args) {
      this._storedWarnMessage = args;
    },

    _myTestError : function (args) {
      this._storedErrorMessage = args;
    },

    _onDefaultAppenderLoaded : function () {
      var className = 'aria.core.Log';
      var msg = 'Default message';
      var msgText = 'Default text message';

      aria.core.log.DefaultAppender.prototype.debug(className, msg, msgText, {});
      this.assertTrue(this._storedDebugMessage == '[' + className + '] ' + msg);
      this.assertTrue(aria.utils.Json.equals(this._storedDirMessage, {}));

      aria.core.log.DefaultAppender.prototype.info(className, msg, msgText, {});
      this.assertTrue(this._storedInfoMessage == '[' + className + '] ' + msg);
      this.assertTrue(aria.utils.Json.equals(this._storedDirMessage, {}));

      aria.core.log.DefaultAppender.prototype.warn(className, msg, msgText, {});
      this.assertTrue(this._storedWarnMessage == '[' + className + '] ' + msg);
      this.assertTrue(aria.utils.Json.equals(this._storedDirMessage, {}));

      aria.core.log.DefaultAppender.prototype.error(className, msg, msgText);
      this.assertTrue(this._storedErrorMessage == '[' + className + '] ' + msg);

      aria.core.log.DefaultAppender.prototype.error(className, msg, msgText, true);
      this.assertTrue(this._storedErrorMessage == '[' + className + '] ' + msg + '\n');

      this.notifyTestEnd('testAsyncDefaultAppenderLogMessages');
    }
	}
});
