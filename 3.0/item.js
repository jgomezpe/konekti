/** Konekti plugin for item elements */
class ItemPlugin extends PlugIn{
	constructor(){ super('item') }

	/**
	 * Item configuration object
	 * @param parent Parent component
	 * @param id Id of the item
	 * @param icon Icon of the item
	 * @param caption Caption of the item
	 * @param config Extra configuration 
	 */
	setup(parent, id, icon, caption, config={}){ 
		config.tag = config.tag || 'span'
		config.style = "vertical-align:middle;" + (config.style||'')
		var c = super.setup(parent, id, '', config)
		c.icon = icon
		c.caption = caption
		return c
	}

	client(config){ return new Item(config) }
}

/** Registers the item plugin in Konekti */
new ItemPlugin()

/**
 * An item (icon/caption) manager
 */
class Item extends Client{
	/**
	 * Creates an item client with the given id/information, and registers it into the Konekti framework
	 */	
	constructor(config){ super(config) }

	/**
	 * Associated html code
	 */
	html(){ 
		this.inner = this.inner_html()
		return super.html()
	}

	inner_html(){
		var style = Konekti.dom.fontsizeclass(this.config.class!=undefined?this.config.class:"")
		if(style == null) style = Konekti.dom.fontsizestyle(this.config.style!=undefined?this.config.style:"")
		if(style == null) style = Konekti.dom.fontsize(this.parent)
		var fontSize = style * 1.3
		var code = ''
		if(typeof this.icon == 'string') 
			if(this.icon.length > 0){ 
				if(this.icon.startsWith('fa')) this.icon = {'type':'fa', 'src':this.icon} // Backward compatibility
				else this.icon = {'type':'plain', 'src':this.icon}
			}else this.icon = {'type':''}
		switch(this.icon.type){
			case 'fa':
				if(typeof this.icon.src == 'string') 
					code = '<i id="'+this.id+'Icon" class="fa '+this.icon.src+'"></i> '
				else{					
					code = '<span class="fa-stack">\n'
					code += '<i class="fa ' + this.icon.src[0] + ' fa-stack-2x"></i>\n'
					code += '<i class="fa ' + this.icon.src[1] + ' fa-stack-1x"></i>\n'
				  	code += '</span>\n'
				}
			break;
			case 'plain': 
				code = this.icon.src + ' '
			break;
			case 'img':
				code = '<div style="float:left;width:' + fontSize +'px;height:100%;"><img src="' + this.icon.src + '" style="width:100%;height:100%"></div>' 
			break;
		}
		return code + this.caption
	}
	
	/**
	 * Updates icon and caption of the itema component's attribute to the given value 
	 * @param icon Item's icon
	 * @param caption Item's caption
	 */
	update(icon, caption){
		var c = this.vc()
		this.icon = icon
		this.caption = caption
		c.innerHTML = this.inner_html()
	}

	/**
	 * Sets the item's caption
	 * @param caption Item's caption
	 */
	setCaption(caption){
		var c = this.vc()
		this.caption = caption
		c.innerHTML = this.inner_html()
	}

	/**
	 * Sets the item's icon
	 * @param icon Item's icon
	 */
	setIcon(icon){
		var c = this.vc()
		this.icon = icon
		c.innerHTML = this.inner_html()
	}

}

/**
 * Creates an item
 * @param parent Parent component
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 * @param config Extra configuration 
 * @param callback Function called when the item is ready
 */
Konekti.item = function(parent, id, icon, caption, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = ''
	if(args.length==4) args[4] = {}
	if(args.length==5) args[5] = function(){}
	Konekti.add('item', ...args)
}
