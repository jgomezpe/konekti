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

/* ************************************* Konekti Methods ****************************************** */
Konekti = {
	/**
	 * Inits the konekti framework
	 * @param callback Function that will be called after initializing the konekti framework
	 * @param servlet Servlet that will be used by the Konekti server. If servlet==null a simple server is initialized
	 */
	init: function(servlet){
		if( servlet == null ){ Konekti.server = new Server() }
		else{ Konekti.server = new ServletServer(servlet) }
	},

	component_id(dictionary, plugin){
		if( dictionary!=null && typeof dictionary.plugin != "undefined" ){
			if( dictionary.plugin == plugin ) return dictionary.id
			for( var c in dictionary ){
				var x = Konekti.component_id(dictionary[c], plugin)
				if(x != null) return x
			}
		}
		return null
	},

	client : {},

	build(dictionary, client, callback){
		function inner( dict ){
			var uses = []
			if( dict!=null && dict.plugin != null ){
				if( dict.plugin != "" ){
					uses.push(dict.plugin);
					for( var c in dict ){
						uses = uses.concat(inner(dict[c]))
					}
				}else{
					for( var c in dict ){
						uses = uses.concat(inner(dict[c]))
					}
				}
			}else if(Array.isArray(dict) ){
				for( var i=0; i<dict.length; i++ ){
					uses = uses.concat(inner(dict[i]))
				}
			}
			return uses
		}

		function inner_replace(dict){
			if( dict!=null && dict.plugin != null ){
				if( dict.plugin != "" ){
					if( typeof dict.client == "undefined" || dict.client==null ) dict.client = client
					Konekti.plugin[dict.plugin].replaceWith(dict)
					for( var c in dict ){
						inner_replace(dict[c])
					}
				}else{
					for( var c in dict ){
						inner_replace(dict[c])
					}
				}
			}if(Array.isArray(dict) ){
				for( var i=0; i<dict.length; i++ ){
					inner_replace(dict[i])
				}
			}
		}

		PlugIn.uses(inner(dictionary), 
			function(){ 
				inner_replace(dictionary) 
				if( callback != null ) callback()
			}
		)	
	}
}

Konekti.script={
	loaded : [],

	/** 
	 * Gets the position of the script <i>x</i> in the array of loaded scripts. If the script has not been loaded, this method returns the size of the array of loaded scripts.
	 * @param x Script to be located
	 * @return Position of the script if it was previously loaded, <i>n=size(src)</i> otherwise
	 */
	index: function( id ){
		var i=0;
		while(i<Konekti.script.loaded.length && id!=Konekti.script.loaded[i].id){ i++ }
		return i
	},

	/**
	 * Adds a script to the client from its source code 
	 * @param type Script type
	 * @param id If of the script to be added
	 * @param code Source code of the script
	 * @param next Function that will be called after loading the script
	 */
	add: function( type, id, code ){
		var index = Konekti.script.index(id)
		if( index == Konekti.script.loaded.length ){ 
			var element = document.createElement( 'script' )
			element.defer = true
			element.charset="utf-8"
			if( type!=null ) element.type = type
			Konekti.script.loaded.push({"id":id})
			element.innerHTML = code
			var b = document.getElementsByTagName('script')[0]
			b.parentNode.insertBefore(element, b)
		}
	},

	/**
	 * Adds a script to the client from a cloud url
	 * @param type Script type
	 * @param url URL of the script
	 * @param next Function that will be called after loading the script
	 * @param error Function that will be called if the script cold not be loaded
	 */
	load : function( type, url, next ){
		var index = Konekti.script.index(url)
		if( index == Konekti.script.loaded.length ){ 
			var element = document.createElement( 'script' )
			if( type!=null ) element.type = type
			element.async = true
			element.defer = true
			element.src = url 
			element.charset="utf-8"
			element.onreadystatechange = null

			var myScript = {id:url, state:0, queue:[next] } 
			Konekti.script.loaded.push(myScript)
			
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
			myScript = Konekti.script.loaded[index]
			var state = myScript.state
			var queue = myScript.queue
			if( state==1 ) next()
			if( state==0 ) queue.push( next )
		}
	},

	/**
	 * Adds a javascript to the client from a cloud url
	 * @param url URL of the script
	 * @param next Function that will be called after loading the script
	 * @param error Function that will be called if the script cold not be loaded
	 */
	loadJS: function( url, next ){ Konekti.script.load( 'text/javascript', url, next ) },

	/**
	 * Adds a link to the client from a cloud url
	 * @param url URLs of the link
	 * @param rel 
	 */
	link: function( url, rel ){
		var l = document.createElement('link')
		l.rel = rel
		l.href = url
		l.crossorigin="anonymous"
		document.getElementsByTagName('head')[0].appendChild(l)
	},

	/**
	 * Adds a style sheet to the client from a cloud url
	 * @param url URLs of the style sheet
	 */
	stylesheet: function( url ){ Konekti.script.link( url, "stylesheet" ) },
}

/* ************************************* Util Methods ****************************************** */
Konekti.util = {
	/**
	 * Creates a string from string (id function)
	 * @param str String to be converted to a String
	 * @return A String version of the String
	 */
	txt: function(str){ return str },

	/**
	 * Creates a XML object from a string, if possible
	 * @param str String to be converted to a XML object
	 * @return A XML version of the String
	 */
	xml: function(str){ return new DOMutilr().utilFromString(str,"text/xml") },

	/**
	 * Creates a JSON object from a string, if possible
	 * @param str String to be converted to a JSON object
	 * @return A JSON version of the String
	 */
	json: function(str){ return ((str!=null)&&(str.length>0))?JSON.parse(str):null },

	/**
	 * Creates a HTML element from a string, if possible
	 * @param str String representing a single HTML element
	 * @return A HTML version of the string
	 */
	html: function(str) {
	    var template = document.createElement('template')
	    str = str.trim()
	    template.innerHTML = str
	    return template.content.firstChild
	},

	/**
	 * Creates a CSS node from a string, if possible
	 * @param str String representing a CSS file
	 * @return A CSS node version of the string
	 */
	css: function(str){
		if(str!=null){
			str = str.trim();
			var d = document.createElement('style')
			d.innerHTML = str
			return d
		}
		return null;
	},

	/**
	 * Adds a CSS file (as String) to the client, if possible
	 * @param str String representing a CSS file
	 */
	addCSS: function(str){
		var d = Konekti.util.css( str )
		if( d != null ) document.getElementsByTagName('head')[0].appendChild(d)
	},

	/**
	 * Obtains a String from a template by replacing the set of tags with their associated values. A tag is limited both sides by a character <i>c</i>. 
	 * For example, if <i>str='lorem ·X· dolor ·haha· amet'</i>, <i>c='·'</i> and <i>dictionary={'X':'ipsum', 'haha':'sit' }
	 * then this method will return the string <i>lorem ipsum dolor sit amet'</i>
	 * @param str Template used for generating the String
	 * @param dictionary Set of pairs <i>(TAG,value)</i> used for replacing each <i>TAG</> by its corresponding <i>value</i>
	 * @param c Enclosing tag character
	 * @return A String from a template by replacing the set of tags with their associated values. 
	 */
	fromTemplate: function(str, dictionary, c){
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
	},

	/**
	 * Obtains the set of tags defined in a String template. A tag is limited both sides by a character <i>c</i>. For example, if <i>str='lorem·X·ipsum·haha· quia'</i>
	 * and <i>c='·'</i> then this method will return the array of tags <i>['X', 'haha']</i>
	 * @param str Template used for generating the String
	 * @param c Enclosing tag character
	 * @return A dictionary, set of pairs <i>(TAG,value)</i>, containing each <i>TAG</> in the template
	 */
	templateTags: function(str, c){
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
	},

	/**
	 * Obtains a JSON version of a String
	 * @param str String to be stored as JSON String
	 * @return A JSON version of the String
	 */
	encode: function(str){ return '"' + str.replace(/\\/g, '\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\t/g,'\\t') +'"' },

	/**
	 * Obtains a String from a JSON version
	 * @param str String to be recovered from a JSON String
	 * @return The String from a JSON version
	 */
	decode: function(str){
		var s = str.replace(/\\\\/g, '\\').replace(/\\"/g,'"').replace(/\\n/g,'\n').replace(/\\t/g,'\t')
		return s.substring(1,s.length-1)
	},

	/**
	 * Obtains the child node (starting with <i>node</i> as parent) with the given id
	 * @param node The starting node for the searching process
	 * @param childId Id of the node being located
	 * @return The child node (starting with <i>node</i> as parent) with the given id
	 */
	findChild: function(node, childId){
		var components = node.getElementsByTagName("*")
		var c = null
		for (var i = 0; i < components.length && c==null; i++) if( components[i].id == childId ) c = components[i]
		return c
	},

	/**
	 * Obtains the node with the given id (A shortcut of the <i>document.getElementById</i> method
	 * @param id Id of the element being located
	 * @return The node with the given id (A shortcut of the <i>document.getElementById</i> method
	 */
	vc: function(id){ return document.getElementById(id) },

	/**
	 * Determines the interface language
	 * @return Interface language
	 */ 
	language: function(){
		var urlParams = new URLSearchParams(window.location.search)
		var lang = urlParams.get('lang')  || navigator.language || navigator.userLanguage 
		var idx = lang.indexOf('-')
		if( idx > 0 ) lang = lang.substring(0,idx)
		return lang
	},

	previousFont: function( font ){
		if( font == 'small' ) return 'tiny'
		if( font == 'medium' ) return 'small'
		if( font == 'large' ) return 'medium'
		if( font == 'xlarge' ) return 'large'
		if( font == 'xxlarge' ) return 'xlarge'
		if( font == 'xxxlarge' ) return 'xxlarge'
		if( font == 'jumbo' ) return 'xxxlarge'
		return font	
	},

	fontSize: function( font ){
		if( font == 'tiny' ) return 10
		if( font == 'small' ) return 12
		if( font == 'medium' ) return 15
		if( font == 'large' ) return 18
		if( font == 'xlarge' ) return 24
		if( font == 'xxlarge' ) return 36
		if( font == 'xxxlarge' ) return 48
		if( font == 'jumbo' ) return 64
		return 15	
	}
}

/* ************************************* PlugIn Methods ****************************************** */
class PlugIn{
	/**
	 * Gets the Konekti plugins path
	 * @param id PlugIn id
	 * @return Konekti plugins path
	 */
	static URL(id){ return "https://konekti.numtseng.com/source/" }

	/**
	 * Creates a PlugIn with the given <i>id</i>, loading its resources from the given <i>server</i> and 
	 * runs the <i>next</i> function after loaded
	 * @param id Id of the PlugIn
	 * @param next Function that will be executed after loading the PlugIn  
	 */
	constructor(id, next){
		this.id = id
		var server = Konekti.server
		var js
		var css 
		var html 
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
			if( typeof css == 'undefined' ){ cssLoaded = true }
			else if( typeof css == 'boolean' ){
				if( css ){ server.loadCSS(x.path+id, backCSS) }
				else{ cssLoaded = true }
			}else{
				Konekti.util.addCSS(css) 
				backCSS(css)
			}

			if( typeof html == 'undefined' ){ htmlLoaded = true }
			else if( typeof html == 'boolean' ){
				if( html ){ server.getHTML(x.path+id, backHTML) }
				else{ htmlLoaded = true }
			}else{ backHTML( html ) }

			if( typeof js == 'undefined' ){ backJS() }
			else if( typeof js == 'boolean' ){
				if( js ){ server.loadJS(x.path+id, backJS) }
				else{ backJS() }
			}else{
				eval(js)
				backJS()
			}
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
						if( Konekti.plugin[uses[i]]==null ) new PlugIn(uses[i], step)
						else step()
					}else init2()
				}
				while( i<uses.length && Konekti.plugin[uses[i]]!=null ){ i++ }
				if( i<uses.length ) new PlugIn(uses[i], step) 
				else init2()
			}else init2()
		}

		function checkKonektiFirst( obj ){
			if( obj != null ){
				x.path = PlugIn.URL(x.id)
				init(obj)
			}else{
				x.path = server.pluginPath(id)
				server.getJSON( x.path+x.id, init )
			}

		}

		if( Konekti.plugin == null ) Konekti.plugin = {}
		Konekti.plugin[id] = this
		this.next = next
		this.id = id
		server.getJSON(PlugIn.URL(this.id)+this.id, checkKonektiFirst)
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
	htmlCode( dictionary ){	return Konekti.util.fromTemplate( this.htmlTemplate, dictionary, '·' ) }

	/**
	 * Creates a DOM node for an instance of the PlugIn
	 * @param dictionary Information of the PlugIn instance
	 * @return A DOM node for an instance of the PlugIn
	 */
	instance( dictionary ){
		var code = this.htmlCode( dictionary ) 
		var node = Konekti.util.html( code )
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
		var parentNode = Konekti.util.vc( parent )
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
		var sisterNode = Konekti.util.vc( sister )
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
		var c = Konekti.util.vc( dictionary.id )
		if( typeof this.replace == 'string' && this.replace == 'strict' ){
			var node = this.instance( dictionary )
			if( c!=null ) c.parentElement.replaceChild(node, c)
		}else{ if(c!=null) c.innerHTML = this.htmlCode(dictionary) }
		this.connect( dictionary )
	}

	/**
	 * Loads a set of PlugIns
	 * @param server Server containing the set of PlugIns
	 * @param plugins Name of the PlugIns to be loaded
	 * @param next Function that will be executed after loading the set of PlugIns
	 */
	static uses(plugins, next){
		if( Konekti.plugin == null ) Konekti.plugin = {}
		var i=0
		function step(){
			if( i<plugins.length ){
				var p = plugins[i]
				i++
				if( Konekti.plugin[p] != null ) step()
				else new PlugIn(p, step)
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
	constructor(){ this.plugin_path = 'plugin/' }

	getConfigFile(file, next){ this.getJSON(file, next) } 

	multiLanguage(id, lang, callback){
		var server = this
		function back(languages){
			if( server.languages == null ) server.languages = {}
			server.languages[id] = languages
			var found = false;
			for(var i = 0; i < languages.supported.length && !found; i++) 
			    found = (languages.supported[i].id == lang )
			if( !found ) lang = languages['default']
			server.getConfigFile = function(file, next){ server.getJSON('language/'+lang+'/'+file, next) } 
			callback()
		}
		server.getJSON( 'language/supported', back )
	}

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
	pluginPath(id){ return this.plugin_path }

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
			Konekti.script.add( type, id, code )
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
			Konekti.util.addCSS( cssCode )
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
		function backJSON( json ){ next( json.length>0?JSON.parse( json ):null ) }
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

/* ************************************* Components ****************************************** */
/**
 * An editor (text) manager
 */
class KonektiEditor{
	constructor( dictionary ){
		this.id = dictionary.id
		this.gui = Konekti.util.vc(this.id)
	}

	getText(){ return null }

	setText(txt){}

	locateCursor(row, column){}
	cursorLocation(){ return [0,0] }

	highlight(row){}

	cursorIndex(){ return 0 }
	locateCursorIndex(pos){}

	scrollTop(pos){
		if(typeof pos=='undefined') pos = this.gui.scrollHeight
		this.gui.scrollTop = pos
	}
}

/**
 * A media manager.
 */
class KonektiMedia{
	constructor( dictionary ){
		this.id = dictionary.id
		this.gui = Konekti.util.vc(this.id)
	}

	pause(){}

	play(){}

	seek(time){}
}

/**
 * A client for the application. Connection point between interfzse and server
 */
class KonektiClient{
	/**
	 * Creates a client with the given id
	 * @param id Client id
	 */	
	constructor(id){
		Konekti.init()
		var client = this
		client.id = id
		client.media={}
		client.edit={}
		Konekti.client[id] = this
	}

	/**
	 * Connects the given object to the given client
	 */
	connect( dictionary, cid, callback ){ Konekti.build(dictionary, cid, callback) }

	/**
	 * Paused event manager for media components
	 * @param id Media component that generates the paused event
	 */
	paused(id){}

	/**
	 * Playing event manager for media components
	 * @param id Media component that generates the playing event
	 * @param time Current time
	 */
	playing(id, time){}

	media(m){ this.media[m.id] = m }

	editor(e){ this.edit[e.id] = e }
}

/**
 * application javascript
 */

class App extends KonektiClient{
	constructor( main, topic ){
		super(main)
		var client = this
		this.topic = topic
		
		function callbackLanguage(){
			client.languages = Konekti.server.languages[client.id]
			client.firstTime = true
			client.init(main)
		}

		Konekti.server.multiLanguage(client.id, Konekti.util.language(), callbackLanguage)
	}

	setLanguage(id, lang){
		Konekti.server.getConfigFile = function(file, next){ Konekti.server.getJSON('language/'+lang+'/'+file, next) }
		this.languageChange = true
		this.init(id)
	}

	init(main){
		var client = this
		function callbackMain(dictionary){ 
			dictionary.client = client.id
			if( typeof dictionary.id == 'undefined' ) dictionary.id = client.id
			client.connect(dictionary, client.id, function(){ client.goto(client.topic) } )			
		}
		Konekti.server.getConfigFile(main, callbackMain)
	}

	goto(topic){
		var client = this
		function callback(dictionary){ 
			dictionary.client = client.id
			if( typeof dictionary.id == 'undefined' ) dictionary.id = client.id
			client.topic = topic
			client.connect(dictionary, client.id)
		}
		Konekti.server.getConfigFile(topic, callback)
	}
	
	select(id){ this.goto(id) }

	playing(id, time){
		if( this.media[id] == null ) this.media[id] = {}
		this.media[id].time = time
		var scripts = this.scripts
		for( var i=0; i<scripts.length; i++ ){
			var script = scripts[i]
			if(typeof this.edit[script.target] != 'undefined'){
				if( typeof script.text == "undefined" || script.text == null ) script.text = this.edit[script.target].getText()
				if( typeof script.current == "undefined" ) script.current = -1
				var k=script.mark.length-1
				while( k>=0 && script.mark[k].time>time ){ k-- }
				if(k!=script.current){
					var text;
					if(k>=0 ){
						if(typeof script.mark[k].txt!='undefined') text = script.mark[k].txt
						else{
							var start = 0
							if(typeof script.mark[k].start!='undefined') start = script.mark[k].start
							var end = script.text.length
							if(typeof script.mark[k].end!='undefined') end = script.mark[k].end
							var add=''
							if(typeof script.mark[k].add!='undefined') add = script.mark[k].add 
							text = script.text.substring(start,end) + add
						}
					}else text = script.text
					this.edit[script.target].setText(text)
					if( k>=0 ) this.edit[script.target].scrollTop()
					script.current = k
				}
			}
		}
	}

	editor(e){ this.edit[e.id] = e }
}
