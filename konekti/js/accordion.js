/**
*
* accordion.js
* <P>An accordion kind of menu
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

// Canvas functions
var accordion = window.plugin.accordion
var accordionItem = window.plugin.accordionItem

accordion.expand = function( id ){
	var x = document.getElementById(id);
	if (x.className.indexOf("w3-show") == -1) x.className += " w3-show"
	else x.className = x.className.replace(" w3-show", "")
}

accordion.instance = function ( dictionary ){
	var id = dictionary.id
	var code = this.htmlCode( dictionary )
	var node = Util.html( code )
	var children = dictionary.children
	if( children != null ){
		var inner = Util.findChild( node, id+'-inner' )
		for( var i=0; i<children.length; i++ ){
			var child = children[i]
			var childNode = null
			if( child.isAccordion ){
				if( child.color == undefined || child.color == null ) child.color = dictionary.color
				childNode = accordion.instance( child )
			}
			else childNode = accordionItem.instance( child )
			inner.appendChild( childNode )
		}
	}
	return node
}
