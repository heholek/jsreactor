var z = require('zora')
var _ = require('./../../_')
var jre   = require('json-rules-engine')
var b /*BRE engine instance*/
var BRE = require('./../../BRE')
var HelloWorld = require('./../../channel/HelloWorld')
var Javascript = require('./../../channel/Javascript')

z.test('init BRE',  async (t) => {
  b = new BRE() // index.js
  b.engine = new jre.Engine()
  new HelloWorld({bre:b})
  new Javascript({bre:b})
  t.ok(true,"inited")
})

z.test('loadRuleConfigs', async (t) => {
    
  b.loadRuleConfigs = () => {
     return new Promise( (resolve, reject) => resolve([
      {
        "createdAt": "2019-11-10T13:47:45.696Z",
        "updatedAt": "2019-11-10T13:47:59.796Z",
        "name": "test",
        "config": {
          "basic": {
            "name": "test",
            "notes": "test",
            "disabled": false
          },
          "action": [
            {
              "config": {
              "type": "javascript",
              "config": {
                  "js": "console.log('AAAAAAAAAAAAAAAAAAAA');input.n+='A';"
              }
              },
              "channel": "Javascript"
          },
          ],
          "trigger": [
            {
              "config": {
                "type": "helloEquals",
                "value": "123"
              },
              "channel": "HelloWorld"
            }
          ]
        },
        "objectId": "3Kiu8bXNd6"
      }
     ]))
  }
})


z.test('sync execution', async (t) => { 
  var input = {foo:"123",n:''}
  await b.run(input)
  input.n+='B'
  console.log(input.n)
  t.ok(input.n == 'B', "should be sync")
})

z.test('run input through rules engine', async (t) => { 
    var p = []
    var n = 50
    for( var i =0;i < n;i++)
        p.push( b.run({foo:"123",bar:true,n:''}) )
    var x = await Promise.all(p)
    t.ok( x.length == n,n+" done" ) 
    var sleep = new Promise((r,j)=>setTimeout(r,1000))
    await sleep
})
