/** A Konekti grid plugin. */
class GridPlugin extends PlugIn{
	constructor(){ super('grid') }

	children_setup(id, cells, max_cols, cell_config){
        var col_size = 96/max_cols
		cell_config.height = cell_config.height || '200px'
		cell_config =  Konekti.config(cell_config)
		cell_config.style.padding = '4px'
		cell_config.style.margin = '4px'
		cell_config.width = col_size+'%'
		cell_config.style['min-width'] = cell_config.style['min-width'] || '200px'
		cell_config.style['max-width'] = cell_config.style['max-width'] || '1000000px'
		cell_config.style.float = 'left'
        var c = []
        for(var i=0; i<cells.length; i++)
            c[i] = {'plugin':'raw', 'setup':[id+'Cell-'+i, cells[i], cell_config]}
		return c
	}

	/**
	 * Creates a grid configuration object
	 * @param parent Parent component
	 * @param id Id of the grid component
	 * @param max_cols Maximum number of columns per row
	 * @param cell_config Cell configuration info 
	 * @param cells Contained components
	 */
	setup( parent, id, cells, max_cols, cell_config, config={} ){
		config = Konekti.config(config)
        cells = this.children_setup(id, cells, max_cols, cell_config)
		config.style.margin = "2px"
		config.style.padding = "0px"
		var c = super.setup(parent, id, cells, config)
		c.cell_config = cell_config
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
    constructor(config){ 
		super(config) 
		this.layout = 'row'
	}

	set(cells){
		var x = this
		Konekti.daemon(function(){ return x.vc()!= undefined && x.vc() !== null}, 
			function(){
				x.vc().innerHTML = ''
				for(var i=0; i<x.children.length; i++) Konekti.client[x.children[i].id] = null
				x.children = []
				x.callback = []
				x.addqueue = 0
				for(var i=0; i<cells.length; i++) cells[i].setup.splice(0,0,x.id+'Cell-'+i)
				cells = gridplugin.children_setup(x.id, cells, x.max_cols, x.cell_config)
				for(var i=0; i<cells.length; i++) cells[i].setup.splice(0,0,x.id)
				var k=0
				function check(){
					k++
					if(k==cells.length){
						var r = x.vc().getBoundingClientRect()
						x.resize(r.width, r.height)
					}
				}
				for(var i=0; i<cells.length; i++) Konekti.add(cells[i], check)
			}
		)
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
Konekti.grid = function( id, cells, columns=4, cell_config={'tag':'div', 'height':'200px', 'style':{'min-width':'200px', 'max-width':'1000000px'}}, config={}, callback=function(){} ){ 
	Konekti.add({'plugin':'grid', 'setup':['body', id, cells, columns, cell_config, config]}, callback)
}
