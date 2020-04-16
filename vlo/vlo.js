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

vlo = window.plugin.vlo

vlo.connect = function( dictionary ){
	var id = dictionary.id
	var uses = []
	if( dictionary.reading != null ) uses.push( dictionary.reading.plugin )
	if( dictionary.working != null ) uses.push( dictionary.working.plugin )
	function innerConnect(){
		if( dictionary.reading != null ){
			dictionary.reading.id = id+'ReadingInner'
			window.plugin[dictionary.reading.plugin].replaceWith( dictionary.reading )
		}
		if( dictionary.working != null ){
			dictionary.working.id = id+'WorkingInner'
			window.plugin[dictionary.working.plugin].replaceWith( dictionary.working )
		}
	}
	PlugIn.uses(this.server, uses, innerConnect)
}
