
var enableLogs = true;
var cacheName = 'offline';
var version = '0.2';
var cache = cacheName + '-' + version;
var fileList = [
    'index.html'
];

self.addEventListener('install', function(event) {
    if (enableLogs) console.log('[install]');
    event.waitUntil(caches
                        .open(cache)
                        .then(function(cache) {
                            if (enableLogs) console.log('[ServiceWorker] Caching files ' + fileList);
                            cache.addAll(fileList);
                        })
    );
});

self.addEventListener('fetch', function(event) {
    if (enableLogs) console.log('[fetch]');
    if (enableLogs) console.log('[fetch] event.request=', event.request);
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
    if (enableLogs) console.log('[activate]');
    event.waitUntil(caches.keys()
                        .then(function(keyList) {
                            if (enableLogs) console.log('keyList='+keyList);
                            Promise.all(keyList.map(function(key) {
                                if (key !== cache) {
                                    if (enableLogs) console.log('[ServiceWorker] Removing old cache ', key);
                                    return caches.delete(key);
                                }
                            }));
                        })
    );
});
