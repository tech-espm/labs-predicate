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

abstract class Evaluatable extends ModelObject {
	public static nextId = 1;

	public readonly id: number;
	public readonly isUnary: boolean;
	private _usedVariables: VariableMap | null;
	private _sortedVariables: string | null;
	private _equivalence: Uint8Array | null;
	private _evaluatedValue: boolean | null;
	private equivalenceVariableCount: number;
	private equivalenceLastByteMask: number;
	private computedSimplifiedString: string | null;
	private computedString: string | null;

	public constructor(isUnary: boolean) {
		super();

		this.id = Evaluatable.nextId++;
		this.isUnary = isUnary;
		this._usedVariables = null;
		this._sortedVariables = null;
		this._equivalence = null;
		this._evaluatedValue = null;
		this.equivalenceVariableCount = 0;
		this.equivalenceLastByteMask = 0;
		this.computedSimplifiedString = null;
		this.computedString = null;
	}

	public get simplifiedString(): string {
		if (!this.computedSimplifiedString)
			this.computedSimplifiedString = this.computeString(true);
		return this.computedSimplifiedString;
	}

	public toString(simplified?: boolean): string {
		if (simplified) {
			return this.simplifiedString;
		} else {
			if (!this.computedString)
				this.computedString = this.computeString(false);
			return this.computedString;
		}
	}

	protected abstract computeString(simplified: boolean): string;

	public abstract checkIfAxiomIsOfInterest(axiom: Axiom): void;
	public abstract collectVariables(usedVariables: VariableMap): void;
	public abstract evaluateEquivalence(): boolean;
	protected abstract evaluateValueInternal(): boolean | null;

	public get usedVariables(): VariableMap {
		if (!this._usedVariables) {
			this._usedVariables = new VariableMap();
			this.collectVariables(this._usedVariables);
		}
		return this._usedVariables;
	}

	public get sortedVariables(): string {
		if (!this._sortedVariables) {
			const usedVariables = this.usedVariables;

			const ids: number[] = [];
			for (let id of usedVariables.keys())
				ids.push(id);

			ids.sort((a, b) => (a - b));

			this._sortedVariables = ids.join("_");
		}

		return this._sortedVariables;
	}

	public get equivalence(): Uint8Array {
		if (!this._equivalence) {
			const usedVariables = this.usedVariables;

			const variables: Variable[] = [];
			for (let variable of usedVariables.values())
				variables.push(variable);

			variables.sort((a, b) => (a.id - b.id));

			const variableCount = variables.length;

			if (variableCount > 16)
				throw new Error(Strings.ErrorExpressionUsesTooManyVariables);

			const totalCombinations = 1 << variableCount,
				equivalence = new Uint8Array(variableCount + ((totalCombinations + 7) >>> 3));

			this.equivalenceVariableCount = variableCount;
			// Compute the mask of valid bits in the last byte to use with isEquivalentNegated() 
			const validBitsInLastByte = (totalCombinations & 7) || 8;
			this.equivalenceLastByteMask = (1 << validBitsInLastByte) - 1;

			for (let i = 0; i < variableCount; i++)
				equivalence[i] = variables[i].id;

			for (let i = 0, bitIndex = (variableCount << 3); i < totalCombinations; i++, bitIndex++) {
				for (let v = variableCount - 1, tmp = i; v >= 0; v--, tmp >>>= 1)
					variables[v].helperValue = !!(tmp & 1);

				if (this.evaluateEquivalence())
					equivalence[(bitIndex >>> 3)] |= 1 << (bitIndex & 7);
			}

			this._equivalence = equivalence;
		}

		return this._equivalence;
	}

	public isEquivalent(evaluatable: Evaluatable): boolean {
		const a = this.equivalence,
			b = (evaluatable = evaluatable.actualEvaluatable).equivalence;

		if (this.equivalenceVariableCount !== evaluatable.equivalenceVariableCount)
			return false;

		const length = a.length;

		// Start with byte 0 to check the variable id's first (possibly failing faster)
		for (let i = 0; i < length; i++) {
			if (a[i] !== b[i])
				return false;
		}

		return true;
	}

	public isEquivalentNegated(evaluatable: Evaluatable): boolean {
		const a = this.equivalence,
			b = (evaluatable = evaluatable.actualEvaluatable).equivalence,
			equivalenceVariableCount = this.equivalenceVariableCount;

		if (equivalenceVariableCount !== evaluatable.equivalenceVariableCount)
			return false;

		// Start with byte 0 to check the variable id's first (possibly failing faster)
		let i = 0;

		for (; i < equivalenceVariableCount; i++) {
			if (a[i] !== b[i])
				return false;
		}

		const length = a.length - 1;

		for (; i < length; i++) {
			if (a[i] !== ~b[i])
				return false;
		}

		return (a[i] === ((~b[i]) & this.equivalenceLastByteMask));
	}

	public isEquivalentSomehow(evaluatable: Evaluatable): number {
		const a = this.equivalence,
			b = (evaluatable = evaluatable.actualEvaluatable).equivalence,
			equivalenceVariableCount = this.equivalenceVariableCount;

		if (equivalenceVariableCount !== evaluatable.equivalenceVariableCount)
			return 0;

		// Start with byte 0 to check the variable id's first (possibly failing faster)
		let i = 0;

		for (; i < equivalenceVariableCount; i++) {
			if (a[i] !== b[i])
				return 0;
		}

		const length = a.length - 1;

		if (i === length)
			return ((a[i] === b[i]) ? 1 : ((a[i] === ((~b[i]) & this.equivalenceLastByteMask)) ? -1 : 0));

		if (a[i] === b[i]) {
			i++;

			for (; i <= length; i++) {
				if (a[i] !== b[i])
					return 0;
			}

			return 1;
		} else if (a[i] === ~b[i]) {
			i++;

			for (; i < length; i++) {
				if (a[i] !== ~b[i])
					return 0;
			}

			return ((a[i] === ((~b[i]) & this.equivalenceLastByteMask)) ? -1 : 0);
		}

		return 0;
	}

	public evaluateValue(): boolean | null {
		const evaluatedValue = this.evaluateValueInternal();

		if (evaluatedValue !== null) {
			if (this._evaluatedValue === null)
				this._evaluatedValue = evaluatedValue;
			else if (evaluatedValue !== this._evaluatedValue)
				throw new Error(Strings.ErrorInconsistentExpression + this.toString() + Strings.ErrorInconsistentExpression2 + (this._evaluatedValue ? Strings.True : Strings.False) + Strings.ErrorInconsistentExpression3 + (evaluatedValue ? Strings.True : Strings.False));
		}

		return evaluatedValue;
	}

	public get actualEvaluatable(): Evaluatable {
		return this;
	}
}
