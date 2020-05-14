/**
*
* iframe.js
* <P> An iframe component. 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

window.plugin.iframe.getText = function( id ){
	fr = Util.vc(id)
	return fr.contentWindow.document.documentElement.outerHTML 
}

window.plugin.iframe.setText = function( id, txt ){
	fr = Util.vc(id+'-frame')
	fr.src = "data:text/html;charset=utf-8," + txt 
}

window.plugin.iframe.connect = function( dictionary ){
	var id = dictionary.id
	if(dictionary.client!=null){
		var client = window[dictionary.client]
		client.editor( id, function(){ return window.plugin.iframe.getText(id) }, function(txt){ window.plugin.iframe.setText(id, txt) } )
	}
}
