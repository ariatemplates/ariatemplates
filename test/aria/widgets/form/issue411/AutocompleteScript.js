/*
 * Copyright Amadeus
 */
/**
 * Script for the autocomplete sample
 * @class samples.widgets.form.templates.AutoCompleteSampleScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.form.issue411.AutocompleteScript',
    $dependencies : ['aria.resources.handlers.LCResourcesHandler'],
    $constructor : function () {
        this.airlinesHandler = this.newAirLinesHandler();
    },
    $destructor : function () {
        this.airlinesHandler.$dispose();
        this.airlinesHandler = null;
    },
    $prototype : {
        newAirLinesHandler : function (cfg) {
            var handler = new aria.resources.handlers.LCResourcesHandler(cfg);
            handler.setSuggestions([{
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
                        label : 'Scandinavian Airlines System',
                        code : 'SK'
                    }]);
            handler.codeExactMatch = true;
            return handler;
        },

        getAirLinesHandler : function () {
            return this.airlinesHandler;
        }
    }
});