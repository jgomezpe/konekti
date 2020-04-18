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
