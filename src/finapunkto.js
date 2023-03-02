/**
*
* finapunkto.js
* <P>End point processing.</P>
* <P> Requires base64.js, kompari.js, lifya.js, and JXON.js (jxon_wrap.js) if it uses JXONEndPoint or ProcessRunner with JXON objects. </P>
* <P>A numtseng module <A HREF="https://numtseng.com/modules/finapunkto.js">https://numtseng.com/modules/finapunkto.js</P> 
*
* Copyright (c) 2021 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/aplikigo">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Professor Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

Konekti.resource.JS('https://code.jquery.com/jquery-3.5.1.js')

////////// FINAPUNKTO //////////////////
/** An end-point for connecting to a Server */
class EndPoint{
	/** 
     * Creates a server connection (endpoint) to the given url
     * @param url URL of the server's endpoint
     */ 
    constructor( url ){
        this.url = url
        this.token = null
    }

	// Determines if the client is connected to the server
    connected(){ return this.token!=null }

	/**
     * Makes a request to the server (uses JSON objects to transmit information)
     * @param req Request information: It must be a JSON object that must not include attribute token (used by connection/session track).
     * @param endpoint url of the service to connect
     * @param method Indicates type of connection : 'post', 'get'
     * @param onsuccess Function called when success response from the server is received (request was accepted)
     * @param onerror Function called when error response from the server is received (request was not accepted)
     * 
     */
    request( endpoint, req, method='post', onsuccess=function(){}, onerror=function(){} ){
        var x = this
        var token = x.token!=null?x.token:''
        req.token=token        
        var req = { 
            'success' : onsuccess, 
            'error' : onerror,
            'url' : x.url + endpoint,
            'method' : method,
            'data' : JSON.stringify(req),
            'dataType' : 'json',
            'contentType' : "application/json"
        }
        $.ajax(req) 
    }
}

/** End point for running a Process of the server using JSON objects. 
  */
class ProcessRunner extends EndPoint{
    /**
     * Creates a Process runner end-point
     * @param url End-point's URL 
     * @param component Process identification in the server
     * @param out Function called when the process produces some output
     * @param end Function called when the process ends
     */
    constructor(url, component, out, end){
        super(url)
        this.component = component
        this.out = out
        this.end = end
        this.MIN_PULL_TIME = 10
        this.timer = this.MIN_PULL_TIME
        this.running = false
    }
    
	/**
     * Makes a request to the server (uses JSON objects to transmit information)
     * @param action Action to run in the server ('start', 'pull', 'end') 
     */
    request( action='pull', args = [] ){
        var x = this
        var c = {'action':action, 'args':args}
        super.request(x.component, c, 'post', function(res){
            if( res.out !== undefined ){
                x.out(res.out)
                x.timer = x.MIN_PULL_TIME
            }else x.timer += x.MIN_PULL_TIME
            x.running = x.running && res.running
            if(x.running) setTimeout( function(){ x.request() }, x.timer )    
            else x.timer = x.MIN_PULL_TIME 
        }, function(res){
            x.timer = x.MIN_PULL_TIME
            x.stop(res)
        })
    }
     
    /**
     * Runs the process
     */    
    run(){
        this.timer = this.MIN_PULL_TIME
        this.running = true
        var args = []
        for( var i=0; i<arguments.length; i++) args[i] = arguments[i]
        this.request("start",args)
    }
     
    /**
     * Ends the process in the server
     */   
    stop(){
        this.timer = this.MIN_PULL_TIME
        this.running = false
        this.request("end") 
    }
     
    /**
     * Sends input to the process in the server
     * @param cmd Input to be sent to the process in the server
     */   
    input( cmd ){
        this.timer = this.MIN_PULL_TIME
        this.request("pull",[cmd])  
    }
}

/************************ NODEJS ProcessRunner ENDPOINT EXAMPLE**********************/
/*
#!/usr/bin/env node

// It uses express

const express = require('express')

const app = express()
const port = 8080

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

var session = {} // Simple session managment

function CORS(req, res){
  const allowedOrigins = ['https://www.your.server.id', 'https://your.server.id'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)){
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,OPTIONS')
  }  
}

async function command(cmd, req, res, onargs=function(req){ return req.args }) {
    CORS(req, res)
    console.log('Hello from '+ cmd +' endpoint...')
    if(session[c]===undefined) session[c] = {}
    var s = session[c]
    s[cmd] = s[cmd] || {'out':[]}
    var out = s[cmd].out
    var c = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    var action = req.body.action
    var args = req.body.args
    var process
    switch(action){
      case 'start':
        if(s[cmd].process !== undefined && s[cmd].process !== null) s[cmd].process.exit(0)
        s[cmd].process = execFile(cmd, onargs(req));
        process = s[cmd].process
        process.stdout.on("data", (data) => {
          console.log(`stdout:\n${data}`)
          out.push({'out':data})
        });
        process.stderr.on("data", (data) => {
          console.log(`stdout: ${data}`)
          out.push({'err':data})
        });
        process.on("exit", (code) => {
          console.log(`Process ended with ${code}`)
          out.push({'end':code})
          s[cmd].process = null
        });
        res.send({'running':true, "out":[]})
      break;  
      case 'pull':
        process = s[cmd].process
        if(args.length>0) process.stdin.write(args[0]);
        var n = out.length
        var running = !(n>0 && out[n-1].end !== undefined)
        var cout = []
        for(var i=0; i<n; i++) cout[i] = out[i]
        out.splice(0,n)
        res.send({'running':running, "out":cout})
      break;
      case 'end':
        res.send({'running':false, "out":out})
        if(s[cmd].process !== undefined && s[cmd].process !== null) s[cmd].process.exit(0)
      break;
    }
  }

app.post('/your_endpoint', (req, res) => command('your_command', req, res, your_process_args_function))
*/  