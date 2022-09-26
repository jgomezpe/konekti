Konekti.dom.css('.konekti-main{transition:margin-left .4s}\n.konekti-sidebar{height:100%;width:200px;background-color:#fff;position:fixed!important;z-index:40;overflow:auto}\n.konekti-buttonsidebar{height:100%;width:20px;background-color:#fff;position:fixed!important;z-index:39;overflow:auto}\n@media (min-width:993px){\n.konekti-main{margin-left:200px!important;margin-right:0!important}\n{\n.konekti-sidebar{\ndisplay:block!important\n}\n.konekti-buttonsidebar{\ndisplay:none\n}\n}\n@media (max-width:992px){\n.konekti-main{margin-left:20px!important;margin-right:0!important}\n.konekti-sidebar{\ndisplay:none\n}\n.konekti-buttonsidebar{\ndisplay:block!important\n}\n}')

/** Tab manager */
class SideBar extends Container{
	/**
	 * Creates a sidebar configuration object
	 * @param parent Parent component
	 * @param id Id of the iframe container
	 * @param width Width of the div's component
	 * @param height Height of the div's component
	 * @param side Sidebar component
	 * @param main Main component
	 * @param config Style of the sidebar
	 */
	setup(parent, id, width, height, side, main, config={}){
		var client = 'Konekti.client["'+id+'"].'
		var one = {'plugin':'container', 'setup':['container', id+'Bar', [side], '', '', {'onmouseleave':client+"close()", 'class':'konekti-sidebar w3-card w3-animate-left'}]}
		var two = {'plugin':'html', 'setup':[id+'Resize', '', '', {'onmouseenter':client+"open()", 'style':'float:left', 'class':'w3-xlarge konekti-buttonsidebar'}, '&#9776;']}
		var three = {'plugin':'container', 'setup':['container', id+'Main', [main], '100%', '100%', {'class':'konekti-main'}]}
		return super.setup(parent, 'sidebar', id, [one,two,three], width, height, config)
	}

	/** 
	 * Creates a tab component manager 
	 */
	constructor( id, width, height, side, main, parent='KonektiMain' ){ 
		super(...arguments) 
		this.closablesize = true
	}
			
	/**
	 * Sets each children size
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	 setChildrenSize( parentWidth, parentHeight ){
		this.closablesize = parentWidth<=992
		var x = this
		function check(){
			if( x.vc('Bar') !== undefined ){
				if(parentWidth > 992){
					x.vc('Bar').style.display = 'initial' 
					x.children[0].setParentSize(200,x.height)
					x.children[2].setParentSize(x.width-200, x.height)
					x.children[2].vc().style.marginLeft = 200 + 'px'
				}else{
					x.vc('Bar').style.display = 'none' 
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
	close(){ 
		if(this.closablesize) this.vc('Bar').style.display = 'none' 
	}
}

/**
 * Associates/Adds a side bar component (includes navigation bar, and main component)
 * @method
 * sidebar
 * @param parent Parent component
 * @param id Id of the sidebar component
 * @param width Width of the sidebar
 * @param height Height of the div's component
 * @param side Sidebar component
 * @param main Main component
 * @param config Style of the sidebar
 */
Konekti.sidebar = function(parent, id, width, height, side, main, config={}){ 
	return new SideBar(parent, id, width, height, side, main, config) 
}