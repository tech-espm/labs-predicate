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

class TokenStream {
	private readonly code: string;

	private index: number;
	private line: number;
	private lineIndex: number;

	private token: Token | null;

	public constructor(code: string) {
		this.code = code;

		this.index = 0;
		this.line = 1;
		this.lineIndex = 1;

		this.token = this.fetchNextToken();
	}

	public get currentIndex(): number {
		return this.index;
	}

	public get currentLine(): number {
		return this.line;
	}

	public get currentLineIndex(): number {
		return this.lineIndex;
	}

	public peekToken(): Token | null {
		return this.token;
	}

	public getToken(): Token | null {
		const token = this.token;
		this.token = this.fetchNextToken();
		return token;
	}

	private fetchNextToken(): Token | null {
		const code = this.code;

		if (this.index >= code.length)
			return null;

		let t: Token;

		MainLoop:
		while (this.index < code.length) {
			const i = this.index;

			let c = code.charCodeAt(i);

			switch (c) {
				case 0x0020:
				case 0x0009:
				case 0x000B:
				case 0x000C:
				case 0x00A0: // OGHAM SPACE MARK (U+1680), MONGOLIAN VOWEL SEPARATOR (U+180E), EN QUAD (U+2000), EM QUAD (U+2001), EN SPACE (U+2002), EM SPACE (U+2003), THREE-PER-EM SPACE (U+2004), FOUR-PER-EM SPACE (U+2005), SIX-PER-EM SPACE (U+2006), FIGURE SPACE (U+2007), PUNCTUATION SPACE (U+2008), THIN SPACE (U+2009), HAIR SPACE (U+200A), NARROW NO-BREAK SPACE (U+202F), MEDIUM MATHEMATICAL SPACE (U+205F), IDEOGRAPHIC SPACE (U+3000)
					// white space
					this.index++;
					this.lineIndex++;
					break;

				case 0x000A: // new line
					this.index++;
					if ((i + 1) < code.length && code.charCodeAt(i + 1) === 0x000D)
						this.index++;

					t = new Token(TokenType.EndOfLine, TokenStrings.EndOfLine, i, this.line, this.lineIndex);

					this.line++;
					this.lineIndex = 1;

					return t;

				case 0x000D: // new line
					this.index++;
					if ((i + 1) < code.length && code.charCodeAt(i + 1) === 0x000A)
						this.index++;

					t = new Token(TokenType.EndOfLine, TokenStrings.EndOfLine, i, this.line, this.lineIndex);

					this.line++;
					this.lineIndex = 1;

					return t;

				case 0x0085:
				case 0x2028:
				case 0x2029: // new line
					t = new Token(TokenType.EndOfLine, TokenStrings.EndOfLine, i, this.line, this.lineIndex);

					this.index++;
					this.line++;
					this.lineIndex = 1;

					return t;

				case 0x0028: // (
					t = new Token(TokenType.OpeningParenthesis, TokenStrings.OpeningParenthesis, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x005B: // [
					t = new Token(TokenType.OpeningParenthesis2, TokenStrings.OpeningParenthesis2, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x007B: // {
					t = new Token(TokenType.OpeningParenthesis3, TokenStrings.OpeningParenthesis3, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x0029: // )
					t = new Token(TokenType.ClosingParenthesis, TokenStrings.ClosingParenthesis, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x005D: // ]
					t = new Token(TokenType.ClosingParenthesis2, TokenStrings.ClosingParenthesis2, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x007D: // }
					t = new Token(TokenType.ClosingParenthesis3, TokenStrings.ClosingParenthesis3, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x007E:
				case 0x002D:
				case 0x00AC: // ~ - ¬ negation
					t = new Token(TokenType.Negation, TokenStrings.Negation, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x005E:
				case 0x0026:
				case 0x002E:
				case 0x2227:
				case 0x22C5: // ^ & . ∧ ⋅ conjunction
					t = new Token(TokenType.Conjunction, TokenStrings.Conjunction, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x0076:
				case 0x007C:
				case 0x2228: // v | ∨ disjunction
					t = new Token(TokenType.Disjunction, TokenStrings.Disjunction, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x003E:
				case 0x2192:
				case 0x2283: // > → ⊃ implication
					t = new Token(TokenType.Implication, TokenStrings.Implication, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x003D:
				case 0x2194:
				case 0x2261: // = ↔ ≡ biconditional
					t = new Token(TokenType.Biconditional, TokenStrings.Biconditional, i, this.line, this.lineIndex);

					this.index++;
					this.lineIndex++;

					return t;

				case 0x0023: // # comment
					this.index++;
					this.lineIndex++;

					while (this.index < code.length) {
						c = code.charCodeAt(this.index);

						if (c === 0x000A || c === 0x000D)
							break;

						this.index++;
						this.lineIndex++;
					}
					break;

				default:
					const lineIndex = this.lineIndex;
					let length = 0;

					while (this.index < code.length) {
						c = code.charCodeAt(this.index);

						if (c !== 0x005F && (c < 0x0030 || (c > 0x0039 && c < 0x0041) || (c > 0x005A && c < 0x0061) || c > 0x007A)) {
							if (!length)
								throw new InterpreterError(Strings.ErrorInvalidChar + String.fromCharCode(c), i, this.line, lineIndex);

							return new Token(TokenType.Variable, code.substr(i, length), i, this.line, lineIndex);
						}

						length++;
						this.index++;
						this.lineIndex++;
					}

					if (length)
						return new Token(TokenType.Variable, code.substr(i, length), i, this.line, lineIndex);

					break;
			}
		}

		return null;
	}
}
