/** A Konekti grid plugin. */
class GridPlugin extends PlugIn{
	constructor(){ super('grid') }

	children_setup(id, cells, max_cols, min_cell_width, max_cell_width){
        var col_size = 100/max_cols
        var rsp = {'tag':'div', 'class':"w3-col w3-center", 'style':'padding:4px;margin:0px;width:'+col_size+'%;max-width:'+max_cell_width+'px;min-width:'+min_cell_width+'px;'}
        for(var i=0; i<cells.length; i++)
            cells[i] = {'plugin':'raw', 'setup':[id+'Cell-'+i, cells[i], rsp]}
		return cells
	}

	/**
	 * Creates a grid configuration object
	 * @param parent Parent component
	 * @param id Id of the grid component
	 * @param max_cols Maximum number of columns per row
	 * @param min_cell_width Minimum cell width (px)
	 * @param max_cell_width Maximum cell width (px)
	 * @param cells Contained components
	 */
	setup( parent, id, cells, max_cols, min_cell_width, max_cell_width, config={} ){
        cells = this.children_setup(id, cells, max_cols, min_cell_width, max_cell_width)
		config.class = "w3-row-padding w3-section w3-stretch " + (config.class || '')
		config.style = "margin:auto;" + (config.style || '')
		var c = super.setup(parent, id, cells, config)
		c.min_width=min_cell_width
		c.max_width=max_cell_width
		c.max_cols=max_cols
		return c
	}

	client(config){ return new Grid(config) }
}

/** Registers the grid plugin in Konekti */
let gridplugin = new GridPlugin()

/** A Konekti grid. */
class Grid extends Client{
	/**
	 * Creates a grid configuration object
	 */
    constructor(){ super(...arguments) }

	set(cells){
		var x = this
		if( x.vc()!= undefined && x.vc() !== null ) x.vc().innerHTML = ''
		x.children = []
		cells = gridplugin.children_setup(x.id, cells, x.max_cols, x.min_width, x.max_width)
		for(var i=0; i<cells.length; i++) cells[i].setup.splice(0,0,x.id)
		for(var i=0; i<cells.length; i++) x.add(cells[i])
	}
}

/**	 
 * Creates a grid configuration object
 * @param id Id of the grid component
 * @param columns Number of columns
 * @param min_width Minimum cell width (px)
 * @param max_width Maximum cell width (px)
 * @param cells Contained components
 * @param parent Parent component
 * @param callback Function called when the grid component is ready
 */	
Konekti.grid = function( parent, id, cells, columns, min_width, max_width, config, callback ){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==3) args[3] = 4
	if(args.length==4) args[4] = 0
	if(args.length==5) args[5] = 1000000
	if(args.length==6) args[6] = {}
	if(args.length==7) args[7] = function(){}
	Konekti.add('grid', ...args)
}
