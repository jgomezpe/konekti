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
	 * @param config Client configuration
	 */
	html( config ){ return "<i id='"+this.id+"' class='fa "+config.icon+"'> "+config.caption+"</i>" }   
	
	/**
	 * Sets a component's attribute to the given value 
	 * @param config Item configuration
	 */
	update(icon='', caption=''){
		var c = this.vc()
		c.innerHTML = " " + caption
		c.className = 'fa ' + icon
	}
}

/**
 * Creates an item
 * @param id Id of the item
 * @param icon Icon of the item
 * @param caption Caption of the item
 */
Konekti.item = function(id, icon, caption){ return new Item(id, icon, caption) }