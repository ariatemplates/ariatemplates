/*
 * Copyright Amadeus
 */
/**
 * Script for the autocomplete sample
 * @class samples.widgets.form.templates.AutoCompleteSampleScript
 */
Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.form.autocomplete.issue440.AutoCompleteTpl1Script',
    $dependencies : ['aria.resources.handlers.LCResourcesHandler'],
    $constructor : function () {
        this.airlinesHandler = this.newAirLinesHandler();
    },
    $destructor : function () {
        this.airlinesHandler = null;
        if (this.resourcesHandler) {
            this.resourcesHandler.$dispose();
            this.resourcesHandler = null;
        }
    },
    $prototype : {
        newAirLinesHandler : function (cfg) {
            var handler = this.resourcesHandler = new aria.resources.handlers.LCResourcesHandler(cfg);
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
            return handler;
        },
        getAirLinesHandler : function () {
            return this.airlinesHandler;
        }
    }
});