uses('https://jgomezpe.github.io/konekti/src/navbar.js')

/** Tab manager */
class Tab extends Container{
	/**
	 * Creates a Tab panel configuration object 
	 * @param id Id of the tab component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
	 * @param tabs Tab configurations 
	 * @param parent Parent component
	 */
	setup(id, width, height, initial, tabs, parent='KonektiMain'){
		var btns = []
		var contents = []
		for( var i=0; i<tabs.length; i++){
			var cid = tabs[i].content.id || tabs[i].content.setup[0]
			btns.push({'plugin':'btn', 'setup':[cid+'Btn', tabs[i].icon, tabs[i].caption, null, 'w3-light-grey', tabs[i].title, id+'Bar']})
			tabs[i].content.parent = id+'Content'
			contents.push(tabs[i].content)
		}
		var bar = {'plugin':'navbar', 'setup':[id+'Bar', 'w3-light-grey w3-medium', btns, id, 'open', id]}
		var content = {'plugin':'container', 'setup':[id+'Content', 'rest', 'rest', '', contents, id]}
		return {'plugin':'tab', 'id':id, 'initial':initial, 'children':[bar,content], 'width':width, 'height':height, 'parent':parent}
	}

	/** 
	 * Creates a tab component manager 
	 * @param id Tab id
	 * @param tabs Collection of tabs managed by the component
	 */
	constructor(id, width, height, initial, tabs, parent='KonektiMain'){ 
		super(...arguments) 
		this.open(this.config.initial+'Btn')
	}
	
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
				var bar = x.children[0]
				var tabs = x.children[1]
				bar.setParentSize(x.width,x.height)
				tabs.setParentSize(x.width,x.height-bar.height)
			}else setTimeout(check, 100)
		}
		check()
	}	

	/**
	 * Shows the given tab
	 * @param page Tab to display
	 */
	open(page) {
		var x = this
		function check(){
			if( x.children !== undefined && x.children !== null && x.children.length>0 ){
				page = page.substring(0,page.length-3)
				if(x.current===undefined) x.current=page
						var btn
				if(x.current!==page){
					btn = Konekti.vc(x.current+'Btn')
					btn.className = btn.className.replace("w3-grey", "w3-light-grey")
				}
				x.current=page
				var tabs = x.children[1].children
				btn = Konekti.vc(x.current+'Btn')
				btn.className = btn.className.replace("w3-light-grey", "w3-grey")
				for( var c in tabs ) tabs[c].vc().style.display = "none"  
				Konekti.vc(page).style.display = "initial"
				var ta = Konekti.vc(page).getElementsByTagName('textarea')
				for( var k=0; k<ta.length; k++ ) ta[k].focus()
			}else setTimeout(check, 100)
		}
		check()
	}
}

/**
 * Associates/Adds a Tab panel
 * @method
 * tab
 * @param id Id of the tab component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
 * @param tabs Tab configurations 
 * @param parent Parent component
 */
Konekti.tab = function(id, width, height, initial, tabs, parent='KonektiMain'){
	return new Tab(id, width, height, initial, tabs, parent)
}
