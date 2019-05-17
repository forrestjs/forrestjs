# Memcached

`react-ssr` offers a basic in-memory caching mechanism that you can heavily
customize to suit your need.

As an example, you can store the cache in a Redis instance and share it across
**multiple stateless service instances**, or you can fine tune the cache key in
order to **support authenticated sessions**.

The cache system can be configured by passing the following properties to 
the `createSSRRouter()` method.

### useCache

    value:     (string) [yes|no]
    default:   'yes'
    env:       REACT_SSR_USE_CACHE

Enable the basic in-memory cache layer.

### shouldCache(req, res)

    value:     (function) can be async
    default:   null

Example:  
skip caching for routes that contains "/foo"

    ...
    shouldCache: (req, res) => req.url.indexOf('/foo') === -1
    ...

### getCacheKey(req, res)

Synchronous function that should return a unique cache key.

By default `req.url` is being used. If you hook into this function you can use
some other request properties to make the key unique to a specific session.

NOTE: a cache key is an object with a `value` property!

    getCacheKey: (req) => ({
        value: [
            req.url,
            req.locale.language,
            req.locale.region,
        ],
    })

### getCacheExpiry(req, res)

Synchronous function that should return a timestamp after which the cache entry
is not valid anymore.

### onCacheWrites(req, res, html)

Synchronous function that can transform the HTML before it gets stored in the cache.  
It should return the transformed HTML as a string.

### onCacheRead(req, res, cache)

Synchronous function that receives a valid cache entry and should return the HTML
to send back to the client.

    cache = {
        cnt,    // cache content as string
        exp,    // expiry date as timestamp
        ctm,    // creation timestamp
    }

### serializer

A serializer is an object that implements the following asynchronous methods:

    serializer = {
        set: async (key, cacheObject) => {},
        get: async (key) => {},
        remove: async([key1, key2, ...]) => {},
    }

You may want to provide a serializer if you need to move the cache layer outside the main
process memory and target a database or a redis instance.

    cacheObject = {
        cnt,    // cache content as string
        exp,    // expiry date as timestamp
        ctm,    // creation timestamp
    }


