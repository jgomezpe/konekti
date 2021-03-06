/** Konekti Plugin for applications with header/content/footer */
class HCFPlugIn extends PlugIn{
	/** Creates a Plugin for sidebar applications */
	constructor(){ super('hcf') }

	component( thing, t ){
		thing[t].id = thing[t].id || thing.id+'-'+t
		var c = Konekti.vc(thing[t].id)
		if(thing[t].height!==undefined) c.style="overflow:auto;width:100%;height:"+thing[t].height
		if( thing[t].plugin !== undefined ) Konekti[thing[t].plugin](thing[t])
		if(thing[t].height===undefined) thing[t].height = ''+ Konekti.vc(thing[t].id).offsetHeight +'px'
		return thing[t].height
	}

	/**
	 * Provides to a visual component the plugin's functionality 
	 * @param thing Plugin instance information
	 * @param callback Function that will be executed as the box component is loaded
	 */
	connect(thing, callback){
		var x = this
		thing.header = thing.header || {}
		thing.footer = thing.footer || {}
		thing.idheader = thing.header.id || thing.id + '-header'
		thing.idfooter = thing.footer.id || thing.id + '-footer'
		thing.idcontent = thing.content.id || thing.id + '-content'
		function size(){
			var heighth = x.component(thing,'header')
			var heightf = x.component(thing,'footer')
			var px = 0
			var height = 100
			if( heighth.charAt(heighth.length-1) == '%' ) 
				height -= parseInt(heighth.substring(0,heighth.length-1))
			else	px += parseInt(heighth)
			if( heightf.charAt(heightf.length-1) == '%' ) 
				height -= parseInt(heightf.substring(0,heightf.length-1))
			else	px += parseInt(heightf)
			if( px > 0 ) height = 'calc(' + height + '% - ' + px + 'px)'
			else height += '%'
			thing.content.height = height
			x.component(thing,'content')
			if(callback!==undefined) callback()
		}
		var uses = Konekti.analize(thing)
		thing.gui = this.html(thing)
		Konekti.load(...uses,size)
		return this.client(thing)
	}

	/**
	 * Creates a config object from parameters
	 * @param id Id of the header/content/footer component
	 * @param content Content component configuration
	 * @param header Header component configuration
	 * @param footer Footer component configuration
	 */
	config(id, content, header={}, footer={}){
		return {'id':id, 'content':content, 'header':header, 'footer':footer}
	}
}

/** Header/content/footer component */
if(Konekti.hcf===undefined) new HCFPlugIn()

/**
 * Associates/Adds a Header/Content/Footer component
 * @method
 * hcf
 * @param id Id/Configuration of the header/content/footer component
 * @param content Content component configuration or Function that will be executed as the box component is loaded 
 * @param header Header component configuration
 * @param footer Footer component configuration
 * @param callback Function that will be executed as the box component is loaded
 */
Konekti.hcf = function(id, content, header, footer, callback){
	if(typeof id === 'string') id=Konekti.plugins.hcf.config(id,content,header,footer)
	else callback = content
	return Konekti.plugins.hcf.connect(id, callback)
}
