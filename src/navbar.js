/** A Navigation Bar manager */
class NavBar extends Container{
	/**
	 * Creates a Navigation bar configuration object
	 * @param parent Parent component
	 * @param id Id/configuration of the navbar component
	 * @param btns Array of buttons to maintain by the navbar
	 * @param config Style of the navbar
	 * @param onclick Method to call (by default) when a button in the navbar is presses
	 * @return A NavBar manager
	 */
	setup(parent, id, btns, onclick, config){
		config.tag = 'div'
		config.class = (config.class || '') + " w3-bar "
		for(var i=0; i<btns.length; i++) this.init_child(btns[i], onclick)
		var c = super.setup( parent, 'navbar', id, btns, '100%', '', config)
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

	/** 
	 * Creates a NavBar Manager
	 */
	constructor(){ super(...arguments) }

	/**
	 * Inserts components into the navbar before the given component
	 * @param sister Id of the component that will be the next sister of the new component
	 * @param thing PlugIn information for creating the component that will be inserted as previous brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	add(child){
		child = this.init_child(child, this.onclick)
		Konekti.append(this.id, child)
		Konekti.vc(child.id).class = (Konekti.vc(child.id).class || '') + ' w3-bar-item'
	}

	/**
	 * Inserts components into the navbar before the given component
	 * @param sister Id of the component that will be the next sister of the new component
	 * @param child PlugIn information for creating the component that will be inserted as previous brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	insertBefore(sister, child){
		this.add(child)
		var sister_idx = this.child_index(sister)
		child = this.children[this.children.length-1]
		Konekti.dom.insertBefore(child.id, sister)
		this.children.splice(sister_idx,0,this.children[this.children.length-1])
		this.children.splice(this.children.length-1, 1)
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
 * @param parent Parent component
 * @param id Id/configuration of the navbar component
 * @param btns Array of buttons to maintain by the navbar
 * @param onclick Method of the client that will be called when a button is pressed and it does not have associated a run code
 * @param config Style of the navbar
 * @return A NavBar manager
 */
Konekti.navbar = function(parent, id, btns, onclick, config){ return new NavBar(parent, id, btns, onclick, config) }