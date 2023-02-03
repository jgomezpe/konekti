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
	constructor(){}

	/**
	 * Loads the given script (if possible)
	 * @param type Type of the script to be loaded
	 * @param src Script's src
	 * @param callback Function that will be called if the script is loaded
	 */
	script(type, src, callback){
		if( this[src]===undefined){
			this[src] = true
			var element = document.createElement( 'script' )
			if( type!=null ) element.type = type
			element.async = true
			element.defer = true
			element.src = src 
			element.onreadystatechange = null	
			element.onload = callback
			var b = document.getElementsByTagName('script')[0]
			b.parentNode.insertBefore(element, b)
		}else callback()
	}

	/**
	 * Loads a Java Script resource (if possible)
	 * @param src Java Script src
	 * @param callback Function that will be called if the Java Script is loaded
	 */
	JS(src, callback){ this.script('text/javascript', src, callback) }


	/**
	 * Loads a JSON resource (if possible)
	 * @param id JSON id
	 * @param callback Function that will be called if the JSON is loaded
	 */
	JSON(id, callback){ fetch(id).then((response) => { return response.ok?response.json():null; }).then((json) => callback(json)) }
	
	/**
	 * Loads a text resource (if possible)
	 * @param id text_URL id
	 * @param callback Function that will be called if the text file is loaded
	 */
	TXT(id, callback){ fetch(id).then((response) => { return response.ok?response.text():null; }).then((txt) => callback(txt)) }
	
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
}

/** Document utility functions */
class DOM{
	constructor(){}

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
	 * Creates a string for onclick
	 * @param id Visual component programming the onclick method
	 * @param run Code associated to the onclick method
	 */
	onclick(id, run){
		if( typeof run == 'string' ) return run
		if( typeof run == 'function' ) return run.name + '("' + id + '")'
		var client = (run.client !== undefined)?'Konekti.client["'+run.client+'"].':''
		var method = run.method || id
		return client+method+'("'+id+'")'
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

	fontsizeclass( cl ){
		if(cl.includes('w3-tiny')) return 10
		if(cl.includes('w3-small')) return 12
		if(cl.includes('w3-medium')) return 18
		if(cl.includes('w3-xlarge')) return 24
		if(cl.includes('w3-xxlarge')) return 34
		if(cl.includes('w3-xxxlarge')) return 48
		if(cl.includes('w3-jumbo')) return 64
		return null
	}

	fontsizestyle( style ){
		var i = style.indexOf('font-size')
		if(i>=0){
			style = style.substring(i)
			var i = style.indexOf('px')
			return parseInt(style.substring(0,i))
		}
		return null
	}

	fontsize(element_id){
		return parseFloat(window.getComputedStyle(Konekti.vc(element_id), null).getPropertyValue('font-size'))
	}
}

/** A Konekti client. */
class Client{
	/**
	 * Assigns attributes in JSON configuration object to the client
	 * @param {*} config JSON configuration object
	 */
	assign( config ){ for( var x in config ) this[x] = config[x] }

	/**
	 * Creates a client using the JSON configuration object
	 * @param {*} config JSON configuration object
	 */
	constructor( config ){
		var x = this
		x.assign(config)
		x.queue = []
		Konekti.client[x.id] = x
		if(x.parent!=''){
			var p = Konekti.vc(x.parent)
			var cl = x.config.style
			if(cl!==undefined && cl!==null && cl.includes('fit')){
				var type = 'height'
				if(cl.includes('height:fit;')){
					x.config.style = cl.replace('height:fit;', '')
					x.config.class = (x.config.class || '') + ' konektifillrest '
					type = 'height'
				}else{
					if(cl.includes('width:fit;')){
						x.config.style = cl.replace('width:fit;', '')
						x.config.class = (x.config.class || '') + ' konektifillrest '
						type = 'width'
					}	
				} 
				
				var c = Konekti.client[x.parent]
				Konekti.deamon( 
					function(){	return (c!== undefined && c!==null) },
					function(){ c.startResizeObserver(type) }
				)

			}
			p.appendChild(Konekti.dom.html(this.html()))
		}	
		var children = this.children
		this.children=[]
		for(var i=0; i<children.length; i++) 
			this.children[i] = Konekti.build(children[i])
	}

	/**
	 * Adds a component to the client
	 * @param {*} component Component to add 
	 * @param {*} callback Function called when the component may be successfully added
	 */
	add( component, callback ){
		var x = this
		x.queue.push(component.id || component.setup[1])
		Konekti.plugin.setup(component, function(expanded){
			Konekti.deamon(function(){ return expanded.id == x.queue[0] }, function(){
				x.children.push(Konekti.build(expanded))
				x.queue.splice(0,1)
				if(callback !== undefined) callback(expanded)
			})
		})
	}

	/**
	  * Associated html code
	  */
	html(){
		this.inner = this.inner || ''
		var ctag = '</'+this.config.tag+'>'
		switch(this.config.tag){
			case 'img':
				ctag = ''
			break;
		}
		var code = "<"+this.config.tag + " id='" + this.id + "' "
		for(var x in this.config)
			if( x!=='tag' && x!=='extra') code += x + "='" + this.config[x] + "' "
		code += (this.config.extra||'')+">" + this.inner + ctag
		return code
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

	/**
	 * Gets the visual component associated to the client/subclient
	 * @param {*} subId Id of the subclient (the subclient id is a combination of the client id and this argument)
	 * @returns Visual component associated to the client/subclient
	 */
	vc(subId=''){ return Konekti.vc(this.id+subId) }

	startResizeObserver( type='height' ){
		var x = this
		if(x.ro == undefined || x.ro == null){
			x.ro = new ResizeObserver(entry => {
				entry = entry[0]
				var y = x.vc()
				var r = y.getBoundingClientRect()
				var h = r.height
				var w = r.width
				var c = 0
				var v = 0
				for (const child of y.children) {
					if(child.className.includes('konektifillrest')) c++
					else 
						if(type=='height') v += child.offsetHeight
						else v += child.offsetWidth
				}
				if(c>0){
					if(type=='height') v = (h-v)/c
					else v = (w-v)/c
					for (const child of y.children) {
						if(child.className.includes('konektifillrest'))
							if(type=='height') child.style.height = v+'px'
							else child.style.width = v+'px'
					}
				}
			});
						 
			// Resize observer
			x.ro.observe(x.vc())
		}	
	}
}

/** A Konekti plugin. */
class PlugIn{
	/**
	 * Creates a plugin
	 * @param {*} id PlugIn's id
	 */
	constructor(id){
		this.id = id
		Konekti.plugin[id] = this
	}

	/**
	 * Creates a client configuration object
	 * @param parent Parent component
	 * @param plugin Id of the component 
	 * @param id Id of the component 
	 * @param children Inner components or pure html code
	 * @param config Extra configuration 
	 */
	setup( parent, id, children = '', config={}  ){
		var inner =''
		if(typeof children == 'string'){
			inner = children
			children = []
		}else if(!Array.isArray(children)) children = [children]
		for(var i=0; i<children.length; i++)
			if(children[i].setup !== undefined) children[i].setup.splice(0,0,id)
			
		config.tag = config.tag || 'div'
		return {'plugin':this.id, 'id':id, 'parent':parent, 'inner':inner, 'children':children, 'config': config, 
		'listener':[] } 
	}

	client( config ){ return new Client(config) }
}

/** Konekti plugin's manager. Loads plugins as required and connect clients with plugins */
class PlugInManager{
	/**
	 * Inits the konekti framework
	 */
	constructor( konekti ){
		this.konekti = konekti
		this.url = 'https://jgomezpe.github.io/konekti/src/'
	}
    
	/**
	 * Determines all the required dependencies of an array of Konekti clients
	 * @param component Konekti components to load and build (bootstrap)
	 * @param plugs Colection of dependecies
	 */
	dependencies(component, plugs={}){
		if(component===undefined || component===null) return plugs
		function check(c){ return c !== undefined && c !== null && c.length > 0 }
		if(Array.isArray(component)) for(var i=0; i<component.length; i++) plugs = this.dependencies(component[i], plugs)
		else if( typeof component == 'object' && check(component.plugin)){
			if(plugs[component.plugin] === undefined && this[component.plugin] === undefined) plugs[component.plugin] = component.plugin
			if(check(component.children)) plugs = this.dependencies(component.children, plugs)
			else if(check(component.setup)) plugs = this.dependencies(component.setup, plugs)
		}
		return plugs
	}

	/**
	 * Determines if there is a component or component element in the {'plugin':'xyz', 'setup':[..]} version (expandable)
	 * @param {*} component Component to analyze
	 * @returns <i>true</i> if some component or componet element in the {'plugin':'xyz', 'setup':[..]} version (expandable), <i>false</i> otherwise
	 */
	expandable(component){
		function check(c){ return c !== undefined && c !== null }
		if(Array.isArray(component)) for(var i=0; i<component.length; i++) if(this.expandable(component[i])) return true
		if( (typeof component == 'object') && check(component.plugin)){
			if(check(component.setup)) return true
			else if(component.children.length>0) return this.expandable(component.children)
		}
		return false
	}

	/**
	 * Expands any component or component element in the in the {'plugin':'xyz', 'setup':[..]} version (expandable)
	 * @param {*} component Component to analyze
	 * @returns An expanded version (calling the setup method of the associated plugin 'xyz'). May produce expandable components
	 */
	expand(component){
		function check(c){ return c !== undefined && c !== null }
		if(Array.isArray(component)) for(var i=0; i<component.length; i++) component[i] = this.expand(component[i])
		else if( typeof component == 'object' && check(component.plugin)){
			if(check(component.setup)) component = this[component.plugin].setup(...component.setup)
			else if(component.children.length>0) component.children = this.expand(component.children)
		}
		return component
	}

	/**
	 * Creates the expanded configuration JSON of a component (loads plugins if required)
	 * @param {*} component Component to analyze
	 * @param {*} callback Function that will be called when the component is completly analyzed
	 */
	setup(component, callback){
		var x = this
		var plugs = x.dependencies(component)
		var aplugs = []
		for( var c in plugs ){
			if(x[plugs[c]] === undefined){
				var i=0
				while(i<aplugs.length && aplugs[i]!=plugs[c]) i++
				if(i==aplugs.length) aplugs.push(plugs[c])
			}	
		}
		if(aplugs.length==0){ 
			if(this.expandable(component)){
				component = x.expand(component)
				x.setup(component, callback)
			}else callback(component)
		}else{
			x.load(aplugs, function(){
				component = x.expand(component)
				x.setup(component, callback)
			})
		}
	}

	/**
	 * Loads a set of plugins and executes the callback function
	 * @param plugins An array of plugin ids
	 * @param callback function to be executed after loading plugins
	 */
	 load(plugins, callback=function(){}){ 
		if(plugins.length == 0){
			callback()
			return
		}
		var x = this
		var ids = []
		var tout
		function check_eval(){
			Konekti.deamon(function(){
				var m=0
				while(m<ids.length && x[ids[m]]!==undefined) m++
				return (m==ids.length)
			}, callback)
		}

		var k=0
		function check(){
			k++
			if(k==plugins.length) check_eval()
		}

		for(var i=0; i<plugins.length; i++){
			ids[i] = plugins[i].substring(Math.max(0,plugins[i].lastIndexOf('/')))
			if( !plugins[i].endsWith('.js') ) plugins[i] += '.js'
			else ids[i]= ids[i].substring(0,ids[i].length-3)
			if( plugins[i].indexOf('/') < 0 ) plugins[i] = x.url+plugins[i]
			if( x[plugins[i]] === undefined ) x.konekti.resource.JS(plugins[i], check)
			else check()
		} 
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
		this.TIMER = 20
		this.MEDIUMSIZE = 992

		Konekti = this
		
		this.plugin = new PlugInManager(this)
		new PlugIn('raw')		

		this.client = {'':{'children':[]}}
		this.root = new RootClient()
		
		window.addEventListener("resize", this.resize);
	}

	/**
	 * A Konekti deamon. Waits until <i>condition</i> is satisfied and then call function <i>f</i>.
	 */
    deamon( condition, f ){
		var tout=null
		function check(){
			if(tout != null) clearTimeout(tout)
			if(condition()) f()
			else tout = setTimeout(check, Konekti.TIMER)
		}
		check()
	}

	/**
	 * 
	 * @param component Konekti component to build  
	 * @returns A Konekti client
	 */
	build( component ){ return this.plugin[component.plugin].client(component) }

	/**
	 * Creates and adds a component inside other component
	 */
	add(){
		var args = []
		for(var i=1; i<arguments.length-1; i++)
			args[i-1] = arguments[i]
		var component = {'plugin':arguments[0], 'setup':args}
		this.client[args[0]].add(component, arguments[arguments.length-1]) 
	}

	/**
	 * Defines the set of plugins used by Konekti and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
	uses(){
		if( KonektiMain !== undefined ) this.plugin.load(arguments, KonektiMain)
		else this.plugin.load(arguments)
	}

	/**
	 * Gets a visual component by id 
	 * @param id Id of the visual component
	 * @returns Visual componet with the given id
	 */
	vc(id='body'){ return (id=='body')?document.body:document.getElementById(id) }

	/**
	 * Resizes the components
	 */
	resize(){
		var c = Konekti.vc()
		c.style.width = window.innerWidth + 'px'
		c.style.height = window.innerHeight + 'px'
	}

	/**
	 * Creates an item
	 * @param parent Parent component
	 * @param id Id of the item
	 * @param children Client components
	 * @param config Extra configuration 
	 * @param callback Function called when the item is ready
	 */
	raw(parent, id, children, config, callback){ 
		var args = []
		for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
		if(args.length==2) args[2] = ''
		if(args.length==3) args[3] = {}
		if(args.length==4) args[4] = function(){}
		Konekti.add('raw', ...args)
	}
}

/**
 * The root client
 */
class RootClient extends Client{
	/**
	 * Creates the root client
	 */
	constructor(){ 
		super({'parent':'','plugin':'none','id':'body', 'children':[]})
		var c = Konekti.vc()
		Konekti.deamon( 
			function (){ return c!==undefined && c!==null; },
			function (){
				c.style.position = 'absolute'
				c.style.height = '100%'
				c.style.width = '100%'
				c.style.padding = '0px'
				c.style.margin = '0px'
				c.style.border = '0px'
			}
		)
	}
}

/**
 * An editor (text) manager
 */
 class Editor extends Client{
	/**
	 * Creates an editor with the given id/client information, and registers it into the Konekti framework
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
	scrollTop(pos){}
}

/**
 * A media manager.
 */
class MediaClient extends Client{
	/**
	 * Creates a media client with the given id/client information, and registers it into the Konekti framework
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

/**
 * A main client.
 */
class MainClient{
	/**
	 * Creates a main client
	 * @param {*} id Id of the main client (by default 'client')
	 */ 
	constructor(id='client'){ 
		Konekti.client[id] = this 
		this.id = id
	} 
}

/** The main konekti object */
Konekti = new KonektiAPI()