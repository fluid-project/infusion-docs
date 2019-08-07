/* global require */
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
        while ((phraseMatch = remainingContent.match(/(-|\+)?"([^"]+)("|$)/))) {
            var phraseSign = phraseMatch[1];
            var phrase = phraseMatch[2];
            if (phraseSign === "-") {
                parsed.mustNotContainPhrases.push(phrase);
            }
            else if (phraseSign === "+") {
                parsed.mustContainPhrases.push(phrase);
            }
            else {
                parsed.mayContainPhrases.push(phrase);
            }

            var phraseLeader  = phraseMatch.index ? remainingContent.substring(0, phraseMatch.index) : "";
            var phraseTrailer = remainingContent.substring(phraseMatch.index + phraseMatch[0].length);
            remainingContent = phraseLeader + phraseTrailer;
        }

        //Then search for and sort all individual words.
        var weightedMatch = false;
        while ((weightedMatch = remainingContent.match(/(-|\+)?([^ ]+)/))) {
            var wordSign = weightedMatch[1];
            var word = weightedMatch[2];
            if (wordSign === "-") {
                parsed.mustNotContainWords.push(word);
            }
            else if (wordSign === "+") {
                parsed.mustContainWords.push(word);
            }
            else {
                parsed.mayContainWords.push(word);
            }

            var wordLeader  = weightedMatch.index ? remainingContent.substring(0, weightedMatch.index) : "";
            var wordTrailer = remainingContent.substring(weightedMatch.index + weightedMatch[0].length);
            remainingContent = wordLeader + wordTrailer;
        }

        //Anything else is a "word the content may contain"

        return parsed;
    };
})(fluid);
