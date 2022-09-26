/**
 * An item (icon/caption) manager
 */
class Item extends Client{
	/**
	 * Item configuration object
	 * @param parent Parent component
	 * @param id Id of the item
	 * @param icon Icon of the item
	 * @param caption Caption of the item
	 * @param config Extra configuration 
	 */
	setup(parent, id, icon, caption, config={}){ 
		config.tag = 'div'
		config.class = "vertical-align:middle;" + (config.class||'')
		var c = super.setup(parent, 'item', id, '', '', config)
		c.icon = icon
		c.caption = caption
		return c
	}

	/**
	 * Creates an item client with the given id/information, and registers it into the Konekti framework
	 */	
	constructor(){ super(...arguments) }

	/**
	 * Associated html code
	 */
	html(){ 
		this.inner = this.inner_html()
		return super.html()
	} 

	inner_html(){
		var el = Konekti.vc(this.parent)
		var style = window.getComputedStyle(el, null).getPropertyValue('font-size')
		var fontSize = parseFloat(style) * 1.3
		var code = ''
		if(typeof this.icon == 'string') 
			if(this.icon.length > 0) this.icon = {'type':'fa', 'src':this.icon} // Backward compatibility
			else this.icon = {'type':''}
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
			case 'img':
				code = '<div style="float:left;width:' + fontSize +'px;height:100%;"><img src="' + this.icon.src + '" style="width:100%;height:100%"></div>' 
			break;
		}
		return code + this.caption
	}
	
	/**
	 * Sets a component's attribute to the given value 
	 * @param config Item configuration
	 */
	update(icon, caption){
		var c = this.vc()
		this.icon = icon
		this.caption = caption
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
 */
Konekti.item = function(parent, id, icon, caption, config={}){ return new Item(parent, id, icon, caption, config) }