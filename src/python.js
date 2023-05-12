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
     * @param files Python code files
	 * @param config Style of the python ide
	 */
	setup(parent, id, url, files, config){
        var btn=[ {'plugin':'btn', 'setup':[id+"run","fa-play", '', {'client':id, 'method':'run'}]}	]
        var headercfg = config.header || {}
        var title = {'plugin':'header', 'setup':[id+'title',{'type':'img', 'src':'https://jgomezpe.github.io/konekti/img/python.png'}, headercfg.title || 'Python IDE', headercfg.size || 3, headercfg.style || {'class':'w3-green w3-center'}]}
        var navbar = {'plugin':'navbar', 'setup':[id+'navbar', btn, '', config.navbar || {'class':'w3-blue-grey'}]}			
        var acecfg = config.ace || {}
        acecfg.theme = acecfg.theme || ''
        acecfg.style = (acecfg.style || '') + 'width:100%;height:100%;'
        var tabs = []
        for(var i=0; i<files.length; i++){
            tabs[i] = {'plugin':'ace', 'setup':[id+files[i].name, files[i].content, 'python', acecfg.theme, '', {'style':acecfg.style}], 
			'label':["", files[i].name]}
        }
        var tercfg = config.terminal || {}
        tercfg.style = (tercfg.style || '') + 'width:100%;height:fit;'
		var maincfg = config.main || {'style':'width:100%;height:100%;'}
        var control = {
            'plugin':'split', 'setup':[
                id+'editcon', config.layout || 'col', 50, 
                {'plugin':'tab', 'setup':[id+'editor', tabs, 'main.py', {'style':'width:100%;height:100%;'}]},
                {  'plugin':'raw', 'setup':[id+'right', [ navbar,
                    {'plugin':'terminal', 'setup':[id+'console', '', tercfg]} ], {'style':'width:100%;height:100%;'}
                ]}, {'style':'width:100%;height:fit;'}
            ]
        }
        var c = super.setup(parent, id, [title,control], maincfg)
        c.url = url
        c.files = files
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
            x.terminal.init(x.greetings)
            var args = []
            for(var i=0; i<x.files.length; i++) args[i] = {'name':x.files[i].name, 'code':Konekti.client[x.id+x.files[i].name].getText()}
            x.process.run(...args)
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
 * @param files Python code files
 * @param config Style of the python ide
 */
Konekti.python = function(id, url, files={'name':'main.py', 'content':''}, config={}, callback=function(){}){ 
	Konekti.add({'plugin':'python', 'setup':['body', id, url, files, config]}, callback)
}

/*********************** NODEJS Python ENDPOINT EXAMPLE*********************/
/*
const { execFile } = require('node:child_process')
const fs = require('fs')

//  Insert here the NODEJS example code of finapunkto.js (commented at the end of file) //

function python_args(req) {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    var dir = '/tmp/python/'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir) 
    dir += ip+'/'
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