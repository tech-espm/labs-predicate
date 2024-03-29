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

class Conjunction extends Connective {
	public static create(operands: Evaluatable[], skipSort?: boolean): Evaluatable {
		const evaluatable = new Conjunction(operands, skipSort);
		return ((evaluatable.operands.length === 1) ? evaluatable.operands[0] : evaluatable);
	}

	private constructor(operands: Evaluatable[], skipSort?: boolean) {
		super(operands, skipSort, TokenStrings.ConjunctionSpace, Conjunction);
	}

	public get factoryMethod(): ConnectiveFactoryMethod {
		return Conjunction.create;
	}

	public evaluateEquivalence(): boolean {
		const operands = this.operands;

		for (let i = 0; i < operands.length; i++) {
			if (!operands[i].evaluateEquivalence())
				return false;
		}

		return true;
	}

	protected evaluateValueInternal(): boolean | null {
		const operands = this.operands,
			unusedVariables = this.usedVariables.createIdSet();

		let r = true;

		for (let i = operands.length - 1; i >= 0; i--) {
			const v = operands[i].evaluateValue();

			if (v === null)
				continue;

			unusedVariables.deleteSubset(operands[i].usedVariables);

			if (!v) {
				// We must allow the for to complete, instead of breaking
				// here, to make sure all operands are evatuated at least
				// once, in order to check for inconsistencies
				r = false;
			}
		}

		if (this.containsOppositeOperators)
			return false;

		if (!r || !unusedVariables.size)
			return r;

		const axiomsOfInterest = this.axiomsOfInterest;

		for (let axiomOfInterest of axiomsOfInterest.values()) {
			const evaluatable = axiomOfInterest.axiom.evaluatable;

			unusedVariables.deleteSubset(evaluatable.usedVariables);

			if (axiomOfInterest.equivalence < 0) {
				// Unlike up there, there is no need to continue here
				r = false;
				break;
			}

			if (!unusedVariables.size)
				break;
		}

		return (!r ? !r : (unusedVariables.size ? null : true));
	}

	public causesForEvaluation(): Axiom[] | null {
		const operands = this.operands,
			unusedVariables = this.usedVariables.createIdSet(),
			causes: Axiom[] = [];

		let r = true;

		for (let i = operands.length - 1; i >= 0; i--) {
			const v = operands[i].evaluateValue();

			if (v === null)
				continue;

			unusedVariables.deleteSubset(operands[i].usedVariables);

			const c = operands[i].causesForEvaluation();

			if (!v) {
				r = false;
				if (c)
					return c;
			}

			if (c)
				causes.push.apply(causes, c);
		}

		// Compared to evaluateValueInternal(), these two if's are inverted on purpose
		if ((!r || !unusedVariables.size) && causes.length)
			return causes;

		if (this.containsOppositeOperators)
			return null;

		const axiomsOfInterest = this.axiomsOfInterest;

		for (let axiomOfInterest of axiomsOfInterest.values()) {
			const evaluatable = axiomOfInterest.axiom.evaluatable;

			unusedVariables.deleteSubset(evaluatable.usedVariables);

			if (axiomOfInterest.equivalence < 0)
				return [axiomOfInterest.axiom];

			if (!unusedVariables.size)
				break;
		}

		return null;
	}
}
