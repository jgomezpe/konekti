/**
*
* searchBtn.js
* <P> A search button. 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

searchBtn = window.plugin.searchBtn

searchBtn.connect = function( dictionary ){
	var id = dictionary.id
	var input = Util.vc(id)

	function check(event) {	dictionary.check( id, event.target.value ) }
	if( dictionary.check != null ) input.addEventListener("input", check) 	

	function process(event) {
		// Process the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			event.preventDefault()
			dictionary.find( id, event.target.value )
		}
	}
	if( dictionary.find != null ) input.addEventListener("keyup", process) 	
}

