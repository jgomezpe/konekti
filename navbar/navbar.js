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
	var onclick = dictionary.onclick || 'Navigate' 
	var code = this.htmlCode( dictionary )
	var node = Util.html( code )
	var btn = dictionary.btn
	if( btn != null ){
		for( var i=0; i<btn.length; i++ ){
			if( btn[i].side != null && btn[i].side ){
				var side = {id:btn[i].id, width:'50%', caption:'☰'}
				window.plugin.sidebar.replaceWith(side)
				btn[i].run = "window.plugin.sidebar.open('"+side.id+"')"
				btn[i].id = side.id + 'Btn'
				node.appendChild( window.plugin.btn.instance( btn[i] ) )
			}else if( btn[i].find != null && btn[i].find ){
				var find = btn[i].run || onclick+".find()"
				node.appendChild( window.plugin.searchbtn.instance( {'id':'search2', 'find':find } ) )
			}else{
				btn[i].run = btn[i].run || onclick+"."+btn[i].id+"()"
				node.appendChild( window.plugin.btn.instance( btn[i] ) )
			}

		}
	}
	if( dictionary.multilanguage != null ){
		var select = dictionary.setlanguage || onclick+".setLanguage"
		var langBtn = {'id':'language', 'select':select, 'margin':'left', 'fa':"fa fa-language", 'options':dictionary.multilanguage }
		node.appendChild( window.plugin.dropdown.instance(langBtn) )
		window.plugin.dropdown.connect(langBtn)
	}
	return node
}
