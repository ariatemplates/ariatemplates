/**
 * Test case for the logger
 */
Aria.classDefinition({
	$classpath : "test.aria.core.DefaultAppenderTest2",
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

    _myTestError : function (args) {
      this._storedErrorMessage = args;
    },

    _onDefaultAppenderLoaded : function () {
      var className = 'aria.core.Log';
      var msg = 'Default message';
      var msgText = 'Default text message';

      aria.core.log.DefaultAppender.prototype.debug(className, msg, msgText, {});
      this.assertTrue(this._storedLogMessage == '[' + className + '] ' + msg);

      aria.core.log.DefaultAppender.prototype.info(className, msg, msgText, {});
      this.assertTrue(this._storedLogMessage == '[' + className + '] ' + msg);

      aria.core.log.DefaultAppender.prototype.warn(className, msg, msgText, {});
      this.assertTrue(this._storedLogMessage == '[' + className + '] ' + msg);

      aria.core.log.DefaultAppender.prototype.error(className, msg, msgText);
      this.assertTrue(this._storedErrorMessage == '[' + className + '] ' + msg);

      aria.core.log.DefaultAppender.prototype.error(className, msg, msgText, true);
      this.assertTrue(this._storedErrorMessage == '[' + className + '] ' + msg + '\n');

      this.notifyTestEnd('testAsyncDefaultAppenderLogMessages');
    }
	}
});
