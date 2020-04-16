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

gauge = window.plugin.gauge

gauge.pos = function( event, id ){ return Math.floor(100 * (event.offsetX-1) / (Util.vc(id+"Container").offsetWidth-3) ); }

gauge.connect = function( dictionary ){
	var id = dictionary.id
	var node = Util.vc( id )
	var c = Util.findChild( node, id+'Container' )
	c.onmousemove = function(event) {
		width = gauge.pos(event, id)
		var colors = ['#CCFFFF', '#CCE5FF', '#99CCFF', '#66B2FF', '#3399FF', '#0080FF', '#0066CC', '#004C99', '#003366', '#001933', 'black']
		var elem = Util.vc(id+'Bar')
		if(  0<= width && width <= 100) {
			elem.style.backgroundColor = colors[Math.floor(width/10)]
	    	if( width < 40 ) elem.style.color = 'black';  
			else  elem.style.color = 'white';
	    	elem.style.width = width + '%' 
	    	elem.innerHTML = width*1 + '%'
	    }
	}
	c.onclick = function(event) {
		if( dictionary.callback != null ) return dictionary.callback( id, gauge.pos(event, id) )
	}
	return node
}