/**
*
* html.js
* <P> An html component. 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

window.plugin.html.getText( id ){
	fr = Util.vc(id)
	return fr.innerHTML
}

window.plugin.html.setText( id, txt ){
	fr = Util.vc(id)
	fr.innerHTML = txt 
}

window.plugin.html = function( dictionary ){
	var id = dictionary.id
	if(dictionary.client!=null){
		client = window[dictionary.client]
		client.editor( id, function(){ return window.plugin.html.getText(id) },
			function(txt){ window.plugin.html.setText(id, txt) } 
		)
	}
}
