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

class Negation extends Evaluatable {
	public readonly evaluatable: Evaluatable;

	public constructor(evaluatable: Evaluatable) {
		super(true);

		const actualEvaluatable = evaluatable.actualEvaluatable;

		this.evaluatable = (actualEvaluatable.isUnary ? actualEvaluatable : (evaluatable.isUnary ? evaluatable : new SubExpression(actualEvaluatable)));
	}

	public equals(o: ModelObject | null): boolean {
		if (!(o instanceof Evaluatable))
			return false;

		const a = o.actualEvaluatable;
		return ((a instanceof Negation) && this.evaluatable.equals(a.evaluatable));
	}

	protected computeString(simplified?: boolean): string {
		return TokenStrings.Negation + this.evaluatable.toString(simplified);
	}

	public checkIfAxiomIsOfInterest(axiom: Axiom): void {
		this.evaluatable.checkIfAxiomIsOfInterest(axiom);
	}

	public collectVariables(usedVariables: VariableMap): void {
		this.evaluatable.collectVariables(usedVariables);
	}

	public evaluateEquivalence(): boolean {
		return !this.evaluatable.evaluateEquivalence();
	}

	protected evaluateValueInternal(): boolean | null {
		const evaluatedValue = this.evaluatable.evaluateValue();
		return (evaluatedValue === null ? null : !evaluatedValue);
	}

	public causesForEvaluation(): Axiom[] | null {
		return this.evaluatable.causesForEvaluation();
	}

	public get usedVariables(): VariableMap {
		return this.evaluatable.usedVariables;
	}

	public get sortedVariables(): string {
		return this.evaluatable.sortedVariables;
	}
}
