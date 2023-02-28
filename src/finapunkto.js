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
        this.timer = 10
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
                x.timer = 10
            }else x.timer += 10
            if(res.done){
                x.timer = 10 
                x.end()
            }else{ setTimeout( function(){ x.request() }, x.timer ) }    
        }, function(res){
            x.timer = 10
            x.end(res)
        })
    }
     
    /**
     * Runs the process
     */    
    run(){
        this.timer = 10
        this.request("start",arguments)
    }
     
    /**
     * Ends the process in the server
     */   
    end(){
        this.timer = 10
        this.request("end") 
    }
     
    /**
     * Sends input to the process in the server
     * @param cmd Input to be sent to the process in the server
     */   
    input( cmd ){
        this.timer = 10
        this.request("pull",[cmd])  
    }
}