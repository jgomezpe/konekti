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
class KonektiFrameWork{
	/**
	 * Inits the konekti framework
	 * @param callback Function that will be called after initializing the konekti framework
	 * @param servlet Servlet that will be used by the Konekti server. If servlet==null a simple server is initialized
	 */
	constructor(){
		this.script = new KonektiScript()
		this.util = new KonektiUtil()
		this.plugin = {}
		this.user = {"credential":"anonymous"}
		this.client = {}
		this.module = {}
		this.languages = {}
		this.client['console'] = console
		this.konektiPluginPath = "https://konekti.numtseng.com/source/plugin/"
		this.pluginPath = "plugin/"
		this.modulePath = "module/"
		this.languagePath = "language/"
	}

	/**
	 * Computes a list of required plugins for creating a thing instance
	 * @param thig JSON information of the object to be instantiated 
	 * @return List of required plugins for creating a thing instance
	 */
	imports(thing){
		var uses = []
		if( thing!=null && thing.plugin != null ){
			if( thing.plugin != "" ) uses.push(thing.plugin);
			for( var c in thing ) uses = uses.concat(this.imports(thing[c]))
		}else if(Array.isArray(thing) ){
			for( var i=0; i<thing.length; i++ ) uses = uses.concat(this.imports(thing[i]))
		}
		return uses
	}

	/**
	 * Connects a thing instance with its view components and control component 
	 * @param thig JSON information of the object to be connected 
	 * @param control_id Id of the control component for the thing
	 */
	connect(thing, control_id){
		if( thing!=null && thing.plugin != null ){
			if( thing.plugin != "" ){
				if( typeof thing.client === "undefined" || thing.client==null ) thing.client = control_id
				this.plugin[thing.plugin].replaceWith(thing)
			}
			for( var c in thing ) this.connect(thing[c], control_id)
		}if(Array.isArray(thing) ){
			for( var i=0; i<thing.length; i++ ) this.connect(thing[i], control_id)
		}
	}

	build(thing, client, callback){
		var x = this
		this.getPlugins(x.imports(thing), 
			function(){ 
				x.connect(thing,client) 
				if( callback != null ) callback()
			}
		)	
	}

	getPlugin(id, next){
		var x = this
		var js
		var html

		function init2(){
			x.plugin[id]= new KonektiPlugIn(id)
			if( typeof js === 'string' ) eval(js)
			if( typeof html === 'string' ) x.plugin[id].htmlTemplate = html
			next()
		}

		function init( obj ){
			js = obj.js
			html = obj.html
			if( typeof obj.css === 'string' ) x.util.addCSS(obj.css) 
			if( typeof obj.uses !== 'undefined' ){ x.getPlugins(obj.uses, init2) }
			else init2()
		}

		function checkKonektiFirst( obj ){
			if( obj != null ){ init(obj) }
			else{ x.getJSON( x.pluginPath+id, init ) }
		}

		this.getJSON(this.konektiPluginPath+id, checkKonektiFirst)
	}
	
	/**
	 * Loads a set of PlugIns
	 * @param plugins Name of the Plugins to be loaded
	 * @param next Function that will be executed after loading the set of Plugins
	 */
	getPlugins(plugins, next){
		var x=this
		var i=0
		function step(){
			if( i<plugins.length ){
				var p = plugins[i]
				i++
				if( typeof x.plugin[p] === 'undefined' ) x.getPlugin(p, step)
				else step()
			}else next()
		}
		step()
	}

	getDictionary( lang, topic, next ){
		var x = this
		function callbackDict( dictionary ){
			if( typeof dictionary.uses !== 'undefined' )
				x.getDictionarys(lang, dictionary, next)
			else next(dictionary)
		}
		this.getJSON(this.languagePath+lang+'/'+topic, callbackDict)
	}

	/**
	 * Loads a set of PlugIns
	 * @param plugins Name of the Plugins to be loaded
	 * @param next Function that will be executed after loading the set of Plugins
	 */
	getDictionarys(lang, dictionary, next){
		var topics = dictionary.uses
		var x=this
		var i=0
		function step(){
			function merge( dict ){
				dictionary.content = {...dict.content, ...dictionary.content}
				step()
			}
			if( i<topics.length ){
				var inner_topic = topics[i]
				i++
				x.getDictionary(lang,inner_topic,merge) 
			}else next(dictionary)
		}
		step()
	}


	getModule(module, next, language){
		var client = this
		var dict = null
		function callbackMain(json){
			if( dict != null ){
				var content = {}
				for( var x in dict.content ) content[x] = dict.content[x].value
				json = Konekti.util.fromTemplate(json,content,'·')
			}
			var object = json.length>0?JSON.parse( json ):null
			next(object)	
		}
		function callbackDict(lang){ 
			dict = lang
			client.getResource(client.modulePath+module+'.json', callbackMain)
		}
		if( typeof language === 'string' ) 
			Konekti.getDictionary(language, module, callbackDict)
		else 
			this.getResource(this.modulePath+module+'.json', callbackMain)
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
	pluginPath(id){ return 'plugin/' }

	/**
	 * Loads the given script (if possible)
	 * @param type Type of the script to be loaded
	 * @param id Script id
	 * @param next Function that will be called if the script was loaded
	 */
	loadScript( type, id, next ){
		var x = this
		function back( code ){
			x.script.add( type, id, code )
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
			x.util.addCSS( cssCode )
			if( next != null ) next()
		}
		this.getResource(id+'.css', addCSS )
	}

	/**
	 * Loads a HTML resource (if possible)
	 * @param id HTML id
	 * @param next Function that will be called if the HTML was loaded
	 */
	getHTML( id, next ){ this.getResource(id+'.html', next) }

	/**
	 * Loads a JSON resource (if possible)
	 * @param id JSON id
	 * @param next Function that will be called if the JSON was loaded
	 */
	getJSON( id, next ){
		function backJSON( json ){ next( json.length>0?JSON.parse( json ):null ) }
		this.getResource(id+'.json', backJSON) 
	}

	/**
	 * Loads a Java Script resource (if possible)
	 * @param id Java Script id
	 * @param next Function that will be called if the Java Script was loaded
	 */
	loadJS( id, next ){ this.loadScript('text/javascript', id+'.js', next) }

	/**
	 * Resets the application
	 */
	reset(){ window.location.reload(true) }
}

/* ************************************* Util Methods ****************************************** */
class KonektiScript{
	constructor(){ this.loaded=[] }

	/** 
	 * Gets the position of the script <i>x</i> in the array of loaded scripts. If the script has not been loaded, this method returns the size of the array of loaded scripts.
	 * @param x Script to be located
	 * @return Position of the script if it was previously loaded, <i>n=size(src)</i> otherwise
	 */
	index( id ){
		var i=0;
		while(i<this.loaded.length && id!=this.loaded[i].id){ i++ }
		return i
	}

	/**
	 * Adds a script to the client from its source code 
	 * @param type Script type
	 * @param id If of the script to be added
	 * @param code Source code of the script
	 * @param next Function that will be called after loading the script
	 */
	add( type, id, code ){
		var index = this.index(id)
		if( index == this.loaded.length ){ 
			var element = document.createElement( 'script' )
			element.defer = true
			element.charset="utf-8"
			if( type!=null ) element.type = type
			this.loaded.push({"id":id})
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
	load( type, url, next ){
		var index = this.index(url)
		if( index == this.loaded.length ){ 
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
			myScript = this.loaded[index]
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
	loadJS( url, next ){ this.load( 'text/javascript', url, next ) }

	/**
	 * Adds a link to the client from a cloud url
	 * @param url URLs of the link
	 * @param rel 
	 */
	link( url, rel ){
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
	stylesheet( url ){ this.link( url, "stylesheet" ) }
}


/* ************************************* Util Methods ****************************************** */
class KonektiUtil{
	/**
	 * Creates a url from a http response
	 * @param response Response provided by the http connection
	 * @return A URL version of the provided response
	 */
	downloadURL( response ){ return URL.createObjectURL(new Blob([response], {type: 'application/octet-stream'})) }

	/**
	 * Creates a string from string (id function)
	 * @param str String to be converted to a String
	 * @return A String version of the String
	 */
	txt(str){ return str }

	/**
	 * Creates a XML object from a string, if possible
	 * @param str String to be converted to a XML object
	 * @return A XML version of the String
	 */
	xml(str){ return new DOMutilr().utilFromString(str,"text/xml") }

	/**
	 * Creates a JSON object from a string, if possible
	 * @param str String to be converted to a JSON object
	 * @return A JSON version of the String
	 */
	json(str){ return ((str!=null)&&(str.length>0))?JSON.parse(str):null }

	/**
	 * Creates a HTML element from a string, if possible
	 * @param str String representing a single HTML element
	 * @return A HTML version of the string
	 */
	html(str) {
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
	css(str){
		if(str!=null){
			str = str.trim()
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
	addCSS(str){
		var d = this.css( str )
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
	fromTemplate(str, dictionary, c){
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
						if( typeof dictionary[tag] === 'undefined' ) res += tag
						else if( typeof dictionary[tag] === 'string' ) res += dictionary[tag]
						else res += JSON.stringify(dictionary[tag])
						res += x[i]
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
	templateTags(str, c){
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
	encode(str){ return '"' + str.replace(/\\/g, '\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\t/g,'\\t') +'"' }

	/**
	 * Obtains a String from a JSON version
	 * @param str String to be recovered from a JSON String
	 * @return The String from a JSON version
	 */
	decode(str){
		var s = str.replace(/\\\\/g, '\\').replace(/\\"/g,'"').replace(/\\n/g,'\n').replace(/\\t/g,'\t')
		return s.substring(1,s.length-1)
	}

	/**
	 * Obtains the child node (starting with <i>node</i> as parent) with the given id
	 * @param node The starting node for the searching process
	 * @param childId Id of the node being located
	 * @return The child node (starting with <i>node</i> as parent) with the given id
	 */
	findChild(node, childId){
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
	vc(id){ return document.getElementById(id) }

	/**
	 * Determines the interface language
	 * @return Interface language
	 */ 
	language(){
		var urlParams = new URLSearchParams(window.location.search)
		var lang = urlParams.get('lang')  || navigator.language || navigator.userLanguage 
		var idx = lang.indexOf('-')
		if( idx > 0 ) lang = lang.substring(0,idx)
		return lang
	}

	previousFont( font ){
		if( font == 'small' ) return 'tiny'
		if( font == 'medium' ) return 'small'
		if( font == 'large' ) return 'medium'
		if( font == 'xlarge' ) return 'large'
		if( font == 'xxlarge' ) return 'xlarge'
		if( font == 'xxxlarge' ) return 'xxlarge'
		if( font == 'jumbo' ) return 'xxxlarge'
		return font	
	}

	fontSize( font ){
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

	base64ToBlob(base64) {
	    var binary_string = window.atob(base64)
	    var len = binary_string.length
	    var bytes = new Uint8Array(len)
	    for (var i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i)
	    }
	    return bytes.buffer
	}

	base64ToString(base64){
		return new TextDecoder("utf-8").decode(this.base64ToBlob(base64))
	}

	blobToBase64(blob){
		function getChar( b ) {
        		if( b < 26 ) return String.fromCharCode('A'.charCodeAt(0) + b)
       			b -= 26
        		if( b < 26 ) return String.fromCharCode('a'.charCodeAt(0) + b)
        		b -= 26
        		if( b < 10 ) return String.fromCharCode('0'.charCodeAt(0) + b)
            		b -= 10
        		if( b == 0 ) return '+'
        		return '/'
        	}
    
        	function code(blob, begin) {
            		var a,b,c
            		var txt = ""
            		var x = blob.length-begin
            		if( x<=0 ) return ""
			switch(x) {
		       		case 1:
					a = blob[begin] & 0xFF 
					txt += getChar(a>>2)
					txt += getChar((a&3)<<4)
					return txt + "=="
				case 2:
					a = blob[begin] & 0xFF
					b = blob[begin+1] & 0xFF
					txt += getChar(a>>2)
					txt += getChar(((a&3)<<4)+(b>>4))
					txt += getChar((b&15)<<2)
					return txt + "="
				default:
					a = blob[begin] & 0xFF
					b = blob[begin+1] & 0xFF
					c = blob[begin+2] & 0xFF
					txt += getChar(a>>2)
					txt += getChar(((a&3)<<4)+(b>>4))
					txt += getChar(((b&15)<<2)+(c>>6))
					txt += getChar(c&63)
					return txt
			}
		}    
		var sb = ""
		for( var i=0; i<blob.length; i+=3 ) sb += code(blob,i)
		return sb
	}

	stringToBase64(str){
		return this.blobToBase64(new TextEncoder("utf-8").encode(str))
	}
}

/* ************************************* PlugIn Methods ****************************************** */
class KonektiPlugIn{
	/**
	 * Creates a PlugIn with the given <i>id</i>, and runs the <i>next</i> function after loaded
	 * @param id Id of the PlugIn
	 * @param next Function that will be executed after loading the PlugIn  
	 */
	constructor(id){
		this.id = id
	}

	get_uses( uses ){ return uses }
	
	/**
	 * Performs additional JS tasks for the PlugIn that has just been inserted in the document hierarchy
	 * @param thing Information of the PlugIn that has been just inserted in the document hierarchy  
	 */
	connect( thing ){}

	/**
	 * Creates the HTML resource of an instance of the PlugIn. Uses the information provided for the instance <i>dictionary</i>
	 * @param thing Information of the instance of the PlugIn
	 * @return The HTML resource of an instance of the PlugIn.
	 */
	htmlCode( thing ){	return Konekti.util.fromTemplate( this.htmlTemplate, thing, '·' ) }

	/**
	 * Creates a DOM node for an instance of the PlugIn
	 * @param thing Information of the PlugIn instance
	 * @return A DOM node for an instance of the PlugIn
	 */
	instance( thing ){
		var code = this.htmlCode( thing ) 
		var node = Konekti.util.html( code )
		return node
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and appends it as child of the component
	 * in the document with the given id, if possible
	 * @param parent Id of the element in the document that will include the new node
	 * @param thing PlugIn information for creating the HTML element that will be appended as child in the 
	 * HTML element in the document with the given id
	 */
	appendAsChild( parent, thing ){
		var node = this.instance( thing )
		var parentNode = Konekti.util.vc( parent )
		parentNode.appendChild( node )
		this.connect( thing )
	}
	
	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and inserts it as previous brother of the component
	 * in the document with the given id <i>sister</i>, if possible
	 * @param sister Id of the element in the document that will be the younger (next) sister of the new node
	 * @param thing PlugIn information for creating the HTML element that will be inserted as older (previous) brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	insertBefore( sister, thing ){
		var node = this.instance( thing )
		var sisterNode = Konekti.util.vc( sister )
		var parentNode = sisterNode.parentElement
		parentNode.insertBefore( node, sisterNode )
		this.connect( thing )
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and replaces with it the HTML element
	 * in the document with the same id, if possible
	 * @param thing PlugIn information for creating the HTML element that will replace the HTML element in
	 * the document with the same id
	 */
	replaceWith( thing ){
		var c = Konekti.util.vc( thing.id )
		if( typeof this.replace == 'string' && this.replace == 'strict' ){
			var node = this.instance( thing )
			if( c!=null ) c.parentElement.replaceChild(node, c)
		}else{ if(c!=null) c.innerHTML = this.htmlCode(thing) }
		this.connect(thing)
	}
}

/* ************************************* Components ****************************************** */
/**
 * A client for the application. Connection point between front and back
 */
class KonektiClient{
	/**
	 * Creates a client with the given id
	 * @param id Client id
	 */	
	constructor(id){
		if( typeof id == 'string' ){
			this.id = id
		}else{
			this.dictionary = id
			this.id = this.dictionary.id
		}
		this.gui = this.vc()
		this.listener = []
		Konekti.client[this.id] = this
	}

	vc( submodule ){
		if( typeof submodule == 'string' ) return Konekti.util.vc(this.id+submodule)
		else return Konekti.util.vc(this.id)
	}

	addListener( listener ){ this.listener.push(listener) }

	delListener( listener ){
	    var i=0
		while(i<this.listener.length && this.listener[i] !== listener) i++
		if( i<this.listener.length ) this.listener.splice(i,1)
	}

	/**
	 * Connects the given object to the given client
	 */
	connect( dictionary, cid, callback ){ Konekti.build(dictionary, cid, callback) }
}

/**
 * An editor (text) manager
 */
class KonektiEditor extends KonektiClient{
	constructor( dictionary ){
		super(dictionary)
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
class KonektiMedia extends KonektiClient{
	constructor( dictionary ){
		super(dictionary)
	}

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

	pause(){}

	play(){}

	seek(time){}
}

/**
 * application javascript
 */

class App extends KonektiClient{
	constructor( id, main, lang ){
		super(id)
		this.topic = main
		this.lang = lang || null

		/*
		var client = this
		function callbackLanguage(){
			client.languages = Konekti.languages[client.id]
			client.firstTime = true
			client.init(main)
		}

		Konekti.multiLanguage(client.id, Konekti.util.language(), callbackLanguage)
		*/
		this.goto(this.topic)
	}

	setLanguage(language){
		function callbackDict(lang){ 
			for( var y in lang.content ){
				if( typeof lang.content[y].component !== 'undefined' ){
					var x = lang.content[y].component
					for( var i=0; i<x.length; i++ ){
						if( typeof x[i].client === 'boolean' && x[i].client ) Konekti.client[x[i].id][x[i].attr] = lang.content[y].value
						else Konekti.util.vc(x[i].id)[x[i].attr] = lang.content[y].value
					}
				}
			}
		}
		this.lang = language
		Konekti.getDictionary(language,this.topic, callbackDict)
	}

	goto(topic){
		var client = this
		var dict = null
		function callbackMain(object){
			object.client = client.id
			if( typeof object.id == 'undefined' ) object.id = client.id
			client.connect(object, client.id)
			client.topic = topic	
		}
		Konekti.getModule(topic, callbackMain, this.lang )
	}

	select(id){ this.goto(id) }

	/**
	 * Playing event manager for media components
	 * @param id Media component that generates the playing event
	 * @param time Current time
	 */
	playing(id, time){
		this.client[id].time = time
		var scripts = this.scripts
		for( var i=0; i<scripts.length; i++ ){
			var script = scripts[i]
			if(typeof this.client[script.target] != 'undefined'){
				if( typeof script.text == "undefined" || script.text == null ) script.text = this.client[script.target].getText()
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
					this.client[script.target].setText(text)
					if( k>=0 ) this.client[script.target].scrollTop()
					script.current = k
				}
			}
		}
	}
}

Konekti = new KonektiFrameWork()
