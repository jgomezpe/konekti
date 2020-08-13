
class KonektiEndPoint{
	/**
	 * Creates a web server end-point
	 * @param url End-point's URL 
	 * @param header Optional Header information for connecting to the end-point. 
	 * @param method Optional 'GET' or 'POST' method to use. If not provided, the end-point will use 'POST'.
	 */
	constructor( url, header, method ){
		this.url = url
		if( typeof header != 'undefined' ) this.header = header
		else this.header = {}
		if( typeof method == 'undefined' ) this.method = 'POST'
		else this.method = method 
	}
	
	/**
	 * Function that will be called when receiving the response of the server (must process the full XMLHttpRequest).
	 * xhttp XMLHttpRequest object with the response and request.
	 */
	callback( xhttp ){}

	/**
	 * Runs a command of the web server
	 * @param arg Main argument for connecting with the end-point
	 * @param header Header information for connecting to the end-point. 
	 * If not provided, the end-point will use the header provided in the constructor method
	 * @param callback Function that will be called when receiving the response of the server (must process the full XMLHttpRequest).
	 * If not provided, the end-point will use the callback provided its defined callback function
	 */
	request( arg, header, callback ){
		if( typeof callback == 'undefined' ) callback = this.callback
		if( typeof header == 'undefined' ) header = this.header
		
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function (){
			if (xhttp.readyState==4 && xhttp.status == 200){
				callback( xhttp )
			}
		}
		xhttp.open(this.method, this.url, true)
		//xhttp.setRequestHeader("Cache-Control", "max-age=0")
		for( var x in header )
			xhttp.setRequestHeader(x, header[x])
		xhttp.send(arg)
	}
}


class AplikigoEndPoint extends KonektiEndPoint{
    constructor( url ){
        super(url)
    }
    
    callback( xhttp ){
        var pack = JSON.parse(xhttp.response)
        var commands = pack.command
        for( var i=0; i<commands.length; i++ ){
            var c = Konekti.client[commands[i].object]
            c[commands[i].method].apply(c, commands[i].args)
        }
    }
    
    request( object, method, args ){
        var nargs = []
        for( var i=0; i<args.length; i++ ){
            if( args[i].byteLength !== undefined ) nargs.push(btoa(args[i]))
            else nargs.push(args[i])
        }
        var c = {"object":object, "method":method, "args":nargs}
        var pack = {"command":[c], "credential":Konekti.user}
        super.request(JSON.stringify(pack))
    }
}