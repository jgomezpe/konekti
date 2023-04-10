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
		config = Konekti.config(config)
		config.style["vertical-align"] = "middle"
		config.height = ''
		var c = super.setup(parent, id, [], config)
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

	innerHtml(){
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
				var size = Konekti.font.size(this.config) || 10
				code = '<div style="float:left;vertical-align:middle;margin:4px;width:' + size + 'px;height:' + size +'px;"><img src="' + this.icon.src + '" style="vertical-align:middle;width:100%;height:100%;"></div>' 
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
		c.innerHTML = this.innerHtml()
	}

	/**
	 * Sets the item's caption
	 * @param caption Item's caption
	 */
	setCaption(caption){
		var c = this.vc()
		this.caption = caption
		c.innerHTML = this.innerHtml()
	}

	/**
	 * Sets the item's icon
	 * @param icon Item's icon
	 */
	setIcon(icon){
		var c = this.vc()
		this.icon = icon
		c.innerHTML = this.innerHtml()
	}

}

/**
 * Creates an item
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 * @param config Extra configuration 
 * @param callback Function called when the item is ready
 */
Konekti.item = function(id, icon='', caption='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'item', 'setup':['body', id, icon, caption, config]}, callback)
}
