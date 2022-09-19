/**
*
* dialog.js
* <P>Modal Dialog component.</P>
* <P> Requires konekti.js</P>
*
* Copyright (c) 2022 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/aplikigo">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Professor Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

/**
 * Dialog: A modal dialog component for Konekti 
 */
 class Dialog extends Container{
	/**
	 * Creates a dialog configuration object
	 * @param id Id of the dialo component
	 * @param children Component children
	 * @param btns Button Options
	 * @param parent parent component
	 */
	setup(id, children, btns, parent='KonektiMain'){
        var cfg = "onclick='Konekti.vc(\""+id+"\").style.display=\"none\"' class='w3-button w3-display-topright'"
        var span = {'plugin':'span', 'setup':[id+'Span', cfg,[{'plugin':'div', 'setup':[id+'Close','','','','&times;', id+'Span']}], id+'Content']}
        if(!Array.isArray(children)) children = [children]
        children.splice(0,0,span)
        var navbar = {'plugin':'container','setup':[id+'Btns','100%','','class="w3-center"', btns, id+'Content']}
        children.push(navbar)
        var content = {'plugin':'container', 'setup':[id+'Content','','','class="w3-container"',children,id+'Modal']}
        var modal = {'plugin':'container', 'setup':[id+'Modal','','','class="w3-modal-content"', [content], id]}
		return {'plugin':'dialog', 'id':id, 'parent':parent, 'width':'', 'height':'', 'config':'class="w3-modal"', 'children':[modal]}
	}

	/**
	 * Creates a hyper media client with the given id/client information, and registers it into the Konekti framework
	 * @param id Id of the hypermedia component
	 * @param children Component children
	 * @param btns Options
	 * @param parent parent component
	 */	
	constructor(id, children, btns, parent='KonektiMain'){ super(...arguments) }
}

/**
 * Creates a modal dialog client
 * @method
 * dialog
 * @param id Id of the hypermedia component
 * @param children Component children
 * @param btns Options
 * @param parent parent component
 */
Konekti.dialog = function(id, children, btns, parent='KonektiMain'){
	return new Dialog(id, children, btns, parent)
}