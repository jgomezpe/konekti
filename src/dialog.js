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
			var run = (btns[i].setup.length>=4)?btns[i].setup[3]:''
			var onclick = Konekti.dom.onclick(btns[i].setup[0], run)
			while(btns[i].setup.length < 4 ) btns[i].setup.push('') 
			btns[i].setup[3] = 'Konekti.vc("'+id+'").style.display="none"\n' + onclick
		}

        var navbar = {'plugin':'raw','setup':[id+'Btns', btns, {'class':" w3-center ", 'width':'100%'}]}
        children.push(navbar)
        var content = {'plugin':'raw', 'setup':[id+'Content', children, {'width':'100%', 'style':'margin:0px;'}]}
        var modal = {'plugin':'raw', 'setup':[id+'Modal',[content], {'width':'80%', 'class':" w3-modal-content "}]}
		config.class = (config.class || '') + " w3-modal "
		config = Konekti.config(config)
		config.width = '100%'
		config.height = '100%'
		config.style.display = 'none'
		return super.setup(parent, id, modal, config)
	}

	client(config){ return new Dialog(config) }
}

/** Registers the dialog plugin in Konekti */
new DialogPlugin()

class Dialog extends Client{
	constructor(config){ super(config) }

    /**
     * Resize window
     */
	resize( width, height ){
        var x = this	
		if(x.vc().style.display!='none') super.resize(width, height)
		
		x.vc().style.width = width + 'px'
		x.vc().style.height = height + 'px'
		x.vc().style.zIndex="100"
	}

	show(){
		var x = this
		x.vc().style.display = 'block'
		var r = x.vc().getBoundingClientRect()
		super.resize(r.width, r.height)
	}
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
Konekti.dialog = function(id, children, btns=[{'plugin':'btn', 'setup':[id+'OK','fa-check','','']}], config={}, 
	callback=function(){}){ 
	Konekti.add({'plugin':'dialog', 'setup':['body', id, children, btns, config]}, callback)
}
