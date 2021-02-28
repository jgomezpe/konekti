/** Konekti Plugin for applications with a sidebar */
class SideBarPlugIn extends PlugIn{
	/** Creates a Plugin for sidebar applications */
	constructor(){ 
 		super('sidebar') 
	}

	/**
	 * Displays the sidebar
	 * @param barId Sidebar's id
	 */
	open( barId ){ Konekti.vc(barId).style.display = 'block' }

	/**
	 * Hides the sidebar
	 * @param barId Sidebar's id
	 */
	close( barId ){ Konekti.vc(barId).style.display = 'none' }

	/**
	 * Provides to a visual component the plugin's functionality 
	 * @param thing Plugin instance information
 	* @param callback Function that will be executed as the box component is loaded
	 */
	connect(thing,callback){
		thing.width = thing.width || "200px"
		thing.side =  thing.side || {}
		var side = thing.side
		side.plugin = side.plugin || "html"
		thing.main = thing.main || {} 
		var main = thing.main
		thing.navbar = thing.navbar ||{"btn":[]}
		var navbar = thing.navbar
		navbar.plugin = "navbar"
		navbar.id = navbar.id || thing.id+'-bar'
		navbar.btn = navbar.btn || []
		navbar.btn.unshift(
			Konekti.plugins.btn.config(thing.id+'-main-btn',"fa fa-bars", "", 
				'Konekti.plugins.sidebar.open("'+thing.id+'-side")', 
				"w3-bar-item w3-xlarge w3-hide-large"))
		var sidenavbar = {"plugin":"navbar", "id":thing.id+"-side-bar", 
			"btn":[Konekti.plugins.btn.config(thing.id+'-side-btn', "fa fa-bars", "&times;",
			'Konekti.plugins.sidebar.close("'+thing.id+'-side")',"w3-bar-item w3-xlarge w3-hide-large")]}
		
		function back(){
			Konekti.hcf(thing.id+'-side', side, sidenavbar)
			Konekti.hcf(thing.id+'-main', main, navbar)
			if(callback !== undefined) callback()
		}
		var uses = Konekti.analize(thing)
		thing.gui = this.html(thing)
		Konekti.load(...uses, back)
		return this.client(thing)
	}


	/**
	 * Creates a config object from parameters
	 * @param id Id of the sidebar component
	 * @param width Width of the sidebar
	 * @param height Height of the side bar
	 */
	config(id, width='200px', side={}, main={}, navbar={}){
		return {"id":id, "width":width, "side":side, "main":main, "navbar":navbar} 
	}
}

/** Side Bar class */
if(Konekti.sidebar===undefined) new SideBarPlugIn()

/**
 * Associates/Adds a side bar component (includes navigation bar, and main component)
 * @method
 * sidebar
 * @param id Id/Configuration of the sidebar component or Function that will be executed as the box component is loaded 
 * @param width Width of the sidebar
 * @param side Side component configuration
 * @param main Main component configuration
 * @param navbar Navigation bar configuration
 * @param callback Function that will be executed as the box component is loaded
 */
Konekti.sidebar = function(id, width, side, main, navbar, callback){
	if(typeof id === 'string') id=Konekti.plugins.sidebar.config(id,width,side,main,navbar)
	else callback = width
	return Konekti.plugins.sidebar.connect(id,callback)
}

