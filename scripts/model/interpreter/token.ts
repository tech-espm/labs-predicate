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

class Token extends ModelObject {
	public readonly type: TokenType;

	public readonly text: string;

	public readonly index: number;
	public readonly line: number;
	public readonly lineIndex: number;

	public constructor(type: TokenType, text: string, index: number, line: number, lineIndex: number) {
		super();

		this.type = type;
		this.text = text;
		this.index = index;
		this.line = line;
		this.lineIndex = lineIndex;
	}

	public get isOperator(): boolean {
		switch (this.type) {
			case TokenType.Conjunction:
			case TokenType.Disjunction:
			case TokenType.Implication:
			case TokenType.Biconditional:
				return true;
		}

		return false;
	}

	public get isExpressionOperator(): boolean {
		switch (this.type) {
			case TokenType.Conjunction:
			case TokenType.Disjunction:
				return true;
		}

		return false;
	}

	public get isConditionalOperator(): boolean {
		switch (this.type) {
			case TokenType.Implication:
			case TokenType.Biconditional:
				return true;
		}

		return false;
	}

	public get simplifiedString(): string {
		return this.text;
	}

	public toString(simplified?: boolean): string {
		return this.text;
	}

	public equals(o: ModelObject | null): boolean {
		return ((o && (o instanceof Token) && o.type === this.type) ?
			((o.type === TokenType.Variable) ? (o.text === this.text) : true) :
			false);
	}
}
