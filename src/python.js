/**
*
* python.js
* <P>A python ide usin a python interpreter on a server (editor/terminal/play button) interface.</P>
* <P> Requires <A HREF="https://jgomezpe.github.io/konekti/src/konekti.js">https://jgomezpe.github.io/konekti/src/konekti.js</P> 
*
* Copyright (c) 2021 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/aplikigo">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Professor Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

Konekti.resource.JS('https://jgomezpe.github.io/konekti/src/finapunkto.js')

/** Konekti Plugin for a python ide (running on a server) */
class PythonPlugIn extends PlugIn{
    /** Creates a Plugin for a python ide  */
    constructor(){ super('python') }
    
	/**
	 * Creates a python ide configuration object
	 * @param parent Parent component
	 * @param id Id of the python component
	 * @param url URL of the server with the Python interpreter
	 * @param config Style of the python ide
	 */
	setup(parent, id, url, config){
        var btn=[ {'plugin':'btn', 'setup':[id+"run","fa-play", '', {'client':id, 'method':'run'}]}	]
        var headercfg = config.header || {}
        var title = {'plugin':'header', 'setup':[id+'title',{'type':'img', 'src':'https://jgomezpe.github.io/konekti/img/python.png'}, headercfg.title || 'Python IDE', headercfg.size || 3, headercfg.style || {'class':'w3-green w3-center'}]}
        var navbar = {'plugin':'navbar', 'setup':[id+'navbar', btn, '', config.navbar || {'class':'w3-blue-grey'}]}			
        var acecfg = config.ace || {}
        acecfg.style = (acecfg.style || '') + 'width:100%;height:100%;'
        var tercfg = config.terminal || {}
        tercfg.style = (tercfg.style || '') + 'width:100%;height:100%;'
		var maincfg = config.main || {'style':'width:100%;height:100%;'}
        var control = {
            'plugin':'split', 'setup':[
                id+'editcon', 'col', 50, 
                {'plugin':'ace', 'setup':[id+'editor', '', 'python', acecfg.theme || '', '', acecfg]},
                {'plugin':'terminal', 'setup':[id+'console', '', tercfg]}, {'style':'width:100%;height:fit;'}
            ]
        }
        var c = super.setup(parent, id, [title,navbar,control], maincfg)
        c.url = url
        c.greetings = config.greetings || '>>\n'
        return c
	}

    /**
     * Creates a client for the plugin's instance
     * @param config python interpreter configuration
     */
    client(config){ return new Python(config) }
}

if( Konekti.python===undefined) new PythonPlugIn()

/** A Python IDE client*/
class Python extends Client{
    /**
     * Creates the Python IDE
     * @param config Python IDE configuration
     */
    constructor(config){ 
        super(config) 
        var x = this
        x.running = false
        Konekti.daemon(function(){ return Konekti.client[x.id+'console']!==undefined },
            function(){
                x.terminal = Konekti.client[x.id+'console']
                x.process = new ProcessRunner(x.url, "python", 
                    function(res){
                        var n = res.length
                        for(var i=0; i<n; i++){ 
                            x.terminal.output(res[i].out!==undefined?res[i].out:'')
                            x.terminal.output(res[i].err!==undefined?res[i].err:'')
                        }
                        if(n>0 && res[n-1].out === undefined ) x.end()
                    }, 
                    function(out=''){
                        x.terminal.output(out) 
                        x.end()
                    }
                )
                x.terminal.server = x.process 
            }	
        )
    }

    end(){
        var x = this
        Konekti.client[x.id+'run'].update('fa fa-play', '', '')
        x.running = false
        x.vc('editor').focus()
    }

    run(){
        var x = this
        if(x.running){
            x.process.stop()
            x.end()
        }else{
            Konekti.client[x.id+'run'].update('fa fa-stop', '', '')
            x.terminal.init(x.grettings)
            x.process.run({'name':'main.py', 'code':Konekti.client[x.id+'editor'].getText()})
            x.running = true
            x.vc('console').focus()
        }	
    }
}

/**
 * Creates a python ide object
 * @param parent Parent component
 * @param id Id of the python component
 * @param url URL of the server with the Python interpreter
 * @param config Style of the python ide
 */
Konekti.python = function(parent, id, url, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = {}
	if(args.length==4) args[4] = function(){}
	Konekti.add('python', ...args)
}

/*********************** NODEJS Python ENDPOINT EXAMPLE*********************/
/*
const { execFile } = require('node:child_process')
const fs = require('fs')

//  Insert here the NODEJS example code of finapunkto.js (commented at the end of file) //

function python_args(req) {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    var dir = '/tmp/python/'+ip+'/'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir) 
    var args = req.body.args
    var name = []
    for(var i=0; i<args.length; i++){
      name[i] = dir + args[i].name
      fs.writeFileSync(name[i], args[i].code)
    }
    return [name[0]]
  }
  
  app.post('/python', (req, res) => command('python3', req, res, python_args))
*/