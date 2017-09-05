
var enableLogs = true;
var cacheName = 'offline';
var version = '0.7';
var cache = cacheName + '-' + version;
var fileList = [
    'index.html',
    'sw-loader.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(caches
                        .open(cache)
                        .then(function(cache) {
                            if (enableLogs) console.log('[ServiceWorker] Caching files');
                            cache.addAll(fileList);
                        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request)
                        .then(function(response) {
                            if (response) {
                                if (enableLogs) console.log('Fulfilling ' + event.request.url + ' from cache.');
                                return response;
                            } else {
                                if (enableLogs) console.log(event.request.url + ' not found in cache, fetching from network.');
                                return fetch(event.request);
                            }
                        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(caches.keys()
                        .then(function(keyList) {
                            Promise.all(keyList.map(function(key) {
                                if (key !== cache) {
                                    if (enableLogs) console.log('[ServiceWorker] Removing old cache ', key);
                                    return caches.delete(key);
                                }
                            }));
                        })
    );
});
