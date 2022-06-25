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
	 * Loads a JSON resource (if possible)
	 * @param id JSON id
	 * @param callback Function that will be called if the JSON was loaded
	 */
	JSON(id, callback){
		function back(json){ if(callback !== undefined) callback((json!=null)?JSON.parse(json):null) }
		this.load(id+'.json', back) 
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
}

/** Document utility functions */
class DOM{
	constructor(){}

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
	move(element, parent){
		var e = this.remove(element)
		Konekti.vc(parent).appendChild(e)
	}

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
	append(element, parent){
		Konekti.vc( parent ).appendChild( Konekti.vc( element ) )
	}
	
	/**
	 * Inserts an element as previous brother of the component <i>sister</i> element, if possible
	 * @param element Id of the element
	 * @param sister Id of the sister element 
	 */
	insertBefore(element, sister){
		var e = remove(element)
		var s = Konekti.vc(sister)
		var p = s.parentElement
		if( p!==undefined && p!==null) p.insertBefore( e, s )
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
		Konekti = this
		this.client = {}
		this.resource = new Resource()
		this.plugins = {}
		this.loading = 0
		this.root = new Client()
		//this.loader = new PlugInLoader(this)
		this.dom = new DOM(this)
		
		this.resource.stylesheet( 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' )
		this.resource.stylesheet( 'https://www.w3schools.com/w3css/4/w3.css' )
        
		//this.root = new MainClient(components)
		window.addEventListener("resize", Konekti.resize);
	}
    
	resize(){ Konekti.root.setParentSize(window.innerWidth, window.innerHeight) }
    
	build( components ){
		if( Array.isArray(components) ){
			var plugs = {}
			for( var i=0; i<components.length; i++ )
				plugs[components[i].id] = this.plugins[components[i].plugin].client(components[i])
			return plugs
		}else return this.plugins[components.plugin].client(components)
	}
		
	/**
	 * Loads a set of plugins and executes the callback function
	 * @param plugins An array of plugin ids
	 * @param callback function to be executed after loading plugins
	 */
	load(){ 
		var x = this
		var n = arguments.length
		var args = arguments
		var callback = null
		if(n>0 && typeof args[n-1] !== 'string'){
			n--
			callback = args[n]
		}
		
		x.loading += n
		
		function plugin_back(){
			x.loading--
			if(x.loading==0 && callback!=null) callback()
		}
		
		for( var i=0; i<n; i++ ){
			if( args[i].indexOf('https://') < 0 ) args[i] = 'https://numtseng.com/modules/konekti/'+args[i]
			this.resource.JS(args[i],plugin_back)
		}	
	}	

	/**
	 * Defines the set of plugins used by Konekti and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
	uses(){ 
		if(typeof arguments[arguments.length-1] === 'string' && KonektiMain !== undefined ) 
			this.load(...arguments, function(){ 
					KonektiMain()
					Konekti.root.setParentSize(window.innerWidth, window.innerHeight)
				}
			) 
		else this.load(...arguments)
	}
	
	vc(id){ return document.getElementById(id) }
}

class Client{
	constructor( config = {'id':'KonektiMain'} ){ 
		this.id = config.id || 'KonektiMain'
		Konekti.client[this.id] = this
		this.defHeight = config.height
		this.defWidth = config.width
		this.fixedSize = false 
		this.listener = []
		this.parent = config.parent || 'KonektiMain'
		this.children = {}
		if( this.id != 'KonektiMain' ){
			var element = ( this.parent == 'KonektiMain' )?document.body:Konekti.vc(this.parent);
			element.appendChild( Konekti.resource.html(this.html(config)))
			if(Konekti.client[this.parent]!==undefined) Konekti.client[this.parent].children[this.id] = this
		}
		config.children = config.children || []
		for( var i=0; i<config.children.length; i++ ) config.children[i] = this.init_child(config.children[i], config)
		this.children = Konekti.build(config.children) 
	}
	
	init_child(child, config){ 
		child.parent = child.parent || this.id 
		return child
	}
	
	vc(subId=''){ return Konekti.vc(this.id+subId) }

	size( defSize, size ){
		var n = defSize.length-1
		if( defSize.charAt(n) == '%' ){
			var s = parseFloat(defSize.substring(0,n))
			return Math.round(s*size/100)
		}else return parseInt(defSize.substring(0,n-1))
	}
	
	updateSize( parentWidth, parentHeight ){
		if( this.id != 'KonektiMain' ){
			var c = this.vc()
			//if(c.style.display !== 'none'){
				var r = c.getBoundingClientRect()
			
				if(this.defHeight === undefined || this.defHeight === null || this.defHeight == '') this.height = r.height
				else{
					this.height = this.size( this.defHeight, parentHeight )
					c.style.height = this.height + 'px'
				}
				
				if(this.defWidth === undefined || this.defWidth === null || this.defWidth == '') this.width = r.width
				else{
					this.width = this.size( this.defWidth, parentWidth )
					c.style.width = this.width + 'px'
				}
			//}
		}else{
			this.height = parentHeight
			this.width = parentWidth
		}
	}
	
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.updateSize( parentWidth, parentHeight )
		for( var c in this.children ) this.children[c].setParentSize(this.width,this.height)
	} 
	
	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ 
		config.config = config.config || ''
		config.inner = config.inner || ''
		return "<div id='"+this.id+"' "+config.config+">"+config.inner+"</div>" 
	}  
	 	
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

/**
 * An editor (text) manager
 */
class Editor extends Client{
	/**
	 * Creates an editor with the given id/client information, and registers it into the Konekti framework
	 * @param config Editor configuration
	 */	
	constructor(config){ super(config) }

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
	 * @param config Media configuration
	 */	
	constructor(config){ super(config) }

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

/** Plugin class */
class PlugIn{
	/**
	 * Creates a plugin with the given <i>id</i>
	 * @param id Id of the plugin
	 */
	constructor( id ){ 
		if(Konekti != null) Konekti.plugins[id] = this 
		this.id = id
 	}
  
	/**
	 * Creates a client for the plugin
	 * @param config Client configuration
	 */
	client( config ){ return new Client(config) }    
}

Konekti = new KonektiAPI()

// **** New PlugIns can be added inline as follows or using the Konekti.uses method **** //

/** Konekti Div Client */
class DivClient extends Editor{
	/** 
	 * Creates a Div client
	 * @param config Div configuration
	 */
	constructor( config ){ super(config) }
	
	/**
	 * Gets current html code in the div component
	 * @return Current html code in the div component
	 */
	getText(){ return this.gui.innerHTML }

	/**
	 * Sets html code for the div component
	 * @param txt Html code to set in the div component
	 */
	setText(txt){ this.gui.innerHTML = txt }	  
}

/** Konekti Div PlugIn */
class DivPlugIn extends PlugIn{
	/** Creates a Plugin for div components */
	constructor(){ super('div') }
    
  /**
   * Gets a client for a div component
   * @param config Div configuration
   */  
	client( config ){ return new DivClient(config) }    
}

/** DivPanel class */
if(Konekti.div===undefined) new DivPlugIn()

/**
 * Div configuration object
 * @method
 * divConfig
 * @param id Id of the div component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param config Configuration of the div's component (html code: that uses character ' as delimiter)
 * @param inner Inner html code of the div's component (html code: that uses character ' as delimiter)
 * @param parent Parent component
 */
Konekti.divConfig = function( id, width, height, config, inner, parent ){
	return {'plugin':'div', 'id':id, 'width':width,'height':height, 'config':config, 'inner':inner, 'parent':parent}
}

/**
 * Associates/adds Div panel
 * @method
 * div
 * @param id Id of the div component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param config Configuration of the div's component (html code: that uses character ' as delimiter)
 * @param inner Inner html code of the div's component (html code: that uses character ' as delimiter)
 * @param parent Parent component
 */
Konekti.div = function( id, width, height, config, inner, parent ){
	return Konekti.build(Konekti.divConfig(id, width, height, config, inner, parent))
}

/** Konekti Plugin for items (icon/caption) */
class ItemPlugIn extends PlugIn{
	/**
	 * creates the item plugin
	 */
	constructor(){ super('item') }

	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new Item(thing) }
}

new ItemPlugIn()

/**
 * An item (icon/caption) manager
 */
class Item extends Client{
	/**
	 * Creates an item client with the given id/information, and registers it into the Konekti framework
	 * @param config Item configuration
	 */	
	constructor(config){ super(config) }

	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ return "<i id='"+this.id+"' class='fa "+config.icon+"'> "+config.caption+"</i>" }   
}

/**
 * Intem configuration object
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 * @param parent Parent component
 */
Konekti.itemConfig = function(id, icon, caption, parent){ 
	return {'plugin':'item', 'id':id, 'icon':icon, 'caption':caption, 'parent':parent }
}
/**
 * Creates an item
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 * @param parent Parent component
 */
Konekti.item = function(id, icon, caption, parent){ 
	return Konekti.build(Konekti.itemConfig(id, icon, caption, parent))
}
