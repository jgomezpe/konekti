/** Konekti Plugin for navigation (buttons) bar components */
class NavBarPlugIn extends PlugIn{
    /** Creates a Plugin for navbar components */
    constructor(){
        super('navbar')
        this.replace = 'strict'
	this.child_style = 'w3-bar-item'
    }

	/**
	 * Fills the html template with the specific navbar information
	 * @param thing Navbar information
	 * @return Html code associated to the navbar component
	 */
	fillLayout( thing ){
		thing.style = thing.style || "w3-blue-grey w3-xlarge"
		thing.client = thing.client || "client"
	        thing.btnsHTML = Konekti.plugins.btn.listLayout(thing)
	        return Konekti.dom.fromTemplate( this.htmlTemplate, thing) 
	}

	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new NavBar(thing) }

	/**
	 * Creates a config object from parameters
	 * @param id Id of the navbar component
	 * @param btns Array of buttons to maintain by the navbar
	 * @param client Client of the navbar component
	 * @param method Method of the client that will be called when a button is pressed and it does not have associated a run code
	 * @param style Style of the navbar
	 * @return A NavBar manager
	 */
	config(id, btns=[], client='client', method='select', style="w3-blue-grey w3-xlarge"){
		return {"id":id, "method":method, "btn":btns, "style":style, "client":client}
	}
}

/** A Navigation Bar manager */
class NavBar extends Client{
	/** 
	 * Creates a NavBar Manager
	 * @param thing Configuration of the navbar
	 */
	constructor(thing){
		super(thing)
		this.method = thing.method
		this.client = thing.client
	}

	/** Adds a component to the navbar
	 * @param arguments Components to add
	 */
	add(){
		for( var i=0; i<arguments.length; i++ ){
			var thing = arguments[i]
			var type = arguments[i].plugin || 'btn'
			if( thing.onclick === undefined || thing.onclick === null ) thing.onclick={"method":this.method||thing.id,"client":"client"}
			Konekti.dom.append(this.id,type,thing) 
		}
	}

	/**
	 * Insert a component into the navbar before the given component
	 * @param sister Id of the component that will be the next sister of the new component
	 * @param thing PlugIn information for creating the component that will be inserted as previous brother of the 
	 * HTML element in the document with the given <i>sister</i> id
	 */
	insertBefore(sister){
		for( var i=1; i<arguments.length; i++ ){
			var thing = arguments[i]
			var type = arguments[i].plugin || 'btn'
			if( thing.onclick === undefined || thing.onclick === null ) 
				thing.onclick={"method":this.method||thing.id,"client":this.client||"client"}
			Konekti.dom.insertBefore(sister, type, thing)
		}
	}

	/**
	 * Removes a component of the navbar
	 * @param id Id of the component to remove 
	 */
	remove(id){ return Konekti.dom.remove(id) }

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
new NavBarPlugIn()

/**
 * Associates/adds a navigation bar component
 * @method
 * navbar
 * @param id Id/configuration of the navbar component
 * @param btns Array of buttons to maintain by the navbar
 * @param client Client of the navbar component
 * @param method Method of the client that will be called when a button is pressed and it does not have associated a run code
 * @param style Style of the navbar
 * @return A NavBar manager
 */
Konekti.navbar = function(id, btns, client, method, style){
	if(typeof id === 'string') id=Konekti.plugins.navbar.config(id,btns,client,method,style)
	return Konekti.plugins.navbar.connect(id)
}
