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

class Implication extends Evaluatable {
	public readonly operandA: Evaluatable;
	public readonly operandB: Evaluatable;
	private axiomOfInterest: AxiomOfInterest | null;

	public constructor(operandA: Evaluatable, operandB: Evaluatable) {
		super(false);

		this.operandA = (operandA.isUnary ? operandA : new SubExpression(operandA));
		this.operandB = (operandB.isUnary ? operandB : new SubExpression(operandB));
		this.axiomOfInterest = null;
	}

	public equals(o: ModelObject | null): boolean {
		if (!(o instanceof Evaluatable))
			return false;

		const a = o.actualEvaluatable;
		return ((a instanceof Implication) && this.operandA.equals(a.operandA) && this.operandB.equals(a.operandB));
	}

	protected computeString(simplified?: boolean): string {
		return this.operandA.toString(simplified) + TokenStrings.ImplicationSpace + this.operandB.toString(simplified);
	}

	public checkIfAxiomIsOfInterest(axiom: Axiom): void {
		if (!this.axiomOfInterest) {
			const equivalence = axiom.evaluatable.isEquivalentSomehow(this);
			if (equivalence) {
				this.axiomOfInterest = {
					operands: null as any,
					equivalence,
					axiom
				};
			}
		}

		this.operandA.checkIfAxiomIsOfInterest(axiom);
		this.operandB.checkIfAxiomIsOfInterest(axiom);
	}

	public collectVariables(usedVariables: VariableMap): void {
		this.operandA.collectVariables(usedVariables);
		this.operandB.collectVariables(usedVariables);
	}

	public evaluateEquivalence(): boolean {
		return (!this.operandA.evaluateEquivalence() || this.operandB.evaluateEquivalence());
	}

	protected evaluateValueInternal(): boolean | null {
		// Evaluate all operands in order to check for inconsistencies
		const a = this.operandA.evaluateValue(),
			b = this.operandB.evaluateValue();

		let internalResult: boolean | null = null;

		if (a === null) {
			if (b)
				internalResult = true;
		} else if (b === null) {
			if (!a)
				internalResult = true;
		} else {
			internalResult = !a || b;
		}

		if (internalResult !== null) {
			if (this.axiomOfInterest && internalResult !== (this.axiomOfInterest.equivalence > 0))
				throw new Error(Strings.ErrorInconsistentExpression + this.toString() + Strings.ErrorInconsistentExpression2 + ((this.axiomOfInterest.equivalence > 0) ? Strings.True : Strings.False) + Strings.ErrorInconsistentExpression3because + this.axiomOfInterest.axiom.id + Strings.ErrorInconsistentExpression3 + (internalResult ? Strings.True : Strings.False));

			return internalResult;
		}

		return (this.axiomOfInterest ? (this.axiomOfInterest.equivalence > 0) : null);
	}
}
