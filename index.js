const cacheManager = require('cache-manager');
const crypto = require('crypto');
const redisStore = require('cache-manager-ioredis');
const env = require('env-var');

const redisCache = cacheManager.caching({
  store: redisStore,
  host: env.get('REDIS_HOST') || 'localhost', // default value
  port: env.get('REDIS_PORT') ? parseInt(env.get('REDIS_PORT')) : 6379, // default value
  db: env.get('REDIS_DB') ? parseInt(env.get('REDIS_DB')) : 0,
  password: env.get('REDIS_PASS') || null,
  ttl: env.get('REDIS_TTL') ? parseInt(env.get('REDIS_TTL') ) : 300
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
    return  redisCache.wrap(cachekey, function () {
      return func(securityContext);
    });
  },
  validateKey: async (jwt,func) => {
    // cache key with jwt md5 
    let cachekey = `JWTKEY_${crypto.createHash('md5').update(JSON.stringify(jwt)).digest('hex')}`
    return  redisCache.wrap(cachekey, function () {
      return func(jwt);
    });
  }, 
  scheduledRefreshContexts: async (func) => {
    let cachekey = `SCHEDULEDREFRESHCONTEXTS_ITEMS`
    return  redisCache.wrap(cachekey, function () {
      return func();
    });
  },
  pause: pause
}