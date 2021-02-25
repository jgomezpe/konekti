/** Konekti Plugin for buttons */
class BtnPlugIn extends PlugIn{
	/** Creates a Plugin for buttons */
	constructor(){
		super('btn')
		this.replace = 'strict'
	}

	/**
	 * Defines the run method of the button
	 * @param id Button id
	 * @param onclick Button run configuration
	 */
	run(id, onclick){
		if(typeof onclick==='object'){
			onclick = onclick || {}
			var client = onclick.client || 'client'
			var method = onclick.method || id
			return 'Konekti.client("'+client+'").'+method+'("'+id+'")'
		}
		return onclick
	}	

	/**
	 * Fills the html template with the specific button information
	 * @param thing Button information
	 * @return Html code associated to the button component
	 */
	fillLayout(thing){
		this.addItemHTML()
		thing.icon = thing.icon || ''
		thing.caption = thing.caption || ''
		thing.title = thing.title || ''
		thing.style = thing.style || 'w3-bar-item w3-xlarge'
		thing.run = this.run(thing.id, thing.onclick)
		new Item( thing.id+'-icon' )
		return Konekti.dom.fromTemplate(this.htmlTemplate, thing)
	}

	/**
	 * Fills the html template with a specific button list information
	 * @param thing button list information
	 * @return Html code associated to the button list component
	 */
	listLayout( thing ){
		var btnsHTML = ''
		var btn = thing.btn
		for( var i=0; i<btn.length; i++ ){
			btn[i].style = (btn[i].style || '')+" w3-bar-item "
			btn[i].onclick = btn[i].onclick || {'client':thing.client, 'method':thing.method||btn[i].id}
			btnsHTML += this.fillLayout( btn[i] )
			new Btn(btn[i])
		} 
		return btnsHTML
	}

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new Btn(thing) }

	/**
	 * Creates a config object from parameters
	 * @param id Id of the button
	 * @param icon Icon of the button
	 * @param caption Caption of the button
	 * @param onclick Information of the method that will be executed when the button is pressed
	 * @param style Style of the button
	 * @param title Message that will be shown when mouse is over the button
	 */
	config(id, icon='', caption='', onclick={'client':'client'}, style='w3-bar-item w3-xlarge', title=''){
		return {'id':id, 'style':style, 'caption':caption, 'icon':icon, 'title':title, 'onclick':onclick}
	}
}

/** A Button manager */
class Btn extends Client{
	/** 
	 * Creates a Button Manager
	 * @param thing Configuration of the button
	 */
	constructor(thing){ super(thing) }

	/**
	 * Sets a component's attribute to the given value 
	 * @param thing Component configuration 
	 */
	update(thing){
		var c = this.vc()
		if( thing.title !== undefined ) c.title = thing.title
		Konekti.client(this.id+'-icon').update(thing)
		if( thing.onclick !== undefined ) c.onclick = Konekti.plugins.btn.run(thing.id, thing.onclick)
	}
}

/** Creates and registers the button plugin */
if( Konekti.btn === undefined ) new BtnPlugIn()

/**
 * Associates/Adds a button 
 * @method
 * btn
 * @param id Id/Configuration of the button
 * @param icon Icon of the button
 * @param caption Caption of the button
 * @param onclick Information of the method that will be executed when the button is pressed
 * @param style Style of the button
 * @param title Message that will be shown when mouse is over the button
 */
Konekti.btn = function(id, icon, caption, onclick, style, title){
	if(typeof id === 'string') id=Konekti.plugins.btn.config(id, icon, caption, onclick, style, title)
	return Konekti.plugins.btn.connect(id) 
}
