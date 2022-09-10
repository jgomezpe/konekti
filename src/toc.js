uses('https://jgomezpe.github.io/konekti/src/accordion.js')

/** Konekti Plugin for TOC (Table of content) components */
class Toc extends Accordion{
	/**
	 * Creates a TOC configuration object
	 * @param h Size of the main content (1,2,3..) recommended 3 or 4, maximum 6
	 * @param style Style of the toc
	 * @param onclick Method called when an item is selected
	 * @param tree Table of Content component 
	 * @param parent Parent component
	 */
	setup(h, style, onclick, tree, parent='KonektiMain'){
		h = Math.min(h,6)
		var content = null
		if(tree.children !== undefined){
			var children = []
			for( var i=0; i<tree.children.length; i++ )
				children.push({'plugin':'toc', 'setup':[h+1, style, onclick, tree.children[i], tree.id+'Content']})
			content = {'plugin':'container', 'setup':[tree.id+'Content', '', '', children, tree.id]}		
		}
		var config = super.setup(tree.id, tree.icon, tree.caption, h, style, content, tree.open || false, parent)
		if(tree.action === undefined) tree.action = true
		config.expand = tree.action?onclick:function(id){}
		config.plugin = 'toc'
		console.log(config)
		return config
	}

	/**
	 * Creates a TOC configuration object
	 * @param h Size of the main content (1,2,3..) recommended 3 or 4, maximum 6
	 * @param style Style of the toc
	 * @param onclick Method called when an item is selected
	 * @param tree Table of Content component 
	 * @param parent Parent component
	 */
	constructor(h, style, onclick, tree, parent='KonektiMain'){ super(...arguments) }
}

/**
 * Associates/adds a table of contents
 * @method
 * toc
 * @param tree Table of Content component 
 * @param h Size of the main content (1,2,3..)
 * @param style Style of the toc
 * @param onclick Method called when an item is selected
 * @param parent Parent component
 */
Konekti.toc = function(tree, h, style, onclick, parent='KonektiMain'){ return new Toc(h, style, onclick, tree, parent) }