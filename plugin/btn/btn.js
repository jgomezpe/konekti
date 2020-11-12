/** Konekti Plugin for buttons */
class ButtonPlugIn extends KonektiPlugIn{
	/** Creates a Plugin for buttons */
	constructor(){ super('btn') }

	/**
	 * Creates a configuration object from button characteristics
	 * @param id Id of the button
	 * @param caption Caption of the button
	 * @param onclick Information of the method that will be executed when the button is pressed
	 * @param style Style of the button 
	 * @param icon Icon of the button 
	 * @param title Message that will be shown when mouse is over the button
	 */
	config(id, caption, onclick, style, icon, title){
		var thing
		if( typeof id === 'object' ) thing = id 
		else thing = {'id':id, 'style':style, 'caption':caption, 'icon':icon, 'title':title, 'onclick':onclick}
		thing.caption = thing.caption || ''
		onclick = thing.onclick
		if(typeof onclick==='string') thing.run = onclick
		else{
			onclick = onclick || {}
			var client = onclick.client || 'client'
			var method = onclick.method || thing.id
			thing.run = 'Konekti.client("'+client+'").'+method+'("'+thing.id+'")'
		}
		return thing
	}

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new Btn(thing) }
}

/** Creates and registers the button plugin */
new ButtonPlugIn()

/** A Button manager */
class Btn extends KonektiClient{
	/** 
	 * Creates a Button Manager
	 * @param thing Configuration of the navbar
	 */
	constructor(thing){ super(thing) }

	/**
	 * Sets a component's attribute to the given value 
	 * @param thing Component configuration 
	 */
	update(thing){
		var c = this.vc()
		if( thing.title !== undefined ) c.title = thing.title
		if( thing.caption !== undefined ) Konekti.core.update(this.id, 'caption', thing.caption)
		if( thing.icon !== undefined ) this.vc('-icon').className = thing.icon
		var onclick = thing.onclick
		if( onclick !== undefined ){
			if(typeof onclick==='string') c.onclick = onclick
			else{
				onclick = onclick || {}
				var client = onclick.client || 'client'
				var method = onclick.method || thing.id
				c.onclick = 'Konekti.client("'+client+'").'+method+'("'+this.id+'")'
			}
		}

	}
}


/**
 * @function
 * Konekti btn
 * @param id Id of the button
 * @param icon Icon of the button (default value '')
 * @param caption Caption of the button
 * @param onclick Information of the method that will be executed when the button is pressed
 * @param style Style of the button (default value 'w3-bar-item w3-xlarge')
 * @param title Message that will be shown when mouse is over the button (default value '')
 */
Konekti.btn = function(id, icon='', caption='', onclick={'client':'client'}, 
			style='w3-bar-item w3-xlarge', title=''){
	return Konekti.plugin.btn.connect(Konekti.plugin.btn.config(id, caption, onclick, style, icon, title))
}
