/**
*
* latex.js
* <P> A latex component (based on MathJax). 
* It cannot be used along the htmleditor plugin (scripts: https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js and https://cloud.tinymce.com/5/tinymce.min.js are non-compatible)
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

var latex = window.plugin.latex

/*latex.initAPI = function(){
	console.log('Latex...'+MathJax)
	if( MathJax!=null ) MathJax.Hub.Queue(["Typeset",MathJax.Hub]) 
	window['MathJax'] = MathJax
	document.getElementsByTagName('body')[0].setAttribute('class','no-mathjax') 
}*/

if(window.MathJax==null || MathJax == null ){
	Script.loadJS("https://polyfill.io/v3/polyfill.min.js?features=es6")
	Script.loadJS("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js") //, latex.initAPI)
}

latex.getText = function( id ){
	var output = Util.vc(id)
	return output['initial']
}

latex.setText = function( id, tex ){
	var output = Util.vc(id)
	output['initial'] = tex
	output.innerHTML = tex
	var tout = null
	function set(){
		if( typeof MathJax!="undefined" ){
			if( tout !=null ) clearTimeout(tout)
			MathJax.texReset()
			MathJax.typesetClear()
			MathJax.typesetPromise([output]).catch(function (err) {
				output.innerHTML = ''
				output.appendChild(document.createTextNode(err.message))
				console.error(err)
			}).then(function () {});
		}else{
			tout = setTimeout(set,1000)
		}
	}
	set()
}

latex.connect = function( dictionary ){
	if(dictionary.client!=null){
		var id = dictionary.id
		client = window[dictionary.client]
		client.editor( id, function(){ latex.getText(id) }, function(tex){ latex.setText(id,tex) } )
	}
	
	latex.setText(dictionary.id, dictionary.initial)
}
