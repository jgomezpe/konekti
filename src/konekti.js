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
	JSON(id, callback){ fetch(id).then((response) => response.ok?response.json():null).then((json) => callback(json)) }
	
	/**
	 * Loads a text resource (if possible)
	 * @param id text_URL id
	 * @param callback Function that will be called if the text file is loaded
	 */
	TXT(id, callback){ fetch(id).then((response) => response.ok?response.text():null).then((txt) => callback(txt)) }
	
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
		this.url = '../src/'
		//this.url = 'https://jgomezpe.github.io/konekti/src/'
		
		this.client = {}
		this.plugin = {'html':true, 'container':true}
		this.root = new RootClient()
		
		window.addEventListener("resize", Konekti.resize);
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
			if(plugs[component.plugin] === undefined && this.plugin[component.plugin] === undefined) plugs[component.plugin] = component.plugin
			if(check(component.children)) plugs = this.dependencies(component.children, plugs)
			else if(check(component.setup)) plugs = this.dependencies(component.setup, plugs)
		}
		return plugs
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
		var ids = []
		function check_eval(){
			var m=0;
			while(m<ids.length && Konekti[ids[m]]!==undefined) m++
			if(m==ids.length){
				for(var i=0; i<ids.length; i++) Konekti.plugin[ids[i]] = true
				callback()
			}else setTimeout(check_eval, 100)
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
			if( plugins[i].indexOf('/') < 0 ) plugins[i] = this.url+plugins[i]
			if( Konekti.plugin[plugins[i]] === undefined ) this.resource.JS(plugins[i], check)
			else check()
		} 
	}

	/**
	 * Loads all the required dependencies of an array of Konekti clients
	 * @param component Konekti components to load 
	 * @param callback Function called as soon as all dependecies are loaded
	 */
	load_dependencies(component, callback){
		var plugs = this.dependencies(component)
		var aplugs = []
		for( var c in plugs ){
			if(this.plugin[plugs[c]] === undefined){
				var i=0
				while(i<aplugs.length && aplugs[i]!=plugs[c]) i++
				if(i==aplugs.length) aplugs.push(plugs[c])
			}	
		}
		Konekti.load(aplugs,  callback)
	}

	
	resize_required(){
		function check(){
			var flag = true
			for(var x in Konekti.client){
				flag &= (Konekti.client[x].done === undefined || Konekti.client[x].done )
			}	
			if(flag) Konekti.resize()
			else setTimeout(check, 100)
		}
		check()	
	}

	build_aux( component ){
		if( Array.isArray(component) ){
			var plugs = []
			for( var i=0; i<component.length; i++ ) plugs.push(Konekti.build_aux(component[i]))
			return plugs
		}else return Konekti[component.plugin](...component.setup)
	}

	/**
	 * 
	 * @param component Konekti components to build  
	 * @returns An array of Konekti clients 
	 */
	build( component ){
		var c = this.build_aux(component)
		this.resize_required()
		return c
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
	 * Register a set of plugins (useful when more than one plugin is defined in the same JS)
	 */
	register(){
		for( var i=0; i<arguments.length; i++ ) Konekti.plugin[arguments[i]] = true
	}

	/**
	 * Appends a set of konekti component to a client
	 * @param parent Parent client of the components (any other argument is a component to build)
	 */
	append(parent){
		var p = Konekti.client[parent]
		for( var i=1; i<arguments.length; i++ ){
			arguments[i].setup.splice(0,0,parent)
			p.children.push(Konekti[arguments[i].plugin](...arguments[i].setup))
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
	vc(id='body'){ return (id=='body')?document.body:document.getElementById(id) }

	/**
	 * Creates a container bject
	 * @param parent Parent component
	 * @param plugin Component's plugin
	 * @param id Id of the component 
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param config Extra configuration 
	 * @param children Contained components
	 */
	container( parent, plugin, id, children=[], width='', height='', config={'tag':'div'} ){
		return new Container(parent, plugin, id, children, width, height, config) 
	}

	html(parent, id, width='', height='', config={'tag':'div'}, inner=''){
		return new Client(parent,'client', id, width, height, config, inner)
	}
}

/** A Konekti client. */
class Client{
	assign( config ){ for( var x in config ) this[x] = config[x] }

	/**
	 * Creates a client configuration object
	 * @param parent Parent component
	 * @param plugin Id of the component 
	 * @param id Id of the component 
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param config Extra configuration 
	 */
	setup( parent, plugin, id, width, height, config, inner = '' ){
		config.tag = config.tag || 'div'
		return {'plugin':plugin, 'id':id, 'parent':parent, 'config':config, 'inner':inner,
				'defwidth':width, 'defheight':height, 'listener':[]} 
	}

	/**	 
	 * Creates a konekti client using the configuration information	 
	 */	
	constructor(){
		this.assign(this.setup(...arguments))
		Konekti.client[this.id] = this
		if(this.parent=='body') Konekti.client['body'].children.push(this)
		if(this.parent!='') Konekti.vc(this.parent).appendChild(Konekti.dom.html(this.html()))
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
	 * Gets the visual component associated to the client/subclient
	 * @param {*} subId Id of the subclient (the subclient id is a combination of the client id and this argument)
	 * @returns Visual component associated to the client/subclient
	 */
	vc(subId=''){ return Konekti.vc(this.id+subId) }

	/**
	 * Computes the size of a visual component side according to a parent's side dimension
	 * @param {*} side 'width' or 'height'
	 * @param {*} parent_size Size of the parent's dimension
	 * @returns Computed dimension
	 */
	size( side, parent_size ){
		var c = this.vc()
		var r = c.getBoundingClientRect()
		var defSize = this['def'+side]
		if(defSize !== undefined && defSize!==null && defSize!=''){
			var n = defSize.length-1
			if(defSize=='rest'){
				var s = 0
				var p = Konekti.client[this.parent]
				for(var i=0; i<p.children.length; i++){
					if( p.children[i] != this ){
						var r = p.children[i].vc().getBoundingClientRect()
						s += r[side]
					}
				}
				return parent_size - s
			}else if( defSize.charAt(n) == '%' ) return Math.round(parseFloat(defSize.substring(0,n))*parent_size/100)
			else return parseInt(defSize.substring(0,n-1))
		}else return undefined	
	}
	
	/**
	 * Computes the size of the visual component associated to the client
	 * @param {*} parentWidth Parent's width
	 * @param {*} parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.width = this.size('width', parentWidth)
		this.height = this.size('height', parentHeight)
		var c = this.vc()
		c.style.width = this.width + 'px'
		c.style.height = this.height + 'px'
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

/** A Konekti client. */
class Container extends Client{
	/**
	 * Creates a client configuration object
	 * @param parent Parent component
	 * @param plugin Component plugin
	 * @param id Id of the component that will contain the ace editor
	 * @param children Contained components
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param config Extra configuration 
	 */
	setup( parent, plugin, id, children=[], width='', height='', config={"tag":"div"} ){
		config.tag = config.tag || 'div'
		var inner =''
		if(typeof children == 'string'){
			inner = children
			children =[]
		}else if(!Array.isArray(children)) children = [children]
		var c = super.setup(parent, plugin, id, width, height, config, inner)
		c.children = children
		return c
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
	constructor(){ 
		super(...arguments)
		var x = this
		x.done = false
		Konekti.load_dependencies(x.children, function(){ x.setChildrenBack() })
	}

	setChildrenBack(){
		for(var i=0; i<this.children.length; i++) this.children[i].setup.splice(0,0,this.id)
		this.children = Konekti.build(this.children)
		this.done = true
	}

	/**
	 * Sets each children size
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	 setChildrenSize( parentWidth, parentHeight ){
		var x = this
		function check(){
			if( x.done )
				for( var i=0; i<x.children.length; i++ ) x.children[i].setParentSize(x.width,x.height)
			else setTimeout(check, 100)
		}
		check()
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		super.setParentSize( parentWidth, parentHeight )
		this.setChildrenSize(parentWidth, parentHeight)
	}

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
	constructor(){ super('', 'container', 'body', [], '100%', '100%', {'style':'scroll:auto'}) }

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){ super.setParentSize(window.innerWidth, window.innerHeight) } 
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
	scrollTop(pos){}
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