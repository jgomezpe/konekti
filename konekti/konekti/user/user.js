/**
*
* user.js
* <P> User connection to a server. 
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

user = window.plugin.user

user.toogle = function( id ){
	var node = Util.vc(id+'BtnContent')
	if (node.style.display === "none"){
		node.style.display = ""
		node = Util.vc(id+'Btn')
		node.innerHTML = '<i class="fa fa-user"></i>'
		node.onclick=null
	}else{
		node.style.display = "none";
		node = Util.vc(id+'Btn')
		node.innerHTML = '<i class="fa fa-power-off"></i>'
		node.onclick= function (){ user.logout(id) }
	}
}

user.connect = function( dictionary ){
	var id = dictionary.id
	var node = Util.vc(id)
	if( dictionary.captcha != null ) window.plugin.captcha.appendAsChild( id+'BtnContent',  dictionary.captcha )
}

user.login = function( id ){
	function connect( response ){
		var json = Util.json( response )
		if( json.validUser ){
			user.toogle(id)
			if( json.command != null ) eval( json.command )
		}else Util.vc(id+'Msg').innerHTML = json.errorMessage
	}
	this.server.user.login( connect, Util.vc(id+'Id').value, Util.vc(id+'Pwd').value )
}

user.register = function( id ){
	if( Util.vc(id+'Pwd').value != Util.vc(id+'Pwd2').value ){
		Util.vc(id+'Msg').innerHTML = "Retyped Password does not match"
		return
	}
	function connect( response ){
		var json = Util.json( response )
		if( json.validUser ){
			user.toogle(id)
			if( json.command != null ) eval( json.command )
		}else Util.vc(id+'Msg').innerHTML = json.errorMessage
	}
	this.server.user.login( connect, Util.vc(id+'Id').value, Util.vc(id+'Pwd').value )
}

user.logout = function( id ){ this.toogle(id) }
