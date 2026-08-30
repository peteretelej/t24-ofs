var cachePrefix="ofs-"
var cacheName=cachePrefix+"__CACHE_REVISION__"

self.addEventListener("install", function(event){
	event.waitUntil(
		caches.open(cacheName).then(function(cache){
			return cache.addAll([
				"./",
				"./favicon.ico",
				"./manifest.json",
				"./css/foundation.min.css",
				"./js/vue.min.js",
				"./js/clipboard.min.js",
				"./js/main.js"
			])
		})
	)
})
self.addEventListener("activate", function(event){
	event.waitUntil(
		caches.keys().then(function(keys){
			return Promise.all(keys.filter(function(key){
				return key.indexOf(cachePrefix)===0 && key!==cacheName
			}).map(function(key){
				return caches.delete(key)
			}))
		})
	)
})

self.addEventListener("fetch", function(event){
	event.respondWith(
		caches.open(cacheName).then(function(cache){
			return cache.match(event.request).then(function(response){
				return response ||fetch(event.request)
			})
		})
	)
})
