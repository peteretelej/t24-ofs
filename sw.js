var cacheName="ofs-v2"

self.addEventListener("install", function(event){
	event.waitUntil(
		caches.open(cacheName).then(function(cache){
			cache.addAll([
				"/",
				"/favicon.ico",
				"/manifest.json",
				"/css/foundation.min.css",
				"/js/vue.min.js",
				"/js/clipboard.min.js",
				"/js/main.js"
			])
		})
	)
})
self.addEventListener("activate", function(event){
	event.waitUntil(
		caches.keys().then(function(keys){
			keys.forEach(function(key){
				if (key!== cacheName){
					caches.delete(key)
				}
			})
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
