const cacheManager = require('cache-manager');
const crypto = require('crypto');
const redisStore = require('cache-manager-ioredis'); 
const AsyncUtil = require('async-utility').default;
const redisCache = cacheManager.caching({
  store: redisStore,
  host: process.env.REDIS_HOST || "localhost", // default value
  port: process.env.REDIS_PORT? parseInt(process.env.REDIS_PORT):6379, // default value
  db: process.env.REDIS_DB? parseInt(process.env.REDIS_DB):0,
  password: process.env.REDIS_PASS || null,
  ttl: process.env.REDIS_TTL? parseInt(process.env.REDIS_TTL):30
});
/**
 * pasuse helper func
 * @param {pause ms} ms 
 * @returns promise
 */
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncFetchVersion(securityContext,func){
 let cachekey = `SCHEMAVERSION_${crypto.createHash('md5').update(JSON.stringify(securityContext)).digest('hex')}`
 return redisCache.wrap(cachekey, function() {
    return func(securityContext);
  })
} 
module.exports = {
    schemaVersion:  (securityContext,func)=> {
      // use async-utility convert async to sync
      return  AsyncUtil.resolvePromise(asyncFetchVersion(securityContext,func));
    },
    pause:pause
}