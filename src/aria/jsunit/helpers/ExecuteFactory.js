var Aria = require("../../Aria");
var ariaUtilsType = require("../../utils/Type");

module.exports = Aria.classDefinition({
  $classpath: "aria.jsunit.helpers.ExecuteFactory",
  $singleton: true,
  $prototype: {
    createExecuteFunction: function(getActionInfo) {
      var self = this;

      var executeCb = function(unused, args) {
        var array = args.array;
        var curIdx = args.curIdx;
        if (args.curIdx >= array.length) {
          self.$callback(args.cb);
        } else {
          var callParams = array[curIdx];
          args.curIdx++;
          if (!ariaUtilsType.isArray(callParams)) {
            self.$logError("Not an array");
            return;
          }
          var methodName = callParams.shift();
          var fnInfo = getActionInfo.call(this, methodName, args.options);
          if (fnInfo == null) {
            self.$logError("Bad action %1", [methodName]);
            return;
          }
          var nbParams = fnInfo.args;
          if (nbParams != callParams.length) {
            self.$logError("Bad number of parameters for %1", [methodName]);
            return;
          }
          // add the callback parameter before calling the method:
          callParams[nbParams] = {
            fn: executeCb,
            scope: this,
            args: args
          };
          fnInfo.fn.apply(fnInfo.scope, callParams);
        }
      };

      var res = function(array, cb, options) {
        executeCb.call(this, 0, {
          array: array,
          curIdx: 0,
          cb: cb,
          options: options
        });
      };
      res.getActionInfo = getActionInfo;

      return res;
    }
  }
});
