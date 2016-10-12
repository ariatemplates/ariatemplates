/**
 * Script for the autocomplete sample
 * @class samples.widgets.form.templates.AutoCompleteSampleScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.form.multiautocomplete.test7.MultiAutoErrorTestCaseTplScript',
    $dependencies : ['aria.resources.handlers.LCRangeResourceHandler'],
    $constructor : function () {

        this._airLineHandler = new aria.resources.handlers.LCRangeResourceHandler();
        this._airLineHandler.setSuggestions([{
                    label : 'Air France',
                    code : 'AF'

                }, {
                    label : 'Air Canada',
                    code : 'AC'
                }, {
                    label : 'Finnair',
                    code : 'XX'
                }, {
                    label : 'Qantas',
                    code : '--'
                }, {
                    label : 'American Airlines',
                    code : 'AA'
                }, {
                    label : 'Emirates',
                    code : 'EK'
                }, {
                    label : 'P1.some',
                    code : 'AF'
                }, {
                    label : 'P2.kon',
                    code : 'AC'
                }, {
                    label : 'P3.red',
                    code : 'XX'
                }, {
                    label : 'P4.redd',
                    code : '--'
                }, {
                    label : 'Scandinavian Airlines System',
                    code : 'SK'
                }]);
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
