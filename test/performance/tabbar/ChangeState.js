/**
 * In this test I have a TabPanel with 4 tabs, one of them is selected. When I change tab I don't want to reapply the same
 * style to the third tab that is not transitioning
 */
Aria.classDefinition({
    $classpath : "test.performance.tabbar.ChangeState",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.utils.Json", "aria.widgets.container.Tab", "aria.widgets.container.TabPanel"],
    $prototype : {
        testChangeState : function () {
            var state = {
                selected : "one",
                changeState : 0
            };

            var folder1 = this._crateTab("one", state);
            var folder2 = this._crateTab("two", state);
            var folder3 = this._crateTab("three", state);
            var folder4 = this._crateTab("four", state);

            var instance = new aria.widgets.container.TabPanel({
                bind : {
                    selectedTab : {
                        inside : state,
                        to : "selected"
                    }
                }
            }, this.outObj.tplCtxt);

            aria.utils.Json.setValue(state, "selected", "two");

            this.assertEquals(state.changeState, 2, "It's enough to update only two instances");

            folder1.$dispose();
            folder2.$dispose();
            folder3.$dispose();
            folder4.$dispose();
            instance.$dispose();
        },

        /**
         * Create a Tab widget with selectedTab bound to the container and refreshes on it
         * @param {String} name tabId
         * @param {Object} container Data model used for bindings
         * @return {aria.widgets.container.Tab}
         */
        _crateTab : function (name, container) {
            var instance = new aria.widgets.container.Tab({
                tabId : name,
                bind : {
                    selectedTab : {
                        inside : container,
                        to : "selected"
                    }
                }
            }, this.outObj.tplCtxt);

            instance.writeMarkup(this.outObj);
            this.outObj.putInDOM();
            // init widget
            instance.initWidget();

            instance._updateState = function () {
                container.changeState += 1;
            }

            return instance;
        }
    }
})