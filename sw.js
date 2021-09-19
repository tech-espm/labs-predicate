"use strict";

// Change this value to force the browser to install the
// service worker again, and recreate the cache (this technique
// works because the browser reinstalls the service worker
// whenever it detects a change in the source code of the
// service worker).
const CACHE_PREFIX = "labs-predicate-static-cache-";
const CACHE_VERSION = "20210918";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

self.addEventListener("install", (event) => {
	// skipWaiting() will force the browser to start using
	// this version of the service worker as soon as its
	// installation finishes.
	// It does not really matter when we call skipWaiting(),
	// as long as we perform all other operations inside
	// event.waitUntil(). Calling event.waitUntil() forces
	// the installation process to be marked as finished
	// only when all promises passed to waitUntil() finish.

	self.skipWaiting();

	event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
		// According to the spec, the service worker file
		// is handled differently by the browser and needs
		// not to be added to the cache. I tested it and I
		// confirm the service worker works offline even when
		// not present in the cache (despite the error message
		// displayed by the browser when trying to fetch it).
		//
		// Also, there is no need to worry about max-age and
		// other cache-control headers/settings, because the
		// CacheStorage API ignores them.
		//
		// Nevertheless, even though CacheStorage API ignores
		// them, tests showed that a in few occasions, when
		// the browser was fetching these files, the file
		// being added to the cache actually came from the
		// browser's own cache... Therefore, I switched from
		// cache.addAll() to this.
		const files = [
			"/labs-predicate/",
			"/labs-predicate/assets/favicons/favicon.ico",
			"/labs-predicate/assets/favicons/favicon.png",
			"/labs-predicate/assets/favicons/manifest.webmanifest",
			"/labs-predicate/assets/favicons/favicon-512x512.png",
			"/labs-predicate/assets/images/loading-grey-t.gif",
			"/labs-predicate/assets/images/logo-github-w.png?1",
			"/labs-predicate/assets/images/logo-github.png?1",
			"/labs-predicate/assets/images/logo.png?1",
			"/labs-predicate/assets/lib/ace-1.4.7/ace.js",
			"/labs-predicate/assets/lib/ace-1.4.7/ext-keybinding_menu.js",
			"/labs-predicate/assets/lib/ace-1.4.7/ext-language_tools.js",
			"/labs-predicate/assets/lib/ace-1.4.7/ext-options.js",
			"/labs-predicate/assets/lib/ace-1.4.7/ext-prompt.js",
			"/labs-predicate/assets/lib/ace-1.4.7/ext-searchbox.js",
			"/labs-predicate/assets/lib/ace-1.4.7/keybinding-labs.js",
			"/labs-predicate/assets/lib/ace-1.4.7/mode-plain_text.js",
			"/labs-predicate/assets/lib/ace-1.4.7/mode-predicate.js",
			"/labs-predicate/assets/lib/ace-1.4.7/mode-text.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-chrome.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-dracula.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-eclipse.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-labs.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-monokai.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-mono_industrial.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-sqlserver.js",
			"/labs-predicate/assets/lib/ace-1.4.7/theme-textmate.js",
			"/labs-predicate/assets/lib/bootstrap/css/bootstrap-1.0.31.min.css",
			"/labs-predicate/assets/lib/bootstrap/js/bootstrap-1.0.1.min.js",
			"/labs-predicate/assets/lib/font-awesome/css/font-awesome-1.0.2.min.css",
			"/labs-predicate/assets/lib/font-awesome/fonts/fontawesome-webfont.eot?v=4.7.0",
			"/labs-predicate/assets/lib/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0",
			"/labs-predicate/assets/lib/font-awesome/fonts/fontawesome-webfont.svg?v=4.7.0",
			"/labs-predicate/assets/lib/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0",
			"/labs-predicate/assets/lib/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0",
			"/labs-predicate/assets/lib/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0",
			"/labs-predicate/assets/lib/jquery/jquery-1.0.1.min.js",
			// Since these files' contents always change, but their names do not, I
			// added a version number in order to try to avoid browsers' own cache
			"/labs-predicate/assets/css/style.css?v=1.0.10",
			"/labs-predicate/assets/css/style-dark.css?v=1.0.2",
			"/labs-predicate/assets/js/scripts.min.js?v=" + CACHE_VERSION,
			"https://fonts.googleapis.com/css?family=Open+Sans:400,600|Roboto+Mono:400,700"
		];
		const promises = new Array(files.length);
		for (let i = files.length - 1; i >= 0; i--)
			promises[i] = cache.add(new Request(files[i], { cache: "no-store" }));
		return Promise.all(promises);
	}));
});

self.addEventListener("activate", (event) => {
	// claim() is used to ask the browser to use this instance
	// of the service worker with all possible clients, including
	// any pages that might have been opened before this service
	// worker was downloaded/activated.

	self.clients.claim();

	event.waitUntil(
		// List all cache storages in our domain.
		caches.keys().then(function (keyList) {
			// Create one Promise for deleting each cache storage that is not
			// our current cache storage, taking care not to delete other
			// cache storages from the domain by checking the key prefix (we
			// are not using map() to avoid inserting undefined into the array).
			const oldCachesPromises = [];

			for (let i = keyList.length - 1; i >= 0; i--) {
				const key = keyList[i];
				if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
					oldCachesPromises.push(caches.delete(key));
			}

			return Promise.all(oldCachesPromises);
		})
	);
});

function cacheMatch(url, cache) {
	return cache ? cache.match(url, { ignoreVary: true }) : caches.open(CACHE_NAME).then((cache) => {
		return cacheMatch(url, cache);
	});
}

self.addEventListener("fetch", (event) => {
	const url = event.request.url;

	// Try to always use a fresh copy of the main pages
	if (url.endsWith("/labs-predicate/")
		// Debug only
		|| url.startsWith("http://localhost")
		) {
		event.respondWith(fetch(event.request).then((response) => {
			return response || cacheMatch(url);
		}, () => {
			return cacheMatch(url);
		}));
		return;
	}

	// This will speed up the loading time after the first
	// time the user loads the game. The downside of this
	// technique is that we will work with an outdated
	// version of the resource if it has been changed at
	// the server, but has not yet been updated in our
	// local cache (which, right now, will only happen
	// when the service worker is reinstalled).

	event.respondWith(caches.open(CACHE_NAME).then((cache) => {
		return cache.match(event.request, { ignoreVary: true }).then((response) => {
			// Return the resource if it has been found.
			if (response)
				return response;

			// When the resource was not found in the cache,
			// try to fetch it from the network. We are cloning the
			// request because requests are streams, and fetch will
			// consume this stream, rendering event.request unusable
			// (but we will need a usable request later, for cache.put)
			return fetch(event.request.clone()).then((response) => {
				// If this fetch succeeds, store it in the cache for
				// later! (This means we probably forgot to add a file
				// to the cache during the installation phase)

				// We are fetching the request from the cache because
				// we cannot change the headers in a response returned
				// by fetch().
				return ((response && response.status === 200) ? cache.put(event.request, response).then(() => {
					return cacheMatch(url, cache);
				}) : response);
			}, () => {
				// The request was neither in our cache nor was it
				// available from the network (maybe we are offline).
				// Therefore, try to fulfill requests for favicons with
				// the largest favicon we have available in our cache.
				if (url.indexOf("favicon") >= 0)
					return cache.match("/labs-predicate/assets/favicons/favicon-512x512.png", { ignoreVary: true });

				// The resource was not in our cache, was not available
				// from the network and was also not a favicon...
				// Unfortunately, there is nothing else we can do :(
				return null;
			});
		});
	}));

});

// References:
// https://developers.google.com/web/fundamentals/primers/service-workers/?hl=en-us
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle?hl=en-us
// https://developers.google.com/web/fundamentals/codelabs/offline/?hl=en-us
// https://web.dev/service-workers-cache-storage
