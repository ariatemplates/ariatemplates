/**
 * Script for the autocomplete sample
 * @class samples.widgets.form.templates.AutoCompleteSampleScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.form.multiautocomplete.enterAndTab.EnterAndTabTplScript',
    $dependencies : ['aria.resources.handlers.LCRangeResourceHandler'],
    $constructor : function () {

        this._airLineHandler = new aria.resources.handlers.LCRangeResourceHandler();
        this._airLineHandler.setSuggestions([
            {
                label : 'Air France',
                code : 'A1'
            }, {
                label : 'Air France 2',
                code : 'A2'
            }, {
                label : 'Finnair',
                code : 'XX'
            }
        ]);
    },
    $destructor : function () {
        this._airLineHandler.$dispose();
        this._airLineHandler = null;
    },
    $prototype : {
        getAirLinesHandler : function () {
            return this._airLineHandler;
        }
    }
});
