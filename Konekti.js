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
	JS(id, callback){ this.script('text/javascript', id+'.js', callback) }

}

/** Plugin class */
class PlugIn{
	/**
	 * Creates a plugin with the given <i>id</i>, and html template
	 * @param id Id of the plugin
	 */
	constructor(id, konekti){
		Konekti.plugins[id] = this
		this.child_style = ''
	}

	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new Client(thing) }

	/**
	 * Adds item's html to plugin's html
	 */
	addItemHTML(){
		if(this.completed === undefined ){
			this.completed = true
			this.htmlTemplate = this.htmlTemplate.replace('·item·',Konekti.plugin('item').htmlTemplate)
		}
	}

	/**
	 * Creates the HTML resource of an instance of the PlugIn. Uses the information provided for the instance <i>dictionary</i>
	 * @param thing Information of the instance of the PlugIn
	 * @return The HTML resource of an instance of the PlugIn.
	 */
	fillLayout(thing){ return Konekti.dom.fromTemplate( this.htmlTemplate, thing ) }

	/**
	 * Connects instance with html document
	 * @param thing Plugin instance information
	 */
	html(thing){
		var c = Konekti.vc( thing.id )
		if( c===null ){
			c = document.createElement('div')
			document.body.appendChild(c)
		}

		if( typeof this.replace === 'string' && this.replace == 'strict' ){
			var node = Konekti.resource.html(this.fillLayout(thing))
			c.parentElement.replaceChild(node, c)
		}else{ c.innerHTML = this.fillLayout(thing) }

		return c
	}

	/**
	 * Provides to a visual component the plugin's functionality 
	 * @param thing Plugin instance information
	 */
	connect(thing){
		thing.gui = this.html(thing)
		return this.client(thing)
	}

	/**
	 * Creates a config object from parameters
	 * @param id Id of Plugin
	 * @param arguments Plugin configuration parameters
	 */
	config(){ return {} }
}

/** Plugins Loader */
class PlugInLoader{
	/**
	 * Inits the Plugin loader
	 */
	constructor(){
		this.path = {
			"konekti":"https://numtseng.com/modules/konekti/plugin/",
			"local":"plugin/"
		}
	}

	/**
	 * Inits a plugin and executes the callback function
	 * @param plugin A plugin to load (string version or JSON version)
	 * @param callback function to be executed after initializing the plugin
	 */
	init(plugin, callback){
		if( typeof plugin === 'string' ) plugin = JSON.parse(plugin)
		var js = plugin.js
		var html = plugin.html || ''

		function done(){
			if( typeof js === 'string' ) eval(js)
			else new PlugIn(plugin.id)
			Konekti.plugin(plugin.id).htmlTemplate = html
			function loaded(){
				var ready = Konekti.plugin(plugin.id).ready
				if( ready !== undefined && !ready ) setTimeout(loaded,100)
				else if( callback !== null ) callback()
			}
			loaded()
		}
    
		if( typeof plugin.css === 'string' ) Konekti.resource.css(plugin.css) 
		if(plugin.uses !== undefined){ Konekti.load(...plugin.uses, done) }
		else done()
	}

	/**
	 * Loads a plugin/module and executes the callback function
	 * @param id plugin/module to load
	 * @param path Path for the plugin/module
	 * @param callback function to be executed after loading the plugin/module
	 * @param kpath Konekti Path of plugin/module
	 */
	process(id, path, callback=null, kpath=null){

		function css(obj, file){
			if(obj.css){
				Konekti.resource.load(file+'.css', function(css_code){
					obj.css = css_code
					if(callback!=null) callback(obj) 
				})
			}else{
				obj.css = ''
				if(callback!=null) callback(obj)
			}
		}

		function html(obj, file){
			if(obj.html){
				Konekti.resource.load(file+'.html', function(html_code){
					obj.html = html_code
					css(obj,file) 
				})
			}else{
				obj.html = ''
				css(obj,file)
			}
		}

		function js(obj, file){
			if(obj.js){
				Konekti.resource.load(file+'.js', function(js_code){
					obj.js = js_code
					html(obj,file) 
				})
			}else{
				obj.js = ''
				html(obj,file)
			}
		}

		function use(obj, file){
			if(obj.uses !== undefined && obj.uses !== null) Konekti.load(...obj.uses, function(){ js(obj,file) })
			else js(obj,file)
		}

		function konekti(obj){
			if(obj!==null) use(obj, kpath+id+'/'+id) 
			else Konekti.resource.JSON(path+id+'/'+id, function(obj){ use(obj,path+id+'/'+id) })
		}

		if( kpath !== null ) Konekti.resource.JSON(kpath+id+'/'+id, konekti)
		else konekti( null )
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

		function one(id, back){
			function init(obj){
				obj.id = id
				x.init(obj, back) 
			}

			if(Konekti.plugin(id) === undefined) x.process(id, x.path.local, init, x.path.konekti)
			else if(back!==null) back()
		
		}
		if(n>1){
			var i=0
			function step(){
				if( i<n ){
					var p = args[i]
					i++
					if(Konekti.plugin(p) === undefined ) one(p, step)
					else step()
				}else if( callback !== null ) callback()
			}
			step()
		}else one(args[0],callback)		
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
	 * Gets the previous font class to the given font class
	 * @param font Font class (w3-css font class size)
	 * @return The previous font class to the given one (w3-css font class size)
	 */
	previousFont( font ){
		if( font.includes('w3-small') ) return 'w3-tiny'
		if( font.includes('w3-medium') ) return 'w3-small'
		if( font.includes('w3-large') ) return 'w3-medium'
		if( font.includes('w3-xlarge') ) return 'w3-large'
		if( font.includes('w3-xxlarge') ) return 'w3-xlarge'
		if( font.includes('w3-xxxlarge') ) return 'w3-xxlarge'
		if( font.includes('w3-jumbo') ) return 'w3-xxxlarge'
		return font	
	}

	/**
	 * Gets the size of the given font class 
	 * @param font Font class (w3-css font class size)
	 * @return The size of the font class in px (w3-css font class size)
	 */
	fontSize( font ){
		if( font.includes('w3-tiny') ) return 10
		if( font.includes('w3-small') ) return 12
		if( font.includes('w3-medium') ) return 15
		if( font.includes('w3-large') ) return 18
		if( font.includes('w3-xlarge') ) return 24
		if( font.includes('w3-xxlarge') ) return 36
		if( font.includes('w3-xxxlarge') ) return 48
		if( font.includes('w3-jumbo') ) return 64
		return 15	
	}

	/**
	 * Create an item configurstion using just the caption/id
	 * @param id Id of the item to build
	 * @return An item configuration 
	 */
	item(id){ return {'id':id, 'caption':id, 'icon':''} }
	
	/** 
	 * Internationalization
	 * @param id Resource id/configuration
	 * @param callback function called after updating components
	 */
	i18n( id, callback ){
		var x = this
		if( typeof id ==='string' ) 
			Konekti.resource.JSON( id, function(obj){
			 x.update(obj) 
			 if(callback !== undefined) callback()
			} ) 
		else{
		 this.update(id)
		 if( callback !== undefined ) callback()
		} 
	}

	/**
	 * Sets a component's attribute to the given value 
	 * @param id Id of the component to change (or new configuration of the component)
	 * @param attribute Attribute to change 
	 * @param value New value for the component attribute
	 */
	update(id, attribute, value){
		if( typeof id === 'string' ){
			var c = Konekti.vc(id)
			if( c===undefined || c===null ) return  
			if( attribute == 'caption' ){
				var i = Konekti.vc(id+'-icon')
				if( i != null ) i.nextSibling.data = " "+value
				else c.textContent = value
			}else{ c[attribute] = value }
		}else{
			if( id.id === undefined ){
				for( var i=0; i<id.components.length; i++ )
					this.update(id.components[i])
			}else{
				var cl = Konekti.client(id.id)
				if( cl !== undefined && cl !== null ) cl.update(id)
			}
		}
	}

	/**
	 * Creates a url from a http response
	 * @param response Response provided by the http connection
	 * @return A URL version of the provided response
	 */
	downloadURL( response ){ return URL.createObjectURL(new Blob([response], {type: 'application/octet-stream'})) }
	
	/**
	 * Checks and stops process upto the visual components are rendered
	 * @param back Function to be executed after components are checked
	 * @param ... Id of the components to check
	 */
	check( back ){
		function verify(c){ return c!==undefined && c!==null }
		var x = arguments
		function done(){
			var i=1
			while( i<x.length && verify(Konekti.vc(x[i])) && verify(Konekti.client(x[i])) ) i++
			if( i<x.length ) setTimeout(done,100)
			else back()
		}
		done()
	}

	/**
	 * Resets the application
	 */
	reset(){ window.location.reload(true) }	


	/**
	 * Obtains the node with the given id (A shortcut of the <i>document.getElementById</i> method
	 * @param id Id of the element being located
	 * @return The node with the given id (A shortcut of the <i>document.getElementById</i> method
	 */
	vc(id){ return document.getElementById(id) }


	/**
	 * Creates a div HTML node with the given id
	 * @param id Id of the element being created
	 * @param class_style Style (class) of the div
	 * @return A div HTML node with the given id 
	 */
	div(id, class_style=''){ return Konekti.resource.html( "<div id='"+id+"' class='"+class_style+"'></div>") }
	
	/**
	 * Moves a component as child of another component
	 * @param id Id/node of the component to move 
	 * @param parent Id of the component that receives the component
	 */
	move(id, parent){
		var t = (typeof id==='string')?this.vc(id):id
		if( t!==null && t.parentElement !== null ) t.parentElement.removeChild(t)
		this.vc(parent).appendChild(t)
	}

	/**
	 * Removes a component of the document
	 * @param id Id of the component to remove 
	 */
	remove(id){
		var t = this.vc(id)
		t.parentElement.removeChild(t)
	}

	/**
	 * Provides a visual component a plugin functionality 
	 * @param id Visual component id
	 * @param plugin Plugin's id 
	 * @param thing Plugin instance information
	 */
	connect(id, plugin, thing){
		config.id = id
		return Konekti.plugin(plugin).connect(config)
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and appends it as child of the component
	 * in the document with the given id, if possible
	 * @param parent Id of the element in the document that will include the new node
	 * @param thing PlugIn information for creating the HTML element that will be appended as child in the 
	 * HTML element in the document with the given id
	 */
	append(parent, plugin, thing){
		var x = this
		function connect(){
			plugin = Konekti.plugin(plugin)
			x.vc( parent ).appendChild( x.div(thing.id, plugin.child_style) )
			return plugin.connect(thing)
		}
		if(Konekti.plugin(plugin) !== undefined) return connect()
		else Konekti.load(plugin, connect)
	}
	
	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and inserts it as previous brother of the component
	 * in the document with the given id <i>sister</i>, if possible
	 * @param sister Id of the element in the document that will be the next sister component of the new node
	 * @param thing PlugIn information for creating the HTML element that will be inserted as older (previous) brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	insertBefore(sister, plugin, thing){
		var x = this
		function connect(){
			plugin = Konekti.plugin(plugin) 
			var node = x.div( thing.id, plugin.child_style )
			var sisterNode = x.vc( sister )
			var parentNode = sisterNode.parentElement
			parentNode.insertBefore( node, sisterNode )
			return plugin.connect(thing)
		}
		if(Konekti.plugin(plugin) !== undefined) return connect()
		else Konekti.load(plugin, connect)
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
}

/**
 * Konekti Application program interface. Main object of the Konekti framework
 */
Konekti = null

/** Aplication program interface. Plugins will be seen as methods of this class */
class API{
	/**
	 * Inits the konekti framework
	 */
	constructor(){
		Konekti = this
		this.resource = new Resource()
		this.plugins = {}
		this.clients = {'console':console}
		this.loader = new PlugInLoader(this)
		this.dom = new DOM(this)
		
		this.resource.stylesheet( 'https://numtseng.com/modules/konekti/Konekti.css' )
		this.resource.stylesheet( 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' )
		this.resource.stylesheet( 'https://www.w3schools.com/w3css/4/w3.css' )
	}

	/**
	 * Determines the set of plugins required by a component
	 * @param thing component to analize
	 * @param plugins Array of plugins required by the component
	 * @return Array of plugins required by the components
	 */
	analize(thing, plugins=[]){
		if(thing===null || typeof thing === 'string' || typeof thing === 'number' || thing.byteLength !== undefined)
			return plugins
		if(thing.length!==undefined)
			for(var i=0; i<thing.length; i++)
				this.analize(thing[i], plugins)
		else{
			if( thing.plugin !== undefined ){
				var k=0;
				while(k<plugins.length && plugins[k]!==thing.plugin) k++
				if(k==plugins.length) plugins.push(thing.plugin)
			}
			for(var k in thing){
				this.analize(thing[k],plugins)
			}
		}
		return plugins
	}
	
	/**
	 * Loads a set of plugins and executes the callback function
	 * @param plugins An array of plugin ids
	 * @param callback function to be executed after loading plugins
	 */
	load(){ this.loader.load(...arguments) }	

	/**
	 * Defines the set of plugins that Konekti will use and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
	uses(){ 
		if(typeof arguments[arguments.length-1] === 'string' && KonektiMain !== undefined ) this.load(...arguments, KonektiMain) 
		else this.load(...arguments)
	}
	
	/** 
	 * Gets a client
	 * @param id Client's id
	 * @return The client with the given id, null if there is not client with the given id
	 */
	client(id){ return this.clients[id] } 

	/**
	 * Gets the component with the given id
	 * @param id Id of the component to get 
	 * @return the component with the given id
	 */
	vc(id){ return this.dom.vc(id) }

	/** 
	 * Internationalization
	 * @param id Resource id/configuration
	 * @param callback Function called after update components
	 */
	i18n( id, callback ){ this.dom.i18n(id,callback) }

	/**
	 * Gets the plugin with the given id
	 * @param id Id of the plugin to get 
	 * @return the plugin with the given id
	 */
	plugin(id){ return this.plugins[id] }
}

new API()

/**
 * A client for the application. Connection point between front and back
 */
class Client{
	/**
	 * Creates a client with the given id/client information, and registers it into the Konekti framework
	 * @param id Client id/client information
	 */	
	constructor(id='client'){
		if( typeof id == 'string' ) this.id = id
		else this.id = id.id
		this.gui = this.vc()
		this.listener = []
		Konekti.clients[this.id] = this
	}

	/**
	 * Sets a component's attribute to the given value 
	 * @param thing Component configuration 
	 */
	update(thing){ Konekti.dom.update( thing.id, thing.attribute, thing.value ) }

	/**
	 * Gets a visual component of submmodules of the client
	 * @param submodule Submoduel visual component id
	 */
	vc(submodule){
		if( typeof submodule == 'string' ) return Konekti.vc(this.id+submodule)
		else return Konekti.vc(this.id)
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


/** Konekti Plugin for items (icon/caption) */
class ItemPlugIn extends PlugIn{
	/**
	 * creates the item plugin
	 */
	constructor(){ 
		super('item') 
		this.htmlTemplate = "<i id='·id·-icon' class='·icon·'></i> ·caption·"
	}

	/**
	 * Creates the HTML resource of an instance of the PlugIn. Uses the information provided for the instance <i>dictionary</i>
	 * @param thing Information of the instance of the PlugIn
	 * @return The HTML resource of an instance of the PlugIn.
	 */
	fillLayout(thing){ 
		return Konekti.dom.fromTemplate( this.htmlTemplate, thing ) 
	}
	
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new Item(thing.id+'-icon') }

	/**
	 * Creates a config object from parameters
	 * @param id Id of the item
	 * @param icon Icon of the item
	 * @param caption Caption of the item
	 */
	config(id, icon='', caption='' ){ return {"id":id, "icon":icon, "caption":caption} }

}

new ItemPlugIn()

/**
 * An item (icon/caption) manager
 */
class Item extends Client{
	/**
	 * Creates an item client with the given id/information, and registers it into the Konekti framework
	 * @param id Item id
	 */	
	constructor(id){ super(id) }
	/**
	 * Sets a component's attribute to the given value 
	 * @param thing Item configuration
	 */
	update(thing){
		var c = this.vc()
		if( thing.caption !== undefined ) c.nextSibling.data = " "+thing.caption
		if( thing.icon !== undefined ) c.className = thing.icon
	}
}

/**
 * Creates a config object from parameters
 * @param id Id/config of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 */
Konekti.item = function(id, icon, caption){ 
	id = (typeof id === 'string' )?Konekti.plugins.items.config(id,icon,caption):id
	return Konekti.plugins.item.connect(id)
}

/**
 * An editor (text) manager
 */
class Editor extends Client{
	/**
	 * Creates an editor with the given id/client information, and registers it into the Konekti framework
	 * @param id Editor id/client information
	 */	
	constructor(id){ super(id) }

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
	 * @param id Media client id/client information
	 */	
	constructor(thing){ super(thing) }

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

/**
 * HyperMedia: A hypermedia component for Konekti (composed by a media component and several editor components).
 * When the media is played, the set of editors are updated accroding to thier associated scripts.
 */
class HyperMedia extends MediaClient{
	/**
	 * Creates a hyper media client with the given id/client information, and registers it into the Konekti framework
	 * @param thing Hyper media client information
	 */	
	constructor(thing){
		super(thing)
		this.scripts = thing.scripts || []
		this.media = thing.media
		Konekti.client(this.media).addListener(this.id)
	}
	
	/**
	 * Updates the hypermedia client
	 * @param thing Hyper media client information
	 * 
         */
	update(thing){
		this.scripts = thing.scripts || []
		this.media = thing.media
		Konekti.client(this.media).addListener(this.id)
	}
         
	/**
	 * Plays the media component
	 * @param id The media id 
	 */
	play(id){ if( id === undefined ) this.media.play() }

	/**
	 * Pauses the media component
	 * @param id The media id 
	 */
	pause(id){ if( id === undefined ) this.media.pause() }

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	locate(time){
		var scripts = this.scripts
		for( var i=0; i<scripts.length; i++ ){
			var script = scripts[i]
			var target = Konekti.client(script.target)
			if(target !== undefined){
				script.text =  script.text || target.getText()
				script.current = script.current || -1
				var k=script.mark.length-1
				while( k>=0 && script.mark[k].time>time ){ k-- }
				if(k!=script.current){
					var text;
					if(k>=0){
						if(script.mark[k].txt === undefined){
							var start = script.mark[k].start || 0
							var end = script.mark[k].end || script.text.length
							var add = script.mark[k].add || '' 
							text = script.text.substring(start,end) + add
						}else text = script.mark[k].txt
					}else text = script.text
					target.setText(text)
					if(k>=0) target.scrollTop()
					script.current = k
				}
			}
		}
	}

	/**
	 * Locates the media component at the given time
	 * @param id The media id 
	 * @param time Time position for the media component
	 */
	seek(id,time){
		if(typeof id === 'string') this.locate(time)
		else Konekti.client(this.media).seek(time)
	}
}
