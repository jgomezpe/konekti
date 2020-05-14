/**
*
* sidebar.js
* <P>A Side Bar 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

// Sidebar functions

window.plugin.sidebar.open = function( barId ){
	var c = Util.vc(barId)
	c.style.display = "block" 
}

window.plugin.sidebar.close = function( barId ){ Util.vc(barId).style.display = "none" }

window.plugin.sidebar.client = {}

class SideBarClient{
	constructor( id, client ){
		this.id = id
		this.client = client || 'client'
	}
	select(itemId){
		window.plugin.sidebar.close(this.id)
		window[this.client].select(itemId)
	}

}
window.plugin.sidebar.connect = function( dictionary ){
	var id = dictionary.id
	dictionary.content.id = id+'Content'
	window.plugin.sidebar.client[id] = new SideBarClient(id, dictionary.client)
	dictionary.content.client = "window.plugin.sidebar.client['"+id+"']"
	window.plugin[dictionary.content.plugin].replaceWith(dictionary.content)
}

