Konekti.resource.css('.konekti-main{transition:margin-left .4s}\n.konekti-sidebar{height:100%;width:200px;background-color:#fff;position:fixed!important;z-index:40;overflow:auto}\n.konekti-buttonsidebar{height:100%;width:20px;background-color:#fff;position:fixed!important;z-index:39;overflow:auto}\n@media (min-width:993px){\n.konekti-sidebar{\ndisplay:block!important\n}\n.konekti-buttonsidebar{\ndisplay:none\n}\n}\n@media (max-width:992px){\n.konekti-main{margin-left:20px!important;margin-right:0!important}\n.konekti-sidebar{\ndisplay:none\n}\n.konekti-buttonsidebar{\ndisplay:block!important\n}\n}')

/** Tab manager */
class SideBar extends Container{
	/**
	 * Creates a sidebar configuration object
	 * @param id Id of the iframe container
	 * @param width Width of the div's component
	 * @param height Height of the div's component
	 * @param side Sidebar component
	 * @param main Main component
	 * @param parent Parent component
	 */
	setup(id, width, height, side, main, parent='KonektiMain'){
		var client = 'Konekti.client["'+id+'"].'
		side.parent = id+'Bar'
		var one = {'plugin':'container', 'setup':[id+'Bar', '', '', "onmouseleave='"+client+"close()' class='konekti-sidebar w3-card w3-animate-left'",[side], id]}
		var two = {'plugin':'div', 'setup':[id+'Resize', '', '', "onmouseenter='"+client+"open()' style='float:left' class='w3-xlarge konekti-buttonsidebar'", '&#9776;', id]}
		main.parent = id+'Main'
		var three = {'plugin':'container', 'setup':[id+'Main', '100%', '100%', "", [main], id]}
		return {'plugin':'sidebar', 'id':id, 'width':width, 'height':height, 'children':[one,two,three], 'parent':parent}
	}

	/** 
	 * Creates a tab component manager 
	 * @param id Id of the iframe container
	 * @param width Width of the div's component
	 * @param height Height of the div's component
	 * @param side Sidebar component
	 * @param main Main component
	 * @param parent Parent component
	 */
	constructor( id, width, height, side, main, parent='KonektiMain' ){ super(...arguments) }
			
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.updateSize( parentWidth, parentHeight )
		var x = this
		function check(){
			if( x.children !== undefined && x.children !== null && x.children.length>0 ){
				if(parentWidth > 992){
					x.children[0].setParentSize(200,x.height)
					x.children[2].setParentSize(x.width-200, x.height)
					x.children[2].vc().style.marginLeft = 200 + 'px'
				}else{
					x.children[2].setParentSize(x.width-20, x.height)
					x.children[2].vc().style.marginLeft = 20 + 'px'
				}	
			}else setTimeout(check, 100)
		}
		check()
	}


	/**
	 * Displays the sidebar
	 * @param barId Sidebar's id
	 */
	open(){ this.vc('Bar').style.display = 'initial' }

	/**
	 * Hides the sidebar
	 * @param barId Sidebar's id
	 */
	close(){ this.vc('Bar').style.display = 'none' }
}

/**
 * Associates/Adds a side bar component (includes navigation bar, and main component)
 * @method
 * sidebar
 * @param id Id of the sidebar component
 * @param width Width of the sidebar
 * @param height Height of the div's component
 * @param side Sidebar component
 * @param main Main component
 * @param parent Parent component
 */
Konekti.sidebar = function(id, width, height, side, main, parent='KonektiMain'){ 
	return new SideBar(id, width, height, side, main, parent) 
}