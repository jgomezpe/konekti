/**
*
* konekti_util.js
* <P>Useful functions.
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

/* ************************************* Util Methods ****************************************** */
class Util{
	/**
	 * Creates a string from string (id function)
	 * @param str String to be converted to a String
	 * @return A String version of the String
	 */
	static txt( str ){ return str }

	/**
	 * Creates a XML object from a string, if possible
	 * @param str String to be converted to a XML object
	 * @return A XML version of the String
	 */
	static xml( str ){ return new DOMutilr().utilFromString(str,"text/xml") }

	/**
	 * Creates a JSON object from a string, if possible
	 * @param str String to be converted to a JSON object
	 * @return A JSON version of the String
	 */
	static json( str ){ return ((str!=null)&&(str.length>0))?JSON.util(str):null }

	/**
	 * Creates a HTML element from a string, if possible
	 * @param str String representing a single HTML element
	 * @return A HTML version of the string
	 */
	static html(str) {
	    var template = document.createElement('template')
	    str = str.trim()
	    template.innerHTML = str
	    return template.content.firstChild
	}

	/**
	 * Creates a CSS node from a string, if possible
	 * @param str String representing a CSS file
	 * @return A CSS node version of the string
	 */
	static css( str ){
		if( str!=null ){
			str = str.trim();
			var d = document.createElement('style')
			d.innerHTML = str
			return d
		}
		return null;
	}

	/**
	 * Adds a CSS file (as String) to the client, if possible
	 * @param str String representing a CSS file
	 */
	static addCSS( str ){
		var d = Util.css( str )
		if( d != null ) document.getElementsByTagName('head')[0].appendChild(d)
	}

	/**
	 * Obtains a String from a template by replacing the set of tags with their associated values. A tag is limited both sides by a character <i>c</i>. 
	 * For example, if <i>str='lorem ·X· dolor ·haha· amet'</i>, <i>c='·'</i> and <i>dictionary={'X':'ipsum', 'haha':'sit' }
	 * then this method will return the string <i>lorem ipsum dolor sit amet'</i>
	 * @param str Template used for generating the String
	 * @param dictionary Set of pairs <i>(TAG,value)</i> used for replacing each <i>TAG</> by its corresponding <i>value</i>
	 * @param c Enclosing tag character
	 * @return A String from a template by replacing the set of tags with their associated values. 
	 */
	static fromTemplate( str, dictionary, c ){
		var x = str.split(c)
		var state = 0
		var res = ""
	  	var tag = ''
		for( var i = 0; i<x.length; i++ ){
			switch( state ){
				case  0:
					res += x[i]
					state = 1
				break;    
				case 1:
		        		if( x[i].length > 0 ){
		        			tag = x[i]
						state = 2
					}else{
						res += c
		        			state = 0
					}
				break;
			    	case 2:
				    	if( x[i].length > 0 || i==x.length-1 ){
						res += ((dictionary[tag]!=null)?dictionary[tag]:tag) + x[i]
						state = 1
					}else{
		            			tag += c
						state = 3
					}                
				break;
				case 3:
		        		if( x[i].length > 0 ) tag += x[i]
						state = 2
			}
		}
		return res
	}

	/**
	 * Obtains the set of tags defined in a String template. A tag is limited both sides by a character <i>c</i>. For example, if <i>str='lorem·X·ipsum·haha· quia'</i>
	 * and <i>c='·'</i> then this method will return the array of tags <i>['X', 'haha']</i>
	 * @param str Template used for generating the String
	 * @param c Enclosing tag character
	 * @return A dictionary, set of pairs <i>(TAG,value)</i>, containing each <i>TAG</> in the template
	 */
	static templateTags( str, c ){
		var array = []
		var x = str.split(c)
		var state = 0
	  	var tag = ''
		for( var i = 0; i<x.length; i++ ){
			switch( state ){
				case  0:
					state = 1
				break;    
				case 1:
		        		if( x[i].length > 0 ){
		        			tag = x[i]
						state = 2
					}else{ state = 0 }
				break;
			    	case 2:
				    	if( x[i].length > 0 || i==x.length-1 ){
						array.push(tag)
						state = 1
					}else{
		            			tag += c
						state = 3
					}                
				break;
				case 3:
		        		if( x[i].length > 0 ) tag += x[i]
					state = 2
			}
		}
		return array
	}
	
	/**
	 * Obtains a JSON version of a String
	 * @param str String to be stored as JSON String
	 * @return A JSON version of the String
	 */
	static encode( str ){ return '"' + str.replace(/\\/g, '\\\\').replace(/"/g,'\\"') +'"' }

	/**
	 * Obtains the child node (starting with <i>node</i> as parent) with the given id
	 * @param node The starting node for the searching process
	 * @param childId Id of the node being located
	 * @return The child node (starting with <i>node</i> as parent) with the given id
	 */
	static findChild( node, childId ){
		var components = node.getElementsByTagName("*")
		var c = null
		for (var i = 0; i < components.length && c==null; i++) if( components[i].id == childId ) c = components[i]
		return c
	}

	/**
	 * Obtains the node with the given id (A shortcut of the <i>document.getElementById</i> method
	 * @param id Id of the element being located
	 * @return The node with the given id (A shortcut of the <i>document.getElementById</i> method
	 */
	static vc( id ){ return document.getElementById(id) }
}