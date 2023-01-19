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
	  
	@media (min-width:` + (Konekti.MEDIUMSIZE+1) + `px){
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
	  
	@media (max-width:` + Konekti.MEDIUMSIZE + `px){
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
		var expand = {'plugin':'raw', 'setup':[id+'Resize', '&#9776;', {'onclick':client+"open()", 'class':' w3-large w4-sidebtn '}]}
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
	open(){ this.vc('Bar').style.display = 'block' }

	/**
	 * Hides the sidebar
	 * @param barId Sidebar's id
	 */
	close(){ 
		this.vc('Bar').style.display = null 
	}
}

/**
 * Associates/Adds a side bar component (includes navigation bar, and main component)
 * @method
 * sidebar
 * @param parent Parent component
 * @param id Id of the sidebar component
 * @param side Sidebar component
 * @param main Main component
 * @param config Style of the sidebar
 * @param callback Function called when the sidebar is ready
 */
Konekti.sidebar = function(parent, id, side, main, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==4) args[4] = {}
	if(args.length==5) args[5] = function(){}
	Konekti.add('sidebar', ...args)
}
