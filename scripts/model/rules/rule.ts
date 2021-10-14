//
// MIT License
//
// Copyright (c) 2021 ESPM
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// https://github.com/tech-espm/labs-predicate
//

abstract class Rule {
	// This rule is an exception
	public static biconditionalElimination: Rule;

	public static readonly rules: Rule[] = [];
	public static readonly rules2: Rule[] = [];
	public static readonly rules3: Rule[] = [];

	private static readonly nextIds = [0, 0, 0];

	public static init(): void {
		// This rule is an exception
		Rule.biconditionalElimination = new BiconditionalElimination();

		Rule.rules.push(new Simplification());
		Rule.rules.push(new AntecedentEvaluation());
		Rule.rules.push(new ConsequentEvaluation());

		Rule.rules2.push(new DisjunctiveSyllogism());
		Rule.rules2.push(new HypotheticalSyllogism());
		Rule.rules2.push(new ModusPonens());
		Rule.rules2.push(new ModusTollens());
		Rule.rules2.push(new NegationIntroduction());

		Rule.rules3.push(new ConstructiveDilemmaDisjunctionElimination());
		Rule.rules3.push(new DestructiveDilemma());
	}

	public static applyRules1(pendingDeductions: PendingDeduction[], deductions: Deduction[], axiomIndex: number, axioms: Axiom[]): void {
		const lastAxiom = axioms[axiomIndex],
			rules = Rule.rules;

		for (let i = rules.length - 1; i >= 0; i--) {
			const result = rules[i].apply(lastAxiom);

			if (result) {
				if (result === true)
					pendingDeductions.push({
						rule: rules[i],
						axioms: [lastAxiom]
					});
				else
					deductions.push.apply(deductions, result);
			}
		}
	}

	public static applyRules2(pendingDeductions: PendingDeduction[], deductions: Deduction[], axiomIndex: number, axioms: Axiom[]): void {
		const lastAxiom = axioms[axiomIndex],
			rules = Rule.rules2;

		for (let i = 0; i < axiomIndex; i++) {
			const axiom = axioms[i];

			for (let j = rules.length - 1; j >= 0; j--) {
				const result = rules[j].apply(axiom, lastAxiom);

				if (result) {
					if (result === true)
						pendingDeductions.push({
							rule: rules[j],
							axioms: [axiom, lastAxiom]
						});
					else
						deductions.push.apply(deductions, result);
				}
			}
		}
	}

	public static applyRules3(pendingDeductions: PendingDeduction[], deductions: Deduction[], axiomIndex: number, axioms: Axiom[]): void {
		const lastAxiom = axioms[axiomIndex],
			rules = Rule.rules3;

		for (let i = 0; i < axiomIndex; i++) {
			const axiom = axioms[i];

			for (let j = i + 1; j < axiomIndex; j++) {
				const axiom2 = axioms[j];

				for (let k = rules.length - 1; k >= 0; k--) {
					const result = rules[k].apply(axiom, axiom2, lastAxiom);

					if (result) {
						if (result === true)
							pendingDeductions.push({
								rule: rules[k],
								axioms: [axiom, axiom2, lastAxiom]
							});
						else
							deductions.push.apply(deductions, result);
					}
				}
			}
		}
	}

	public static applyRulesOfPendingDeductions(pendingDeductions: PendingDeduction[], deductions: Deduction[]): void {
		let pendingDeductionsLength = pendingDeductions.length;

		for (let i = 0; i < pendingDeductionsLength; i++) {
			const pendingDeduction = pendingDeductions[i],
				rule = pendingDeduction.rule,
				result = rule.apply.apply(rule, pendingDeduction.axioms);

			if (result !== true) {
				pendingDeductions.splice(i, 1);
				pendingDeductionsLength--;
				i--;
	
				if (result)
					deductions.push.apply(deductions, result);
			}
		}
	}

	public readonly id: number;
	public readonly name: string;
	public readonly inputCount: number;

	public constructor(name: string, inputCount: number) {
		if (inputCount > 3)
			throw new Error("Invalid input count: " + inputCount);

		this.id = Rule.nextIds[inputCount - 1]++;
		this.name = name;
		this.inputCount = inputCount;
	}

	public toString(): string {
		return this.name;
	}

	protected createFullExplanation(name: string, ...axioms: Axiom[]): string {
		let explanation = name + ": " + axioms[0].id;

		for (let i = 1; i < axioms.length; i++)
			explanation += ", " + axioms[i].id;

		return explanation;
	}

	protected createExplanation(...axioms: Axiom[]): string {
		return this.createFullExplanation(this.name, ...axioms);
	}

	// When apply() returns true it means this rule can be applied to these axioms, but not now.
	// When apply() returns false it means this rule cannot be applied to these axioms at any given time.
	public abstract apply(a: Axiom, b?: Axiom, c?: Axiom): Deduction[] | boolean;
}
