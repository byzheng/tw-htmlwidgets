/*\

Utils for tw-htmlwidgets

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    const htmlwidgetsUtils = {
        getArgumentValue: function(argNames, argValues, targetArgName, defaultValue) {
            defaultValue = defaultValue === undefined ? null : defaultValue;
            
            const index = argNames.indexOf(targetArgName);
            return index !== -1 && argValues[index] !== undefined ? argValues[index] : defaultValue;
        },

        isNumber: function(value) {
            return typeof value === 'number';
        }
        
        // Add more functions here as needed
    };

    // Exporting for both Node.js and browser environments
    if (typeof exports !== "undefined") {
        exports.htmlwidgetsUtils = htmlwidgetsUtils;
    } else if (typeof window !== "undefined") {
        window.htmlwidgetsUtils = htmlwidgetsUtils;
    }
})();