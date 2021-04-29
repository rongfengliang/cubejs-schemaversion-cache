require('dotenv').config()
const cacheManager = require('cache-manager');
const crypto = require('crypto');
const redisStore = require('cache-manager-ioredis');
const redisCache = cacheManager.caching({
  store: redisStore,
  host: process.env.REDIS_HOST ||  'localhost', // default value
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379, // default value
  db:  process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 0,
  password: process.env.REDIS_PASS || null,
  ttl: process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL) : 300
});
/**
 * pasuse helper func
 * @param {pause ms} ms 
 * @returns promise
 */
function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  schemaVersion: async (securityContext, func) => {
    let cachekey = `SCHEMAVERSION_${crypto.createHash('md5').update(JSON.stringify(securityContext)).digest('hex')}`
    return redisCache.wrap(cachekey, function () {
      return func(securityContext);
    });
  },
  validateKey: async (jwt, func) => {
    // cache key with jwt md5 
    let cachekey = `JWTKEY_${crypto.createHash('md5').update(JSON.stringify(jwt)).digest('hex')}`
    return redisCache.wrap(cachekey, function () {
      return func(jwt);
    });
  },
  scheduledRefreshContexts: async (func) => {
    let cachekey = `SCHEDULEDREFRESHCONTEXTS_ITEMS`
    return redisCache.wrap(cachekey, function () {
      return func();
    });
  },
  pause: pause
}