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

class Parser {
	public static parse(code: string): AxiomContext {
		Evaluatable.nextId = 1;

		const tokenStream = new TokenStream(code);

		let axiom: Axiom | null = null;

		const variables = new VariableCollection(),
			axioms: Axiom[] = [];

		for (;;) {
			let t = tokenStream.peekToken();
			if (!t)
				break;

			if (t.type === TokenType.EndOfLine) {
				tokenStream.getToken();
				continue;
			}

			axiom = Parser.parseAxiom(t.line, tokenStream, variables);
			if (!axiom)
				break;

			axioms.push(axiom);
		}

		return new AxiomContext(code, variables, axioms, tokenStream.currentLine + 3);
	}

	private static parseUnary(tokenStream: TokenStream, variables?: VariableCollection | null, axiomContext?: AxiomContext | null): Evaluatable {
		const token = tokenStream.getToken();

		if (!token)
			throw new InterpreterError(Strings.ErrorUnexpectedEndOfCodeUnaryExpected, tokenStream.currentIndex, tokenStream.currentLine, tokenStream.currentLineIndex);

		let evaluatable: Evaluatable;

		switch (token.type) {
			case TokenType.Variable:
				let variable: Variable | null = null;

				if (variables)
					variable = variables.getOrCreateVariable(token.text);
				else if (axiomContext)
					variable = axiomContext.getVariable(token.text);

				if (!variable)
					throw new InterpreterError(Strings.ErrorUnknownVariable + token.text, token.index, token.line, token.lineIndex);

				return variable;

			case TokenType.OpeningParenthesis:
				evaluatable = Parser.parseConditional(tokenStream, variables, axiomContext);

				const closingParenthesis = tokenStream.getToken();
				if (!closingParenthesis)
					throw new InterpreterError(Strings.ErrorClosingParenthesisOrOperatorExpected, tokenStream.currentIndex, tokenStream.currentLine, tokenStream.currentLineIndex);
				if (closingParenthesis.type !== TokenType.ClosingParenthesis)
					throw new InterpreterError(Strings.ErrorClosingParenthesisOrOperatorExpected, closingParenthesis.index, closingParenthesis.line, closingParenthesis.lineIndex);

				return (evaluatable.isUnary ? evaluatable : new SubExpression(evaluatable));

			case TokenType.OpeningParenthesis2:
				evaluatable = Parser.parseConditional(tokenStream, variables, axiomContext);

				const closingParenthesis2 = tokenStream.getToken();
				if (!closingParenthesis2)
					throw new InterpreterError(Strings.ErrorClosingParenthesis2OrOperatorExpected, tokenStream.currentIndex, tokenStream.currentLine, tokenStream.currentLineIndex);
				if (closingParenthesis2.type !== TokenType.ClosingParenthesis2)
					throw new InterpreterError(Strings.ErrorClosingParenthesis2OrOperatorExpected, closingParenthesis2.index, closingParenthesis2.line, closingParenthesis2.lineIndex);

				return (evaluatable.isUnary ? evaluatable : new SubExpression(evaluatable, TokenStrings.OpeningParenthesis2, TokenStrings.ClosingParenthesis2));

			case TokenType.OpeningParenthesis3:
				evaluatable = Parser.parseConditional(tokenStream, variables, axiomContext);

				const closingParenthesis3 = tokenStream.getToken();
				if (!closingParenthesis3)
					throw new InterpreterError(Strings.ErrorClosingParenthesis3OrOperatorExpected, tokenStream.currentIndex, tokenStream.currentLine, tokenStream.currentLineIndex);
				if (closingParenthesis3.type !== TokenType.ClosingParenthesis3)
					throw new InterpreterError(Strings.ErrorClosingParenthesis3OrOperatorExpected, closingParenthesis3.index, closingParenthesis3.line, closingParenthesis3.lineIndex);

				return (evaluatable.isUnary ? evaluatable : new SubExpression(evaluatable, TokenStrings.OpeningParenthesis3, TokenStrings.ClosingParenthesis3));

			case TokenType.Negation:
				evaluatable = Parser.parseUnary(tokenStream, variables, axiomContext);

				//return ((evaluatable instanceof Negation) ? (evaluatable as Negation).evaluatable : new Negation(evaluatable));
				return new Negation(evaluatable);

			case TokenType.EndOfLine:
				throw new InterpreterError(Strings.ErrorUnexpectedEndOfLineUnaryExpected, token.index, token.line, token.lineIndex);

			default:
				throw new InterpreterError(token.isOperator ? Strings.ErrorUnexpectedOperatorUnaryExpected : Strings.ErrorUnaryExpected, token.index, token.line, token.lineIndex);
		}
	}

	// parseExpression() considers that both AND and OR have the same precedence
	private static parseExpression(tokenStream: TokenStream, variables?: VariableCollection | null, axiomContext?: AxiomContext | null): Evaluatable {
		let operand = Parser.parseUnary(tokenStream, variables, axiomContext),
			token = tokenStream.peekToken();

		if (!token || !token.isExpressionOperator)
			return operand;

		let lastOperator = token.type,
			operands = [operand];

		while (token && token.isExpressionOperator) {
			tokenStream.getToken();

			if (token.type !== lastOperator) {
				operands = [((lastOperator === TokenType.Conjunction) ? Conjunction.create(operands) : Disjunction.create(operands))];
				lastOperator = token.type;
			}

			operands.push(Parser.parseUnary(tokenStream, variables, axiomContext));

			token = tokenStream.peekToken();
		}

		return ((lastOperator === TokenType.Conjunction) ? Conjunction.create(operands) : Disjunction.create(operands));
	}

	private static parseConjunction(tokenStream: TokenStream, variables?: VariableCollection | null, axiomContext?: AxiomContext | null): Evaluatable {
		let operand = Parser.parseUnary(tokenStream, variables, axiomContext),
			token = tokenStream.peekToken();

		if (!token || token.type !== TokenType.Conjunction)
			return operand;

		let operands = [operand];

		while (token && token.type === TokenType.Conjunction) {
			tokenStream.getToken();

			operands.push(Parser.parseUnary(tokenStream, variables, axiomContext));

			token = tokenStream.peekToken();
		}

		return Conjunction.create(operands);
	}

	private static parseDisjunction(tokenStream: TokenStream, variables?: VariableCollection | null, axiomContext?: AxiomContext | null): Evaluatable {
		let operand = Parser.parseConjunction(tokenStream, variables, axiomContext),
			token = tokenStream.peekToken();

		if (!token || token.type !== TokenType.Disjunction)
			return operand;

		let operands = [operand];

		while (token && token.type === TokenType.Disjunction) {
			tokenStream.getToken();

			operands.push(Parser.parseConjunction(tokenStream, variables, axiomContext));

			token = tokenStream.peekToken();
		}

		return Disjunction.create(operands);
	}

	private static parseConditional(tokenStream: TokenStream, variables?: VariableCollection | null, axiomContext?: AxiomContext | null): Evaluatable {
		let operand = Parser.parseDisjunction(tokenStream, variables, axiomContext);

		const token = tokenStream.peekToken();

		if (token && token.isConditionalOperator) {
			tokenStream.getToken();

			const operandB = Parser.parseConditional(tokenStream, variables, axiomContext);
			operand = ((token.type === TokenType.Implication) ? new Implication(operand, operandB) : new Biconditional(operand, operandB));
		}

		return operand;
	}

	private static parseAxiom(id: number, tokenStream: TokenStream, variables?: VariableCollection | null, axiomContext?: AxiomContext | null): Axiom {
		const evaluatable = Parser.parseConditional(tokenStream, variables, axiomContext);

		const token = tokenStream.peekToken();
		if (token && token.type !== TokenType.EndOfLine)
			throw new InterpreterError(Strings.ErrorEndOfLineExpected, token.index, token.line, token.lineIndex);

		return new Axiom(id, evaluatable);
	}
}
