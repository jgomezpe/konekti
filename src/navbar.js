/** Konekti plugin for navbar elements */
class NavBarPlugin extends PlugIn{
	constructor(){ super('navbar') }
	/**
	 * Creates a Navigation bar configuration object
	 * @param parent Parent component
	 * @param id Id/configuration of the navbar component
	 * @param btns Array of buttons to maintain by the navbar
	 * @param config Style of the navbar
	 * @param onclick Method to call (by default) when a button in the navbar is presses
	 * @return A NavBar manager
	 */
	setup(parent, id, btns, onclick, config={}){
		config.tag = 'div'
		config.class = (config.class || '') + " w3-bar "
		config.style = 'width:100%;' + (config.style||'')
		for(var i=0; i<btns.length; i++) this.init_child(btns[i], onclick)
		var c = super.setup( parent, id, btns, config)
		c.onclick = onclick
		return c
	}

	init_child( child, onclick ){
		if(child.plugin=='btn'){
			if(child.setup.length<4 || child.setup[3]==null) child.setup[3] = onclick
			if(child.setup.length<5 ) child.setup[4] = {}
			child.setup[4].class =  'w3-bar-item ' + (child.setup[4].class||'')
		}	
		return child
	}

	client(config){ return new NavBar(config) }
}

/** Registers the navbar plugin in Konekti */
new NavBarPlugin()

/** A Navigation Bar manager */
class NavBar extends Client{

	/** 
	 * Creates a NavBar Manager
	 */
	constructor(config){ super(config) }

	/**
	 * Shows a components into the navbar before the given component
	 * @param sister Id of the component that will be the next sister of the new component
	 * @param thing PlugIn information for creating the component that will be inserted as previous brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	show(child){
		var c = Konekti.vc(child).className || ''
		c = c.replace('w3-hide', 'w3-show')
		Konekti.vc(child).className = c
	}

	hide(child){
		var c = Konekti.vc(child).className || ''
		c = c.replace('w3-show', '')
		Konekti.vc(child).className = c + ' w3-hide'
	}

	/** 
	 * Keeps the given components in the navbar and removes any other component.
	 * @param ids Ids of the components to keep in the navbar.
	 */
	keep( ids ){
		for( var i=0; i<this.children.length; i++ ){
			if( ids.includes(this.children[i].id)  ) this.show(this.children[i].id)
			else this.hide(this.children[i].id)
		}
	}

	/** 
	 * Removes the given components from the navbar and keeps any other component.
	 * @param ids Ids of the components to remove from the navbar.
	 */
	remove( ids ){
		for( var i=0; i<this.children.length; i++ ){
			if( ids.includes(this.children[i].id)  ) this.hide(this.children[i].id)
			else this.show(this.children[i].id)
		}
	}
}

/**
 * Associates/adds a navigation bar component
 * @method
 * navbar
 * @param parent Parent component
 * @param id Id/configuration of the navbar component
 * @param btns Array of buttons to maintain by the navbar
 * @param onclick Method of the client that will be called when a button is pressed and it does not have associated a run code
 * @param config Style of the navbar
 * @param config NavBar style
 * @param callback Function called when the navbar is ready
 */
Konekti.navbar = function(parent, id, btns, onclick, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = ''
	if(args.length==4) args[4] = {}
	if(args.length==5) args[5] = function(){}
	Konekti.add('navbar', ...args)
}