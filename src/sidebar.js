Konekti.dom.css('.konekti-main{transition:margin-left .4s}\n'+
	'.konekti-sidebar{height:100%;width:200px;background-color:#fff;position:fixed!important;z-index:40;overflow:auto}\n'+
	'.konekti-buttonsidebar{height:100%;width:20px;background-color:#fff;position:fixed!important;z-index:39;overflow:auto}\n'+
	'@media (min-width:'+(Konekti.MEDIUMSIZE+1)+'px){\n'+
	'.konekti-main{margin-left:200px!important;margin-right:0!important}\n'+
	'.konekti-sidebar{display:block!important}\n'+
	'.konekti-buttonsidebar{display:none}\n}\n'+
	'@media (max-width:'+Konekti.MEDIUMSIZE+'px){\n'+
	'.konekti-main{margin-left:20px!important;margin-right:0!important}\n'+
	'.konekti-sidebar{display:none;}\n'+
	'.konekti-buttonsidebar{display:block!important}\n}')

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
		var one = {'plugin':'raw', 'setup':[id+'Bar', [side], {'onmouseleave':client+"close()", 'class':'konekti-sidebar w3-card w3-animate-left'}]}
		var two = {'plugin':'raw', 'setup':[id+'Resize', '&#9776;', {'onmouseenter':client+"open()", 'style':'float:left', 'class':'w3-xlarge konekti-buttonsidebar'}]}
		var three = {'plugin':'raw', 'setup':[id+'Main', main, {'class':'konekti-main', 'style':'width:100%;height:100%;'}]}
		return super.setup(parent, id, [one,two,three], config)
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
	open(){ this.vc('Bar').style.display = 'initial' }

	/**
	 * Hides the sidebar
	 * @param barId Sidebar's id
	 */
	close(){ 
		if(this.vc().clientWidth < 992) this.vc('Bar').style.display = 'none' 
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