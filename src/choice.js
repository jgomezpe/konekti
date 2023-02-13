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
        	var btn = {'plugin':'btn', 'setup':[id+'Btn-'+i, 'fa fa-square-o', '', {'client':id, 'method':'select'}, {'class':unselcolor +' w3-block'}]}
        	opts[i] = {'plugin':'card', 'setup':[id+'Option-'+i, [options[i],btn]]}
        }
    	var grid = {'plugin':'grid', 'setup':[id+'Options', opts, cols, 300, 5000]}
    	var c = super.setup( parent, id, grid, config)
        c.type = type
        c.selcolor = selcolor
        c.unselcolor = unselcolor
        if(type=='single') c.selected = [null]
        else c.selected = []
        return c
    } 
    
    client(config){ return new ChoiceClient(config) }
}

/** Registers the choice plugin in Konekti */
new ChoicePlugIn()

/** A choice manager */
class ChoiceClient extends Client{
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
            var selId = x.id+'Btn-'+x.selected[0]
        	var c = Konekti.vc(selId)
        	if(c!==null){
            	c.className = c.className.replace(x.selcolor, x.unselcolor)
                Konekti.client[selId].update('fa fa-square-o', '')
            }    
            x.selected[0] = s
            c = Konekti.vc(id)
        	c.className = c.className.replace(x.unselcolor, x.selcolor)
            Konekti.client[id].update('fa fa-check-square-o', '')
        }else{
        	var i=0
            while(i<x.selected.length && x.selected[i]!=s) i++
           	var c = Konekti.vc(id)
            if(i<x.selected.length){
        		c.className = c.className.replace(x.selcolor, x.unselcolor)
                Konekti.client[id].update('fa fa-square-o', '')
                x.selected.splice(i,1)
            }else{
        		c.className = c.className.replace(x.unselcolor, x.selcolor)
                Konekti.client[id].update('fa fa-check-square-o', '')
                x.selected.push(s)
            }
        }
   	}
}

/**
 * Creates a choice object
 * @param parent Parent component
 * @param id Id of the choice component
 * @param options Options of the choice element
 * @param type If it is a 'single' choice or a 'multiple' option choice element
 * @param config Style of the choice
 * @param callback Function called when the choice element is ready
 */
Konekti.choice = function(parent, id, options, type, config, callback){
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = 'single'
	if(args.length==4) args[4] = {}
	if(args.length==5) args[5] = function(){}
	Konekti.add('choice', ...args)
}
