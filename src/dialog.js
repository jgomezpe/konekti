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
	 * @param parent parent component
	 * @param id Id of the dialo component
	 * @param children Component children
	 * @param btns Button Options
	 * @param config Dialog style configuration
	 */
	setup(parent, id, children, btns, config={}){
        var span = {'plugin':'container', 'setup':['container', id+'Span', 
			[{'plugin':'html', 'setup':[id+'Close','','',{"onclick":'Konekti.vc("'+id+'").style.display="none"',
			 'class':'w3-button w3-display-topright'},'&times;']}]]}
        if(!Array.isArray(children)) children = [children]
        children.splice(0,0,span)
		for( var i=0; i<btns.length; i++ ){
			var onclick = Konekti.dom.onclick(btns[i].setup[0], btns[i].setup[3])
			btns[i].setup[3] = 'Konekti.vc("'+id+'").style.display="none"\n' + onclick
		}

        var navbar = {'plugin':'container','setup':['container', id+'Btns', btns, '100%','',{'class':"w3-center"}]}
        children.push(navbar)
        var content = {'plugin':'container', 'setup':['container', id+'Content', children, '','',{'class':"w3-container"}]}
        var modal = {'plugin':'container', 'setup':['container', id+'Modal',[content], '','',{'class':"w3-modal-content"}]}
		config.class = (config.class || '') + " w3-modal"
		config.style = 'display:none;'+(config.style || '') 
		return super.setup(parent, 'dialog', id, [modal], '', '', config)
	}

	/**
	 * Creates a hyper media client with the given id/client information, and registers it into the Konekti framework
	 */	
	constructor(){ super(...arguments) }
}

/**
 * Creates a modal dialog client
 * @method
 * dialog
 * @param parent parent component
 * @param id Id of the hypermedia component
 * @param children Component children
 * @param btns Options
 * @param config Dialog style configuration
 */
Konekti.dialog = function(parent, id, children, btns, config){
	return new Dialog(parent, id, children, btns, config)
}