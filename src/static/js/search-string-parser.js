/ * global require */
var fluid = fluid || require("infusion");
(function (fluid) {
    "use strict";
    fluid.registerNamespace("fluid.docs.search");

    fluid.docs.search.parseSearchString = function (toParse) {
        var parsed = {
            mayContainWords:       [],
            mayContainPhrases:     [],
            mustContainWords:      [],
            mustContainPhrases:    [],
            mustNotContainWords:   [],
            mustNotContainPhrases: []
        };

        var remainingContent = toParse.toString();
        //First, search for and sort all whole phrases.
        var phraseMatch = false;
        while (phraseMatch = remainingContent.match(/(-|\+)?"([^"]+)("|$)/)) {
            var sign = phraseMatch[1];
            var phrase = phraseMatch[2];
            if (sign == "-") {
                parsed.mustNotContainPhrases.push(phrase);
            }
            else if (sign == "+") {
                parsed.mustContainPhrases.push(phrase);
            }
            else {
                parsed.mayContainPhrases.push(phrase);
            }

            var leader  = phraseMatch.index ? remainingContent.substring(0, phraseMatch.index) : "";
            var trailer = remainingContent.substring(phraseMatch.index + phraseMatch[0].length);
            remainingContent = leader + trailer;
        }

        //Then search for and sort all individual words.
        var weightedMatch = false;
        while (weightedMatch = remainingContent.match(/(-|\+)?([^ ]+)/)) {
            var sign = weightedMatch[1];
            var word = weightedMatch[2];
            if (sign == "-") {
                parsed.mustNotContainWords.push(word);
            }
            else if (sign == "+") {
                parsed.mustContainWords.push(word);
            }
            else {
                parsed.mayContainWords.push(word);
            }

            var leader  = weightedMatch.index ? remainingContent.substring(0, weightedMatch.index) : "";
            var trailer = remainingContent.substring(weightedMatch.index + weightedMatch[0].length);
            remainingContent = leader + trailer;
        }
        //Anything else is a "word the content may contain"

        return parsed;
    };
})(fluid);
