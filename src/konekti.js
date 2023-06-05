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

/**
 * Konekti Application program interface. Main object of the Konekti framework
 */
let Konekti = null

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
	 * Creates a JSON from a style parameter of a html element
	 * @param {*} sty Style parameter string 
	 * @returns A JSON representation of the style parameter
	 */
	style( sty ){
		var attr = sty.split(";")
		var json = {}
		for(var k=0; k<attr.length; k++){
			if(attr[k].indexOf(':')>=0){
				var a = attr[k].split(':')
				json[a[0]] = a[1]
			}
		}
		return json
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

	/**
	 * Computes the size of a component
	 * @param {*} parent Parent's size
	 * @param {*} child  Component's size (ended with 'px', '%', or just with value 'fit')
	 * @returns The computed size of the component 
	 */
	size(parent, child){
		if(child.endsWith('px'))
			return parseFloat(child.substring(0,child.length-2))
		if(child.endsWith('%'))
			return parent * parseFloat(child.substring(0,child.length-1)) / 100
		return parent
	}
}

class FontSize{
	constructor(){
		this.defaultSize = 16
		this.w3 = {
			'label': ['w3-tiny', 'w3-small', 'w3-medium', 'w3-large', 'w3-xlarge', 'w3-xxlarge', 'w3-xxxlarge', 'w3.jumbo'],
			'size': [10, 12, 15, 18, 24, 34, 48, 64]
		}
		this.h = [40, 32, 24, 18.72, 16, 13.8, 10.72]
	}

	locType(cl){
		var i=0
		while(i<this.w3.label.length && !cl.includes(this.w3.label[i])) i++
		if(i<this.w3.label.length) return i
		return -1
	}

	type(cl){
		var i=this.locType(cl)
		if(i>=0) return this.w3.label[i]
		return ''
	}

	fromType(type){
		var i=0
		while(i<this.w3.label.length && type!=this.w3.label[i]) i++
		if(i<this.w3.label.length) return this.w3.size[i]
		return null
	}

	fromClass( cl ){
		var i=this.locType(cl)
		if(i>=0) return this.w3.size[i]
		return null
	}

	fromHeader( h ){
		if(typeof h === 'string') h = parseInt(h.substring(1))
		if(0<h && h<this.h.length) return this.h[h]
		return this.h[4]
	}

	fromFontSize(fs){
		if(fs.endsWith('px')) return parseFloat(fs.substring(0,fs.length-2))
		if(fs.endsWith('em')) return parseFloat(fs.substring(0,fs.length-2)) * 16
		return null
	}

	size(config){
		var s = null
		if(config.style['font-size']!==undefined) s = this.fromFontSize(config.style['font-size'])
		if(s==null && config.class!==undefined)	s = this.fromClass(config.class)
		return (s!=null)?s:this.defaultSize
	}
}

/** A Konekti component. */
class Client{
    /**
     * Assigns attributes in JSON configuration object to the component
     * @param {*} config JSON configuration object
     */
    assign( config ){ for( var x in config ) this[x] = config[x] }

    /**
     * Creates a component using the JSON configuration object
     * @param {*} config JSON configuration object
     */
    constructor( config ){
        var x = this
        x.assign(config)
		x.inner = x.inner || ''
		x.addqueue = 0
		x.callback = []
        Konekti.client[x.id] = x
    }

    /**
     * Gets the html code associated to the client
	 * @return html code associated to the client
	 */
    innerHtml(){
        var inner = this.inner || ''
        for(var i=0; i<this.children.length; i++)
            inner += this.children[i].html()
        return inner
    }

    /**
     * Gets the html code associated to the client
	 * @return html code associated to the client
	 */
    html(){
        var config = this.config
        var tag = config.tag
        // Open tag
        var otag = "<" + tag + " id='" + this.id + "' "
		for(var x in config){        
			if( x=='style' ){
				var v=''
				for(var y in config[x]) v += y + ':' + config[x][y] + ';'
				otag += x + "='" + v + "' "
			}else if( x!=='tag' && x!=='extra' && x!='width' && x!='height' && x!='layout') otag += x + "='" + config[x] + "' "
		}	
        otag += (config.extra||'')+">"
        
        // innerHTML
        var inner = this.innerHtml()
        
        // Close tag
        var ctag = ''
        switch(tag){
            case 'img':
                ctag = ''
                break;
            default:
                ctag = '</'+tag+'>'
        }
        return otag + inner + ctag
    }
  
	/**
	 * Gets a html component associated to the client or subclient
	 * @param {*} id Subclient partial id
	 * @returns HTML element associated to the client or patial id client
	 */
    vc(id=''){ return Konekti.vc(this.id+id) }

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

	fitWidth(){ 
		var x = this
		var tw = 0
		var h = 0
		for(var i=0; i<x.children.length; i++) {
			if(x.children[i] != null && x.children[i].config.width!='fit'){
				tw += x.children[i].width
				if(h<x.children[i].height) h = x.children[i].height
			}	
		}
		return this.width - tw
	}

	fitHeight(){ 
		var x = this
		var th = 0
		var w = 0
		for(var i=0; i<x.children.length; i++) {
			if(x.children[i] != null && x.children[i].config.height!='fit'){
				th += x.children[i].height
				if(w<x.children[i].width) w = x.children[i].width
			}	
		}
		return this.height - th
	}


	widthResize(width){
		var x = this
		var w = 0
		switch(x.config.width){
			case '':
				w = this.vc().getBoundingClientRect().width
			break;
			case 'fit':
				w = Konekti.component[x.parent].fitWidth()
			break;
			default:
				if(x.config.width.endsWith('px')) w = parseFloat(x.config.width.substring(0,x.config.width.length-2))
				else w = width * parseFloat(x.config.width.substring(0,x.config.width.length-1)) / 100	
		}
		return w
	}

	heightResize(height){
		var x = this
		var h = 0
		switch(x.config.height){
			case '':
				h = this.vc().getBoundingClientRect().height
			break;
			case 'fit':
				h = Konekti.component[x.parent].fitHeight()
			break;
			default:
				if(x.config.height.endsWith('px')) h = parseFloat(x.config.height.substring(0,x.config.height.length-2))
				else h = height * parseFloat(x.config.height.substring(0,x.config.height.length-1)) / 100	
		}
		return h
	}

    /**
     * Resize window
     */
    rowLayout(){
		var x = this
		for(var i=0; i<x.children.length; i++)
			if(x.children[i] != null && x.children[i].config.width!='fit')
				x.children[i].resize(x.width, x.height)
		for(var i=0; i<x.children.length; i++)
			if(x.children[i] !== null && x.children[i].config.width=='fit')
				x.children[i].resize(x.width, x.height)
    }   

    /**
     * Resize window
     */
    colLayout(){
		var x = this
		for(var i=0; i<x.children.length; i++)
			if(x.children[i] !== null && x.children[i].config.height!='fit')
				x.children[i].resize(x.width, x.height)
		for(var i=0; i<x.children.length; i++)
			if(x.children[i] !== null && x.children[i].config.height=='fit')
				x.children[i].resize(x.width, x.height)
    }

	computeSize(size, style, fitSize){
		if(style=='fit') return fitSize
		if(style.endsWith('px')) return parseFloat(style.substring(0,style.length-2))
		if(style.endsWith('%')) return size * parseFloat(style.substring(0,style.length-1)) / 100
		return size
	}

    /**
     * Resizes the component 
	 * @param width Parent's width
	 * @param height Parent's height
     */
    resize( width, height ){
		var x = this
		width = x.computeSize(width, x.config.width, x.parent!==undefined?Konekti.client[x.parent].fitWidth():0)
		height = x.computeSize(height, x.config.height, x.parent!==undefined?Konekti.client[x.parent].fitHeight():0)

		if(x.children.length>0){
			if(x.layout=='row'){
				for(var i=0; i<x.children.length; i++)
					if(x.children[i] != null && x.children[i].config.width!='fit') 
						x.children[i].resize(width, height)
				var r = x.vc().getBoundingClientRect()
				if(x.config.width!=''){
					x.width = width
					x.vc().style.width = width + 'px'
				}else x.width = r.width
				for(var i=0; i<x.children.length; i++)
					if(x.children[i] != null && x.children[i].config.width=='fit') 
						x.children[i].resize(width, height)				
				if(x.config.height!=''){
					x.height = height
					x.vc().style.height = height + 'px'
				}else x.height = r.height
			}else{
				for(var i=0; i<x.children.length; i++)
					if(x.children[i] != null && x.children[i].config.height!='fit') 
						x.children[i].resize(width, height)
				var r = x.vc().getBoundingClientRect()
				if(x.config.height!=''){
					x.height = height
					x.vc().style.height = height + 'px'
				}else x.height = r.height
				for(var i=0; i<x.children.length; i++)
					if(x.children[i] != null && x.children[i].config.height=='fit') 
						x.children[i].resize(width, height)				
				if(x.config.width!=''){
					x.width = width
					x.vc().style.width = width + 'px'
				}else x.width = r.width		
			}
		}else{
			var r = x.vc().getBoundingClientRect()
			if(x.config.width!=''){
				x.width = width
				x.vc().style.width = width + 'px'
			}else x.width = r.width
			if(x.config.height!=''){
				x.height = height
				x.vc().style.height = height + 'px'
			}else x.height = r.height
		}
 	}
}

/** Class used for creating an instance of a Konekti component (plugin). */
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
	 * @param id Id of the component 
	 * @param children Children components
	 * @param config Extra configuration 
	 */
	setup( parent, id, children=[], config={}  ){
		config = Konekti.config(config)
		var inner = ''
		if(typeof children === 'string'){
			inner = children
			children = []
		}
		if(!Array.isArray(children)) children = [children]
		for(var i=0; i<children.length; i++) 
			if(children[i].setup[0]!=id) children[i].setup.splice(0,0,id)
		return {'id':id, 'parent':parent, 'children':children, 'inner': inner, 'config': config, 'listener':[] } 
	}

	/**
	 * Creates a client from the specific plugin
	 * @param {*} config Client configuration
	 * @returns Client from the specific plugin
	 */
	client( config ){ return new Client(config) }
}

/** Aplication program interface. Plugins will be seen as methods of this class */
class KonektiAPI{
	/**
	 * Inits the konekti framework
	 */
    constructor(url='https://jgomezpe.github.io/konekti/src/'){

        var x = this
		Konekti = x
        x.url = url
		
		x.font = new FontSize()
        x.dom = new DOM(x)
		x.resource = new Resource()
		x.resource.stylesheet( 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' )
		x.resource.stylesheet( 'https://www.w3schools.com/w3css/4/w3.css' )
		x.TIMER = 20
        
        x.SMALL_SIZE = 600
		x.MEDIUM_SIZE = 902

		x.plugin = {}
		new PlugIn('raw')		

		x.client = {}
		new Root()
		
		window.addEventListener("resize", function(){ x.resize() })
        x.resize()
	}

	/**
	 * Resizes the components
	 */
    resize(){ 
		var x = this
		Konekti.daemon( function(){ return x.vc() !== undefined && x.vc()!==null },
			function(){ x.client['body'].resize(window.innerWidth, window.innerHeight) }	
		)
	}

	/**
	 * Gets a visual component by id 
	 * @param id Id of the visual component
	 * @returns Visual componet with the given id
	 */
    vc(id='body'){ return (id=='body')?document.body:document.getElementById(id) }

	/**
	 * A Konekti daemon. Waits until <i>condition</i> is satisfied and then call function <i>f</i>.
	 */
    daemon( condition, f ){
		var tout=null
		function check(){
			if(tout != null) clearTimeout(tout)
			if(condition()) f()
			else tout = setTimeout(check, Konekti.TIMER)
		}
		check()
	}

	/**
	 * Expands a component in the {'plugin':'xyz', 'setup':[..]} version (expandable)
	 * @param {*} component Component to analyze
     * @param {*} callback Function called when the component is expanded
	 */
    expand(component, callback){
        var x = this
        if(typeof component == 'object' && component.plugin !== undefined && component.setup!==undefined){
            var plugin = component.plugin
            if( !plugin.endsWith('.js') ) plugin += '.js'
		    if( plugin.indexOf('/') < 0 ) plugin = x.url+plugin
            var id = plugin.substring(plugin.lastIndexOf('/')+1, plugin.length-3)
            function check(){
                Konekti.daemon(
                    function(){ return x.plugin[id]!==undefined }, 
                    function(){
                        var c = x.plugin[id].setup(...component.setup)
                        var k=0
                        function add_child(child){
							var j=0; 
                            while(j<c.children.length && (c.children[j].setup === undefined || child.id!=c.children[j].setup[1]) ) j++
                            c.children[j] = child
                            k++
                            if(k==c.children.length) callback(x.plugin[id].client(c)) 
                        }
                        if(c.children!=undefined && c.children.length>0){
                            for( var i=0; i<c.children.length; i++ )
                                x.expand(c.children[i], add_child)
                        }else callback(x.plugin[id].client(c))
                    }
                )
            }
            if(x.plugin[id] === undefined) x.resource.JS(plugin, check) 
            else check()
		}else callback(component)
	}

    add(component, callback=function(){}){
        var x = this
		var pid = component.parent || component.setup[0]
		var p = Konekti.client[pid]
		var i = p.children.length
		p.children[i] = null
		p.callback[i] = callback
        x.expand(component, function(c){
            p.children[i] = c
			var k = p.addqueue
			while(k<p.children.length && p.children[k] != null){
				p.vc().appendChild(Konekti.dom.html(p.children[k].html()))
				k++
			}
			p.addqueue = k
			if(k==p.children.length){
				p.resize(p.vc().clientWidth, p.vc().clientHeight)			
				for(var j=0; j<p.children.length; j++) p.callback[j]()
			}	
        })
    }

	/**
	 * Creates an item
	 * @param id Id of the item
	 * @param children Client components
	 * @param config Extra configuration 
	 * @param callback Function called when the item is ready
	 */
    raw(id, children=[], config={}, callback=function(){}){ 
		Konekti.add({'plugin':'raw', 'setup':['body', id, children, config]}, callback)
	}

	/**
	 * Loads a set of plugins and executes the callback function
	 * @param plugins An array of plugin ids
	 * @param callback Function called after loading all plugins
	 */
    load(plugins, callback = function(){}){
        var x = this
        var ids = []
        for(var i=0; i<plugins.length; i++){
            var plugin = plugins[i]
            if( !plugin.endsWith('.js') ) plugin += '.js'
		    if( plugin.indexOf('/') < 0 ) plugin = x.url+plugin
            var id = plugin.substring(plugin.lastIndexOf('/')+1, plugin.length-3)
            ids[i] = id
            if(x.plugin[id] === undefined) x.resource.JS(plugin) 
        }
        Konekti.daemon(
            function(){
                var flag = true
                var k=0
                while(k<ids.length && x.plugin[ids[k]] !== undefined) k++
                return k==ids.length
            }, 
            callback
        )
	}

	/**
	 * Defines the set of plugins used by Konekti and executes the KonektiMain function
	 * @param plugins An array of plugin ids
	 */
    uses(){
        if(KonektiMain===undefined) KonektiMain = function(){}
		var plugins = []
		for(var i=0; i<arguments.length; i++) plugins[i] = arguments[i]
        this.load(plugins,KonektiMain)
	}

	/**
	 * Process a configuration object associated to a client
	 * @param json JSON to process
	 * @return A processed configuration  object (deep clone with some attributes such as widdth, height, and style processed)
	 */
	config(json){ 
		json = JSON.parse(JSON.stringify(json))
		json.style = json.style || {}
		if(typeof json.style === 'string') json.style = Konekti.dom.style(json.style)
		json.layout = json.layout || 'col'
		json.width = json.width || json.style.width || ''
		if(json.style.width !== undefined) delete json.style.width
		json.height = json.height || json.style.height || ''
		if(json.style.height !== undefined ) delete json.style.height
		json.tag = json.tag || 'div'
		return json
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
 * The root client
 */
class Root extends Client{
	/**
	 * Creates the root client
	 */
	constructor(){ 
		super({'id':'body', 'children':[], 'config':{'style':{'margin':'0px', 'padding':'0px'}, 'width':'100%', 'height':'100%'}})
	}
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