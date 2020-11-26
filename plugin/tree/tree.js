/** Konekti Plugin for tree components */
class TreePlugIn extends KonektiPlugIn{
    /** Creates a Plugin for tree components */
    constructor(){
        super('tree')
        this.replace = 'strict'
    }
    
    /**
     * Splits the html template in the tree components 
     */
    splitTemplate(){
        var k = this.htmlTemplate.indexOf("</div>\n<div") + 7
        var template = this.htmlTemplate.substring(k)
        this.htmlTemplate = this.htmlTemplate.substring(0,k)
        k = template.indexOf("</div>\n<div") + 7
        this.itemTemplate = template.substring(0,k)
        template = template.substring(k)
        k = template.indexOf("</div>\n<div") + 7
        this.optionsTemplate = template.substring(0,k)
        this.innerTemplate = template.substring(k)
        k = this.innerTemplate.indexOf("</div>\n<div") + 7
        this.leafTemplate = this.innerTemplate.substring(0,k)
    }

    /**
     * Generates the html associated to a node of the tree
     * @param tree Tree's id
     * @param id node's id
     * @param option Nodes configuration
     */
    fillOption(tree, id, option){
        if( option !== undefined ){
            var optTemplate = ''
            for( var i=0; i<option.length; i++ ){
		var opt = option[i]
                if( typeof opt == 'string'){
                    opt = {"id":id+'-'+opt, "caption":opt}
                }
                opt.tree = tree
                optTemplate += Konekti.core.fromTemplate(this.itemTemplate, opt)
            }
            var copt = {"id":id, "tree":tree, "drop":optTemplate}
            return Konekti.core.fromTemplate(this.optionsTemplate, copt)
        }else return ''
    }

    /**
     * Generates the html associated to a leaf node of the tree
     * @param tree Tree's id
     * @param leaf node's id
     * @param icon node's icon
     * @param option Nodes configuration
     */
    fillLeaf(tree, leaf, icon, option){
        leaf.tree = tree
        leaf.run = "Konekti.client('·tree·').select('·id·')"
        leaf.run = Konekti.core.fromTemplate(leaf.run, leaf)
        leaf.icon = leaf.icon || icon
        option = leaf.option || option
        leaf.options = this.fillOption(tree, leaf.id, option)
        return Konekti.core.fromTemplate(this.leafTemplate, leaf)
    }

    /**
     * Generates the html associated to an inner node of the tree
     * @param tree Tree's id
     * @param inner node's id
     * @param icon node's icon
     * @param option Nodes configuration
     */
    fillInner(tree, inner, icon, option){
        var id = inner.id
        var template = ''
        for( var i=0; i<inner.children.length; i++ ){
            var child = inner.children[i]
            if( typeof child === 'string' ) child = {"id":child, "caption":child}
            if( child.caption === undefined ) child.caption = child.id
            if( child.id === undefined ) child.id = child.caption
            if( child.children !== undefined  ) template += this.fillInner(tree, child, icon, option)
            else template += this.fillLeaf(tree, child, icon.leaf, option.leaf)
        }
        inner.tree = tree
        inner.run = "Konekti.client('·tree·').expand('·id·')"
        inner.run = Konekti.core.fromTemplate(inner.run, inner)
        inner.icon = inner.icon || icon.expand
        inner.contracticon = inner.contracticon || icon.contract
        inner.inner = template
        inner.options = this.fillOption(tree, inner.id, option.inner)
        return Konekti.core.fromTemplate(this.innerTemplate, inner)
    }

    /**
     * Fills the html template with the specific tree information
     * @param thing Tree information
     * @return Html code associated to the tree component
     */
    fillLayout(thing){
        if(this.innerTemplate === undefined || this.innerTemplate === null) this.splitTemplate()
        var id = thing.id
        thing.client = thing.client || 'client'
        var icon = thing.icon || {"leaf":"", "expand":"fa fa-angle-right", "contract":"fa fa-angle-down"}
        var options = thing.options || {}
        if( thing.tree.caption === undefined ) thing.tree.caption = thing.tree.id
        if( thing.tree.id === undefined ) thing.tree.id = thing.tree.caption
        thing.inner = this.fillInner(id, thing.tree, icon, options )
        return Konekti.core.fromTemplate(this.htmlTemplate, thing)
    }

    	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new Tree(thing) }

}

new TreePlugIn()

/** Tree manager */
class Tree extends KonektiClient{
    /** 
     * Creates a tree component manager 
     * @param thing Tree configuration
     */
	constructor( thing ){
		super(thing)
		this.client = thing.client
		this.clientSelect = thing.select || 'select'
		this.sel_color = thing.sel_color || " w3-green"
	}
	
    /** 
     * Shows/hides a tree element 
     * @param id Id of the element of the tree to show/hide according to selection
     */
	showhide( id ){
        if( this.current !== undefined ){
            var cx = Konekti.vc(this.current)
            cx.className = cx.className.replace(this.sel_color, ' ')
            var ceb = Konekti.vc(this.current+'-btn')
            if( ceb !== undefined && ceb !== null){
                var xd = Konekti.vc(this.current+'-drop');
                if (xd.className.indexOf("w3-show") != -1)
                    xd.className = xd.className.replace(" w3-show", "")
                ceb.className = ceb.className.replace('w3-show', 'w3-hide')
                ceb.className = ceb.className.replace(this.sel_color, ' ')
            }    
        }
        this.current = id
        
        var x = Konekti.vc(id);
        x.className += this.sel_color
        var eb = Konekti.vc(id+'-btn');
        if( eb !== undefined && eb !== null){
            eb.className += this.sel_color
            eb.className = eb.className.replace('w3-hide', 'w3-show')
        }
	}
	
    /** 
     * Shows/hides a tree element options
     * @param id Id of the element of the tree that shows its options
     */
	drop( id ){
        var x = Konekti.vc(id+'-drop');
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else { 
            x.className = x.className.replace(" w3-show", "")
        }
	}
	
    /** 
     * Runs proccess associated to the selected option
     * @param id Selected option
     */
	select( id ){
        var c = Konekti.client(this.client)
        if( typeof c != 'undefined' && c[this.clientSelect] !== undefined ) 
            c[this.clientSelect](id)
        this.showhide(id)
	}

    /** 
     * Shows/hides a tree inner node
     * @param id Id of the inner node of the tree to show/hide
     */
    expand( id ){
        var c = Konekti.client(this.client)
        if( typeof c != 'undefined' && typeof c.expand != 'undefined' ) c.expand(id)
        this.showhide(id)
        var x = Konekti.vc(id);
        var b = Konekti.vc(id+'-icon')
        var i = Konekti.vc(id+'-inner')
        if(i.className.indexOf('w3-show') == -1){ 
            i.className = i.className.replace('w3-hide', 'w3-show')
            b.className = x.getAttribute('cicon')
        }else{
            i.className = i.className.replace('w3-show', 'w3-hide')
            b.className = x.getAttribute('icon')
        }    
    }  

    /**
     * updates the html associated to a node of the tree
     * @param tree Tree's id
     * @param id node's id
     * @param option Nodes configuration
     */
    updateOption(id, option){
        if( option !== undefined && option !== null){
            var optTemplate = ''
            for( var i=0; i<option.length; i++ ){
		if( option[i].caption !== undefined ) Konekti.core.update(option[i].id, 'caption', option[i].caption)
		if( option[i].icon !== undefined ) Konekti.vc(option[i]+'-icon').className = option[i].icon
            }
        }
    }

    /**
     * Updates the html associated to a leaf node of the tree
     * @param leaf node's id
     * @param icon node's icon
     * @param option Nodes configuration
     */
    updateLeaf(leaf, icon, option){
        if( icon !== undefined && icon !== null ) Konekti.vc(leaf.id).icon = icon
        if( leaf.icon !== undefined && leaf.icon !== null ) Konekti.vc(leaf.id).icon = leaf.icon
	Konekti.vc(leaf.id+'-icon').className = Konekti.vc(leaf.id).icon
	if( leaf.caption !== undefined ) Konekti.core.update(leaf.id, 'caption', leaf.caption )
	this.updateOption( leaf.id, leaf.option || (option!==undefined && option!==null)?option.leaf:null )
   }

    /**
     * Updates the html associated to an inner node of the tree
     * @param tree Tree's id
     * @param inner node's id
     * @param icon node's icon
     * @param option Nodes configuration
     */
    updateInner(inner, icon, option){
        var id = inner.id
        for( var i=0; i<inner.children.length; i++ ){
            var child = inner.children[i]
            if( child.children !== undefined  ) this.updateInner(child, icon, option)
            else{ 
		if( icon !== undefined && icon !== null ) this.updateLeaf(child, icon.leaf, option.leaf)
		else this.updateLeaf(child)
		}
        }
        if( icon!==undefined && icon != null && icon.expand !== undefined ) Konekti.vc(inner.id).icon = icon.expand
        if( inner.icon !== undefined ) Konekti.vc(inner.id).icon = inner.icon
        if( icon!==undefined && icon != null && icon.contract !== undefined ) Konekti.vc(inner.id).cicon = icon.contract
        if( inner.contracticon !== undefined ) Konekti.vc(inner.id).cicon = inner.contracticon
	Konekti.vc(inner.id+'-icon').className = Konekti.vc(inner.id).icon
	if( inner.caption !== undefined ) Konekti.core.update(inner.id, 'caption', inner.caption )
	this.updateOption( inner.id, inner.option || (option!==undefined && option!==null)?option.inner:null )
    }

    /**
     * Updates the specific tree information
     * @param thing Tree information
     */
    update(thing){ this.updateInner(thing.tree, thing.icon || null, thing.options || null )}
}

/**
 * @function
 * Konekti tree
 * @param t Tree configuration 
 */
Konekti.tree = function(t){
    return Konekti.plugin.tree.connect(t)
}
