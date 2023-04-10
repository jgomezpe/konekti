Konekti.dom.css(
	`.w4-main{
		height:100%;
		margin-left:200px;
		transition:margin-left .4s;
		position:fixed!important;
		overflow:auto;
	}
	  
	.w4-sidebar{
		height:100%;
		width:200px;
		background-color:#fff;
		position:fixed!important;
		z-index:40;
		overflow:auto;
	}
	  
	.w4-sidebtn{
		height:100%;
		width:20px;
		background-color:#fff;
		opacity:0.4;
		position:fixed;
		cursor:pointer;
	}
	  
	@media (min-width:` + (Konekti.MEDIUM_SIZE+1) + `px){
		.w4-main{
			margin-left:200px!important;
			margin-right:0px!important;
		}
		
		.w4-sidebtn{
		   display:none;
		}
	   
		.w4-sidebar{
			display:block;
		}
	}

	  
	@media (max-width:` + Konekti.MEDIUM_SIZE + `px){
		.w4-sidebar{
			display:none;
		}
	   
		.w4-sidebtn{
			display:block;
		}
	   
		.w4-main{
			margin-left:20px!important;
			margin-right:0px!important;
		}
	}`
)


/** Konekti plugin for sidebarb elements */
class SideBarPlugin extends PlugIn{
	constructor(){ super('sidebar') }

	/**
	 * Creates a sidebar configuration object
	 * @param parent Parent component
	 * @param id Id of the iframe container
	 * @param side Sidebar component
	 * @param main Main component
	 * @param config Style of the sidebar
	 */
	 setup(parent, id, side, main, config={}){
		var client = 'Konekti.client["'+id+'"].'
		var side = {'plugin':'raw', 'setup':[id+'Bar', [
			{'plugin':'btn', 'setup':[id+'Close', 'fa fa-times', '', client+'close()', {'class':' w3-large w3-hide-large w3-right-align '}]},
			side
		], {'class':'w4-sidebar w3-collapse w3-card w3-animate-left'}]}
		config.layout='row'
		var expand = {'plugin':'raw', 'setup':[id+'Resize', '&#9776;', {'width':'20px','onclick':client+"open()", 'class':' w3-large w4-sidebtn '}]}
		var main = {'plugin':'raw', 'setup':[id+'Main', main, {'class':' w4-main ', 'style':'margin-left:200px;height:100%;'}]}
		return super.setup(parent, id, [expand,side,main], config)
	}
	
	client(config){ return new SideBar(config) }
}

/** Registers the sidebar plugin in Konekti */
new SideBarPlugin()

/** Sidebar client */
class SideBar extends Client{
	/** 
	 * Creates a tab component manager 
	 */
	constructor( config ){ super(config) }
			
	/**
	 * Displays the sidebar
	 * @param barId Sidebar's id
	 */
	open(){ 
		var x = this
		x.vc('Resize').style.display = 'none' 
		x.vc('Bar').style.display = 'block' 
		x.update(x.width, x.height)
	}

	/**
	 * Hides the sidebar
	 * @param barId Sidebar's id
	 */
	close(){ 
		var x = this
		x.vc('Resize').style.display = 'block' 
		x.vc('Bar').style.display = 'none' 
		x.update(x.width, x.height)
	}

    /**
     * Resizes the component 
	 * @param width Component's width
	 * @param height Component's height
     */
    update( width, height ){
		var x = this
		if(width>Konekti.MEDIUM_SIZE){
			x.children[0].resize(0,height)
			x.children[1].resize(200,height)
			x.children[2].resize(width-200,height)
		}else{
			x.children[2].resize(width,height)
		}
	}

    /**
     * Resizes the component 
	 * @param width Parent's width
	 * @param height Parent's height
     */
    resize( width, height ){
		var x = this
		width = x.computeSize(width, x.config.width, x.parent!==undefined?Konekti.client[x.parent].fitWidth():0)
		height = x.computeSize(height, x.config.height, x.parent!==undefined?Konekti.client[x.parent].fitHeight():0)
		x.width = width
		x.vc().style.width = width + 'px'
		x.height = height
		x.vc().style.height = height + 'px'
		x.update(width, height)
	}
}

/**
 * Associates/Adds a side bar component (includes navigation bar, and main component)
 * @method
 * sidebar
 * @param id Id of the sidebar component
 * @param side Sidebar component
 * @param main Main component
 * @param config Style of the sidebar
 * @param callback Function called when the sidebar is ready
 */
Konekti.sidebar = function(id, side, main, config={}, callback=function(){}){ 
	Konekti.add({'plugin':'sidebar', 'setup':['body',id,side,main,config]}, callback)
}