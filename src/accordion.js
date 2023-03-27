/** Konekti plugin for accordion elements */
class AccordionPlugin extends PlugIn{
	constructor(){ super('accordion') }

	/**
	 * Creates an accordion configuration object
	 * @param parent Parent component
	 * @param id Id of the accordion
	 * @param header Accordion's header
	 * @param content Content component
	 * @param showContent If the content will be shown or not
	 * @param onclick Method call when the accordion item is selected
	 * @param config Style of the accordion's header
	 */
	setup(parent, id, header, content, showContent, onclick, config={}){
		config = this.style(config)
		config.style['font-size'] = config.style['font-size'] || (Konekti.font.defaultSize +'px')
		config.width = '100%'
		var cfg = header.config || {}
		cfg.class = (cfg.class || '') + ' w3-button w3-left-align '
		cfg.width = '100%'
		cfg =  this.style(cfg)
		cfg.style['font-size'] = config.style['font-size']
		cfg.style.cursor = 'pointer'
		cfg.tag = 'div'
		cfg.onclick = 'Konekti.client["'+id+'"].show()'
		var children = [{'plugin':'item', 'setup':[id+'Item', header.icon, header.caption, cfg]}]
		if(content!==null) children[1] = content
		var c = super.setup(parent, id, children, config)
		c.onclick = Konekti.dom.onclick(id, onclick)
		c.showContent = showContent
		return c
	}	

	client(config){ return new Accordion(config) }
}

/** Registers the accordion plugin in Konekti */
new AccordionPlugin()

/** An Accordion component */
class Accordion extends Client{
	/**
	 * Creates an accordion configuration object
	 */
	constructor(config){ 
		super(config)
		var x = this
		Konekti.daemon( 
			function(){
				if(x.children.length <= 1) return true
				var c = Konekti.vc(x.children[1].id)
				return c!==undefined  && c!==null 
			}, 
			function(){ if(x.children.length>1 && !x.showContent) Konekti.vc(x.children[1].id).style.display = 'none' }
		) 
	}

	/**
	 * Shows/hides the drop option list
	 */
	show(){
		if(this.children.length>1){
			var x = Konekti.vc(this.children[1].id)
			if( x.style.display=='none'){
				 x.style.display='block'
			}else x.style.display = 'none'
  		}
		eval(this.onclick) 		
	}	
}

/**
 * Associates/adds an accordion
 * @method
 * accordion
 * @param id Id of the accordion
 * @param icon Icon for the accordion's header
 * @param caption Caption of the accordion's header
 * @param content Content component
 * @param showContent If the content will be shown or not
 * @param onclick Method call when the accordion item is selected
 * @param config Style of the accordion's header
 * @param callback Function called when the item is ready
 */
Konekti.accordion = function(id, header, content='', showContent=false, onclick='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'accordion', 'setup':['body',id, header, content, showContent, onclick, config]}, callback)
}
