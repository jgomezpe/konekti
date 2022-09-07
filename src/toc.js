uses('accordion')

/** Konekti Plugin for TOC (Table of content) components */
class TocPlugIn extends AccordionPlugIn{
	/** Creates a Plugin for TOC components */
	constructor(){ super('toc') }

	/**
	 * Creates a TOC configuration object
	 * @method
	 * tocConfig
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
				content = Konekti.plugin['div'].setup(tree.id+'Content', '', '', '', '', tree.id)		
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
}

/** Accordion class */
if(Konekti.toc === undefined) new TocPlugIn()

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
Konekti.toc = function(tree, h, style, onclick, open){
	return Konekti.build(Konekti.plugin['toc'].setup(tree, h, style, onclick, open))
}