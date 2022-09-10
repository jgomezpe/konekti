uses('accordion')

/** Konekti Plugin for TOC (Table of content) components */
class Toc extends Accordion{
	/**
	 * Creates a TOC configuration object
	 * @param tree Table of Content component 
	 * @param h Size of the main content (1,2,3..) recommended 3 or 4, maximum 6
	 * @param style Style of the toc
	 * @param onclick Method called when an item is selected
	 * @param open If toc component should be displayed or not
	 * @param parent Parent component
	 */
	setup(tree, h, style, onclick, open, parent='KonektiMain'){
		var config = tree
		if(h !== undefined){
			h = Math.min(h,6)
			var content =null
			if(tree.children !== undefined){
				content = {'plugin':'div', 'setup':[tree.id+'Content', '', '', '', '', tree.id]}		
				content.children = []
				for( var i=0; i<tree.children.length; i++ ){
					content.children.push(this.setup(tree.children[i], h+1, style, onclick, false, tree.id+'Content'))
				}
			}
			var config = super.setup(tree.id, tree.icon, tree.caption, h, style, content, open, parent)
			if(tree.action === undefined) tree.action = true
			config.expand = tree.action?onclick:function(id){}
		}
		config.plugin = 'toc'
		return config
	}

	/**
	 * Creates a TOC configuration object
	 * @param tree Table of Content component 
	 * @param h Size of the main content (1,2,3..) recommended 3 or 4, maximum 6
	 * @param style Style of the toc
	 * @param onclick Method called when an item is selected
	 * @param open If toc component should be displayed or not
	 * @param parent Parent component
	 */
	constructor(tree, h, style, onclick, open, parent='KonektiMain'){ super(...arguments) }
}

/**
 * Associates/adds a table of contents
 * @method
 * btn
 * @param tree Table of Content component 
 * @param h Size of the main content (1,2,3..)
 * @param style Style of the toc
 * @param onclick Method called when an item is selected
 * @param open If toc component should be displayed or not
 */
Konekti.toc = function(tree, h, style, onclick, open){ return new Toc(tree, h, style, onclick, open) }