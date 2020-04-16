/**
*
* htmleditor.js
* <P>A html editor (based on the tinymce library) 
* It cannot be used along the latex plugin (scripts: https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js and https://cloud.tinymce.com/5/tinymce.min.js are non-compatible)
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/


// The htmleditor plugin
var htmleditor = window.plugin.htmleditor

htmleditor.view = []
htmleditor.loaded = false

htmleditor.callback = function (){
	htmleditor.loaded = true
	while( htmleditor.view.length > 0 ){
		var dictionary = htmleditor.view[0]
		htmleditor.view.shift()
		htmleditor.connect( dictionary )
	}
}

//  Using the htmleditor api

htmleditor.connect = function( dictionary ){ 
	if( htmleditor.loaded ) tinymce.init({ "selector":dictionary.id }) 
	else{
		if( htmleditor.view.length == 0 ) Script.loadJS("https://cloud.tinymce.com/5/tinymce.min.js?apiKey="+dictionary.apiKey, htmleditor.callback)
		htmleditor.view.push( dictionary )
	}
}
