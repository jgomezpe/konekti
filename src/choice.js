/** Konekti plugin for choice elements */
class ChoicePlugIn extends PlugIn{
	constructor(){ super('choice') }
    
	/**
	 * Creates a choice configuration object
	 * @param parent Parent component
	 * @param id Id of the choice component
	 * @param options Options of the choice element
	 * @param type If it is a 'single' choice or a 'multiple' option choice element
	 * @param config Style of the choice
	 */
    setup( parent, id, options, type='single', config={} ){
     	var cols = Math.min(4, options.length)
        var selcolor = config.selcolor || 'w3-red'
        var unselcolor = config.unselcolor || 'w3-teal'
        var opts = []
        for( var i=0; i<options.length; i++ ){
        	var btn = {'plugin':'btn', 'setup':[id+'Btn-'+i, 'fa fa-square-o', String.fromCharCode(65+i), {'client':id, 'method':'select'}, {'class':unselcolor +' w3-block'}]}
        	opts[i] = {'plugin':'card', 'setup':[id+'Option-'+i, [options[i],btn]]}
        }
    	var grid = {'plugin':'grid', 'setup':[id+'Options', opts, cols, 
                    {'style':{'min-width':'200px', 'max-width':'5000px'}, 'height':'30%'}, {'width':'100%', 'height':'100%'}]}
    	var c = super.setup( parent, id, grid, config)
        c.type = type
        c.selcolor = selcolor
        c.unselcolor = unselcolor
        c.selected = []
        c.total = options.length
        return c
    } 
    
    client(config){ return new ChoiceClient(config) }
}

/** Registers the choice plugin in Konekti */
new ChoicePlugIn()

/** A choice manager */
class ChoiceClient extends Editor{
	/**
	 * Creates a choice configuration object
	 */
	constructor(config){ super(config) }
    
    /**
     * Controls the selection of an option
     * @param {*} id Id of the selected option
     */
    select(id){ 
        var s = id.split('-')
        s = parseInt(s[s.length-1])
        var x = this
    	if( x.type=='single' ){
            if(x.selected.length > 0){
                var selId = x.id+'Btn-'+x.selected[0]
                var c = Konekti.vc(selId)
                c.className = c.className.replace(x.selcolor, x.unselcolor)
                Konekti.client[selId].update('fa fa-square-o', String.fromCharCode(65+x.selected[0]))
            }    
            x.selected[0] = s
            c = Konekti.vc(id)
        	c.className = c.className.replace(x.unselcolor, x.selcolor)
            Konekti.client[id].update('fa fa-check-square-o', String.fromCharCode(65+x.selected[0]))
        }else{
        	var i=0
            while(i<x.selected.length && x.selected[i]!=s) i++
           	var c = Konekti.vc(id)
            if(i<x.selected.length){
        		c.className = c.className.replace(x.selcolor, x.unselcolor)
                Konekti.client[id].update('fa fa-square-o', String.fromCharCode(65+x.selected[i]))
                x.selected.splice(i,1)
            }else{
        		c.className = c.className.replace(x.unselcolor, x.selcolor)
                Konekti.client[id].update('fa fa-check-square-o', String.fromCharCode(65+s))
                x.selected.push(s)
            }
        }
   	}

	/**
	 * Sets current selected options
     * @param txt Current selected options
	 */
    setText(txt){
        txt = txt.substring(1,txt.length-1)
        var s = txt.split(',')
        for( var i=0; i<s.length; i++) s[i] = parseInt(s[i])
        var x = this
        if(x.type=='single'&& s.length>1) s = [s[0]]
        x.selected = s
        for( var i=0; i<x.total; i++ ){
            var selId = x.id+'Btn-'+i
            var c = Konekti.vc(selId)
            c.className = c.className.replace(x.selcolor, x.unselcolor)
            Konekti.client[selId].update('fa fa-square-o', String.fromCharCode(65+i))
        }
        for( var i=0; i<x.selected.length; i++ ){
            var selId = x.id+'Btn-'+x.selected[i]
            var c = Konekti.vc(selId)
            c.className = c.className.replace(x.unselcolor, x.selcolor)
            Konekti.client[selId].update('fa fa-check-square-o', String.fromCharCode(65+x.selected[i]))
        }
    }

	/**
	 * Gets current selected options
	 * @return Current selected options
	 */
    getText(){
        var txt = '['
        var s = ''
        for( var i=0; i<this.selected.length; i++ ){
            txt += s + this.selected[i]
            s = ','
        }
        txt += ']'
        return txt
    }
}

/**
 * Creates a choice object
 * @param id Id of the choice component
 * @param options Options of the choice element
 * @param type If it is a 'single' choice or a 'multiple' option choice element
 * @param config Style of the choice
 * @param callback Function called when the choice element is ready
 */
Konekti.choice = function(id, options, type='single', config={}, callback=function(){}){
	Konekti.add({'plugin':'choice', 'setup':['body', id, options, type, config]}, callback)
}
