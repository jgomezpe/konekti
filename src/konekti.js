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
		this.load(id, back) 
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
		var e = this.remove(element)
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
		this.root = new MainClient()
		this.path = "https://jgomezpe.github.io/konekti/src/"
		this.dom = new DOM(this)
		
		this.resource.stylesheet( 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' )
		this.resource.stylesheet( 'https://www.w3schools.com/w3css/4/w3.css' )
        
		//this.root = new MainClient(components)
		window.addEventListener("resize", Konekti.resize);
	}
    
	/**
	 * Resizes the window 
	 */
	resize(){ Konekti.root.setParentSize() }
    
	/**
	 * 
	 * @param components Konekti components to build  
	 * @returns An array of Konekti clients 
	 */
	build( components ){
		if( Array.isArray(components) ){
			var plugs = []
			for( var i=0; i<components.length; i++ ){
				plugs.push(this.plugins[components[i].plugin].client(components[i]))
			}	
			return plugs
		}else return this.plugins[components.plugin].client(components)
	}

	/**
	 * Appends a set of konekti component to a client
	 * @param parent Parent client of the components (any other argument is a component to build)
	 */
	append(parent){
		var n = arguments.length
		var p = Konekti.client[parent]
		for( var i=1; i<arguments.length; i++ ){
			arguments[i].parent = parent
			p.children.push(this.plugins[arguments[i].plugin].client(arguments[i]))
		}
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
			if( args[i].indexOf('https://') < 0 ) args[i] = this.path+args[i]
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
	
	/**
	 * Gets a visual component by id 
	 * @param id Id of the visual component
	 * @returns Visual componet with the given id
	 */
	vc(id){ return document.getElementById(id) }
}

/** A Konekti client. */
class Client{
	/**
	 * Creates a konekti client using the configuration information
	 * @param config Component information
	 */
	constructor( config ){ 
		if(typeof config == 'string') config = {'id':config}
		this.id = config.id
		this.fitRect = false
		this.parent = (this.id!='KonektiMain')?config.parent || 'KonektiMain':null
		if(this.parent=='KonektiMain') Konekti.client['KonektiMain'].children.push(this)
		Konekti.client[this.id] = this
		this.defHeight = config.height
		this.defWidth = config.width
		this.listener = []
		this.init_view(config)
		config.children = config.children || []
		for( var i=0; i<config.children.length; i++ ) config.children[i] = this.init_child(config.children[i], config)
		this.children = Konekti.build(config.children) 
	}

	/**
	 * Initializes the visual component associated to the client
	 * @param child Child to be initilized
	 * @param config Configuration of the client
	 */
	init_view(config){
		var element = ( this.parent == 'KonektiMain' )?document.body:Konekti.vc(this.parent);
		element.appendChild( Konekti.resource.html(this.html(config)))
	}

	/**
	 * Initializes a child component (usually to set the parent id of the child) 
	 * @param {*} child Child configuration
	 * @param {*} config Client configuration
	 * @returns 
	 */
	init_child(child, config){ 
		child.parent = this.id 
		return child
	}
	
	/**
	 * Determines the child position 
	 * @param {*} child_id Id of the child
	 * @returns The child position or -1 if there is not such child
	 */
	child_index(child_id){
		var i=0
		while(i<this.children.length && this.children[i].id != child_id) i++
		return i<this.children.length?i:-1
	}

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
		if( this.id != 'KonektiMain' ){

			var c = this.vc()
			var r = c.getBoundingClientRect()
		
			if(this.defHeight !== undefined && this.defHeight !== null && this.defHeight != ''){ 
				this.height = this.size( this.defHeight, parentHeight, false )
				if( this.height > 0 ) c.style.height = this.height + 'px'
			}else if(this.fitRect){
				this.height = r.height
			}			
			
			if(this.defWidth !== undefined && this.defWidth !== null && this.defWidth != ''){
				this.width = this.size( this.defWidth, parentWidth, true )
				if( this.width > 0 ) c.style.width = this.width + 'px'
			}else if(this.fitRect){ 
				this.width = r.width
			}	
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
		for( var i=0; i<this.children.length; i++ ) this.children[i].setParentSize(this.width,this.height)
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
 * The Main client
 */
class MainClient extends Client{
	/**
	 * Creates the main client
	 * @param {*} ide Components defining the ide
	 */
	constructor(ide){ super({'id':'KonektiMain', 'children':ide, 'width':'100%', 'height':'100%'}) }

	/**
	 * Gets the visual component associated to the client/subclient
	 * @param {*} subId Id of the subclient (the subclient id is a combination of the client id and this argument)
	 * @returns Visual component associated to the client/subclient
	 */
	vc(subId=''){
		if(subId=='') return document.body
		else return Konekti.vc(subId) 
	}

	/**
	 * Initializes the visual component associated to the client
	 * @param config Configuration of the client
	 */
	 init_view(config){}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	 setParentSize( parentWidth, parentHeight ){ super.setParentSize(window.innerWidth, window.innerHeight) } 
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
	getText(){ return this.vc().innerHTML }

	/**
	 * Sets html code for the div component
	 * @param txt Html code to set in the div component
	 */
	setText(txt){ this.vc().innerHTML = txt }	  
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
new DivPlugIn()

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
Konekti.divConfig = function( id, width, height, config, inner, parent='KonektiMain' ){
	config = config || ''
	if(typeof inner == 'string') return {'plugin':'div', 'id':id, 'width':width,'height':height, 'config':config, 'inner':inner, 'parent':parent}
	else if(Array.isArray(inner)) return {'plugin':'div', 'id':id, 'width':width,'height':height, 'config':config, 'children':inner, 'parent':parent}
	else return {'plugin':'div', 'id':id, 'width':width,'height':height, 'config':config, 'children':[inner], 'parent':parent}
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
 */
Konekti.div = function( id, width, height, config, inner, parent ){
	return Konekti.build(Konekti.divConfig(id, width, height, config, inner))
}

/** Konekti Plugin for items (icon/caption) */
class ItemPlugIn extends PlugIn{
	/**
	 * creates the item plugin
	 */
	constructor(){ super('item') }

	/**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client(config){ return new Item(config) }
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
	
	/**
	 * Sets a component's attribute to the given value 
	 * @param config Item configuration
	 */
	update(config){
		var c = this.vc()
		if( config.caption !== undefined ) c.innerHTML = " "+config.caption
		if( config.icon !== undefined ) c.className = 'fa '+config.icon
	}
}

/**
 * Intem configuration object
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 * @param parent Parent component
 */
Konekti.itemConfig = function(id, icon, caption, parent='KonektiMain'){ 
	return {'plugin':'item', 'id':id, 'icon':icon, 'caption':caption, 'parent':parent }
}
/**
 * Creates an item
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 */
Konekti.item = function(id, icon, caption){ 
	return Konekti.build(Konekti.itemConfig(id, icon, caption))
}
