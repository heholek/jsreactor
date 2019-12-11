let runcode = require('safe-eval')

module.exports = function(opts){
    var bre          = opts.bre
    this.title       = "Javascript"
    this.description = "javascript snippet"  
    this.init = async () => {
        
        var runJS = (input,cfg,results) => new Promise( async (resolve,reject) => {
            
            var code = `new Promise( async (resolve,reject) => {
                try{
                    ${cfg.config.js}
                    resolve(input)
                }catch(e){ reject(e) }
            })`

            var scope = Object.assign(opts,{
                input,
                cfg,
                results,
                console:{
                    error:console.error,
                    log: (str) => bre.log(str,"┋ "), 
                },
                setTimeout
            })
            try {
                var r = await runcode(code,scope)
                for( var i in r ) input[i] = r[i] // update input
            } catch (e) {
                input.output.error = e.stack
                console.log(e.stack)
                console.error(e.stack)
            }
            resolve(input) // never reject since errors are handled above
        })               
        
        this.trigger = { schema: []}
        
        this.action  = {
            schema: [
                {
                    type:"object",
                    title:" ",
                    properties:{
                        type: bre.addType('javascript', runJS ),
                        config:{
                            type:"object",
                            title:"edit code",
                            options:{disable_collapse:false,collapsed:true},
                            properties:{
                                js:{ 
                                    type:"string", 
                                    title:"javascript",
                                    description:"async (input,cfg,results) => { input.output = {a:1} }", 
                                    default:"//input.users = await somePromise()\n//console.error('boo')\n//console.log('hello world')\ninput.output = {a:1}\n",
                                    format: "javascript",
                                    "options": {
                                        "ace": {
                                            "theme": "ace/theme/monokai",
                                            "tabSize": 2,
                                            "useSoftTabs": true,
                                            "wrap": true,
                                            maxLines:20,
                                            minLines:20,
                                            fontSize:'14px'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }            
            ]            
        }
    }

    opts.bre.addChannel(this)
  
    return this
}

