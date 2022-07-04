Konekti.uses('btn')

/** Konekti Plugin for navigation (buttons) bar components */
class NavBarPlugIn extends PlugIn{
	/** Creates a Plugin for navbar components */
	constructor(){ super('navbar') }

	/**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client(config){ return new NavBar(config) }
}

/** A Navigation Bar manager */
class NavBar extends Client{
	/** 
	 * Creates a NavBar Manager
	 * @param config Configuration of the navbar
	 */
	constructor(config){
		super(config)
		this.method = config.method
		this.client = config.client
		this.fitRect = true
	}

	/**
	 * Initializes the visual component associated to the client
	 * @param child Child to be initilized
	 * @param config Configuration of the client
	 */
	 init_child(child, config){ 
		super.init_child(child, config)
		this.method = this.method || config.method
		this.client = this.client || config.client || ''
		child.plugin = child.plugin || 'btn'
		child.style = (child.style!='')?child.style:(config.style||this.style)
		if(child.run === undefined || child.run===null || child.run=='') child.run = {'client':this.client, 'method':this.method}
		return child
	}
	
	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ return "<div id='"+this.id+"' class='"+config.style+" w3-bar'></div>" }   

	/**
	 * Inserts components into the navbar before the given component
	 * @param sister Id of the component that will be the next sister of the new component
	 * @param thing PlugIn information for creating the component that will be inserted as previous brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	 add(){
		for( var i=0; i<arguments.length; i++ ) this.init_child(arguments[i])
		var children = Konekti.build(arguments)
		for( var i=0; i<children.length; i++ ) this.children.push(children[i])
	}

	/**
	 * Inserts components into the navbar before the given component
	 * @param sister Id of the component that will be the next sister of the new component
	 * @param thing PlugIn information for creating the component that will be inserted as previous brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	 insertBefore(sister){
		var children = []
		for( var i=1; i<arguments.length; i++ ){
			this.init_child(arguments[i])
			children.push(arguments[i])
		}
		children = Konekti.build(children)
		var sister_idx = this.child_index(sister)
		for( var i=0; i<children.length; i++ ){
			Konekti.dom.insertBefore(children[i].id, sister)
			this.children.splice(sister_idx+i,0,children[i])
		}
	}

	/**
	 * Removes a component of the navbar
	 * @param id Id of the component to remove 
	 */
	remove(id){ 
		this.children.splice(this.child_index(id),1)
		return Konekti.dom.remove(id)
	}

	/** 
	 * Keeps the given components in the navbar and removes any other component.
	 * @param ids Ids of the components to keep in the navbar.
	 */
	keep( ids ){
		var c = this.vc()
		var r = []
		for( var i=0; i<c.children.length; i++ ){
			if( !ids.includes(c.children[i].id)  ) r.push(c.children[i].id)
		}
		for( var j=0; j<r.length; j++) this.remove(r[j])
	}
}

/** Navigation Bar class */
if(Konekti.navbar===undefined) new NavBarPlugIn()

/**
 * Creates a Navigation bar configuration object
 * @method
 * navbarConfig
 * @param id Id/configuration of the navbar component
 * @param style Style of the navbar
 * @param btns Array of buttons to maintain by the navbar
 * @param client Client of the navbar component
 * @param method Method of the client that will be called when a button is pressed and it does not have associated a run code
 * @param parent Parent component
 * @return A NavBar manager
 */
Konekti.navbarConfig = function(id, style, btns, client, method, parent='KonektiMain'){
	return {'plugin':'navbar', 'id':id, 'style':style, 'client':client, 'method':method, 'children':btns, 'parent':parent}
}
/**
 * Associates/adds a navigation bar component
 * @method
 * navbar
 * @param id Id/configuration of the navbar component
 * @param style Style of the navbar
 * @param btns Array of buttons to maintain by the navbar
 * @param client Client of the navbar component
 * @param method Method of the client that will be called when a button is pressed and it does not have associated a run code
 * @param parent Parent component
 * @return A NavBar manager
 */
Konekti.navbar = function(id, style, btns, client, method){
	return Konekti.build(Konekti.navbarConfig(id, style, btns, client, method))
}
