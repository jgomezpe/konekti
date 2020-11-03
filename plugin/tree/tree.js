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
                if( typeof option[i] == 'string'){
                    option[i] = {"id":option[i], "caption":option[i]}
                }
                option[i].tree = tree
                option[i].menu = id
                optTemplate += Konekti.core.fromTemplate(this.itemTemplate, option[i])
            }
            var opt = {"id":id, "tree":tree, "drop":optTemplate}
            return Konekti.core.fromTemplate(this.optionsTemplate, opt)
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
     * @param leaf node's id
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
		thing.select = thing.select || 'select'
		thing.sel_color = thing.sel_color || " w3-green"
	}
	
    /** 
     * Updates a tree element 
     * @param id Id of the element of the tree to update according to selection
     */
	update( id ){
        if( this.current !== undefined ){
            var cx = Konekti.vc(this.current)
            cx.className = cx.className.replace(this.thing.sel_color, ' ')
            var ceb = Konekti.vc(this.current+'-btn')
            if( ceb !== undefined && ceb !== null){
                var xd = Konekti.vc(id+'-drop');
                if (xd.className.indexOf("w3-show") != -1)
                    xd.className = xd.className.replace(" w3-show", "")
                ceb.className = ceb.className.replace('w3-show', 'w3-hide')
                ceb.className = ceb.className.replace(this.thing.sel_color, ' ')
            }    
        }
        this.current = id
        
        var x = Konekti.vc(id);
        x.className += this.thing.sel_color
        var eb = Konekti.vc(id+'-btn');
        if( eb !== undefined && eb !== null){
            eb.className += this.thing.sel_color
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
     * @param option Option selected (if any)
     */
	select( id, option ){
        var c = Konekti.client(this.thing.client)
        if( typeof c != 'undefined' && c[this.thing.select] !== undefined ) 
            c[this.thing.select](id, option)
        this.update(id)
	}

    /** 
     * Shows/hides a tree inner node
     * @param id Id of the inner node of the tree to show/hide
     */
    expand( id ){
        var c = Konekti.client(this.thing.client)
        if( typeof c != 'undefined' && typeof c.expand != 'undefined' ) c.expand(id)
        this.update(id)
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
}

/**
 * @function
 * Konekti tree
 * @param t Tree configuration 
 */
Konekti.tree = function(t){
    Konekti.plugin.tree.connect(t)
    return new Tree(t)
}
