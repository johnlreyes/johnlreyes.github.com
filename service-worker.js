
var enableLogs = true;
var cacheName = 'offline';
var version = '0905171148PM';
var cache = cacheName + '-' + version;
var fileList = [
    'index.html',
    'sw-loader.js',
    'service-worker.js',
    'img/profile.jpg',
    'css/bootstrap.min.css',
    'css/main.css',
    'js/jquery.min.js',
    'js/bootstrap.min.js',
    'js/docs.min.js',
    'js/main.js',
    'js/ie10-viewport-bug-workaround.js',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
];

self.addEventListener('install', function(event) {
    event.waitUntil(caches
                        .open(cache)
                        .then(function(cache) {
                            if (enableLogs) console.log('[ServiceWorker] Caching files ' + fileList);
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
