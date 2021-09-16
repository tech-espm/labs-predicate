ace.define("ace/mode/predicate", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/text_highlight_rules", "ace/mode/behaviour"],
	function (acerequire, aceexport, n) {
		"use strict";

		var oop = acerequire("../lib/oop"),
			TextMode = acerequire("./text").Mode,
			TextHighlightRules = acerequire("./text_highlight_rules").TextHighlightRules,
			Behaviour = acerequire("./behaviour").Behaviour,
			PredicateHighlightRules = function () {
				// https://ace.c9.io/#nav=higlighter
				// https://ace.c9.io/tool/mode_creator.html
				this.$rules = {
					start: [
						{
							token: "custom-paren",
							regex: /[\(\[\{]/
						},
						{
							token: "custom-paren",
							regex: /[\)\]\}]/
						},
						{
							token: "comment",
							regex: /#.*$/
						},
						{
							//token: "punctuation.operator",
							token: "keyword.operator",
							regex: /[\~\-¬]/
						},
						{
							token: "string",
							regex: /[\^\&\.∧\⋅]/
						},
						{
							token: "keyword",
							regex: /[v\|∨]/
						},
						{
							token: "constant.library",
							regex: /[\>→⊃\=↔≡]/
						}
					]
				};
			},
			PredicateMode = function () {
				this.HighlightRules = PredicateHighlightRules;
				this.$behaviour = new Behaviour();
			};

		oop.inherits(PredicateHighlightRules, TextHighlightRules);
		oop.inherits(PredicateMode, TextMode);

		(function () {
			this.type = "text";
			this.$id = "ace/mode/predicate";
		}).call(PredicateMode.prototype);

		aceexport.Mode = PredicateMode;
	}
);

(function () {
	ace.require(["ace/mode/predicate"], function (m) {
		if (typeof module == "object" && typeof exports == "object" && module) {
			module.exports = m;
		}
	});
})();
