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

class VariableCollection {
	private readonly variables: VariableNameMap;
	private nextVariableId: number;

	public constructor() {
		this.variables = createVariableNameMap();
		this.nextVariableId = 0;
	}

	public getOrCreateVariable(name: string): Variable {
		let variable = this.variables.get(name);

		if (variable)
			return variable;

		if (this.nextVariableId >= 256)
			throw new Error(Strings.ErrorTooManyVariables);

		variable = new Variable(this.nextVariableId++, name);
		this.variables.set(name, variable);

		return variable;
	}

	public getVariable(name: string): Variable | null {
		return (this.variables.get(name) || null);
	}
}
