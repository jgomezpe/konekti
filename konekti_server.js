/**
*
* konekti_server.js
* <P>A Server for the konekti library.
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

/* ************************************* Package for sending and returning data to and from the server ****************************************** */
class Package{
	/**
	 * Creates a Package for sending and returning data to and from the server
	 * @param header Header of the package
	 * @param data Data sent to or received from the server 
	 */
	constructor( header, data ){
		this.header = header
		this.data = data!=null?data:''
	}
}

/* ************************************* A server ****************************************** */
class Server{
	constructor(){ this.plugin_path = 'plugin/' }

	/**
	 * Reads a resource from the server
	 * @param resource Id of the resource to be read from the server
	 * @param next Function that will be called after the resource is read from the server (it must has an argument that correspond to the resource that has been read)
	 */ 
	getResource( resource, next ){
		if( resource==null ) return;

		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function (){ 
			if (xhttp.readyState==4 ){
				var response = ""
				if( next != null )
					if( xhttp.status == 200 ) next(xhttp.response)
					else next('')
			}
		}
		xhttp.open('GET', resource, true)
		xhttp.setRequestHeader("Cache-Control", "max-age=0")
		xhttp.send()
	}

	/**
	 * Gets the path to the plugIn
	 * @param id PlugIn id 
	 * @return The plugIns Path
	 */
	pluginPath(id){ return this.plugin_path+id+'/' }

	/**
	 * Creates a server based id for the given resource
	 * @param id Id of the resource
	 * @param type Type of the resource
	 * @return A server based id for the given resource
	 */
	makeResourceID( id, type ){ return id+'.'+type }

	/**
	 * Loads the given script (if possible)
	 * @param type Type of the script to be loaded
	 * @param id Script id
	 * @param next Function that will be called if the script was loaded
	 */
	loadScript( type, id, next ){
		function back( code ){
			Script.add( type, id, code )
			if( next != null ) next()
		}

		this.getResource(id, back )
	}

	/**
	 * Loads a CSS resource (if possible)
	 * @param id CSS id
	 * @param next Function that will be called if the CSS was loaded
	 */
	loadCSS( id, next ){ 
		var x = this
		function addCSS( cssCode ){ 
			Util.addCSS( cssCode )
			if( next != null ) next()
		}
		this.getResource(this.makeResourceID(id,'css'), addCSS )
	}

	/**
	 * Loads a HTML resource (if possible)
	 * @param id HTML id
	 * @param next Function that will be called if the HTML was loaded
	 */
	getHTML( id, next ){ this.getResource(this.makeResourceID(id,'html'), next) }

	/**
	 * Loads a JSON resource (if possible)
	 * @param id JSON id
	 * @param next Function that will be called if the JSON was loaded
	 */
	getJSON( id, next ){
		function backJSON( json ){ next( JSON.parse( json ) ) }
		this.getResource(this.makeResourceID(id,'json'), backJSON) 
	}

	/**
	 * Loads a Java Script resource (if possible)
	 * @param id Java Script id
	 * @param next Function that will be called if the Java Script was loaded
	 */
	loadJS( id, next ){ this.loadScript('text/javascript', this.makeResourceID(id,'js'), next) }

	/**
	 * Registers a command in the Server
	 * @param object Object that will execute the command
	 * @param method Command (method of the object) that will be executed
	 */
	registerCommand( object, method ){
		if( typeof object == "string" ){
			if( this[object] == null ) this[object] = {}
			this[object][method.id] = method.value
		}else{
			this[object.id] = object.value
		}
	}

	/**
	 * Resets the application
	 */
	reset(){ window.location.reload(true) }
}

/* ************************************* A Server based on a Servlet ****************************************** */
class ServletServer extends Server{
	constructor( servlet ){
		super()
		this.servlet = servlet!=null?servlet:'maya'
	}

	/**
	 * Runs a command of the web server
	 * @param object Object that will execute the command
	 * @param method Command (method of the object) that will be executed
	 * @param arg Arguments of the command that have been sent (A command can be sent to the server in chunks)
	 * @param value Values of the arguments that have been sent
	 * @param next Function that will be called when receiving the response of the server (must process one argument)
	 */
	web(object, method, arg, value, next){
		command = new Package({'object':object, 'method':method, 'args':arg, 'navigator':navigator.appName}, value)
		
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function (){
			if (xhttp.readyState==4 && xhttp.status == 200){
						//xhttp.responseType = xhttp.getResponseHeader('Content-Type')
				var response = new Package( xhttp.getResponseHeader('header'), xhttp.response )
				next(response)
			}
		}
		xhttp.open('POST', this.servlet , true)
		xhttp.setRequestHeader("Cache-Control", "max-age=0")
		xhttp.setRequestHeader("header", JSON.stringify(command.header))
		xhttp.send(command.arg)
	}

	/**
	 * Reads a resource from the server
	 * @param resource Id of the resource to be read from the server
	 * @param next Function that will be called after the resource is read from the server (it must has an argument that correspond to the resource that has been read)
	 */ 
	getResource( resource, next ){
		if( resource==null ) return;
		this.web('resource', 'download', '[txt]', '['+resource+']', function( response ){ next( response.data ) }) 
	}

	/**
	 * Gets the path to the plugIn
	 * @param id PlugIn id 
	 * @return The plugIns Path
	 */
	pluginPath(id){ return '' }

	/**
	 * Registers a command in the Server
	 * @param object Object that will execute the command
	 * @param method Command (method of the object) that will be executed
	 */
	registerCommand(object, method){
		if( typeof object == "string" && typeof method == "string" ){
			if( this[object] == null ) this[object] = {}
			var x = this
			this[object][method] = function( next ){
				switch( arguments.length ){
					case 0:
						x.web(object, method, '*', '', next) 
					break;
					case 1:
						x.web(object, method, '*', '', next) 
					break;
					case 2:
						x.web(object, method, '*', arguments[1], next) 
					break;
					default:
						// Getting the type of arguments required by the service
						var non_blob = []
						var blob = []
						var i
						for( i=1; i<arguments.length; i++ ){
							if( arguments[i] instanceof Blob ) blob.push(i-1)
							else non_blob.push(i-1)
						}
						var values = []
						for( i=0; i<non_blob.length; i++ ){ values.push(arguments[non_blob[i]])	}
						if( values.length == arguments.length-1 ) x.web(object, method, '*', JSON.stringify(values), next)
						else{
							function merge( response ){	if( response != "command.builder.incomplete()" ) next(response)	}
							non_blob.push(object)
							non_blob.push(method)
							x.web('command', 'builder', non_blob, JSON.stringify(values), merge)
							for( i=0; i<blob.length; i++ ){
								x.web('command', 'builder', [object, method, blob[i]], arguments[blob[i]], merge)
							}
						}
				}
			}
		}else super.registerCommand(object, method, arg)
	}
}
