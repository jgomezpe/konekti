/** Konekti plugin for dropdown elements */
class DropDownPlugin extends PlugIn{
	constructor(id='dropdown'){ super(id) }

	/**
	 * Creates a dropdown configuration object
	 * @param parent Parent component
	 * @param id Id of the dropdown
	 * @param icon Icon of the dropdown
	 * @param caption Caption of the dropdown
	 * @param content Content
	 * @param config Style of the dropdown
	 */
	setup(parent, id, icon, caption, content, config={}){
		var btn = {'plugin':'btn', 'setup':[id+'Btn', icon, caption, {'client':id, 'method':'click'}, config]}
		var drop = {'plugin':'raw', 'setup':[id+'Drop', content, {'tag':'div', "class":'w3-dropdown-content w3-bar-block w3-border'}]}
		return super.setup(parent, id, [btn,drop], config)		
	}

	client(config){ return new DropDown(config) }
}

/** Registers the dropdown plugin in Konekti */
new DropDownPlugin()

/** Konekti Plugin for DropDown components */
class DropDown extends Client{
	/**
	 * Creates a dropdown client object
	 */
	constructor(config){ super(config) }

	click(){
		var x = this.vc()
		if (x.className.indexOf("w3-show") == -1) x.className += " w3-show"
		else x.className = x.className.replace(" w3-show", "")
	}
}

/**
 * Associates/Adds a dropdown
 * @method
 * dropdown
 * @param parent Parent component
 * @param id Id of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param content List of options to dropdown
 * @param config config of the dropdown
 * @param callback Function called when the dropdown is ready
 */
Konekti.dropdown = function(parent, id, icon, caption, content, config, callback){
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==5) args[5] = {}
	if(args.length==6) args[6] = function(){}
	Konekti.add('dropdown', ...args)
}
