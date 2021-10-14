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

class ConsequentEvaluation extends Rule {
	public constructor() {
		super(Strings.ConsequentEvaluation, 1);
	}

	public apply(a: Axiom): Deduction[] | boolean {
		const ea = a.evaluatable;

		if (ea instanceof Implication) {
			let v = ea.operandB.evaluateValue();
			if (v === null)
				return true;

			// No need to try to apply this rule again to this axiom
			if (v === true)
				return false;

			let causes = ea.operandA.causesForEvaluation();
			if (!causes || !causes.length)
				causes = [a];
	
			return [
				{
					newEvaluatable: new Negation(ea.operandB),
					explanation: this.createFullExplanation(Strings.ConsequentEvaluation1 + a.id + Strings.ConsequentEvaluation2, ...causes)
				}
			];
		}

		return false;
	}
}
