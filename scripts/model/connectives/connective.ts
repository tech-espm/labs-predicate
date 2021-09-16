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

interface ConnectiveFactoryMethod {
	(operands: Evaluatable[], skipSort?: boolean): Evaluatable;
}

abstract class Connective extends Evaluatable {
	public readonly operands: Evaluatable[];
	protected readonly originalOperands: Evaluatable[];
	private readonly connector: string;
	protected readonly axiomsOfInterest: AxiomOfInterestMap;

	protected constructor(operands: Evaluatable[], skipSort: boolean | undefined, connector: string, clazz: any) {
		super(false);

		this.originalOperands = operands;
		this.connector = connector;
		this.axiomsOfInterest = createAxiomOfInterestMap();

		if (skipSort) {
			this.operands = operands;
		} else {
			const actualOperands: Evaluatable[] = [];

			// Merge several similar connectives together
			for (let i = operands.length - 1; i >= 0; i--) {
				const operand = operands[i];

				if (operand.actualEvaluatable instanceof clazz) {
					const newOperands = (operand.actualEvaluatable as Connective).operands;
					for (let j = newOperands.length - 1; j >= 0; j--) {
						const newOperand = newOperands[j];
						actualOperands.push(newOperand.isUnary ? newOperand : new SubExpression(newOperand));
					}
				} else {
					actualOperands.push(operand.isUnary ? operand : new SubExpression(operand));
				}
			}

			// Remove repeated operands
			for (let i = actualOperands.length - 1; i >= 0; i--) {
				const operand = actualOperands[i].actualEvaluatable;

				for (let j = i - 1; j >= 0; j--) {
					if (operand.equals(actualOperands[j])) {
						actualOperands.splice(i, 1);
						break;
					}
				}
			}

			// Sort the remaining operands (to improve equality check) as the order does not affect the final result
			const sortedOperands: {
				sortedVariables: string,
				operand: Evaluatable
			}[] = new Array(actualOperands.length);

			for (let i = sortedOperands.length - 1; i >= 0; i--)
				sortedOperands[i] = {
					sortedVariables: actualOperands[i].actualEvaluatable.sortedVariables,
					operand: actualOperands[i]
				};

			sortedOperands.sort((a, b) => ((a.sortedVariables < b.sortedVariables) ? -1 : 1));

			// Remove possibly repeated operands
			for (let i = sortedOperands.length - 2; i >= 0; i--) {
				if (sortedOperands[i].sortedVariables !== sortedOperands[i + 1].sortedVariables ||
					!sortedOperands[i].operand.isEquivalent(sortedOperands[i + 1].operand))
					continue;

				sortedOperands.splice(i + 1, 1);
			}

			this.operands = new Array(sortedOperands.length);
			for (let i = sortedOperands.length - 1; i >= 0; i--)
				this.operands[i] = sortedOperands[i].operand;
		}
	}

	public equals(o: ModelObject | null): boolean {
		if (!(o instanceof Evaluatable))
			return false;

		const a = o.actualEvaluatable;
		if (!(a instanceof Connective) || this.connector !== a.connector || this.operands.length !== a.operands.length)
			return false;

		const operands = this.operands,
			aOperands = a.operands;

		for (let i = operands.length - 1; i >= 0; i--) {
			if (!operands[i].equals(aOperands[i]))
				return false;
		}

		return true;
	}

	protected computeString(simplified?: boolean): string {
		const operands = (simplified ? this.operands : this.originalOperands),
			connector = this.connector,
			operandsLength = operands.length;

		let s = operands[0].toString(simplified);

		for (let i = 1; i < operandsLength; i++)
			s += connector + operands[i].toString(simplified);

		return s;
	}

	private generateNextSequence(counters: number[], maxValue: number, size: number): boolean {
		let positionFromLast = 0,
			i = size - 1;

		while (i >= 0) {
			counters[i]++;

			if (counters[i] <= (maxValue - positionFromLast))
				break;

			i--;
			positionFromLast++;
		}

		if (i < 0)
			return false;

		while (++i < size)
			counters[i] = counters[i - 1] + 1;

		return true;
	}

	public checkIfAxiomIsOfInterest(axiom: Axiom): void {
		if (this.axiomsOfInterest.has(axiom.id))
			return;

		const evaluatable = axiom.evaluatable,
			evaluatableUsedVariables = evaluatable.usedVariables;

		let operands = this.operands,
			operandsLength = operands.length;

		for (let i = operandsLength - 1; i >= 0; i--)
			operands[i].checkIfAxiomIsOfInterest(axiom);

		if (!this.usedVariables.containsSubset(evaluatableUsedVariables))
			return;

		// Let's handle the trivial cases first
		for (let i = operandsLength - 1; i >= 0; i--) {
			const equivalence = operands[i].isEquivalentSomehow(evaluatable);

			if (equivalence) {
				this.axiomsOfInterest.set(axiom.id, {
					operands: [operands[i]],
					equivalence,
					axiom
				});
				return;
			}
		}

		if (operandsLength < 2)
			return;

		// Remove all operands that do not share at least one variable with the
		// given evaluatable
		operands = operands.slice();
		for (let i = operandsLength - 1; i >= 0; i--) {
			if (!operands[i].usedVariables.intersects(evaluatableUsedVariables))
				operands.splice(i, 1);
		}

		operandsLength = operands.length;

		if (operandsLength < 2)
			return;

		const factoryMethod = ((this instanceof Conjunction) ? Conjunction.create : Disjunction.create),
			maxSize = operandsLength,
			maxIndex = operandsLength - 1,
			counters: number[] = new Array(maxSize),
			idSet = new IdSet();

		for (let size = 2; size <= maxSize; size++) {
			for (let i = size - 1; i >= 0; i--)
				counters[i] = i;

			do {
				idSet.clear();
				for (let i = size - 1; i >= 0; i--)
					idSet.addSubset(operands[counters[i]].usedVariables);

				if (!idSet.containsSameElements(evaluatableUsedVariables))
					continue;

				// Now that we know this combination of operands has the same
				// variables as the given evaluatable, we check if they are
				// equivalent somehow
				const newOperands: Evaluatable[] = new Array(size);
				for (let i = size - 1; i >= 0; i--)
					newOperands[i] = operands[counters[i]];

				const equivalence = factoryMethod(newOperands, true).isEquivalentSomehow(evaluatable);

				if (equivalence) {
					this.axiomsOfInterest.set(axiom.id, {
						operands: newOperands,
						equivalence,
						axiom
					});
					return;
				}
			} while (this.generateNextSequence(counters, maxIndex, size));
		}
	}

	public collectVariables(usedVariables: VariableMap): void {
		const operands = this.operands;

		for (let i = operands.length - 1; i >= 0; i--)
			operands[i].collectVariables(usedVariables);
	}

	public getAxiomOfInterest(axiom: Axiom): AxiomOfInterest | null {
		return this.axiomsOfInterest.get(axiom.id) || null;
	}
}
