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

class BlobDownloader {
	private static blobURL: string | null = null;

	private static readonly saveAs = ((window as any).saveAs || (window as any).webkitSaveAs || (window as any).mozSaveAs || (window as any).msSaveAs || (window as any).navigator.saveBlob || (window as any).navigator.webkitSaveBlob || (window as any).navigator.mozSaveBlob || (window as any).navigator.msSaveBlob);

	public static readonly supported = (("Blob" in window) && ("URL" in window) && ("createObjectURL" in window.URL) && ("revokeObjectURL" in window.URL));

	public static alertNotSupported(): boolean {
		alert(Strings.BrowserNotSupported);
		return false;
	}

	public static download(filename: string, blob: Blob): boolean {
		if (!BlobDownloader.supported)
			return false;

		if (BlobDownloader.blobURL) {
			URL.revokeObjectURL(BlobDownloader.blobURL);
			BlobDownloader.blobURL = null;
		}

		if (BlobDownloader.saveAs) {
			try {
				BlobDownloader.saveAs.call(window.navigator, blob, filename);
				return true;
			} catch (ex: any) {
				// Just ignore...
			}
		}

		const a = document.createElement("a");
		BlobDownloader.blobURL = URL.createObjectURL(blob);
		a.href = BlobDownloader.blobURL;
		a.download = filename;

		if (document.createEvent && (window.MouseEvent || (window as any).MouseEvents)) {
			try {
				const evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(evt);
				return true;
			} catch (ex: any) {
				// Just ignore...
			}
		}

		a.click(); // Works on Chrome but not on Firefox...
		return true;
	}
};
