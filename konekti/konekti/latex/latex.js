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

latex.initAPI = function(){ document.getElementsByTagName('body')[0].setAttribute('class','no-mathjax') }

if(window.MathJax==null || MathJax == null ){
	Script.load( "text/x-mathjax-config", "MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\\\(','\\\\)']],processClass: 'mathjax', ignoreClass: 'no-mathjax'}});" )
	Script.loadJS("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML", latex.initAPI)
}

latex.connect = function( dictionary ){ if( MathJax!=null ) MathJax.Hub.Queue(["Typeset",MathJax.Hub]) }