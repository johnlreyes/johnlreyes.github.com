
var enableLogs = true;
var cacheName = 'offline';
var version = '0905171155PM';
var cache = cacheName + '-' + version;
var fileList = [
    'index.html',
    'sw-loader.js',
    'img/profile.jpg',
    'css/bootstrap.min.css',
    'css/main.css',
    'js/jquery.min.js',
    'js/bootstrap.min.js',
    'js/docs.min.js',
    'js/main.js',
    'js/ie10-viewport-bug-workaround.js',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',
    'https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,200bold,400old',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/fonts/fontawesome-webfont.woff2?v=4.6.3',
    'https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlNV_2ngZ8dMf8fLgjYEouxg.woff2',
    'https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGEo0As1BFRXtCDhS66znb_k.woff2'
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
