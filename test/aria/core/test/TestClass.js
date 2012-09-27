Aria.classDefinition({
  $classpath : "test.aria.core.test.TestClass",
  $singleton : true,
  $constructor : function () {
    this.classNumber = 2;
    this.classObj = {empty : "nothing"};
    this.classFunc = function () {var a = "";};
  }
});