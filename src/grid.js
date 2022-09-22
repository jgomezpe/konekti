/** A Konekti grid. */
class Grid extends Container{
	/**
	 * Creates a grid configuration object
	 * @param id Id of the grid component
	 * @param max_cols Maximum number of columns per row
	 * @param min_cell_width Minimum cell width (px)
	 * @param max_cell_width Maximum cell width (px)
	 * @param cells Contained components
	 * @param parent Parent component
	 */
	setup( id, max_cols, min_cell_width, max_cell_width, cells, parent='KonektiMain' ){
        cells = this.children_setup(id, max_cols, min_cell_width, max_cell_width, cells)
		return {'plugin':'grid', 'id':id, 'width':'', 'height':'', 'min_width':min_cell_width, 'max_width':max_cell_width, 
				'max_cols':max_cols, 'config':'class="w3-row-padding w3-section w3-stretch" style="margin:auto"', 'children':cells, 'parent':parent} 
	}

	children_setup(id, max_cols, min_cell_width, max_cell_width, cells){
        var col_size = 100/max_cols
        var rsp = 'class="w3-col w3-center" style="padding:4px;width:'+col_size+'%;max-width:'+max_cell_width+'px;min-width:'+min_cell_width+'px;"'
        for(var i=0; i<cells.length; i++)
            cells[i] = {'plugin':'container', 'setup':[id+'Cell-'+i, '', '', rsp, [cells[i]], id]}
		return cells
	}

	/**
	 * Creates a grid configuration object
	 * @param id Id of the grid component
	 * @param max_cols Maximum number of columns per row
	 * @param min_cell_width Minimum cell width (px)
	 * @param max_cell_width Maximum cell width (px)
	 * @param cells Contained components
	 * @param parent Parent component
	 */
    constructor( id, columns, min_cell_width, max_cell_width, cells, parent='KonektiMain' ){
		super(...arguments) 
	}

	set(cells){
		var x = this
		x.children = undefined
		x.config.children = x.children_setup(x.id, x.config.max_cols, x.config.min_width, x.config.max_width, cells)
		x.vc().innerHTML = ''
		Konekti.load_dependecies(x.config.children, function(){ 
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
            if(x.children !== undefined){
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