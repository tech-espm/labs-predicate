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

class Strings {
	public static language = "en";

	public static DecimalSeparator = ".";
	public static OppositeDecimalSeparator = ",";
	public static Oops = "Oops\u2026";

	public static AntecedentEvaluation = "Antecedent evaluates as True";
	public static BiconditionalElimination = "Biconditional Elimination";
	public static ConsequentEvaluation = "Consequent evaluates as False";
	public static ConstructiveDilemma = "Constructive Dilemma";
	public static DestructiveDilemma = "Destructive Dilemma";
	public static DisjunctionElimination = "Disjunction Elimination";
	public static DisjunctiveSyllogism = "Disjunctive Syllogism";
	public static HypotheticalSyllogism = "Hypothetical Syllogism";
	public static ModusPonens = "Modus Ponens";
	public static ModusTollens = "Modus Tollens";
	public static NegationIntroduction = "Negation Introduction";
	public static Simplification = "Simplification";

	public static PleaseWait = "Please wait\u2026";
	public static Error = "Error";
	public static ICouldNotDeductAnythingElse = "I could not deduct anything else 😊";
	public static False = "False";
	public static True = "True";
	public static Ln = "Ln";
	public static Col = "Col";
	public static Menu = "Menu";
	public static New = "New";
	public static Load = "Load";
	public static LoadEllipsis = "Load\u2026";
	public static Save = "Save";
	public static SaveEllipsis = "Save\u2026";
	public static LoadExample = "Load Example";
	public static InstallEllipsis = "Install\u2026";
	public static WrapMode = "Line Wrap";

	public static Edit = "Edit";
	public static Delete = "Delete";
	public static Enable = "Enable";
	public static Disable = "Disable";
	public static Enabled = "Enabled";
	public static Disabled = "Disabled";
	public static OK = "OK";
	public static Cancel = "Cancel";
	public static Clear = "Clear";
	public static Back = "Back";
	public static Close = "Close";
	public static Refresh = "Refresh";
	public static Exit = "Exit";
	public static ShowNextDeduction = "Show Next Deduction";
	public static StopDeducting = "Stop Deducting";
	public static FileName = "File Name";
	public static UnknownError = "Unknown error";
	public static Theme = "Theme";
	public static ThemeEllipsis = "Theme\u2026";
	public static BrowserNotSupported = "Unfortunately, your browser does not support this feature 😢";
	public static UpdateAvailable = "Update Available!";
	public static PleaseRefresh = "Please, refresh the page to update the app 😊";
	public static ConfirmQuit = "Do you really want to quit? You will lose unsaved information.";
	public static ConfirmClose = "Do you really want to continue? You will lose unsaved information.";
	public static ErrorNoFile = "Your browser does not support advanced file access 😢";
	public static ErrorFileLoad = "An error occurred while reading the file 😢";
	public static ErrorFileSave = "An error occurred while saving the file 😢";
	public static ErrorDownload = "An error occurred while downloading data 😢";
	public static ErrorInvalidFileName = "Invalid file name 😢";
	public static ErrorInvalidChar = "Invalid character: ";
	public static ErrorUnexpectedEndOfCode = "Unexpected end of code.";
	public static ErrorUnexpectedEndOfCodeUnaryExpected = "Unexpected end of code. Variable, negation or ( expected.";
	public static ErrorUnexpectedEndOfLineUnaryExpected = "Unexpected end of line. Variable, negation or ( expected.";
	public static ErrorEndOfLineExpected = "End of line expected.";
	public static ErrorUnexpectedOperatorUnaryExpected = "Unexpected operator. Variable, negation or ( expected.";
	public static ErrorUnaryExpected = "Invalid character found. Variable, negation or ( expected.";
	public static ErrorClosingParenthesisExpected = ") expected.";
	public static ErrorClosingParenthesis2Expected = "] expected.";
	public static ErrorClosingParenthesis3Expected = "} expected.";
	public static ErrorClosingParenthesisOrOperatorExpected = "), conjunction, disjunction, implication or biconditional operator expected.";
	public static ErrorClosingParenthesis2OrOperatorExpected = "], conjunction, disjunction, implication or biconditional operator expected.";
	public static ErrorClosingParenthesis3OrOperatorExpected = "}, conjunction, disjunction, implication or biconditional operator expected.";
	public static ErrorConditionalOperatorExpected = "Implication or biconditional operator expected.";
	public static ErrorOperatorExpected = "Conjunction, disjunction, implication or biconditional operator expected.";
	public static ErrorVariableAlreadyAssignedToADifferentValue = "Variable already assigned to a different value: ";
	public static ErrorExpressionAlreadyAssignedToADifferentValue = "Expression already assigned to a different value: ";
	public static ErrorExpressionUsesTooManyVariables = "Expression uses more than 16 variables.";
	public static ErrorInconsistentAxioms = "Inconsistent axioms: ";
	public static ErrorInconsistentExpression = "Inconsistent expression: ";
	public static ErrorInconsistentExpression2 = " evaluated as ";
	public static ErrorInconsistentExpression3because = " because of ";
	public static ErrorInconsistentExpression3 = " but now evaluates as ";
	public static ErrorTooManyVariables = "More than 256 declared variables.";
	public static ErrorUnknownVariable = "Unknown variable: ";

	public static toFixed(x: number, fractionDigits: number): string { return x.toFixed(fractionDigits); }

	public static init(): void {
		const language = ((navigator as any)["userLanguage"] as string || navigator.language);
		if (language && language.toLowerCase().indexOf("pt") === 0) {
			Strings.language = "pt-br";

			document.documentElement.setAttribute("lang", "pt-br");

			Strings.DecimalSeparator = ",";
			Strings.OppositeDecimalSeparator = ".";
			//Strings.Oops = "Oops\u2026";

			Strings.AntecedentEvaluation = "Antecedente vale Verdadeiro";
			Strings.BiconditionalElimination = "Eliminação de Bicondicional";
			Strings.ConsequentEvaluation = "Consequente vale Falso";
			Strings.ConstructiveDilemma = "Dilema Construtivo";
			Strings.DestructiveDilemma = "Dilema Destrutivo";
			Strings.DisjunctionElimination = "Eliminação de Disjunção";
			Strings.DisjunctiveSyllogism = "Silogismo Disjuntivo";
			Strings.HypotheticalSyllogism = "Silogismo Hipotético";
			Strings.ModusPonens = "Modus Ponens";
			Strings.ModusTollens = "Modus Tollens";
			Strings.NegationIntroduction = "Introdução de Negação";
			Strings.Simplification = "Simplificação";
		
			Strings.PleaseWait = "Por favor, aguarde\u2026";
			Strings.Error = "Erro";
			Strings.ICouldNotDeductAnythingElse = "Não consegui deduzir mais nada 😊";
			Strings.False = "Falso";
			Strings.True = "Verdadeiro";
			//Strings.Ln = "Ln";
			//Strings.Col = "Col";
			//Strings.Menu = "Menu";
			Strings.New = "Novo";
			Strings.Load = "Abrir";
			Strings.LoadEllipsis = "Abrir\u2026";
			Strings.Save = "Salvar";
			Strings.SaveEllipsis = "Salvar\u2026";
			Strings.LoadExample = "Abrir Exemplo";
			Strings.InstallEllipsis = "Instalar\u2026";
			Strings.WrapMode = "Quebra de Linha";
			Strings.Edit = "Edit";
			Strings.Delete = "Excluir";
			Strings.Enable = "Habilitar";
			Strings.Disable = "Desabilitar";
			Strings.Enabled = "Habilitado";
			Strings.Disabled = "Desabilitado";
			//Strings.OK = "OK";
			Strings.Cancel = "Cancelar";
			Strings.Clear = "Limpar";
			Strings.Back = "Voltar";
			Strings.Close = "Fechar";
			Strings.Refresh = "Recarregar";
			Strings.Exit = "Sair";
			Strings.ShowNextDeduction = "Mostrar Próxima Dedução";
			Strings.StopDeducting = "Parar Deduções";
			Strings.FileName = "Nome do Arquivo";
			Strings.UnknownError = "Erro desconhecido";
			Strings.Theme = "Tema";
			Strings.ThemeEllipsis = "Tema\u2026";
			Strings.BrowserNotSupported = "Infelizmente seu navegador não suporta essa funcionalidade 😢";
			Strings.UpdateAvailable = "Atualização Disponível!";
			Strings.PleaseRefresh = "Por favor, recarregue a página para atualizar a aplicação 😊";
			Strings.ConfirmQuit = "Deseja mesmo sair da página? Você perderá o documento atual.";
			Strings.ConfirmClose = "Deseja mesmo continuar? Você perderá as alterações não salvas.";
			Strings.ErrorNoFile = "Seu browser não oferece suporte a acesso avançado de arquivos 😢";
			Strings.ErrorFileLoad = "Ocorreu um erro ao ler o arquivo 😢";
			Strings.ErrorFileSave = "Ocorreu um erro ao gravar o arquivo 😢";
			Strings.ErrorDownload = "Ocorreu um erro durante o download dos dados 😢";
			Strings.ErrorInvalidFileName = "Nome de arquivo inválido 😢";
			Strings.ErrorInvalidChar = "Caractere inválido: ";
			Strings.ErrorUnexpectedEndOfCode = "Fim de código inesperado.";
			Strings.ErrorUnexpectedEndOfCodeUnaryExpected = "Fim de código inesperado. Era esperado uma variável, negação ou (.";
			Strings.ErrorUnexpectedEndOfLineUnaryExpected = "Término de linha inesperado. Era esperado uma variável, negação ou (.";
			Strings.ErrorEndOfLineExpected = "Era esperado um término de linha.";
			Strings.ErrorUnexpectedOperatorUnaryExpected = "Operador inesperado. Era esperado uma variável, negação ou (.";
			Strings.ErrorUnaryExpected = "Caractere inválido encontrado. Era esperado uma variável, negação ou (.";
			Strings.ErrorClosingParenthesisExpected = "Era esperado um ).";
			Strings.ErrorClosingParenthesis2Expected = "Era esperado um ].";
			Strings.ErrorClosingParenthesis3Expected = "Era esperado um }.";
			Strings.ErrorClosingParenthesisOrOperatorExpected = "Era esperado um ) ou um operador de conjunção, disjunção, implicação ou bicondicional.";
			Strings.ErrorClosingParenthesis2OrOperatorExpected = "Era esperado um ] ou um operador de conjunção, disjunção, implicação ou bicondicional.";
			Strings.ErrorClosingParenthesis3OrOperatorExpected = "Era esperado um } ou um operador de conjunção, disjunção, implicação ou bicondicional.";
			Strings.ErrorConditionalOperatorExpected = "Era esperado operador de implicação ou bicondicional.";
			Strings.ErrorOperatorExpected = "Era esperado um operador de conjunção, disjunção, implicação ou bicondicional.";
			Strings.ErrorVariableAlreadyAssignedToADifferentValue = "Um valor diferente já havia sido atribuído à variável: ";
			Strings.ErrorExpressionAlreadyAssignedToADifferentValue = "Um valor diferente já havia sido atribuído à expressão: ";
			Strings.ErrorExpressionUsesTooManyVariables = "A expressão utiliza mais de 16 variáveis.";
			Strings.ErrorInconsistentAxioms = "Premissas inconsistentes: ";
			Strings.ErrorInconsistentExpression = "Expressão inconsistente: ";
			Strings.ErrorInconsistentExpression2 = " era avaliada como ";
			Strings.ErrorInconsistentExpression3because = " por causa de ";
			Strings.ErrorInconsistentExpression3 = " mas agora é avaliada como ";
			Strings.ErrorTooManyVariables = "Mais de 256 variáveis declaradas.";
			Strings.ErrorUnknownVariable = "Variável desconhecida: ";
		}

		Strings.translateChildren(document.body);
	}

	public static translate(key: string): string {
		const v = (Strings as any)[key] as string | undefined;
		return (v !== undefined ? v : key);
	};

	public static translateChildren(parent: HTMLElement): void {
		const childNodes = parent.childNodes;
		for (let i = childNodes.length - 1; i >= 0; i--) {
			const c = childNodes[i] as HTMLElement;
			if (!c.tagName)
				continue;
			if (c.childNodes && c.childNodes.length)
				Strings.translateChildren(c);

			let d: string | null;

			if ((d = c.getAttribute("title")))
				c.setAttribute("title", Strings.translate(d));

			if (!(d = c.getAttribute("data-string")))
				continue;

			c.removeAttribute("data-string");

			let start = 0;
			do {
				let end = d.indexOf(";", start);
				if (end < start)
					end = d.length;

				const idx = d.indexOf("|", start);

				if (idx < 0 || idx >= end) {
					c.appendChild(document.createTextNode(Strings.translate(d)));
				} else {
					const attr = d.substring(start, idx),
						key = d.substring(idx + 1, end);
					if (attr == "text")
						c.appendChild(document.createTextNode(Strings.translate(key)));
					else
						c.setAttribute(attr, Strings.translate(key));
				}

				start = end + 1;
			} while (start < d.length);
		}
	}
}
