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

class AxiomContext {
	public readonly code: string;
	private readonly variables: VariableCollection;
	private readonly axioms: Axiom[];
	private nextAxiomId: number;
	private deductions: Deduction[];
	private pendingDeductions: PendingDeduction[];
	private stringDeductions: StringDeduction[];
	private error: boolean;

	public constructor(code: string, variables: VariableCollection, axioms: Axiom[], nextAxiomId: number) {
		this.code = code;
		this.variables = variables;
		this.axioms = axioms;
		this.nextAxiomId = nextAxiomId;
		this.deductions = null as any; // Just to indicate this object is uninitialized
		this.pendingDeductions = [];
		this.stringDeductions = [];
		this.error = false;
	}

	public getVariable(name: string): Variable | null {
		return this.variables.getVariable(name);
	}

	public step(): StringDeduction | null {
		const pendingDeductions = this.pendingDeductions,
			stringDeductions = this.stringDeductions;

		if (!this.error) {
			try {
				const axioms = this.axioms;

				if (!this.deductions) {
					this.deductions = [];
					const deductions = this.deductions;

					let axiomsLength = axioms.length;

					// Remove all biconditionals before starting
					for (let i = 0; i < axiomsLength; i++) {
						const result = Rule.biconditionalElimination.apply(axioms[i]);
						if (result && result !== true) {
							axioms.splice(i, 1);
							axiomsLength--;
							i--;
							deductions.push.apply(deductions, result);
						}
					}

					axiomsLength = axioms.length;

					// This is the first time, so we need to initialize all axioms
					for (let i = 0; i < axiomsLength; i++)
						axioms[i].initialize(i, axioms);

					for (let i = 0; i < axiomsLength; i++) {
						const axiom = axioms[i];

						for (let j = i + 1; j < axiomsLength; j++)
							axioms[j].checkIfAxiomIsOfInterest(axiom);
					}

					for (let i = 0; i < axiomsLength; i++)
						Rule.applyRules(pendingDeductions, deductions, i, axioms);
				}

				if (!stringDeductions.length) {
					const deductions = this.deductions;

					while (!stringDeductions.length && deductions.length) {
						const deduction = deductions.splice(0, 1)[0];

						if (deduction.error) {
							this.error = true;
							stringDeductions.push({
								error: true,
								text: deduction.explanation,
								explanation: null as any
							});
							break;
						}

						const previousAxiomsLength = axioms.length,
							axiom = new Axiom(this.nextAxiomId, deduction.newEvaluatable);

						try {
							// When initialize() returns false it means another equivalent axiom already exists
							if (!axiom.initialize(previousAxiomsLength, axioms))
								continue;
						} catch (ex: any) {
							// Add the axiom before leaving so the user knows why the error happened
							stringDeductions.push({
								error: false,
								text: deduction.newEvaluatable.actualEvaluatable.toString(),
								explanation: deduction.explanation
							});
	
							throw ex;
						}

						axioms.push(axiom);
						this.nextAxiomId += 2;
						stringDeductions.push({
							error: false,
							text: deduction.newEvaluatable.actualEvaluatable.toString(),
							explanation: deduction.explanation
						});

						try {
							for (let i = 0; i < previousAxiomsLength; i++)
								axiom.checkIfAxiomIsOfInterest(axioms[i]);

							Rule.applyRulesOfPendingDeductions(pendingDeductions, deductions);

							Rule.applyRules(pendingDeductions, deductions, previousAxiomsLength, axioms);
						} catch (ex: any) {
							deductions.push({
								error: true,
								newEvaluatable: null as any,
								explanation: (("formatMessage" in ex) ? ex.formatMessage() : (ex.message || ex.toString()))
							});
							break;
						}
					}
				}
			} catch (ex: any) {
				this.error = true;
				stringDeductions.push({
					error: true,
					text: (("formatMessage" in ex) ? ex.formatMessage() : (ex.message || ex.toString())),
					explanation: null as any
				});
			}
		}

		return (stringDeductions.length ? stringDeductions.splice(0, 1)[0] : null);
	}
}
