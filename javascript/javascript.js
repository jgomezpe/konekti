/**
*
* javascript.js
* <P> Simple javascript programming environment. 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

class JSClient{
	constructor( id ){
		this.id = id
		this.edit={}
	}

	editor(id, get, set){
		if( this.edit[id] == null ) this.edit[id] = {}
		this.edit[id].getText = get
		this.edit[id].setText = set
	}

	run(){
		var id = this.id
		var editor = id+'JSeditor'
		var code = this.edit[editor].getText()
		var jsconsole = id+'JSconsole'
		this.edit[jsconsole].setText("<!DOCTYPE html>\n"+
			"<html>\n"+
			"	<meta name='viewport' content='width=device-width, initial-scale=1'>\n"+
			"	<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>\n"+
			"<body>\n"+
			"	<div id='error' class='w3-container w3-red'></div>\n"+
			"	<textarea id='out' style='position:relative; padding-bottom:54%; height:0; width:99%; ' class='w3-container'>Output:</textarea>\n"+
			"	<script>\n"+
			"		console.log = function(txt){document.getElementById('out').innerHTML = document.getElementById('out').innerHTML+'\\n'+txt}\n"+
			"		try {\n"+ 
			"		"+code+"\n"+
			"		} catch(e){\n"+
			"			document.getElementById('error').innerHTML = e.message\n"+
			"		}\n"+
			"	</"+"script>\n"+
			"</body>\n"+
			"</html>"
		)
	}
}


window.plugin.javascript.connect = function( dictionary ){
	var id = dictionary.id
	var client = id
	dictionary.client = client

	window[client] = new JSClient(client)

	var nav = id+'JSnavbar'

	window.plugin.navbar.replaceWith(
		{
			"id":nav,
			"client":client,
			"color":"w3-blue-grey",
			"search":false,
			"btn":[	{"id":"run","fa":"fa fa-play"} ]
		}
	)

	var editor = id+'JSeditor'
	window.plugin.editor.replaceWith(
		{ 
			"id":editor,
			"client":client,
			"theme":"chrome", 
			"mode":"javascript"
		}
	)

	var jsconsole = id+'JSconsole'
	window.plugin.iframe.replaceWith(
		{ 
			"id":jsconsole,
			"client":client,
			"src":""
		}
	)
}

