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

class IdSet extends Set<number> {
	public intersects(subset: VariableMap | IdSet): boolean {
		if (subset.size <= this.size) {
			for (let id of subset.keys()) {
				if (this.has(id))
					return true;
			}
		} else {
			for (let id of this.keys()) {
				if (subset.has(id))
					return true;
			}
		}

		return false;
	}

	public containsSameElements(subset: VariableMap | IdSet): boolean {
		if (this.size !== subset.size)
			return false;

		for (let id of subset.keys()) {
			if (!this.has(id))
				return false;
		}

		return true;
	}

	public containsSubset(subset: VariableMap | IdSet): boolean {
		if (this.size < subset.size)
			return false;

		for (let id of subset.keys()) {
			if (!this.has(id))
				return false;
		}

		return true;
	}

	public deleteSubset(subset: VariableMap | IdSet): void {
		for (let id of subset.keys())
			this.delete(id);
	}

	public addSubset(subset: VariableMap | IdSet): void {
		for (let id of subset.keys())
			this.add(id);
	}

	public clone(): IdSet {
		return new IdSet(this);
	}
}

class VariableMap extends Map<number, Variable> {
	public intersects(subset: VariableMap | IdSet): boolean {
		if (subset.size <= this.size) {
			for (let id of subset.keys()) {
				if (this.has(id))
					return true;
			}
		} else {
			for (let id of this.keys()) {
				if (subset.has(id))
					return true;
			}
		}

		return false;
	}

	public containsSameElements(subset: VariableMap | IdSet): boolean {
		if (this.size !== subset.size)
			return false;

		for (let id of subset.keys()) {
			if (!this.has(id))
				return false;
		}

		return true;
	}

	public containsSubset(subset: VariableMap | IdSet): boolean {
		if (this.size < subset.size)
			return false;

		for (let id of subset.keys()) {
			if (!this.has(id))
				return false;
		}

		return true;
	}

	public deleteSubset(subset: VariableMap | IdSet): void {
		for (let id of subset.keys())
			this.delete(id);
	}

	public clone(): VariableMap {
		return new VariableMap(this);
	}

	public createIdSet(): IdSet {
		return new IdSet(this.keys());
	}
}

// Just to avoid creating new actual classes that extend the Map class
interface VariableNameMap extends Map<string, Variable> {
}

interface AxiomMap extends Map<number, Axiom> {
}

interface AxiomOfInterest {
	operands: Evaluatable[];
	equivalence: number;
	axiom: Axiom;
}

interface AxiomOfInterestMap extends Map<number, AxiomOfInterest> {
}

interface BooleanMap extends Map<string, boolean> {
}

interface RuleMap extends Map<number, RuleMap | boolean> {
}

function createVariableNameMap(): VariableNameMap {
	return new Map<string, Variable>();
}

function createAxiomMap(): AxiomMap {
	return new Map<number, Axiom>();
}

function createAxiomOfInterestMap(): AxiomOfInterestMap {
	return new Map<number, AxiomOfInterest>();
}

function createBooleanMap(): BooleanMap {
	return new Map<string, boolean>();
}

function createRuleMap(): RuleMap {
	return new Map<number, RuleMap | boolean>();
}
