/** Konekti plugin for table of content (toc) elements */
class TocPlugin extends PlugIn{
	constructor(){ super('toc') }

	children_setup(children, style, onclick){
		if(!Array.isArray(children)) children = [children]
		var nchildren = []
		for( var i=0; i<children.length; i++ ){
			var c = children[i]
			if(typeof c === 'string') c = [c, '', c]
			var id = c[0] 
			var icon = c[1]
			var caption = c[2]
			var cstyle = c[3] || {}
			cstyle.class = 'w3-block w3-left-align ' + (cstyle.class||'')
			cstyle = Konekti.config(cstyle)
			cstyle.style['font-size'] = cstyle.style['font-size'] || style.style['font-size']
			var xchildren = c[4] || []
			var showChildren = (c[5]!==undefined && c[5] !=null && c[5])
			var call_action = (c[6]==undefined || c[6])
			var nc = (xchildren.length>0)?this.children_setup(xchildren, style, onclick):null
			if(nc!==null) nc = {'plugin':'raw', 'setup':[id+'Group', nc, {'style':'margin-left:8px;width:100%;'}]}
			nchildren[i] = {'plugin':'accordion', 'setup':[id, {'icon':icon, 'caption':caption, 'config':cstyle},  nc, showChildren,
			(call_action)?Konekti.dom.onclick(id, onclick):'', style]}
		}
		return nchildren
	}

	/**
	 * Creates a TOC configuration object
	 * @param parent Parent component
	 * @param id Id of the toc
	 * @param content Table of Content component 
	 * @param onclick Method called when an item is selected
	 * @param config Style of the toc
	 */
	setup(parent, id, content, onclick, config){
		config = Konekti.config(config)
		config.style['font-size'] = config.style['font-size'] || (Konekti.font.defaultSize +'px')
		config.style.padding = '0px'
		return super.setup(parent, id, this.children_setup(content, config, onclick), config)
	}

	client(config){ return new Toc(config) }
}

/** Registers the item plugin in Konekti */
new TocPlugin()

/** Konekti client for TOC (Table of content) components */
class Toc extends Client{
	/**
	 * Creates a TOC configuration object
	 */
	constructor(config){ super(config) }
}

/**
 * Associates/adds a table of contents
 * @method
 * toc
 * @param id Id of the accordion
 * @param content Elements of the Table of Content 
 * @param onclick Method called when an item is selected
 * @param config Style of the toc
 * @param callback Function called when the toc component is ready
 */
Konekti.toc = function(id, content, onclick='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'toc', 'setup':['body', id, content, onclick, config]}, callback)
}
