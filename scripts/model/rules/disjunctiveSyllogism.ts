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

class DisjunctiveSyllogism extends Rule {
	public constructor() {
		super(Strings.DisjunctiveSyllogism, 2);
	}

	private applyIfPossible(a: Axiom, b: Axiom): Deduction[] | boolean {
		const ea = a.evaluatable;

		let axiomOfInterest: AxiomOfInterest | null;

		if ((ea instanceof Disjunction) && (axiomOfInterest = ea.getAxiomOfInterest(b))) {
			// No need to try to apply this rule again to this pair of axioms
			if (axiomOfInterest.equivalence > -1)
				return false;

			const newOperands = ea.operands.slice(),
				axiomOfInterestOperands = axiomOfInterest.operands;

			for (let i = newOperands.length - 1; i >= 0; i--) {
				const newOperand = newOperands[i];

				for (let j = axiomOfInterestOperands.length - 1; j >= 0; j--) {
					if (newOperand === axiomOfInterestOperands[j]) {
						newOperands.splice(i, 1);
						break;
					}
				}
			}

			return [
				{
					newEvaluatable: ((newOperands.length === 1) ? newOperands[0] : Disjunction.create(newOperands)),
					explanation: this.createExplanation(a, b)
				}
			];
		}

		return false;
	}

	public apply(a: Axiom, b: Axiom): Deduction[] | boolean {
		return this.applyIfPossible(a, b) || this.applyIfPossible(b, a);
	}
}
