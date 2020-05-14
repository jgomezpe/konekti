/**
*
* navbar.js
* <P>A Navigation Bar 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

window.plugin.navbar.instance = function ( dictionary ){
	var id = dictionary.id
	var onclick = dictionary.client || 'client' 
	var code = this.htmlCode( dictionary )
	var node = Util.html( code )
	if( dictionary.side != null ){
		var sideBtn = {'margin':'left', 'fa':"fa fa-bars", 'class':"w3-button w3-bar-item  w3-margin-right w3-xlarge" }
		sideBtn.run = "window.plugin.sidebar.open('"+dictionary.side.id+"')"
		sideBtn.id = dictionary.side + 'Btn'
		node.appendChild( window.plugin.btn.instance( sideBtn ) )
		var sideBar = dictionary.side 
		sideBar.client = onclick
		sideBar.width ='50%'
		sideBar.btnBar = id
		sideBar['class'] ="w3-button w3-bar-item  w3-margin-right w3-xlarge"
		window.plugin.sidebar.replaceWith(sideBar)
	}
	if( dictionary.search ){
		node.appendChild( window.plugin.searchbtn.instance( {'id':'search2', 'find':onclick+".find" } ) )
	}
	var btn = dictionary.btn
	if( btn != null ){
		for( var i=0; i<btn.length; i++ ){
			btn[i].run = btn[i].run || onclick+"."+btn[i].id+"()"
			node.appendChild( window.plugin.btn.instance( btn[i] ) )
		}
	}

	// Language Button
	var server = this.server
	if( server.languages!=null && server.languages[dictionary.root]!=null ){
		if( window.plugin.navbar.langManager == null ) window.plugin.navbar.langManager = {}
		window.plugin.navbar.langManager[id] = { select: function(lang){ window[onclick].setLanguage(dictionary.root, lang) } }
		var langBtn = {'id':'language', root:dictionary.root, client:"window.plugin.navbar.langManager['"+id+"']", fa:'fa fa-language', 'margin':'left', 'class':"w3-button w3-bar-item w3-xlarge", 'options': server.languages[dictionary.root].supported }
		langNode = window.plugin.dropdown.instance(langBtn)
		node.appendChild( langNode )
	}
	return node
}
