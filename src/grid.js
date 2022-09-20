/** A Konekti grid. */
class Grid extends Container{
	/**
	 * Creates a grid configuration object
	 * @param id Id of the grid component
	 * @param columns Number of columns
	 * @param min_cell_width Minimum cell width (px)
	 * @param cells Contained components
	 * @param parent Parent component
	 */
	setup( id, columns, min_cell_width, cells, parent='KonektiMain' ){
        var col_size = 100/columns
        var rsp = 'class="w3-col" style="padding:4px;width:'+col_size+'%"'
        for(var i=0; i<cells.length; i++)
            cells[i] = {'plugin':'container', 'setup':[id+'Cell-'+i, '', '', rsp, [cells[i]], id]}
		return {'plugin':'grid', 'id':id, 'width':'', 'height':'', 'min_width':min_cell_width, 'columns':columns, 'config':'class="w3-row-padding w3-section w3-stretch"', 'children':cells, 'parent':parent} 
	}

	/**
	 * Creates a grid configuration object
	 * @param id Id of the grid component
	 * @param columns Number of columns 
	 * @param min_width Minimum cell width (px)
	 * @param cells Contained components
	 * @param parent Parent component
	 */
     constructor( id, columns, min_cell_width, cells, parent='KonektiMain' ){ super(...arguments) }

	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
    setParentSize( parentWidth, parentHeight ){
        var x = this
        var max_cols = Math.floor(parentWidth / this.config.min_width)
        var cols = Math.min(max_cols, this.config.columns)
        var size = 100/cols
        function check(){
            if(x.children !== undefined)
                for(var i=0; i<x.children.length; i++){
                    x.vc('Cell-'+i).style.width = ''+size+'%'
                }    
            else setTimeout(check,100) 
        }    
        check()
        super.setParentSize(parentWidth,parentHeight)
    }
}

/**	 
 * Creates a grid configuration object
 * @param id Id of the grid component
 * @param columns Number of columns
 * @param min_width Minimum cell width (px)
 * @param cells Contained components
 * @param parent Parent component
 */	
Konekti.grid = function( id, columns, min_width, cells, parent='KonektiMain' ){ 
    return new Grid(id, columns, min_width, cells, parent) 
}