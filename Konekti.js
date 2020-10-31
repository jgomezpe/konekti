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
class KonektiCore{
	/**
	 * Inits the konekti framework
	 * @param callback Function that will be called after initializing the konekti framework
	 * @param servlet Servlet that will be used by the Konekti server. If servlet==null a simple server is initialized
	 */
	constructor(){
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
	 * loads a resource from the server
	 * @param resource Id of the resource to be load from the server
	 * @param callback Function that will be called after the resource is read 
	 * from the server (it must has an argument that correspond to the resource that has been load)
	 */ 
	loadResource( resource, callback ){
		if( resource==null ) return;
		var xhttp = new XMLHttpRequest()
		xhttp.onreadystatechange = function (){ 
			if (xhttp.readyState==4 ){
				var response = ""
				if( callback !== undefined && callback !== null )
					if( xhttp.status == 200 ) callback(xhttp.response)
					else callback(null)
			}
		}
		xhttp.open('GET', resource, true)
		xhttp.setRequestHeader("Cache-Control", "max-age=0")
		xhttp.send()
	}

	/**
	 * Loads a JSON resource (if possible)
	 * @param id JSON id
	 * @param callback Function that will be called if the JSON was loaded
	 */
	loadJSON( id, callback ){
		function back(json){ if(callback !== undefined) callback((json!=null)?JSON.parse(json):null) }
		this.loadResource(id+'.json', back) 
	}

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
		str = str.trim()
		var d = document.createElement('style')
		d.innerHTML = str
	    document.getElementsByTagName('head')[0].appendChild(d)
	}

	/**
	 * Loads a CSS resource (if possible)
	 * @param id CSS id
	 * @param callback Function that will be called if the CSS is loaded
	 */
	loadCSS( id, callback ){
	    var x = this
		function add(str){
		    if(str!==undefined && str!==null){ x.css(str) }
			if(callback !== undefined) callback()
		}
		this.loadResource(id+'.css', add)
	}
	
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
	

	/**
	 * Loads the given script (if possible)
	 * @param type Type of the script to be loaded
	 * @param url Script's url
	 * @param callback Function that will be called if the script is loaded
	 */
	loadScript( type, url, callback ){
		var element = document.createElement( 'script' )
		if( type!=null ) element.type = type
		element.async = true
		element.defer = true
		element.src = url 
		element.charset="utf-8"
		element.onreadystatechange = null

		element.onload = callback
		var b = document.getElementsByTagName('script')[0]
		b.parentNode.insertBefore(element, b)
	}

	/**
	 * Loads a Java Script resource (if possible)
	 * @param id Java Script id
	 * @param callback Function that will be called if the Java Script is loaded
	 */
	loadJS( id, callback ){ this.loadScript('text/javascript', id+'.js', callback) }

	/**
	 * Loads a set of plugins and executes the callback function
	 * @param plugins An array of plugin ids
	 * @param callback function to be executed after loading plugins
	 */
	loadPlugIn(){
		var x = this
		var n = arguments.length-1
		var args = arguments
		var callback = args[n]
		if(n==1){
		    var id = args[0]
    		var js
    		var html
    
    		function init2(){
    			x.plugin[id]= new KonektiPlugIn(id)
    			if( typeof js === 'string' ) eval(js)
    			if( typeof html === 'string' ) x.plugin[id].htmlTemplate = html
    			callback()
    		}
    
    		function init(obj){
    			js = obj.js
    			html = obj.html
    			if( typeof obj.css === 'string' ) x.css(obj.css) 
    			if( typeof obj.uses !== 'undefined' ){ x.loadPlugIn(...obj.uses, init2) }
    			else init2()
    		}
    
    		function checkingKonektiFirst(obj){
    			if(obj!=null){ init(obj) }
    			else{ x.loadJSON(x.pluginPath+id, init) }
    		}
    
    		this.loadJSON(this.konektiPluginPath+id, checkingKonektiFirst)
        }else{
    		var i=0
    		function step(){
    			if( i<n ){
    				var p = args[i]
    				i++
    				if( typeof x.plugin[p] === 'undefined' ) x.loadPlugIn(p, step)
    				else step()
    			}else callback()
    		}
    		step()
        }	
	}
	
	/**
	 * Defines the set of plugins that Konekti will use and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
	uses(){ 
	    if( KonektiMain !== undefined ) this.loadPlugIn(...arguments, KonektiMain) 
	    else this.loadPlugIn(...arguments)
	}

	/**
	 * Resets the application
	 */
	reset(){ window.location.reload(true) }	

	/**
	 * Gets the path to the plugIn
	 * @param id PlugIn id 
	 * @return The plugIns Path
	 */
	pluginPath(id){ return 'plugin/' }

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
		if( c===undefined ) c = String.fromCharCode(183)
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
	 * Obtains the node with the given id (A shortcut of the <i>document.getElementById</i> method
	 * @param id Id of the element being located
	 * @return The node with the given id (A shortcut of the <i>document.getElementById</i> method
	 */
	vc(id){ return document.getElementById(id) }
	
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
	 * Creates a url from a http response
	 * @param response Response provided by the http connection
	 * @return A URL version of the provided response
	 */
	downloadURL( response ){ return URL.createObjectURL(new Blob([response], {type: 'application/octet-stream'})) }
}


/* ************************************* PlugIn Methods ****************************************** */
class KonektiPlugIn{
	/**
	 * Creates a PlugIn with the given <i>id</i>, and runs the <i>next</i> function after loaded
	 * @param id Id of the PlugIn
	 * @param next Function that will be executed after loading the PlugIn  
	 */
	constructor(id, core){
		this.id = id 
		this.core = core || Konekti.core
	}
	
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
	fillLayout( thing ){ return this.core.fromTemplate( this.htmlTemplate, thing, String.fromCharCode(183) ) }

	/**
	 * Creates a DOM node for an instance of the PlugIn
	 * @param thing Information of the PlugIn instance
	 * @return A DOM node for an instance of the PlugIn
	 */
	html( thing ){ return this.core.html(this.fillLayout(thing)) }

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and appends it as child of the component
	 * in the document with the given id, if possible
	 * @param parent Id of the element in the document that will include the new node
	 * @param thing PlugIn information for creating the HTML element that will be appended as child in the 
	 * HTML element in the document with the given id
	 */
	appendAsChild( parent, thing ){
		var node = this.html( thing )
		var parentNode = this.core.vc( parent )
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
		var node = this.html( thing )
		var sisterNode = this.core.vc( sister )
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
		var c = this.core.vc( thing.id )
		if( typeof this.replace == 'string' && this.replace == 'strict' ){
			var node = this.html( thing )
			if( c!=null ) c.parentElement.replaceChild(node, c)
		}else{ if(c!=null) c.innerHTML = this.fillLayout(thing) }
		this.connect(thing)
	}
}

class KonektiAPI{
	constructor(){
		this.core = new KonektiCore()
		this.plugin = this.core.plugin
	}
    
	/**
	 * Defines the set of plugins that Konekti will use and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
	uses(){ this.core.uses(...arguments) }
	
	/** 
	 * Gets a client
	 * @param id Client's id
	 * @return The client with the given id, null if there is not client with the given id
	 */
	client(id){ return this.core.client[id] } 

	/**
	 * Moves a component as child of another component
	 * @param id Id of the component to move 
	 * @param parent Id of the component that receives the component
	 */
	move(id, parent){
		var t = this.core.vc(id)
		t.parentElement.removeChild(t)
		this.core.vc(parent).appendChild(t)
	}

	/**
	 * Gets the component with the given id
	 * @param id Id of the component to get 
	 * @return the component with the given id
	 */
	vc(id){ return this.core.vc(id) }

	/**
	 * Gets the plugin with the given id
	 * @param id Id of the plugin to get 
	 * @return the plugin with the given id
	 */
	plugin(id){ return this.plugin[id] }
}

Konekti = new KonektiAPI()


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
		Konekti.core.client[this.id] = this
	}

	vc( submodule ){
		if( typeof submodule == 'string' ) return Konekti.core.vc(this.id+submodule)
		else return Konekti.core.vc(this.id)
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
	connect( dictionary, cid, callback ){ Konekti.core.build(dictionary, cid, callback) }
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

