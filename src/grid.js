/** A Konekti grid. */
class Grid extends Container{
	/**
	 * Creates a grid configuration object
	 * @param parent Parent component
	 * @param id Id of the grid component
	 * @param max_cols Maximum number of columns per row
	 * @param min_cell_width Minimum cell width (px)
	 * @param max_cell_width Maximum cell width (px)
	 * @param cells Contained components
	 */
	setup( parent, id, max_cols, min_cell_width, max_cell_width, cells ){
        cells = this.children_setup(id, max_cols, min_cell_width, max_cell_width, cells)
		var c = super.setup(parent, 'grid', id, cells, '', '', {'class':"w3-row-padding w3-section w3-stretch", 'style':"margin:auto"})
		c.min_width=min_cell_width
		c.max_width=max_cell_width
		c.max_cols=max_cols
		return c
	}

	children_setup(id, max_cols, min_cell_width, max_cell_width, cells){
        var col_size = 100/max_cols
        var rsp = {'tag':'div', 'class':"w3-col w3-center", 'style':'padding:4px;width:'+col_size+'%;max-width:'+max_cell_width+'px;min-width:'+min_cell_width+'px;'}
        for(var i=0; i<cells.length; i++)
            cells[i] = {'plugin':'container', 'setup':['container', id+'Cell-'+i, [cells[i]], '', '', rsp]}
		return cells
	}

	/**
	 * Creates a grid configuration object
	 */
    constructor(){ super(...arguments) }

	set(cells){
		var x = this
		x.children = x.children_setup(x.id, x.max_cols, x.min_width, x.max_width, cells)
		x.vc().innerHTML = ''
		this.done = false
		Konekti.load_dependencies(x.children, function(){ 
			x.setChildrenBack() 	
		})
	}

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
    setParentSize( parentWidth, parentHeight ){
        super.setParentSize(parentWidth,parentHeight)
        var x = this
        function check(){
            if(x.done){
				var cols = Math.floor(parentWidth / (x.config.min_width+10))
				cols = Math.min(cols, x.config.max_cols)
				cols = Math.min(Math.max(x.children.length,1), cols)
				var size = 100/cols
				for(var i=0; i<x.children.length; i++){
					x.vc('Cell-'+i).style.width = ''+size+'%'
                }    
			}else setTimeout(check,100) 
        }    
        check()
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
 */	
Konekti.grid = function( id, columns, min_width, max_width, cells, parent='KonektiMain' ){ 
    return new Grid(id, columns, min_width, max_width, cells, parent) 
}