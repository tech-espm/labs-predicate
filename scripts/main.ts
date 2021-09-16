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

Strings.init();
Rule.init();

class UI {
	private static readonly btnStep = document.getElementById("btnStep") as HTMLButtonElement;
	private static readonly btnStop = document.getElementById("btnStop") as HTMLButtonElement;
	private static readonly modalSaveFileName = document.getElementById("modalSaveFileName") as HTMLInputElement;
	private static readonly modalSaveOk = document.getElementById("modalSaveOk") as HTMLButtonElement;
	private static readonly editorActionToggleWrapModeIcon = document.getElementById("editorActionToggleWrapModeIcon") as HTMLElement;
	private static readonly modalThemeSelect = document.getElementById("modalThemeSelect") as HTMLSelectElement;
	private static readonly editorActionFileLoad = document.getElementById("editorActionFileLoad") as HTMLInputElement;
	private static readonly editor = (window as any).ace.edit("editor");

	private static installationPrompt: any = null;
	private static loading = false;
	private static wrapMode: boolean;
	private static theme: string;
	private static axiomContext: AxiomContext;
	private static editSession: any;
	private static stepSession: any;
	private static stepping = false;
	private static steppingFinished = false;

	private static createSession(contents: string): any {
		const session = (window as any).ace.createEditSession(contents);

		session.setMode("ace/mode/predicate");
		session.setTabSize(4);
		session.setUseSoftTabs(false);
		session.setUseWrapMode(UI.wrapMode);
		session.getUndoManager().reset();

		return session;
	}

	private static fixDarkTheme(): void {
		let bgColor: string | null = null,
			style = document.getElementById("style-dark-mode") as HTMLLinkElement,
			metaColorScheme = document.getElementById("metaColorScheme") as HTMLMetaElement;
	
		switch (UI.theme) {
			case "ace/theme/dracula":
				bgColor = "#282a36";
				break;
			case "ace/theme/mono_industrial":
				bgColor = "#222c28";
				break;
			case "ace/theme/monokai":
				bgColor = "#272822";
				break;
		}
	
		const editorImgLogoGit = document.getElementById("editorImgLogoGit") as HTMLImageElement;

		if (bgColor) {
			document.body.style.backgroundColor = bgColor;
			editorImgLogoGit.setAttribute("src", "assets/images/logo-github-w.png?1");

			if (metaColorScheme)
				metaColorScheme.setAttribute("content", "dark");

			if (!style) {
				style = document.createElement("link");
				style.setAttribute("id", "style-dark-mode");
				style.setAttribute("rel", "stylesheet");
				style.setAttribute("href", "assets/css/style-dark.css?v=1.0.2");
				document.head.appendChild(style);
			}
		} else {
			document.body.style.backgroundColor = "";
			editorImgLogoGit.setAttribute("src", "assets/images/logo-github.png?1");

			if (metaColorScheme)
				metaColorScheme.setAttribute("content", "light");

			if (style)
				document.head.removeChild(style);
		}
	}

	private static modalSaveShown(): void {
		UI.modalSaveFileName.focus();
	}

	private static modalThemeShown(): void {
		UI.modalThemeSelect.focus();
	}

	private static modalSaveFileNameKeyDown(e: KeyboardEvent): void {
		if (e.key === "Enter" || e.keyCode === 13)
			UI.modalSaveOk.click();
	}

	private static editorActionFileLoadChange(): void {
		if (UI.loading) {
			UI.editorActionFileLoad.value = "";
			return;
		}

		if (!("files" in UI.editorActionFileLoad)) {
			alert(Strings.ErrorNoFile);
			return;
		}

		let file: File | null;

		if (!UI.editorActionFileLoad.files || !UI.editorActionFileLoad.files.length || !(file = UI.editorActionFileLoad.files[0])) {
			UI.editorActionFileLoad.value = "";
			return;
		}

		if (!file.name.toLowerCase().endsWith(".txt")) {
			UI.editorActionFileLoad.value = "";
			alert(Strings.ErrorInvalidFileName);
			return;
		}

		UI.stop();

		UI.loading = true;

		function showError() {
			UI.loading = false;
			UI.editorActionFileLoad.value = "";
			alert(Strings.ErrorFileLoad);
		}

		try {
			const reader = new FileReader();

			reader.onerror = showError;
			reader.onload = function () {
				UI.loading = false;
				UI.editorActionFileLoad.value = "";
				UI.editSession.setValue(reader.result);
			};

			reader.readAsText(file);
		} catch (ex: any) {
			showError();
		}
	}

	private static prepareSW(): void {
		if ("serviceWorker" in navigator) {
			window.addEventListener("beforeinstallprompt", function (e) {
				if ("preventDefault" in e)
					e.preventDefault();

				UI.installationPrompt = e;

				(document.getElementById("editorActionInstallSeparator") as HTMLElement).style.display = "";
				(document.getElementById("editorActionInstallItem") as HTMLElement).style.display = "";
			});

			navigator.serviceWorker.register("/labs-predicate/sw.js");
		}
	}

	public static init() {
		if (!("localStorage" in window) || !BlobDownloader.supported)
			BlobDownloader.alertNotSupported();

		UI.prepareSW();

		UI.theme = localStorage.getItem("theme") || "ace/theme/labs";
		UI.fixDarkTheme();

		UI.editor.setOptions({
			selectionStyle: "text",
			highlightActiveLine: true,
			highlightSelectedWord: true,
			readOnly: false,
			cursorStyle: "ace",
			mergeUndoDeltas: true,
			behavioursEnabled: false,
			wrapBehavioursEnabled: false,
			autoScrollEditorIntoView: false,
			copyWithEmptySelection: false,
			useSoftTabs: false,
			navigateWithinSoftTabs: false,
			enableMultiselect: true,
			hScrollBarAlwaysVisible: false,
			vScrollBarAlwaysVisible: false,
			highlightGutterLine: true,
			animatedScroll: false,
			showInvisibles: false,
			showPrintMargin: false,
			fadeFoldWidgets: false,
			showFoldWidgets: true,
			showLineNumbers: true,
			showGutter: true,
			displayIndentGuides: false,
			scrollPastEnd: false,
			fixedWidthGutter: true,
			theme: UI.theme,
			enableLiveAutocompletion: false,
			keyboardHandler: "ace/keyboard/labs"
		});

		$("#modalSave").on("shown.bs.modal", UI.modalSaveShown);

		$("#modalTheme").on("shown.bs.modal", UI.modalThemeShown);

		UI.modalSaveFileName.onkeydown = UI.modalSaveFileNameKeyDown;

		UI.editorActionFileLoad.onchange = UI.editorActionFileLoadChange;

		setTimeout(function () {
			document.body.style.visibility = "";

			UI.editSession = UI.createSession(localStorage.getItem("code") || "");
			UI.stepSession = UI.createSession("");

			if (localStorage.getItem("wrapMode"))
				UI.toggleWrapMode(false);

			UI.editor.setSession(UI.editSession);

			UI.editor.focus();

			UI.editor.resize();
		}, 250);
	}

	public static step(): void {
		if (UI.steppingFinished || UI.loading)
			return;

		if (!UI.stepping) {
			const code = UI.editSession.getValue();

			localStorage.setItem("code", code);

			let error: string | null = null;

			try {
				UI.axiomContext = Parser.parse(code);
			} catch (ex: any) {
				error = (("formatMessage" in ex) ? ex.formatMessage() : (ex.message || ex.toString()));
			}

			UI.stepSession.setValue(code + "\n####################" + (error ? ("\n\n# " + Strings.Oops + "\n# " + error) : ""));
			UI.stepSession.getUndoManager().reset();

			UI.btnStop.style.display = "";
			UI.editor.setReadOnly(true);
			UI.stepping = true;
			UI.steppingFinished = !!error;
			UI.editor.setSession(UI.stepSession);

			if (error)
				return;
		}

		try {
			const deduction = UI.axiomContext.step();

			if (deduction) {
				let code = UI.stepSession.getValue();

				if (deduction.error) {
					code += "\n\n# " + Strings.Oops + "\n# " + deduction.text;
					UI.steppingFinished = true;
				} else {
					code += "\n\n" + deduction.text + " # " + deduction.explanation;
				}

				UI.stepSession.setValue(code);
			} else {
				UI.steppingFinished = true;
			}

			if (UI.steppingFinished && (!deduction || !deduction.error))
				UI.stepSession.setValue(UI.stepSession.getValue() + "\n\n# " + Strings.ICouldNotDeductAnythingElse);
		} catch (ex: any) {
			const error = (("formatMessage" in ex) ? ex.formatMessage() : (ex.message || ex.toString()));
			UI.steppingFinished = true;
			UI.stepSession.setValue(UI.stepSession.getValue() + "\n\n# " + Strings.Oops + "\n# " + error);
		}
	}

	public static stop(): void {
		if (!UI.stepping || UI.loading)
			return;

		UI.btnStop.style.display = "none";
		UI.editor.setReadOnly(false);
		UI.stepping = false;
		UI.steppingFinished = false;
		UI.editor.setSession(UI.editSession);
	}

	public static clear(): void {
		if (UI.loading)
			return;

		UI.stop();

		UI.editSession.setValue("");
	}

	public static load(): void {
		if (UI.loading)
			return;

		UI.editorActionFileLoad.click();
	}

	public static showModalSave(): void {
		if (UI.loading)
			return;

		UI.stop();

		($("#modalSave") as any).modal({
			keyboard: true,
			backdrop: true
		});
	}

	public static save(): void {
		if (UI.loading)
			return;

		let filename = UI.modalSaveFileName.value.trim();
		if (!filename)
			return;

		const code = UI.editSession.getValue() || "\n";

		if (!filename.toLowerCase().endsWith(".txt"))
			filename += ".txt";

		BlobDownloader.download(filename, new Blob([
				new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
				code,
			],
			{ type: "text/plain;charset=utf-8" }
		));

		($("#modalSave") as any).modal("hide");
	}

	public static loadExample(): void {
		if (UI.loading)
			return;
	}

	public static install(): void {
		(document.getElementById("editorActionInstallSeparator") as HTMLElement).style.display = "none";
		(document.getElementById("editorActionInstallItem") as HTMLElement).style.display = "none";

		if (UI.installationPrompt) {
			try {
				UI.installationPrompt.prompt();
			} catch (ex: any) {
				// Just ignore...
			}
			UI.installationPrompt = null;
		}
	}

	public static toggleWrapMode(fromUser: boolean): void {
		UI.wrapMode = !UI.wrapMode;

		if (fromUser) {
			if (UI.wrapMode)
				localStorage.setItem("wrapMode", "1");
			else
				localStorage.removeItem("wrapMode");
		}

		UI.editorActionToggleWrapModeIcon.className = (UI.wrapMode ? "fa fa-margin fa-check-square-o" : "fa fa-margin fa-square-o");

		UI.editSession.setUseWrapMode(UI.wrapMode);
		UI.stepSession.setUseWrapMode(UI.wrapMode);
	}

	public static showModalTheme(): void {
		UI.modalThemeSelect.value = UI.theme;

		($("#modalTheme") as any).modal({
			keyboard: true,
			backdrop: true
		});
	}

	public static setTheme(): void {
		UI.theme = UI.modalThemeSelect.value;

		localStorage.setItem("theme", UI.theme);

		UI.editor.setTheme(UI.theme);

		UI.fixDarkTheme();

		($("#modalTheme") as any).modal("hide");
	}
}

UI.init();
