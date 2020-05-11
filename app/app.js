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
window.plugin.app.build = function( id, lang, languages ){
	function replaceWithId( dictionary ){
		dictionary.id = id 
		window.plugin.app.replaceWith(dictionary)
	}

	if(lang!=null){
		function back(languages){
			var found = false;
			for(var i = 0; i < languages.supported.length && !found; i++) 
			    found = (languages.supported[i].id == lang )
			if( !found ) lang = languages['default']
			this.server.getConfigFile = function(file, next){ this.getJSON('language/'+lang+'/'+file, next) } 

			function next( dictionary ){
				dictionary.languages = languages
				replaceWithId(dictionary) 
			}
			this.server.getConfigFile(id, next) 
		}
		if( languages==null ){ this.server.getJSON( 'language/supported', back ) }
		else{ back(languages) }
	}else{
		this.server.getConfigFile = function(file, next){ this.getJSON(file, next) } 
		this.server.getConfigFile(id, replaceWithId ) 
	}
}


/**
 * Sets the interface language
 * @param lang Interface language
 * @param next Function to be excetuted after setting the interface language
 */ 
window.plugin.app.setLanguage = function( id, lang ){
	function replaceWithId( dictionary ){
		dictionary.id = id 
		window.plugin.app.replaceWith(dictionary)
	}
	this.server.getConfigFile = function(file, next){ this.getJSON('language/'+lang+'/'+file, next) } 
	this.server.getConfigFile(id, replaceWithId ) 
}


window.plugin.app.connect = function( dictionary ){
	id = dictionary.id
	uses = []
	if( dictionary.content != null ) uses.push( dictionary.content.plugin )
	function innerConnect(){
		var client = dictionary.client || 'client'
		window[client].appid = dictionary.id
		dictionary.title.id = id+'title'
		window.plugin.title.replaceWith( dictionary.title )

		dictionary.nav.id = id+'nav'
		dictionary.nav.side = id+'tocMenu'
		dictionary.nav.owner = "window.plugin.app"
		dictionary.nav.onclick = client
		window.plugin.navbar.replaceWith( dictionary.nav )
		var t = Util.vc(id+'toc')
		dictionary.toc.id = id+'toc'
		dictionary.toc.select = client+'.tocSelect'
		dictionary.toc.client = client
		if( t!=null ) window.plugin.accordion.replaceWith( dictionary.toc )
		else window.plugin.accordion.appendAsChild( id+'tocMenu', dictionary.toc )

		// Language Button
		if( dictionary.languages != null ){
			var langBtn = {'id':'language', owner:id, fa:'fa fa-language', 'select':'window.plugin.app.setLanguage', 'margin':'left', 'class':"w3-button w3-bar-item w3-xlarge", 'options':dictionary.languages.supported }
			window.plugin.dropdown.appendAsChild( id+'nav', langBtn )
		}
		
		// Client
		dictionary.content.id = id+'content'
		dictionary.content.client = client
		dictionary.client = client
		window.plugin[dictionary.content.plugin].replaceWith( dictionary.content )
	}
	PlugIn.uses(this.server, uses, innerConnect)
}
