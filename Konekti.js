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
class KonektiResource{
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
class KonektiPlugIn{
	/**
	 * Creates a plugin with the given <i>id</i>, and html template
	 * @param id Id of the plugin
	 */
	constructor(id){
		this.core = Konekti.core
		this.core.plugin[id] = this
		this.child_style = ''
	}

	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new KonektiClient(thing) }
	
	/**
	 * Adds item's html to plugin's html
	 */
	addItemHTML(){
		if(this.completed === undefined ){
			this.completed = true
			this.htmlTemplate = this.htmlTemplate.replace('·item·',Konekti.plugin.item.htmlTemplate)
		}
	}

	/**
	 * Creates the HTML resource of an instance of the PlugIn. Uses the information provided for the instance <i>dictionary</i>
	 * @param thing Information of the instance of the PlugIn
	 * @return The HTML resource of an instance of the PlugIn.
	 */
	fillLayout(thing){ return this.core.fromTemplate( this.htmlTemplate, thing ) }

	/**
	 * Connects instance with html document
	 * @param thing Plugin instance information
	 */
	html(thing){
		var c = this.core.vc( thing.id )
		if( c!==null ){
			if( typeof this.replace == 'string' && this.replace == 'strict' ){
				var node = this.core.resource.html(this.fillLayout(thing))
				c.parentElement.replaceChild(node, c)
			}else{ c.innerHTML = this.fillLayout(thing) }
		}
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
}

/** Konekti Plugin for items (icon/caption) */
class ItemPlugIn extends KonektiPlugIn{
	/**
	 * creates the item plugin
	 */
	constructor(){ 
		super('item') 
		this.htmlTemplate = "<i id='·id·-icon' class='·icon·'></i> ·caption·"
	}

	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new Item(thing.id+'-icon') }
}

/** Core method for Konekti */
class KonektiCore{
	/**
	 * Inits the konekti framework
	 * @param callback Function that will be called after initializing the konekti framework
	 * @param servlet Servlet that will be used by the Konekti server. If servlet==null a simple server is initialized
	 */
	constructor(){
		this.resource = new KonektiResource()
		this.plugin = {}
		this.client = {'console':console}
		this.konektiPluginPath = "https://konekti.numtseng.com/src/plugin/"
		this.pluginPath = "plugin/"
		this.konektiModulePath = "https://konekti.numtseng.com/src/module/"
		this.modulePath = "module/"
		this.resource.stylesheet( 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' )
		this.resource.stylesheet( 'https://www.w3schools.com/w3css/4/w3.css' )
	}

	/**
	 * Inits a plugin and executes the callback function
	 * @param plugin A plugin to load (string version or JSON version)
	 * @param callback function to be executed after initializing the plugin
	 */
	init(plugin, callback){
		if( typeof plugin === 'string' ) plugin = JSON.parse(plugin)
		var x = this
		var js = plugin.js
		var html = plugin.html || ''

		function done(){
			if( typeof js === 'string' ) eval(js)
			else new KonektiPlugIn(plugin.id, x)
			x.plugin[plugin.id].htmlTemplate = html
			if( callback !== null ) callback()
		}
    
		if( typeof plugin.css === 'string' ) x.resource.css(plugin.css) 
		if( typeof plugin.uses !== 'undefined' ){ x.load(...plugin.uses, done) }
		else done()
	}

	/**
	 * Loads a set of plugins and executes the callback function
	 * @param plugins An array of plugin ids
	 * @param callback function to be executed after loading plugins
	 */
	load(){
		var x = this
		var n = arguments.length-1
		var args = arguments
		var callback = n>0?args[n]:null
		if(n<=1){
			var id = args[0]

			function init(obj){
				obj.id = id
				x.init(obj, callback) 
			}

			function next(js_code, path){
				js_code = js_code!==null?js_code:''
				x.resource.load(path+id+'/'+id+'.html', 
					function(html_code){
						html_code = html_code!==null?html_code:''
						x.resource.load(path+id+'/'+id+'.css', function(css_code){
							css_code = css_code!==null?css_code:''
							init({"js":js_code,"html":html_code,"css":css_code})
						})
					})
			}

			function konekti(js_code){
				if(js_code!==null){ next(js_code, x.konektiPluginPath) }
				else{ x.resource.load(x.pluginPath+id+'/'+id+'.js', function(js_code){ next(js_code,x.pluginPath) }) }
			}

			if( this.plugin[id] === undefined) this.resource.load(this.konektiPluginPath+id+'/'+id+'.js', konekti)
		}else{
			var i=0
			function step(){
				if( i<n ){
					var p = args[i]
					i++
					if( typeof x.plugin[p] === 'undefined' ) x.load(p, step)
					else step()
				}else if( callback !== null ) callback()
			}
			step()
		}		
	}

	/**
	 * Sets a module into a container and executes the callback function
	 * @param container Id of the module's container
	 * @param module A module to load (string version or JSON version)
	 * @param callback function to be executed after initializing the plugin
	 */
	set(container, module, callback){
		if( typeof module === 'string' ) module = JSON.parse(module)
		if( typeof module.css === 'string' ) x.resource.css(module.css)
		container = this.vc(container)
		container.innerHTML = module.html || ''
		if( typeof module.js === 'string' ) eval(module.js)
		if( callback !== undefined ) callback()
	}

	/**
	 * Loads a module and executes the callback function
	 * @param container Id of the module's container
	 * @param module_id Id of the module to load
	 * @param callback function to be executed after loading the module
	 */
	module(container, module_id, callback){
		var id = module_id
		var x=this

		function init(obj){ x.set(container, obj, callback) }

		function next(js_code, path){
			js_code = js_code!==null?js_code:''
			x.resource.load(path+id+'/'+id+'.html', 
				function(html_code){
					html_code = html_code!==null?html_code:''
					x.resource.load(path+id+'/'+id+'.css', function(css_code){
						css_code = css_code!==null?css_code:''
						init({"js":js_code,"html":html_code,"css":css_code})
					})
				})
		}

		function konekti(js_code){
			if(js_code!==null){ next(js_code, x.konektiModulePath) }
			else{ x.resource.load(x.modulePath+id+'/'+id+'.js', function(js_code){ next(js_code,x.modulePath) }) }
		}

		this.resource.load(this.konektiModulePath+id+'/'+id+'.js', konekti)
	}

	/**
	 * Defines the set of plugins that Konekti will use and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
	uses(){ 
	    if( KonektiMain !== undefined ) this.load(...arguments, KonektiMain) 
	    else this.load(...arguments)
	}

	/**
	 * Resets the application
	 */
	reset(){ window.location.reload(true) }	

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
	div(id, class_style=''){ return this.resource.html( "<div id='"+id+"' class='"+class_style+"'></div>") }
	
	/**
	 * Moves a component as child of another component
	 * @param id Id of the component to move 
	 * @param parent Id of the component that receives the component
	 */
	move(id, parent){
		var t = this.vc(id)
		t.parentElement.removeChild(t)
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
		return this.plugin[plugin].connect(config)
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and appends it as child of the component
	 * in the document with the given id, if possible
	 * @param parent Id of the element in the document that will include the new node
	 * @param thing PlugIn information for creating the HTML element that will be appended as child in the 
	 * HTML element in the document with the given id
	 */
	append(parent, plugin, thing){
		plugin = this.plugin[plugin] 
		this.vc( parent ).appendChild( this.div(thing.id, plugin.child_style) )
		return plugin.connect(thing)
	}
	
	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and inserts it as previous brother of the component
	 * in the document with the given id <i>sister</i>, if possible
	 * @param sister Id of the element in the document that will be the younger (next) sister of the new node
	 * @param thing PlugIn information for creating the HTML element that will be inserted as older (previous) brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	insertBefore(sister, plugin, thing){
		plugin = this.plugin[plugin] 
		var node = this.div( thing.id, plugin.child_style )
		var sisterNode = this.vc( sister )
		var parentNode = sisterNode.parentElement
		parentNode.insertBefore( node, sisterNode )
		return plugin.connect(thing)
	}

	/** 
	 * Internationalization
	 * @param id Resource id/configuration
	 */
	i18n( id ){
		var x = this
		if( typeof id ==='string' ) this.resource.JSON( id, function(obj){ x.update(obj) } ) 
		else this.update(id)
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
			}else Konekti.client(id.id).update(id)
		}
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
	 * Creates a url from a http response
	 * @param response Response provided by the http connection
	 * @return A URL version of the provided response
	 */
	downloadURL( response ){ return URL.createObjectURL(new Blob([response], {type: 'application/octet-stream'})) }
}

/** Aplication program interface. Plugins will be seen as methods of this class */
class KonektiAPI{
	/**
	 * Creates a Konekti API
	 */
	constructor(){
		this.core = new KonektiCore(this)
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
	 * Gets the component with the given id
	 * @param id Id of the component to get 
	 * @return the component with the given id
	 */
	vc(id){ return this.core.vc(id) }

	/** 
	 * Internationalization
	 * @param id Resource id/configuration
	 */
	i18n( id ){ this.core.i18n(id) }

	/**
	 * Gets the plugin with the given id
	 * @param id Id of the plugin to get 
	 * @return the plugin with the given id
	 */
	plugin(id){ return this.plugin[id] }
}

/**
 * Konekti Application program interface. Main object of the Konekti framework
 */
Konekti = new KonektiAPI()
new ItemPlugIn()

/**
 * A client for the application. Connection point between front and back
 */
class KonektiClient{
	/**
	 * Creates a client with the given id/client information, and registers it into the Konekti framework
	 * @param id Client id/client information
	 */	
	constructor(id='client'){
		if( typeof id == 'string' ) this.id = id
		else this.id = id.id
		this.gui = this.vc()
		this.listener = []
		Konekti.core.client[this.id] = this
	}

	/**
	 * Sets a component's attribute to the given value 
	 * @param thing Component configuration 
	 */
	update(thing){ Konekti.core.update( thing.id, thing.attribute, thing.value ) }

	/**
	 * Gets a visual component of submmodules of the client
	 * @param submodule Submoduel visual component id
	 */
	vc(submodule){
		if( typeof submodule == 'string' ) return Konekti.core.vc(this.id+submodule)
		else return Konekti.core.vc(this.id)
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
 * An item (icon/caption) manager
 */
class Item extends KonektiClient{
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
 * An editor (text) manager
 */
class KonektiEditor extends KonektiClient{
	/**
	 * Creates a client with the given id/client information, and registers it into the Konekti framework
	 * @param id Client id/client information
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
class KonektiMedia extends KonektiClient{
	constructor(thing){
		super(thing)
		this.client = Konekti.client(thing.client) || null
	}

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
