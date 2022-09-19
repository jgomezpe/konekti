/**
 * An item (icon/caption) manager
 */
class Item extends Client{
	/**
	 * Item configuration object
	 * @param id Id of the item
	 * @param icon Icon of the item
	 * @param caption Caption of the item
	 * @param parent Parent component
	 */
	setup(id, icon, caption, parent='KonektiMain'){ return {'plugin':'item', 'id':id, 'icon':icon, 'caption':caption, 'parent':parent } }

	/**
	 * Creates an item client with the given id/information, and registers it into the Konekti framework
	 * @param id Id of the item
	 * @param icon Icon of the item
	 * @param caption Caption of the item
	 * @param parent Parent component
	 */	
	constructor(id, icon, caption, parent='KonektiMain'){ super(...arguments) }

	/**
	 * Associated html code
	 */
	html(){ return '<div id="'+this.id+'" style:"vertical-align:middle;" >' + this.inner_html() +'</div>' } 

	inner_html(){
		var el = Konekti.vc(this.parent)
		var style = window.getComputedStyle(el, null).getPropertyValue('font-size')
		var fontSize = parseFloat(style) * 1.3
		var code = ''
		if(typeof this.config.icon == 'string') this.config.icon = {'type':'fa', 'src':this.config.icon} // Backward compatibility
		switch(this.config.icon.type){
			case 'fa':
				if(typeof this.config.icon.src == 'string') 
					code = '<i id="'+this.id+'Icon" class="fa '+this.config.icon.src+'"></i>'
				else{					
					code = '<span class="fa-stack">\n'
					code += '<i class="fa ' + this.config.icon.src[0] + ' fa-stack-2x"></i>\n'
					code += '<i class="fa ' + this.config.icon.src[1] + ' fa-stack-1x"></i>\n'
				  	code += '</span>\n'
				}
			break;
			case 'img':
				code = '<div style="float:left;width:' + fontSize +'px;height:100%;"><img src="' + this.config.icon.src + '" style="width:100%;height:100%"></div>' 
			break;
		}
		return code + this.config.caption
	}
	
	/**
	 * Sets a component's attribute to the given value 
	 * @param config Item configuration
	 */
	update(icon, caption){
		var c = this.vc()
		this.config.icon = icon
		this.config.caption = caption
		c.innerHTML = this.inner_html()
	}
}

/**
 * Creates an item
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 * @param parent Parent component
 */
Konekti.item = function(id, icon, caption, parent='KonektiMain'){ return new Item(id, icon, caption, parent) }