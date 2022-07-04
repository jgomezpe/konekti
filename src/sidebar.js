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
	constructor( config ){ super(config) }
			
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.updateSize( parentWidth, parentHeight )
		var side = this.children[0].vc()
		console.log(this.height)
		if(parentWidth > 992){
			this.children[0].setParentSize(200,this.height)
			this.children[2].setParentSize(this.width-200, this.height)
			this.children[2].vc().style.marginLeft = 200 + 'px'
		}else{
			this.children[2].setParentSize(this.width-20, this.height)
			this.children[2].vc().style.marginLeft = 20 + 'px'
		}	
	}


	/**
	 * Displays the sidebar
	 * @param barId Sidebar's id
	 */
	open(){ this.vc('Bar').style.display = 'initial' }

	/**
	 * Hides the sidebar
	 * @param barId Sidebar's id
	 */
	close(){ this.vc('Bar').style.display = 'none' }
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
Konekti.sidebarConfig = function(id, width, height, side, main, parent='KonektiMain'){
	var client = 'Konekti.client["'+id+'"].'
	var one = Konekti.divConfig(id+'Bar', '', '', "onmouseleave='"+client+"close()' class='konekti-sidebar w3-card w3-animate-left'",'', id)
	var two = Konekti.divConfig(id+'Resize', '', '', "onmouseenter='"+client+"open()' style='float:left' class='w3-xlarge konekti-buttonsidebar'", '&#9776;', id)
	var three = Konekti.divConfig(id+'Main', '100%', '100%', "", '', id)
	one.children = [side]
	three.children = [main]
	return {'plugin':'sidebar', 'id':id, 'width':width, 'height':height, 'children':[one,two,three], 'parent':parent}
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
 */
Konekti.sidebar = function(id, width, height, side, main){
	return Konekti.build(Konekti.sidebarConfig(id, width, height, side, main))
}

