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

class Variable extends Evaluatable {
	public readonly id: number;
	public readonly name: string;
	public helperValue: boolean;
	private assignedValue: boolean | null;

	public constructor(id: number, name: string) {
		super(true);

		this.id = id;
		this.name = name;
		this.helperValue = false;
		this.assignedValue = null;
	}

	public equals(o: ModelObject | null): boolean {
		return (this === o);
	}

	public get simplifiedString(): string {
		return this.name;
	}

	public toString(simplified?: boolean): string {
		return this.name;
	}

	protected computeString(simplified?: boolean): string {
		return this.name;
	}

	public checkIfAxiomIsOfInterest(axiom: Axiom): void {
		switch (axiom.evaluatable.isEquivalentSomehow(this)) {
			case 1:
				if (this.assignedValue === null)
					this.assignedValue = true;
				else if (!this.assignedValue)
					throw new Error(Strings.ErrorVariableAlreadyAssignedToADifferentValue + Strings.False);
				break;

			case -1:
				if (this.assignedValue === null)
					this.assignedValue = false;
				else if (this.assignedValue)
					throw new Error(Strings.ErrorVariableAlreadyAssignedToADifferentValue + Strings.True);
				break;
		}
	}

	public collectVariables(usedVariables: VariableMap): void {
		usedVariables.set(this.id, this);
	}

	public evaluateEquivalence(): boolean {
		return this.helperValue;
	}

	protected evaluateValueInternal(): boolean | null {
		return this.assignedValue;
	}
}
