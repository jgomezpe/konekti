/** Konekti plugin for accordion elements */
class AccordionPlugin extends PlugIn{
	constructor(){ super('accordion') }

	/**
	 * Creates an accordion configuration object
	 * @param parent Parent component
	 * @param id Id of the accordion
	 * @param icon Icon for the accordion's header
	 * @param caption Caption of the accordion's header
	 * @param content Content component
	 * @param showContent If the content will be shown or not
	 * @param onclick Method call when the accordion item is selected
	 * @param config Style of the accordion's header
	 */
	setup(parent, id, icon, caption, content, showContent, onclick, config){
		var children = [{'plugin':'item', 'setup':[id+'Item', icon, caption, 
			{'class':'w3-button w3-left-align', 'style':'width:100%;cursor:pointer;', 'tag':'div', 'onclick':'Konekti.client["'+id+'"].show()'}]}]
		if(content!==null) children[1] = content
		config.style = 'width:100%;' + (config.style||'')
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
		if(this.children.length>1 && !this.showContent) Konekti.vc(this.children[1].id).style.display = 'none'
	}

	/**
	 * Shows/hides the drop option list
	 */
	show(){
		if(this.children.length>1){
			var x = Konekti.vc(this.children[1].id)
			if( x.style.display=='none') x.style.display='block'
			else x.style.display = 'none'
  		}
		eval(this.onclick) 		
	}	
}

/**
 * Associates/adds an accordion
 * @method
 * accordion
 * @param parent Parent component
 * @param id Id of the accordion
 * @param icon Icon for the accordion's header
 * @param caption Caption of the accordion's header
 * @param content Content component
 * @param showContent If the content will be shown or not
 * @param onclick Method call when the accordion item is selected
 * @param config Style of the accordion's header
 * @param callback Function called when the item is ready
 */
Konekti.accordion = function(parent, id, icon, caption, content, showContent, onclick, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = ''
	if(args.length==4) args[4] = ''
	if(args.length==5) args[5] = false
	if(args.length==6) args[6] = ''
	if(args.length==7) args[7] = {}
	if(args.length==8) args[8] = function(){}
	Konekti.add('accordion', ...args)
}
