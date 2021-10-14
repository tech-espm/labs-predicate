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

class SubExpression extends Evaluatable {
	public readonly evaluatable: Evaluatable;
	private readonly openingParenthesis: string;
	private readonly closingParenthesis: string;

	public constructor(evaluatable: Evaluatable, openingParenthesis?: string, closingParenthesis?: string) {
		super(true);

		this.evaluatable = evaluatable.actualEvaluatable;
		this.openingParenthesis = openingParenthesis || TokenStrings.OpeningParenthesis;
		this.closingParenthesis = closingParenthesis || TokenStrings.ClosingParenthesis;
	}

	public equals(o: ModelObject | null): boolean {
		return ((o instanceof Evaluatable) && this.evaluatable.equals(o));
	}

	protected computeString(simplified?: boolean): string {
		return this.openingParenthesis + this.evaluatable.toString(simplified) + this.closingParenthesis;
	}

	public checkIfAxiomIsOfInterest(axiom: Axiom): void {
		this.evaluatable.checkIfAxiomIsOfInterest(axiom);
	}

	public collectVariables(usedVariables: VariableMap): void {
		this.evaluatable.collectVariables(usedVariables);
	}

	public evaluateEquivalence(): boolean {
		return this.evaluatable.evaluateEquivalence();
	}

	protected evaluateValueInternal(): boolean | null {
		return this.evaluatable.evaluateValue();
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

	public get equivalence(): Uint8Array {
		return this.evaluatable.equivalence;
	}

	public isEquivalent(evaluatable: Evaluatable): boolean {
		return this.evaluatable.isEquivalent(evaluatable);
	}

	public isEquivalentNegated(evaluatable: Evaluatable): boolean {
		return this.evaluatable.isEquivalentNegated(evaluatable);
	}

	public isEquivalentSomehow(evaluatable: Evaluatable): number {
		return this.evaluatable.isEquivalentSomehow(evaluatable);
	}

	public evaluateValue(): boolean | null {
		return this.evaluatable.evaluateValue();
	}

	public get actualEvaluatable(): Evaluatable {
		return this.evaluatable;
	}
}
