/** Konekti Plugin for TOC (Table of content) components */
class Toc extends Container{
	children_setup(children, style, onclick){
		if(!Array.isArray(children)) children = [children]
		var nchildren = []
		for( var i=0; i<children.length; i++ ){
			var c = children[i]
			if(typeof c === 'string') c = [c, '', c,{}]
			var nc = this.children_setup(c[6] || [], style, onclick)
			nc = {'plugin':'container', 'setup':['container', c[0]+'Group', nc, '', '', {'style':'margin-left:8px;'}]}
			nchildren[i] = {'plugin':'accordion', 'setup':[c[0], c[1], c[2], c[3]||{}, nc, c[4]||false, 
			(c[5]===undefined || c[5])?Konekti.dom.onclick(c[0], onclick):'']}
		}
		return nchildren
	}

	/**
	 * Creates a TOC configuration object
	 * @param parent Parent component
	 * @param config Style of the toc
	 * @param onclick Method called when an item is selected
	 * @param content Table of Content component 
	 */
	setup(parent, id, config, onclick, content){
		config.style = 'padding:0px;'+(config.style || '')
		return super.setup(parent, 'toc', id, this.children_setup(content, config, onclick), '', '', config)
	}

	/**
	 * Creates a TOC configuration object
	 */
	constructor(){ super(...arguments) }
}

/**
 * Associates/adds a table of contents
 * @method
 * toc
 * @param style Style of the toc
 * @param onclick Method called when an item is selected
 * @param tree Table of Content component 
 * @param parent Parent component
 */
Konekti.toc = function(parent, id, style, onclick, content){ 
	return new Toc(parent, id, style, onclick, content) 
}
