const {schemaVersion,scheduledRefreshContexts,pause} = require("./index")

async function demo(){
    console.log("demeapp")
    return "demoapp"
};

async function fetchscheduleContexts(){
    await pause(3000)
    return  [
     {
        authInfo: {
          myappid: 'demoappid',
          bucket: 'demo',
        },
      },
      {
        authInfo: {
          myappid: 'demoappid2',
          bucket: 'demo2',
        }
      }
    ]
  }

(async ()=>{
    let info = await schemaVersion({
        username:"dalong"
    },demo)
    console.log(info)
})();



(async ()=>{
    let info = await scheduledRefreshContexts(fetchscheduleContexts)
    console.log(info)
})();
