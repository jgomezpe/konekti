/**
*
* vlo.js
* <P> Virtual Learning Object. 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

window.plugin.app.connect = function( dictionary ){
	id = dictionary.id
	uses = []
	if( dictionary.content != null ) uses.push( dictionary.content.plugin )
	function innerConnect(){
		var client = dictionary.client || 'client'
		window[client].appid = dictionary.id
		dictionary.title.id = id+'title'
		window.plugin.title.replaceWith( dictionary.title )
console.log("[app]"+dictionary.root)
		dictionary.nav.root = id
		dictionary.nav.id = id+'nav'
		dictionary.nav.side = id+'tocMenu'
		dictionary.nav.client = client
		window.plugin.navbar.replaceWith( dictionary.nav )
		var t = Util.vc(id+'toc')
		dictionary.toc.id = id+'toc'
		dictionary.toc.client = client
		if( t!=null ) window.plugin.accordion.replaceWith( dictionary.toc )
		else window.plugin.accordion.appendAsChild( id+'tocMenu', dictionary.toc )

		// Language Button
/*		if( dictionary.languages != null ){
			var langBtn = {'id':'language', owner:id, fa:'fa fa-language', 'select':'window.plugin.app.setLanguage', 'margin':'left', 'class':"w3-button w3-bar-item w3-xlarge", 'options':dictionary.languages.supported }
			window.plugin.dropdown.appendAsChild( id+'nav', langBtn )
		}
*/		
		// Client
		dictionary.content.id = id+'content'
		dictionary.content.client = client
		dictionary.client = client
		window.plugin[dictionary.content.plugin].replaceWith( dictionary.content )
	}
	PlugIn.uses(this.server, uses, innerConnect)
}
