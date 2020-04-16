/**
*
* gauge.js
* <P> A gauge button. 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

var dropdown = window.plugin.dropdown

dropdown.connect = function( dictionary ){
	var id = dictionary.id
	var inner = Util.vc(id+'Options')
	var optHTML = '<a id="·id·" onclick="·select·(\'·id·\')" class="w3-bar-item w3-button">·caption·</a>'
	var optsHTML = ''
	for( var i in dictionary.options ){
		dictionary.options[i].drop = id
		dictionary.options[i].select = dictionary.select
		optsHTML += Util.fromTemplate( optHTML, dictionary.options[i], '·' )
	}
	inner.innerHTML = optsHTML
}
