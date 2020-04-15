/**
*
* konekti.js
* <P>Java Script connection library. This library allows to connect to a server for running command, 
* uploading and downloading resources. Also to add JS/HTML/CSS resources as plug-ins. 
* It is a wrap of all the konekti components (util, script, plugin and server)</P>
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

/* ************************************* Util Methods ****************************************** */
class Util{
	/**
	 * Creates a string from string (id function)
	 * @param str String to be converted to a String
	 * @return A String version of the String
	 */
	static txt( str ){ return str }

	/**
	 * Creates a XML object from a string, if possible
	 * @param str String to be converted to a XML object
	 * @return A XML version of the String
	 */
	static xml( str ){ return new DOMutilr().utilFromString(str,"text/xml") }

	/**
	 * Creates a JSON object from a string, if possible
	 * @param str String to be converted to a JSON object
	 * @return A JSON version of the String
	 */
	static json( str ){ return ((str!=null)&&(str.length>0))?JSON.parse(str):null }

	/**
	 * Creates a HTML element from a string, if possible
	 * @param str String representing a single HTML element
	 * @return A HTML version of the string
	 */
	static html(str) {
	    var template = document.createElement('template')
	    str = str.trim()
	    template.innerHTML = str
	    return template.content.firstChild
	}

	/**
	 * Creates a CSS node from a string, if possible
	 * @param str String representing a CSS file
	 * @return A CSS node version of the string
	 */
	static css( str ){
		if( str!=null ){
			str = str.trim();
			var d = document.createElement('style')
			d.innerHTML = str
			return d
		}
		return null;
	}

	/**
	 * Adds a CSS file (as String) to the client, if possible
	 * @param str String representing a CSS file
	 */
	static addCSS( str ){
		var d = Util.css( str )
		if( d != null ) document.getElementsByTagName('head')[0].appendChild(d)
	}

	/**
	 * Obtains a String from a template by replacing the set of tags with their associated values. A tag is limited both sides by a character <i>c</i>. 
	 * For example, if <i>str='lorem ·X· dolor ·haha· amet'</i>, <i>c='·'</i> and <i>dictionary={'X':'ipsum', 'haha':'sit' }
	 * then this method will return the string <i>lorem ipsum dolor sit amet'</i>
	 * @param str Template used for generating the String
	 * @param dictionary Set of pairs <i>(TAG,value)</i> used for replacing each <i>TAG</> by its corresponding <i>value</i>
	 * @param c Enclosing tag character
	 * @return A String from a template by replacing the set of tags with their associated values. 
	 */
	static fromTemplate( str, dictionary, c ){
		var x = str.split(c)
		var state = 0
		var res = ""
	  	var tag = ''
		for( var i = 0; i<x.length; i++ ){
			switch( state ){
				case  0:
					res += x[i]
					state = 1
				break;    
				case 1:
		        		if( x[i].length > 0 ){
		        			tag = x[i]
						state = 2
					}else{
						res += c
		        			state = 0
					}
				break;
			    	case 2:
				    	if( x[i].length > 0 || i==x.length-1 ){
						res += ((dictionary[tag]!=null)?dictionary[tag]:tag) + x[i]
						state = 1
					}else{
		            			tag += c
						state = 3
					}                
				break;
				case 3:
		        		if( x[i].length > 0 ) tag += x[i]
						state = 2
			}
		}
		return res
	}

	/**
	 * Obtains the set of tags defined in a String template. A tag is limited both sides by a character <i>c</i>. For example, if <i>str='lorem·X·ipsum·haha· quia'</i>
	 * and <i>c='·'</i> then this method will return the array of tags <i>['X', 'haha']</i>
	 * @param str Template used for generating the String
	 * @param c Enclosing tag character
	 * @return A dictionary, set of pairs <i>(TAG,value)</i>, containing each <i>TAG</> in the template
	 */
	static templateTags( str, c ){
		var array = []
		var x = str.split(c)
		var state = 0
	  	var tag = ''
		for( var i = 0; i<x.length; i++ ){
			switch( state ){
				case  0:
					state = 1
				break;    
				case 1:
		        		if( x[i].length > 0 ){
		        			tag = x[i]
						state = 2
					}else{ state = 0 }
				break;
			    	case 2:
				    	if( x[i].length > 0 || i==x.length-1 ){
						array.push(tag)
						state = 1
					}else{
		            			tag += c
						state = 3
					}                
				break;
				case 3:
		        		if( x[i].length > 0 ) tag += x[i]
					state = 2
			}
		}
		return array
	}
	
	/**
	 * Obtains a JSON version of a String
	 * @param str String to be stored as JSON String
	 * @return A JSON version of the String
	 */
	static encode( str ){ return '"' + str.replace(/\\/g, '\\\\').replace(/"/g,'\\"') +'"' }

	/**
	 * Obtains the child node (starting with <i>node</i> as parent) with the given id
	 * @param node The starting node for the searching process
	 * @param childId Id of the node being located
	 * @return The child node (starting with <i>node</i> as parent) with the given id
	 */
	static findChild( node, childId ){
		var components = node.getElementsByTagName("*")
		var c = null
		for (var i = 0; i < components.length && c==null; i++) if( components[i].id == childId ) c = components[i]
		return c
	}

	/**
	 * Obtains the node with the given id (A shortcut of the <i>document.getElementById</i> method
	 * @param id Id of the element being located
	 * @return The node with the given id (A shortcut of the <i>document.getElementById</i> method
	 */
	static vc( id ){ return document.getElementById(id) }
}

/* ************************************* Script Methods ****************************************** */

loadedScripts = [];

/**
 * Script Management
 * @param getResource A function that brings the resource from the server
 */
class Script{

	/** 
	 * Gets the position of the script <i>x</i> in the array of loaded scripts. If the script has not been loaded, this method returns the size of the array of loaded scripts.
	 * @param x Script to be located
	 * @return Position of the script if it was previously loaded, <i>n=size(src)</i> otherwise
	 */
	static index( id ){
		var i=0;
		while(i<loadedScripts.length && id!=loadedScripts[i].id){ i++ }
		return i
	}

	/**
	 * Adds a script to the client from its source code 
	 * @param type Script type
	 * @param id If of the script to be added
	 * @param code Source code of the script
	 * @param next Function that will be called after loading the script
	 */
	static add( type, id, code ){
		var index = Script.index(id)
		if( index == loadedScripts.length ){ 
			var element = document.createElement( 'script' )
			element.defer = true
			element.charset="utf-8"
			if( type!=null ) element.type = type
			loadedScripts.push({"id":id})
			element.innerHTML = code
			var b = document.getElementsByTagName('script')[0]
			b.parentNode.insertBefore(element, b)
		}
	}

	/**
	 * Adds a script to the client from a cloud url
	 * @param type Script type
	 * @param url URL of the script
	 * @param next Function that will be called after loading the script
	 * @param error Function that will be called if the script cold not be loaded
	 */
	static load( type, url, next ){
		var index = Script.index(url)
		if( index == loadedScripts.length ){ 
			var element = document.createElement( 'script' )
			if( type!=null ) element.type = type
			element.async = true
			element.defer = true
			element.src = url 
			element.charset="utf-8"
			element.onreadystatechange = null

			var myScript = {id:url, state:0, queue:[next] } 
			loadedScripts.push(myScript)
			
			function onload(){
				myScript.state = 1
				var queue = myScript.queue
				while( queue.length>0 ){
					var f = queue[0]
					if( f!=undefined && f!=null ) f()
					queue.shift()
				} 
			}

			function onerror(){ myScript.state = 2 }

			element.onload = onload
			element.onerror = onerror
			var b = document.getElementsByTagName('script')[0]
			b.parentNode.insertBefore(element, b)
		}else{
			myScript = loadedScripts[index]
			var state = myScript.state
			var queue = myScript.queue
			if( state==1 ) next()
			if( state==0 ) queue.push( next )
		}
	}

	/**
	 * Adds a javascript to the client from a cloud url
	 * @param url URL of the script
	 * @param next Function that will be called after loading the script
	 * @param error Function that will be called if the script cold not be loaded
	 */
	static loadJS( url, next ){ Script.load( 'text/javascript', url, next ) }

	/**
	 * Adds a link to the client from a cloud url
	 * @param url URLs of the link
	 * @param rel 
	 */
	static link( url, rel ){
		var l = document.createElement('link')
		l.rel = rel
		l.href = url
		l.crossorigin="anonymous"
		document.getElementsByTagName('head')[0].appendChild(l)
	}

	/**
	 * Adds a style sheet to the client from a cloud url
	 * @param url URLs of the style sheet
	 */
	static stylesheet( url ){ Script.link( url, "stylesheet" ) }
}

/* ************************************* PlugIn Methods ****************************************** */
class PlugIn{
	static URL( id ){ return "https://konekti.numtseng.com/konekti/" + id + '/' }

	/**
	 * Creates a PlugIn with the given <i>id</i>, loading its resources from the given <i>server</i> and 
	 * runs the <i>next</i> function after loaded
	 * @param server Server used for getting the resources associated to the PlugIn
	 * @param id Id of the PlugIn
	 * @param next Function that will be executed after loading the PlugIn  
	 */
	constructor( server, id, next ){
		this.id = id
		this.server = server
		
		var js = false
		var css = false
		var html = false
		var htmlLoaded = false
		var jsLoaded = false
		var cssLoaded = false

		function done(){ if(htmlLoaded && cssLoaded && jsLoaded) next() }

		var x = this
		
		function backHTML( html ){
			htmlLoaded = true
			x.htmlTemplate = html
			done()
		}
		function backCSS( css ){
			cssLoaded = true
			done()
		}
		function backJS(){
			jsLoaded = true
			done()
		}

		function init2(){
			if( css ) server.loadCSS(x.path+id, backCSS)
			else cssLoaded = true
			if( html ) server.getHTML(x.path+id, backHTML)
			else htmlLoaded = true
			if( js ) server.loadJS(x.path+id, backJS)
			else jsLoaded = true
		}

		function init( obj ){
			var uses = obj.uses
			js = obj.js
			css = obj.css
			html = obj.html
			if( uses != null ){
				var i = 0
				var n = uses.length
				function step(){
					i++
					if(i<n){
						if( window.plugin[uses[i]]==null ) new PlugIn( server, uses[i], step )
						else step()
					}else init2()
				}
				while( i<uses.length && window.plugin[uses[i]]!=null ){ i++ }
				if( i<uses.length ) new PlugIn( server, uses[i], step ) 
				else init2()
			}else init2()
		}

		function checkKonektiFirst( obj ){
			if( obj != null ){
				x.path = PlugIn.URL(x.id)
				init(obj)
			}else{
				x.path = this.server.pluginPath(id)
				x.server.getJSON( x.path+x.id, init )
			}

		}

		if( window.plugin == null ) window.plugin = {}
		window.plugin[id] = this
		this.next = next
		this.server = server
		this.id = id
		this.server.getJSON(PlugIn.URL(this.id)+this.id, checkKonektiFirst)
	}
	
	/**
	 * Performs additional JS tasks for the PlugIn that has just been inserted in the document hierarchy
	 * @param dictionary Information of the PlugIn that has been just inserted in the document hierarchy  
	 */
	connect( dictionary ){}

	/**
	 * Creates the HTML resource of an instance of the PlugIn. Uses the information provided for the instance <i>dictionary</i>
	 * @param dictionary Information of the instance of the PlugIn
	 * @return The HTML resource of an instance of the PlugIn.
	 */
	htmlCode( dictionary ){	return Util.fromTemplate( this.htmlTemplate, dictionary, '·' ) }

	/**
	 * Creates a DOM node for an instance of the PlugIn
	 * @param dictionary Information of the PlugIn instance
	 * @return A DOM node for an instance of the PlugIn
	 */
	instance( dictionary ){
		var code = this.htmlCode( dictionary ) 
		var node = Util.html( code )
		return node
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and appends it as child of the component
	 * in the document with the given id, if possible
	 * @param parent Id of the element in the document that will include the new node
	 * @param dictionary PlugIn information for creating the HTML element that will be appended as child in the 
	 * HTML element in the document with the given id
	 */
	appendAsChild( parent, dictionary ){
		var node = this.instance( dictionary )
		var parentNode = Util.vc( parent )
		parentNode.appendChild( node )
		this.connect( dictionary )
	}
	
	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and inserts it as previous brother of the component
	 * in the document with the given id <i>sister</i>, if possible
	 * @param sister Id of the element in the document that will be the younger (next) sister of the new node
	 * @param dictionary PlugIn information for creating the HTML element that will be inserted as older (previous) brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	insertBefore( sister, dictionary ){
		var node = this.instance( dictionary )
		var sisterNode = Util.vc( sister )
		var parentNode = sisterNode.parentElement
		parentNode.insertBefore( node, sisterNode )
		this.connect( dictionary )
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and replaces with it the HTML element
	 * in the document with the same id, if possible
	 * @param dictionary PlugIn information for creating the HTML element that will replace the HTML element in
	 * the document with the same id
	 */
	replaceWith( dictionary ){
		var node = this.instance( dictionary )
		var c = Util.vc( dictionary.id )
		if( c!=null ) c.parentElement.replaceChild(node, c)
		this.connect( dictionary )
	}

	/**
	 * Loads a set of PlugIns
	 * @param server Server containing the set of PlugIns
	 * @param plugins Name of the PlugIns to be loaded
	 * @param next Function that will be executed after loading the set of PlugIns
	 */
	static uses( server, plugins, next ){
		if( window.plugin == null ) window.plugin = {}
		var i=0
		function step(){
			if( i<plugins.length ){
				var p = plugins[i]
				i++
				if( window.plugin[p] != null ) step()
				else new PlugIn( server, p, step )
			}else next()
		}
		step()
	}
}

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
	constructor(){}

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
	pluginPath(id){ return 'konekti/'+id+'/' }

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
