/** A Button manager */
class Btn extends Container{
	/**
	 * Creates a button configuration object
	 * @param parent Parent component
	 * @param id Id of the button
	 * @param icon Icon for the button
	 * @param caption Caption of the button
	 * @param onclick Information of the method that will be executed when the button is pressed
	 * @param config Style of the button
	 */
	setup(parent, id, icon, caption, onclick='', config={}){
		config.tag = 'div'
		if(onclick!='') config.onclick = Konekti.dom.onclick(id,onclick)
		config.class = (config.class||"") + " w3-button "
		return super.setup(parent, 'btn', id, [{'plugin':'item', 'setup': [id+'Item', icon, caption]}], '', '', config)
	}

	/**
	 * Creates a button configuration object
	 */
	constructor(){ super(...arguments) }

	/**
	 * Sets a component's attribute to the given value 
	 * @param config Item configuration
	 */
	update(icon, caption, title){
		Konekti.client[this.id+'Item'].update(icon, caption)
		if( title !== undefined ) this.vc().title = title
	}
}

/**
 * Associates/adds a header
 * @method
 * btn
 * @param parent Parent component
 * @param id Id of the button
 * @param icon Icon for the button
 * @param caption Caption of the button
 * @param onclick Information of the method that will be executed when the button is pressed
 * @param config Style of the button
 */
Konekti.btn = function(parent, id, icon, caption, onclick='', config={}){
	return new Btn(parent, id, icon, caption, onclick, config)
}