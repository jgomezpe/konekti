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
 * Dialog: A modal dialog plugin for Konekti 
 */
 class DialogPlugin extends PlugIn{
	constructor(){ super('dialog') }

	/**
	 * Creates a dialog configuration object
	 * @param parent parent component
	 * @param id Id of the dialo component
	 * @param children Component children
	 * @param btns Button Options
	 * @param config Dialog style configuration
	 */
	setup(parent, id, children, btns, config={}){
		var span = {'plugin':'raw', 'setup':[id+'Close','&times;',{'tag':'span', "onclick":'Konekti.vc("'+id+'").style.display="none"',
			 'class':'w3-button w3-display-topright', 'style':'margin:auto;height:34px;'}]}
 
		if(!Array.isArray(children)) children = [children]
        children.splice(0,0,span)
		for( var i=0; i<btns.length; i++ ){
			var onclick = Konekti.dom.onclick(btns[i].setup[0], btns[i].setup[3])
			btns[i].setup[3] = 'Konekti.vc("'+id+'").style.display="none"\n' + onclick
		}

        var navbar = {'plugin':'raw','setup':[id+'Btns', btns, {'class':"w3-center", 'style':'width:100%;'}]}
        children.push(navbar)
        var content = {'plugin':'raw', 'setup':[id+'Content', children, {'style':'width:100%;margin:0px;'}]}
        var modal = {'plugin':'raw', 'setup':[id+'Modal',[content], {'class':"w3-modal-content", 'style':'width:100%;height:100%;'}]}
		config.class = (config.class || '') + " w3-modal"
		config.style = 'display:none;'+(config.style || '') 
		return super.setup(parent, id, modal, config)
	}
}

/** Registers the dialog plugin in Konekti */
new DialogPlugin()

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
Konekti.dialog = function(parent, id, children, btns, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = [{'plugin':'btn', 'setup':[id+'OK','fa-check','']}]
	if(args.length==4) args[4] = {}
	if(args.length==5) args[5] = function(){}
	Konekti.add('dialog', ...args)
}
