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
var sidebar = window.plugin.sidebar

sidebar.open = function( barId ){
	var c = Util.vc(barId)
	c.style.display = "block" 
//	c.style.width = '50%'
}

sidebar.close = function( barId ){ Util.vc(barId).style.display = "none" }

sidebar.connect = function( dictionary ){
	var id = dictionary.id
	var btnHtml = '<button id="·id·Btn" class="·class·" onclick="window.plugin.sidebar.open(\'·id·\')">·caption·</button>'
	var btnJson = { 'id': id, 'class':dictionary['class'], "caption":dictionary.caption }
	btnHtml = Util.fromTemplate( btnHtml, btnJson, '·' )
	var node = Util.html( btnHtml )
	var c = Util.vc( id+'Btn' )
	if( c!=null ) c.parentElement.replaceChild(node, c)
	else{
		c = Util.vc( dictionary.btnBar )
		c.insertBefore( node, c.firstChild )
	}
}
