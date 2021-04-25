# cubejs-schemaversion-cache

using cache-manager for cache multi tennant schemaversion


## Usage

```code
yarn add @dalongrong/cubejs-schemaversion-cache

cube.js

// Cube.js configuration options: https://cube.dev/docs/config
const {pause,schemaVersion} = require("@dalongrong/cubejs-schemaversion-cache")

// one demo func 
async function fetchVersion(securityContext){
  await pause(3000)
  console.log("call version")
  return `"dalong"---${parseInt(Math.random()*100)}`
}
module.exports = {
  schemaVersion:  ({ securityContext }) =>{
    return schemaVersion(securityContext,fetchVersion)
  },
  contextToAppId: ({ securityContext }) => {
   return  `CUBEJS_APP_${securityContext.user_id}`
  }
};
```