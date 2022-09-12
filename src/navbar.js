uses('https://jgomezpe.github.io/konekti/src/btn.js')

/** A Navigation Bar manager */
class NavBar extends Container{
	/**
	 * Creates a Navigation bar configuration object
	 * @param id Id/configuration of the navbar component
	 * @param style Style of the navbar
	 * @param btns Array of buttons to maintain by the navbar
	 * @param client Client of the navbar component
	 * @param method Method of the client that will be called when a button is pressed and it does not have associated a run code
	 * @param parent Parent component
	 * @return A NavBar manager
	 */
	setup(id, style, btns, client, method, parent='KonektiMain'){
		return {'plugin':'navbar', 'id':id, 'style':style, 'client':client, 'method':method, 'children':btns, 'parent':parent}
	}
	/** 
	 * Creates a NavBar Manager
	 * @param id Id/configuration of the navbar component
	 * @param style Style of the navbar
	 * @param btns Array of buttons to maintain by the navbar
	 * @param client Client of the navbar component
	 * @param method Method of the client that will be called when a button is pressed and it does not have associated a run code
	 * @param parent Parent component
	 */
	constructor(id, style, btns, client, method, parent='KonektiMain'){
		super(...arguments)
		this.method = this.config.method
		this.client = this.config.client || ''
		this.fitRect = true
	}

	/**
	 * Initializes the visual component associated to the client
	 * @param child Child to be initilized
	 * @param config Configuration of the client
	 */
	init_child(child){ 
		function check(c){ return c===undefined || c===null || c=='' }
		super.init_child(child)
		child.plugin = child.plugin || 'btn'
		child.style = (child.style!='')?child.style:(config.style||this.style)
		switch(child.plugin){
			case 'btn':
				if(child.setup!==undefined && check(child.setup[3])) child.setup[3] = {'client':this.client, 'method':this.method}
			break;
			case 'dropdown':
			break;
			default:
		}
		return child
	}
	
	/**
	 * Associated html code
	 */
	html(){ return "<div id='"+this.id+"' class='"+this.config.style+" w3-bar'></div>" }   

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
Konekti.navbar = function(id, style, btns, client, method, parent='KonektiMain'){ return new NavBar(id, style, btns, client, method, parent) }