/**
 * Script for the autocomplete sample
 * @class samples.widgets.form.templates.AutoCompleteSampleScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.form.multiautocomplete.template.MultiAutoTplScript',
    $dependencies : ['aria.resources.handlers.LCRangeResourceHandler'],
    $constructor : function () {

        this._airLineHandler = new aria.resources.handlers.LCRangeResourceHandler({
            allowRangeValues : true,
            labelMatchAtWordBoundaries : true
        });
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
                    label : 'P5.loreum',
                    code : 'P5'
                }, {
                    label : 'P6.ipsum',
                    code : 'P6'
                }, {
                    label : 'P7.lomeo',
                    code : 'P7'
                }, {
                    label : 'P8.amino',
                    code : 'P8'
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
        },
        onChangeHandler : function () {
            this.data.onChangeCalls++;
        },
        onBlurHandler : function () {
            this.data.onBlurCalls++;
        },
        onFocusHandler : function () {
            this.data.onFocusCalls++;
        }
    }
});
