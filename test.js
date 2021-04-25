const app = require("./index")
async function demo(){
    return  {
        name:"dalong"
    }
}
let info = app.schemaVersion({
    username:"dalong"
},demo)

console.log(info)