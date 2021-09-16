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

class Axiom extends ModelObject {
	public readonly id: number;
	public readonly evaluatable: Evaluatable;

	public constructor(id: number, evaluatable: Evaluatable) {
		super();

		this.id = id;
		this.evaluatable = evaluatable.actualEvaluatable;
	}

	public get simplifiedString(): string {
		return this.evaluatable.simplifiedString;
	}

	public toString(simplified?: boolean): string {
		return this.evaluatable.toString(simplified);
	}

	public equals(o: ModelObject | null): boolean {
		return ((o instanceof Axiom) && o.evaluatable.equals(this.evaluatable));
	}

	public initialize(axiomIndex: number, axioms: Axiom[]): boolean {
		let r = true;

		for (let i = 0; i < axiomIndex; i++) {
			switch (this.evaluatable.isEquivalentSomehow(axioms[i].evaluatable)) {
				case 1:
					r = false;
					break;

				case 0:
					break;

				case -1:
					throw new Error(Strings.ErrorInconsistentAxioms + this.id + " / " + axioms[i].id);
			}
		}

		return r;
	}

	public checkIfAxiomIsOfInterest(axiom: Axiom): void {
		this.evaluatable.checkIfAxiomIsOfInterest(axiom);
		axiom.evaluatable.checkIfAxiomIsOfInterest(this);
	}
}
