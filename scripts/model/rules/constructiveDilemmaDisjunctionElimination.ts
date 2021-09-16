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

class ConstructiveDilemmaDisjunctionElimination extends Rule {
	public constructor() {
		super(Strings.ConstructiveDilemma, 3);
	}

	private applyIfPossible(a: Axiom, b: Axiom, c: Axiom): Deduction[] | boolean {
		const ea = a.evaluatable,
			eb = b.evaluatable,
			ec = c.evaluatable;

		let newEvaluatable: Evaluatable;

		return (((ea instanceof Implication) && (eb instanceof Implication) && ec.isEquivalent(Disjunction.create([ea.operandA, eb.operandA]))) ?
			[
				{
					newEvaluatable: (newEvaluatable = Disjunction.create([ea.operandB, eb.operandB])),
					explanation: this.createFullExplanation((newEvaluatable instanceof Disjunction) ? Strings.ConstructiveDilemma : Strings.DisjunctionElimination, a, b, c)
				}
			]
			:
			false
		);
	}

	public apply(a: Axiom, b: Axiom, c: Axiom): Deduction[] | boolean {
		// Since the order of the first two parameters in applyIfPossible() does not matter,
		// we can skip half of the checks
		return this.applyIfPossible(a, b, c) ||
			this.applyIfPossible(a, c, b) ||
			this.applyIfPossible(b, c, a);
	}
}
