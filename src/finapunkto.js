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

////////// FINAPUNKTO //////////////////
/** An end-point for connecting to a Server */
class EndPoint{
    /**
     * Creates a web server end-point
     * @param url End-point's URL 
     * @param method Optional 'GET' or 'POST' method to use. If not provided, the end-point will use 'POST'.
     */
    constructor(url, method='POST'){
        this.url = url
        this.method = method 
    }

    /**
     * Function that will be called when receiving the response of the server (must process the full XMLHttpRequest).
     * @param xhttp Object with the response and request.
     */
    callback( xhttp ){}

    /**
     * Parses the response from the server
     * @param xhttp Response of the server
     * @return Object version of the response
     */
    parse(xhttp){ return xhttp }

    /**
     * Stringifies an object
     * @param obj Object to stringify
     * @return A stringify version of the object
     */
    stringify(obj){ return obj }

    /**
     * Runs a command of the web server
     * @param arg Main argument for connecting with the end-point
     * If not provided, the end-point will use the header provided in the constructor method
     * @param callback Function that will be called when receiving the response of the server (must process the full XMLHttpRequest).
     * If not provided, the end-point will use the callback provided its defined callback function
     */
    request( arg, callback ){
        this.callback = callback || this.callback
        var x = this
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function (){
            if (xhttp.readyState==4 && xhttp.status == 200) x.callback( x.parse(xhttp) )
            
        }
        
        xhttp.open(this.method, this.url, true)
        xhttp.send(this.stringify(arg))
    }
}

/** End point based on sending/receiving JXON objects. 
  */
class JXONEndPoint extends EndPoint{
    /**
     * Creates a web server end-point
     * @param url End-point's URL
     * @param jxon <i>true</i> If the server uses JXON objects, <i>false</i> if uses JSON objects. 
     * @param method Optional 'GET' or 'POST' method to use. If not provided, the end-point will use 'POST'.
     */
    constructor( url, jxon=false, method='POST' ){ 
        super(url, method) 
        if(jxon){
            this.parse = function(xhttp){
                var resp = xhttp.response==""?"{}":xhttp.response
                return JXON.parse(resp)
            }            
            this.stringify = function(obj){ return JXON.stringify(obj) }
        }else{
             this.parse = function(xhttp){
                var resp = xhttp.response==""?"{}":xhttp.response
                return JSON.parse(resp)
            }            
            this.stringify = function(obj){ return JSON.stringify(obj) }
        }
    }
}
   

/** End point for running a Process of the server using JSON/JXON objects. 
  */
class ProcessRunner extends JXONEndPoint{
    /**
     * Creates a Process runner end-point
     * @param url End-point's URL 
     * @param jxon <i>true</i> If the server uses JXON objects, <i>false</i> if uses JSON objects. 
     * @param component Process identification in the server
     * @param args Process arguments 
     */
    constructor(url, component, args, jxon=false){
        super(url,jxon)
        this.component = component
        this.args = args
        this.timer = 10
    }
    
    /**
     * Function that will be called when receiving the response of the server (must process the full XMLHttpRequest).
     * @param xhttp Object with the response and request.
     */
	callback(response){
		var x = this
		if(response.args[0]!=null){
			if(response.args[0].length > 0 ){
				x.timer = 10
				x.out( response.args[0] )
				x.request({"component":x.component,"method":"pull","args":[""]})  
			}else{
				setTimeout( function(){ x.request({"component":x.component,"method":"pull","args":[""]}) }, x.timer )
				if( x.timer<100 ) x.timer += 10
			}                  
		}else{
			x.running = false
			x.out()
		}
	}
     
    /**
     * Runs the process
     * @param out Calling back function when the server responses to starting/ending/pulling request
     */    
    run( out ){
        var x = this
        x.out = out
        this.running = true
        this.request({"component":x.component,"method":"start","args":x.args})
    }
     
    /**
     * Ends the process in the server
     */   
    end(){
        this.request({"component":this.component,"method":"end","args":[""]})
        this.running = false
    }
     
    /**
     * Sends input to the process in the server
     * @param cmd Input to be sent to the process in the server
     */   
    input( cmd ){
        var x = this
        x.timer = 10
        this.request({"component":this.component,"method":"pull","args":[cmd]})  
    }
}
