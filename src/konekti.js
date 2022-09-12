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


/** Class for managable resources */
class Resource{
	constructor(){ this.loaded = {} }
	
	/**
	 * Creates a HTML element from a string, if possible
	 * @param str String representing a single HTML element
	 * @return A HTML version of the string
	 */
	html(str) {
		var template = document.createElement('template')
		template.innerHTML = str.trim()
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
	 * Loads a JSON resource (if possible)
	 * @param id JSON id
	 * @param callback Function that will be called if the JSON is loaded
	 */
	 JSON(id, callback){ fetch(id).then((response) => response.json()).then((json) => callback(json)) }
	
	/**
	 * Loads a text resource (if possible)
	 * @param id text_URL id
	 * @param callback Function that will be called if the text file is loaded
	 */
	TXT(id, callback){ fetch(id).then((response) => response.text()).then((txt) => callback(txt)) }
	
	/**
	 * Adds a link to the client from a cloud url
	 * @param url URLs of the link
	 * @param rel 
	 */
	link(url, rel){
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
	stylesheet(url){ this.link( url, "stylesheet" ) }
	
	/**
	 * Loads the given script (if possible)
	 * @param type Type of the script to be loaded
	 * @param url Script's url
	 * @param callback Function that will be called if the script is loaded
	 */
	script(type, url, callback){
		if( this.loaded[url] !== undefined ){
			callback()
			return
		}
		this.loaded[url] = true
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
	JS(id, callback){
		if( !id.endsWith('.js') ) id += '.js'
		this.script('text/javascript', id, callback) 
	}

	/**
	 * loads a resource from URI
	 * @param resource Id of the resource to be load from URI
	 * @param callback Function that will be called after the resource is read 
	 * from the server (it must has an argument that correspond to the resource that has been load)
	 */ 
	 load(resource, callback){
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
	 * Loads a CSS resource (if possible)
	 * @param id CSS id
	 * @param callback Function that will be called if the CSS is loaded
	 */
	CSS(id, callback){
	    var x = this
		function add(str){
		    if(str!==undefined && str!==null){ x.css(str) }
			if(callback !== undefined) callback()
		}
		this.load(id+'.css', add)
	}
}

/** Document utility functions */
class DOM{
	constructor(){}

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
	 * Creates a url from a http response
	 * @param response Response provided by the http connection
	 * @return A URL version of the provided response
	 */
	downloadURL( response ){ return URL.createObjectURL(new Blob([response], {type: 'application/octet-stream'})) }
	
	/**
	 * Resets the application
	 */
	reset(){ window.location.reload(true) }	

	/**
	 * Moves a component as child of another component
	 * @param element Id of the component to move 
	 * @param parent Id of the component that receives the component
	 */
	move(element, parent){ Konekti.vc(parent).appendChild(this.remove(element)) }

	/**
	 * Removes a component of the document
	 * @param element Id of the component to remove 
	 */
	remove(element){
		var e = Konekti.vc(element)
		if(e.parentElement !== undefined && e.parentElement!=null) e.parentElement.removeChild(e)
		return e
	}

	/**
	 * Appends an element as child of the <i>parent</i> component, if possible
	 * @param element Id of the element 
	 * @param parent Id of the parent element 
	 */
	append(element, parent){ Konekti.vc( parent ).appendChild( Konekti.vc( element ) ) }
	
	/**
	 * Inserts an element as previous brother of the component <i>sister</i> element, if possible
	 * @param element Id of the element
	 * @param sister Id of the sister element 
	 */
	insertBefore(element, sister){
		var e = this.remove(element)
		var s = Konekti.vc(sister)
		var p = s.parentElement
		if( p!==undefined && p!==null) p.insertBefore( e, s )
	}
		
	/**
	 * Sets an URL search parameter to a given value
	 * @param param Parameter's id
	 * @param value Value for the parameter 
	 */
	setURLSearchParam( param, value ){
		var urlParams = new URLSearchParams(window.location.search)
		urlParams.set(param, value)
		history.replaceState(null, null, "?"+urlParams.toString())
	}
	
	/**
	 * Gets an URL search parameter
	 * @param param Parameter's id
	 * @param default_value Default value for the parameter 
	 * @return Value of the URL search parameter
	 */
	getURLSearchParam( param, default_value ){
		var urlParams = new URLSearchParams(window.location.search)
		var value = urlParams.get(param)
		if( value === undefined || value === null ) value = default_value
		return value			
	}
	
	/**
	 * Gets the user language (given by the navigator or as URL search parameter
	 * @param general If removes language specific domain or not
	 * @return Users language
	 */
	getUserLanguage( general=true ){
		var urlParams = new URLSearchParams(window.location.search)
		var lang = urlParams.get('lang')
		if( lang === undefined || lang === null ) lang = window.navigator.language
		if( general ) lang = lang.split('-')[0]
		return lang
	}
}

/**
 * Konekti Application program interface. Main object of the Konekti framework
 */
var Konekti = null

/** Aplication program interface. Plugins will be seen as methods of this class */
class KonektiAPI{
	/**
	 * Inits the konekti framework
	 */
	constructor(){
		this.dom = new DOM(this)
		this.resource = new Resource()
		this.resource.stylesheet( 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' )
		this.resource.stylesheet( 'https://www.w3schools.com/w3css/4/w3.css' )

		Konekti = this
		this.url = 'https://jgomezpe.github.io/konekti/src/'
		function check(){ Konekti.manager = new Uses({}) }
		if(typeof uses === 'undefined') this.resource.JS('https://jgomezpe.github.io/uses/src/uses.js', check)
		else check()

		this.client = {}
		this.plugin = {}
		this.root = new RootClient()
		
		window.addEventListener("resize", Konekti.resize);
	}
    
	/**
	 * Determines all the required dependencies of an array of Konekti clients
	 * @param component Konekti components to load and build (bootstrap)
	 * @param plugs Colection of dependecies
	 */
	dependecies(component, plugs={}){
		function check(c){ return c !== undefined && c !== null && c.length > 0 }
		if(Array.isArray(component)) for(var i=0; i<component.length; i++) plugs = this.dependecies(component[i], plugs)
		else if( typeof component == 'object' && check(component.plugin)){
			if(plugs[component.plugin] === undefined && component.plugin != 'container') plugs[component.plugin] = component.plugin
			if(check(component.children)) plugs = this.dependecies(component.children, plugs)
			else if(check(component.setup)) plugs = this.dependecies(component.setup, plugs)
		}
		return plugs
	}

	/**
	 * Loads a set of plugins and executes the callback function
	 * @param plugins An array of plugin ids
	 * @param callback function to be executed after loading plugins
	 */
	load(plugins, callback=function(){}){ 
		for(var i=0; i<plugins.length; i++) plugins[i] = ((plugins[i].indexOf('/') < 0)?this.url:'')+plugins[i]+'.js'
		function check(){
			if(Konekti.manager === undefined) setTimeout(check,100)
			else Konekti.manager.set('konekti'+Math.random(), plugins, function(id){
					callback()
					Konekti.resize()
				})
		}
		check()
	}

	/**
	 * Loads all the required dependencies of an array of Konekti clients
	 * @param component Konekti components to load 
	 * @param callback Function called as soon as all dependecies are loaded
	 */
	load_dependecies(component, callback){
		var plugs = this.dependecies(component)
		var aplugs = []
		for( var c in plugs ){
			if(plugs[c]!='container'){
				var i=0
				while(i<aplugs.length && aplugs[i]!=plugs[c]) i++
				if(i==aplugs.length) aplugs.push(plugs[c])
			}	
		} 
		Konekti.load(aplugs,  callback)
	}

	/**
	 * 
	 * @param component Konekti components to build  
	 * @returns An array of Konekti clients 
	 */
	build( component ){
		if( Array.isArray(component) ){
			var plugs = []
			for( var i=0; i<component.length; i++ ) plugs.push(Konekti.build(component[i]))
			return plugs
		}else return Konekti[component.plugin](component)
	}

	/**
	 * Defines the set of plugins used by Konekti and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
	uses(){
		if( KonektiMain !== undefined ) Konekti.load(arguments, KonektiMain)
		else Konekti.load(arguments)
	}
	
	/**
	 * Appends a set of konekti component to a client
	 * @param parent Parent client of the components (any other argument is a component to build)
	 */
	append(parent){
		var p = Konekti.client[parent]
		for( var i=1; i<arguments.length; i++ ){
			arguments[i].parent = parent
			p.children.push(Konekti[arguments[i].plugin](arguments[i]))
		}
	}
		
	/**
	 * Resizes the window 
	 */
	resize(){ Konekti.root.setParentSize() }

	/**
	 * Gets a visual component by id 
	 * @param id Id of the visual component
	 * @returns Visual componet with the given id
	 */
	vc(id='KonektiMain'){ return (id=='KonektiMain')?document.body:document.getElementById(id) }

	/**
	 * Creates a container bject
	 * @param id Id of the component 
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param children Contained components
	 * @param parent Parent component
	 */
	container( id, width, height, children, parent='KonektiMain' ){ return new Container(id, width, height, children, parent) }
}

/** A Konekti client. */
class Client{
	/**
	 * Creates a client configuration object
	 * @param id Id of the component 
	 * @param parent Parent component
	 */
	setup( id, parent='KonektiMain' ){ return {'id':id, 'parent':parent} }

	/**	 
	 * Creates a konekti client using the configuration information	 
	 * @param id Id of the component 
	 * @param parent Parent component
	 */	
	constructor(id, parent='KonektiMain'){ 
		this.config = id	
		if(typeof id !== 'object') this.config = this.setup(...arguments)
		else{
			var parent = this.config.parent || 'KonektiMain'
			if(this.config.setup !== undefined) this.config = this.setup(...this.config.setup)
			this.config.parent = parent
		} 		
		this.id = this.config.id
		Konekti.client[this.id] = this
		
		this.parent = this.config.parent
		if(this.parent !== null && this.parent=='KonektiMain') Konekti.client['KonektiMain'].children.push(this)

		this.defHeight = this.config.height
		this.defWidth = this.config.width
		this.listener = []
		this.fitRect = false
		this.init_vc()
	}

	/**
	  * Associated html code
	  */
	html(){ return "" }  
 
	/**
	 * Initializes the visual component associated to the client
	 */
	init_vc(){ Konekti.vc(this.parent).appendChild(Konekti.resource.html(this.html())) }
	
	/**
	 * Gets the visual component associated to the client/subclient
	 * @param {*} subId Id of the subclient (the subclient id is a combination of the client id and this argument)
	 * @returns Visual component associated to the client/subclient
	 */
	vc(subId=''){ return Konekti.vc(this.id+subId) }

	/**
	 * Computes the size of a visual component dimension according to a parent's dimension
	 * @param {*} defSize Dimension definition (percentage, absolute or rest)
	 * @param {*} size Size of the parent's dimension
	 * @param {*} setWidth If setting the width (<i>true</i>) or the height (<i>false</i>)
	 * @returns Computed dimension
	 */
	size( defSize, size, setWidth ){
		var n = defSize.length-1
		if( defSize.charAt(n) == '%' ){
			var s = parseFloat(defSize.substring(0,n))
			return Math.round(s*size/100)
		}else if(defSize=='rest'){
			var h = 0
			var w = 0
			var p = Konekti.client[this.parent]
			for(var i=0; i<p.children.length; i++){
				if( p.children[i] != this ){
					var r = p.children[i].vc().getBoundingClientRect()
					h += r.height
					w += r.width
				}
			}
			if(setWidth) return size - w
			else return size - h
		}else return parseInt(defSize.substring(0,n-1))
	}
	
	/**
	 * Computes the size of the visual component associated to the client
	 * @param {*} parentWidth Parent's width
	 * @param {*} parentHeight Parent's height
	 */
	updateSize( parentWidth, parentHeight ){
		var c = this.vc()
		var r = c.getBoundingClientRect()
	
		if(this.defHeight !== undefined && this.defHeight !== null && this.defHeight != ''){ 
			this.height = this.size( this.defHeight, parentHeight, false )
			if( this.height > 0 ) c.style.height = this.height + 'px'
		}else if(this.fitRect) this.height = r.height		
		
		if(this.defWidth !== undefined && this.defWidth !== null && this.defWidth != ''){
			this.width = this.size( this.defWidth, parentWidth, true )
			if( this.width > 0 ) c.style.width = this.width + 'px'
		}else if(this.fitRect) this.width = r.width
	}
	
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){ this.updateSize( parentWidth, parentHeight ) }
	
	/**
	 * Adds listener to events of the client
	 * @param listener Listener of the event
	 */
	addListener(listener){ this.listener.push(listener) }

	/**
	 * Deletes listener to events of the client
	 * @param listener Listener of the event
	 */
	delListener(listener){
		var i=0
		while(i<this.listener.length && this.listener[i] !== listener) i++
		if( i<this.listener.length ) this.listener.splice(i,1)
	}
}

/** A Konekti client. */
class Container extends Client{
	/**
	 * Creates a client configuration object
	 * @param id Id of the component that will contain the ace editor
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param config Extra configuration 
	 * @param children Contained components
	 * @param parent Parent component
	 */
	setup( id, width, height, config, children, parent='KonektiMain' ){ 
		return {'plugin':'container', 'id':id, 'width':width, 'height':height, 'config':config, 'children':children, 'parent':parent} 
	}

	/**	 
	 * Creates a konekti client using the configuration information	 
	 * @param id Id of the component that will contain the ace editor
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param config Extra configuration 
	 * @param children Contained components
	 * @param parent Parent component
	 */	
	constructor( id, width, height, config, children=[], parent='KonektiMain' ){ 
		super(...arguments)
		var x = this
		if(x.config.children !== undefined && x.config.children !== null & x.config.children.length>0)
			Konekti.load_dependecies(x.config.children, function(){ x.setChildrenBack() })
		else x.children = []
	}

	setChildrenBack(){
		for(var i=0; i<this.config.children.length; i++) this.config.children[i] = this.init_child(this.config.children[i])
		this.children = Konekti.build(this.config.children)
	}

	/**
	 * Initializes a child component (usually to set the parent id of the child) 
	 * @param {*} child Child configuration
	 * @returns 
	 */
	init_child(child){ 
		child.parent = this.id 
		return child
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		var x = this
		super.setParentSize( parentWidth, parentHeight )
		function check(){
			if( x.children !== undefined && x.children !== null && x.children.length>0 )
				for( var i=0; i<x.children.length; i++ ) x.children[i].setParentSize(x.width,x.height)
			else setTimeout(check, 100)
		}
		check()
	}

	/**
	 * Associated html code
	 */
	html(){ return "<div id='"+this.id+"' " + (this.config.config||"") + "></div>" }

	/**
	 * Determines the child position 
	 * @param {*} id Id of the child
	 * @returns The child position or -1 if there is not such child
	 */
	 child_index(id){
		var i=0
		while(i<this.children.length && this.children[i].id != id) i++
		return i<this.children.length?i:-1
	}
}

/**
 * The Main client
 */
class RootClient extends Container{
	/**
	 * Creates the main client
	 * @param {*} ide Components defining the ide
	 */
	constructor(){ super('KonektiMain', '', '', '', [], null) }

	/**
	 * Initializes the visual component associated to the client
	 */
	init_vc(){}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){ super.setParentSize(window.innerWidth, window.innerHeight) } 

	/**
	 * Computes the size of the visual component associated to the client
	 * @param {*} parentWidth Parent's width
	 * @param {*} parentHeight Parent's height
	 */
	updateSize( parentWidth, parentHeight ){
		this.height = parentHeight
		this.width = parentWidth		
	}
}

class MainClient{ 
	constructor(id='client'){ 
		Konekti.client[id] = this 
		this.id = id
	} 
}

/**
 * An editor (text) manager
 */
class Editor extends Client{
	/**
	 * Creates an editor with the given id/client information, and registers it into the Konekti framework
	 */	
	constructor(){ super(...arguments) }

	/**
	 * Gets current text in the editor
	 * @return Current text in the editor
	 */
	getText(){ return null }

	/**
	 * Sets text in the editor
	 * @param text Text to set in the editor
	 */
	setText(txt){}

	/**
	 * Sets current position in the editor
	 * @param row Row for the cursor
	 * @param column Column for the cursor
	 */
	locateCursor(row, column){}

	/**
	 * Gets current position in the editor
	 * @return [row,column] for the cursor
	 */
	cursorLocation(){ return [0,0] }

	/**
	 * Highlights a row in the editor
	 * @param row Row to highlight
	 */
	highlight(row){}

	/**
	 * Gets current position in the editor (character count)
	 * @return Position of the cursor (character count)
	 */
	cursorIndex(){ return 0 }

	/**
	 * Sets current position in the editor (character count)
	 * @param pos Position of the cursor (character count)
	 */
	locateCursorIndex(pos){}

	/**
	 * Updates the position of the scroll associated to the editor
	 * @param pos New position for the scroll
	 */
	scrollTop(pos){
		if(typeof pos=='undefined') pos = this.gui.scrollHeight
		this.gui.scrollTop = pos
	}
}

/**
 * A media manager.
 */
class MediaClient extends Client{
	/**
	 * Creates a media client with the given id/client information, and registers it into the Konekti framework
	 */	
	constructor(){ super(...arguments) }

	/**
	 * Pauses the media component
	 */
	pause(){}

	/**
	 * Plays the media component
	 */
	play(){}

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){}
}

Konekti = new KonektiAPI()
