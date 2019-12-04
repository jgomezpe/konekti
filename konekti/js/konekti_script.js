/**
*
* konekti_script.js
* <P>Loads javascript files.
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

loadedScripts = [];

/**
 * Script Management
 * @param getResource A function that brings the resource from the server
 */
class Script{

	/** 
	 * Gets the position of the script <i>x</i> in the array of loaded scripts. If the script has not been loaded, this method returns the size of the array of loaded scripts.
	 * @param x Script to be located
	 * @return Position of the script if it was previously loaded, <i>n=size(src)</i> otherwise
	 */
	static index( id ){
		var i=0;
		while(i<loadedScripts.length && id!=loadedScripts[i].id){ i++ }
		return i
	}

	/**
	 * Adds a script to the client from its source code 
	 * @param type Script type
	 * @param id If of the script to be added
	 * @param code Source code of the script
	 * @param next Function that will be called after loading the script
	 */
	static add( type, id, code ){
		var index = Script.index(id)
		if( index == loadedScripts.length ){ 
			var element = document.createElement( 'script' )
			element.defer = true
			element.charset="utf-8"
			if( type!=null ) element.type = type
			loadedScripts.push({"id":id})
			element.innerHTML = code
			var b = document.getElementsByTagName('script')[0]
			b.parentNode.insertBefore(element, b)
		}
	}

	/**
	 * Adds a script to the client from a cloud url
	 * @param type Script type
	 * @param url URL of the script
	 * @param next Function that will be called after loading the script
	 * @param error Function that will be called if the script cold not be loaded
	 */
	static load( type, url, next ){
		var index = Script.index(url)
		if( index == loadedScripts.length ){ 
			var element = document.createElement( 'script' )
			if( type!=null ) element.type = type
			element.async = true
			element.defer = true
			element.src = url 
			element.charset="utf-8"
			element.onreadystatechange = null

			var myScript = {id:url, state:0, queue:[next] } 
			loadedScripts.push(myScript)
			
			function onload(){
				myScript.state = 1
				var queue = myScript.queue
				while( queue.length>0 ){
					var f = queue[0]
					if( f!=undefined && f!=null ) f()
					queue.shift()
				} 
			}

			function onerror(){ myScript.state = 2 }

			element.onload = onload
			element.onerror = onerror
			var b = document.getElementsByTagName('script')[0]
			b.parentNode.insertBefore(element, b)
		}else{
			myScript = loadedScripts[index]
			var state = myScript.state
			var queue = myScript.queue
			if( state==1 ) next()
			if( state==0 ) queue.push( next )
		}
	}

	/**
	 * Adds a javascript to the client from a cloud url
	 * @param url URL of the script
	 * @param next Function that will be called after loading the script
	 * @param error Function that will be called if the script cold not be loaded
	 */
	static loadJS( url, next ){ Script.load( 'text/javascript', url, next ) }

	/**
	 * Adds a link to the client from a cloud url
	 * @param url URLs of the link
	 * @param rel 
	 */
	static link( url, rel ){
		var l = document.createElement('link')
		l.rel = rel
		l.href = url
		l.crossorigin="anonymous"
		document.getElementsByTagName('head')[0].appendChild(l)
	}

	/**
	 * Adds a style sheet to the client from a cloud url
	 * @param url URLs of the style sheet
	 */
	static stylesheet( url ){ Script.link( url, "stylesheet" ) }
}

