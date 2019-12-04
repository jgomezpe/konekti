/**
*
* editor.js
* <P>A syntax highlight editor (based on ACE editor)  
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

// Editor functions
editor = window.plugin.editor

editor.done = function (){
	editor.loaded = true
	while( editor.view.length > 0 ){
		var dictionary = editor.view[0]
		editor.view.shift()
		editor.connect( dictionary )
	}
}
	
editor.loaded = false
	
Script.loadJS("https://ace.c9.io/build/src/ace.js", editor.done)

editor.view = []

function EditLanguage(){
	var lang = this

	lang.mode = function(dictionary){
		var e = ace.edit(dictionary.id+'-ace');
		e.session.setMode("ace/mode/"+dictionary.mode);
	}

	lang.theme = function(dictionary){
		var e = ace.edit(dictionary.id+'-ace');
		if( dictionary.theme!=null) e.setTheme("ace/theme/"+dictionary.theme);
	}

	lang.init = function(dictionary){
		lang.theme(dictionary)
		lang.mode(dictionary)
		var e = ace.edit(dictionary.id+'-ace');
		e.setShowPrintMargin(false);
	}
}

editor.connect = function ( dictionary ){
	if( editor.loaded ){
		var mode = dictionary.mode
		var lang = editor[mode]
		if( lang == undefined || lang == null ){
			function callbacksimple(){
				lang = editor[mode]
				if( lang == undefined || lang == null ) editor[mode] = lang = new EditLanguage()
				lang.init(dictionary)
			}
			this.server.loadJS('ace/'+mode, callbacksimple)
		}else lang.init(dictionary)
	}else editor.view.push( dictionary )
}
	

editor.load = function ( id ){ 
	editor.view.push( id )
	if( editor.loaded ) editor.done();
}

editor.setText = function ( editorId, txt ){
	var edit = ace.edit(editorId);
	edit.setValue(txt, -1);
}
	
editor.getText = function ( editorId ){
	var edit = ace.edit(editorId);
	return edit.getValue();
}

editor.locateCursor = function ( editorId, row, column ){
	var edit = ace.edit(editorId);
	edit.moveCursorTo(row, column);
	edit.focus();
}
	
editor.highlight = function ( editorId, row ){ editor.locateCursor( editorId, row,1 ); }
