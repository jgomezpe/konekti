Konekti.resource.css('.konekti-main{transition:margin-left .4s}\n.konekti-sidebar{height:100%;width:200px;background-color:#fff;position:fixed!important;z-index:40;overflow:auto}\n.konekti-buttonsidebar{height:100%;width:20px;background-color:#fff;position:fixed!important;z-index:39;overflow:auto}\n@media (min-width:993px){\n.konekti-sidebar{\ndisplay:block!important\n}\n.konekti-buttonsidebar{\ndisplay:none\n}\n}\n@media (max-width:992px){\n.konekti-main{margin-left:20px!important;margin-right:0!important}\n.konekti-sidebar{\ndisplay:none\n}\n.konekti-buttonsidebar{\ndisplay:block!important\n}\n}')

/** Konekti Plugin for applications with a sidebar */
class SideBarPlugIn extends PlugIn{
	/** Creates a Plugin for sidebar applications */
	constructor(){ super('sidebar') }

	/**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client(config){ return new SideBar(config) }
}

/** Tab manager */
class SideBar extends Client{
	/** 
	 * Creates a tab component manager 
	 * @param id Tab id
	 * @param tabs Collection of tabs managed by the component
	 */
	constructor( config ){ 
		super(config)
		this.side = config.children[0].id
		this.main = config.children[1].id
	}
	
	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ 
		var client = 'Konekti.client["'+this.id+'"].'
		return "<div id='"+this.id+"'><div id='"+this.id+"Bar' onmouseleave='"+client+"close()' class='konekti-sidebar w3-card w3-animate-left'></div><div id='"+this.id+"Resize' onmouseenter='"+client+"open()' style='float:left' class='w3-xlarge konekti-buttonsidebar'>&#9776;</div><div id='"+this.id+"Main' class='konekti-main' style='margin-left:200px'></div></div>"
	}
		
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.updateSize( parentWidth, parentHeight )
		var side = this.vc('Bar')
		var main = this.vc('Main')
		if(side.style.display == 'initial') this.children[this.side].setParentSize(200,this.height)
		this.children[this.main].setParentSize(this.width-200, this.height)
	}


	/**
	 * Displays the sidebar
	 * @param barId Sidebar's id
	 */
	open(){ 
		this.vc('Bar').style.display = 'initial' 
		this.children[this.side].setParentSize(200,this.height)
	}

	/**
	 * Hides the sidebar
	 * @param barId Sidebar's id
	 */
	close(){ 
		this.vc('Bar').style.display = 'none' 
	}
}


/** Side Bar class */
if(Konekti.sidebar===undefined) new SideBarPlugIn()

/**
 * Creates a sidebar configuration object
 * @method
 * sideConfig
 * @param id Id of the iframe container
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param side Sidebar component
 * @param main Main component
 * @param parent Parent component
 */
Konekti.sidebarConfig = function(id, width, height, side, main, parent){
	side.parent = id+'Bar'
	main.parent = id+'Main'
	return {'plugin':'sidebar', 'id':id, 'children':[side,main], 'width':width, 'height':height, 'parent':parent}
}

/**
 * Associates/Adds a side bar component (includes navigation bar, and main component)
 * @method
 * sidebar
 * @param id Id of the sidebar component
 * @param width Width of the sidebar
 * @param height Height of the div's component
 * @param side Sidebar component
 * @param main Main component
 * @param parent Parent component
 */
Konekti.sidebar = function(id, width, height, side, main, parent){
	return Konekti.build(Konekti.sidebarConfig(id, width, height, side, main, parent))
}

