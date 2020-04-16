/**
*
* konekti_plugin.js
* <P>A PlugIn. Loads its associated JS/HTML/CSS in a recursive fashion, i.e., if the PlugIn uses other PlugIns
*  all of them are loaded.
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

class PlugIn{
	static URL( id ){ return "https://konekti.numtseng.com/source/" + id + '/' }

	/**
	 * Creates a PlugIn with the given <i>id</i>, loading its resources from the given <i>server</i> and 
	 * runs the <i>next</i> function after loaded
	 * @param server Server used for getting the resources associated to the PlugIn
	 * @param id Id of the PlugIn
	 * @param next Function that will be executed after loading the PlugIn  
	 */
	constructor( server, id, next ){
		this.id = id
		this.server = server
		
		var js = false
		var css = false
		var html = false
		var htmlLoaded = false
		var jsLoaded = false
		var cssLoaded = false

		function done(){ if(htmlLoaded && cssLoaded && jsLoaded) next() }

		var x = this
		
		function backHTML( html ){
			htmlLoaded = true
			x.htmlTemplate = html
			done()
		}
		function backCSS( css ){
			cssLoaded = true
			done()
		}
		function backJS(){
			jsLoaded = true
			done()
		}

		function init2(){
			if( css ) server.loadCSS(x.path+id, backCSS)
			else cssLoaded = true
			if( html ) server.getHTML(x.path+id, backHTML)
			else htmlLoaded = true
			if( js ) server.loadJS(x.path+id, backJS)
			else jsLoaded = true
		}

		function init( obj ){
			var uses = obj.uses
			js = obj.js
			css = obj.css
			html = obj.html
			if( uses != null ){
				var i = 0
				var n = uses.length
				function step(){
					i++
					if(i<n){
						if( window.plugin[uses[i]]==null ) new PlugIn( server, uses[i], step )
						else step()
					}else init2()
				}
				while( i<uses.length && window.plugin[uses[i]]!=null ){ i++ }
				if( i<uses.length ) new PlugIn( server, uses[i], step ) 
				else init2()
			}else init2()
		}

		function checkKonektiFirst( obj ){
			if( obj != null ){
				x.path = PlugIn.URL(x.id)
				init(obj)
			}else{
				x.path = this.server.pluginPath(id)
				x.server.getJSON( x.path+x.id, init )
			}

		}

		if( window.plugin == null ) window.plugin = {}
		window.plugin[id] = this
		this.next = next
		this.server = server
		this.id = id
		this.server.getJSON(PlugIn.URL(this.id)+this.id, checkKonektiFirst)
	}
	
	/**
	 * Performs additional JS tasks for the PlugIn that has just been inserted in the document hierarchy
	 * @param dictionary Information of the PlugIn that has been just inserted in the document hierarchy  
	 */
	connect( dictionary ){}

	/**
	 * Creates the HTML resource of an instance of the PlugIn. Uses the information provided for the instance <i>dictionary</i>
	 * @param dictionary Information of the instance of the PlugIn
	 * @return The HTML resource of an instance of the PlugIn.
	 */
	htmlCode( dictionary ){	return Util.fromTemplate( this.htmlTemplate, dictionary, '·' ) }

	/**
	 * Creates a DOM node for an instance of the PlugIn
	 * @param dictionary Information of the PlugIn instance
	 * @return A DOM node for an instance of the PlugIn
	 */
	instance( dictionary ){
		var code = this.htmlCode( dictionary ) 
		var node = Util.html( code )
		return node
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and append it as child of the component
	 * in the document with the given id, if possible
	 * @param parent Id of the element in the document that will include the new node
	 * @param dictionary PlugIn information for creating the HTML element that will be appended as child in the 
	 * HTML element in the document with the given id
	 */
	appendAsChild( parent, dictionary ){
		var node = this.instance( dictionary )
		var parentNode = Util.vc( parent )
		parentNode.appendChild( node )
		this.connect( dictionary )
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and inserts it as previous brother of the component
	 * in the document with the given id <i>sister</i>, if possible
	 * @param sister Id of the element in the document that will be the younger (next) sister of the new node
	 * @param dictionary PlugIn information for creating the HTML element that will be inserted as older (previous) brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	insertBefore( sister, dictionary ){
		var node = this.instance( dictionary )
		var sisterNode = Util.vc( sister )
		var parentNode = sisterNode.parentElement
		parentNode.insertBefore( node, sisterNode )
		this.connect( dictionary )
	}

	/**
	 * Creates an instance of the PlugIn with the given <i>dictionary</i> and replaces with it the HTML element
	 * in the document with the same id, if possible
	 * @param dictionary PlugIn information for creating the HTML element that will replace the HTML element in
	 * the document with the same id
	 */
	replaceWith( dictionary ){
		var node = this.instance( dictionary )
		var c = Util.vc( dictionary.id )
		if( c!=null ) c.parentElement.replaceChild(node, c)
		this.connect( dictionary )
	}

	/**
	 * Loads a set of PlugIns
	 * @param server Server containing the set of PlugIns
	 * @param plugins Name of the PlugIns to be loaded
	 * @param next Function that will be executed after loading the set of PlugIns
	 */
	static uses( server, plugins, next ){
		if( window.plugin == null ) window.plugin = {}
		var i=0
		function step(){
			if( i<plugins.length ){
				var p = plugins[i]
				i++
				if( window.plugin[p] != null ) step()
				else new PlugIn( server, p, step )
			}else next()
		}
		step()
	}
}
