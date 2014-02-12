/**
 * Script for the autocomplete sample
 * @class samples.widgets.form.templates.AutoCompleteSampleScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.form.autocomplete.multiautocomplete.test10.MultiAutoExpandoTplScript',
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
                    code : 'P1'
                }, {
                    label : 'P2.kon',
                    code : 'P2'
                }, {
                    label : 'P3.red',
                    code : 'P3'
                }, {
                    label : 'P4.redd',
                    code : 'P4'
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
