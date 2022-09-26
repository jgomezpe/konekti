Konekti.load(['navbar'], function(){

/** Tab manager */
class Tab extends Container{
	/**
	 * Creates a Tab panel configuration object 
	 * @param parent Parent component
	 * @param id Id of the tab component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
	 * @param tabs Tab configurations 
	 * @param config Style of the tab
	 */
	setup(parent, id, width, height, initial, tabs, config){
		var btns = []
		var contents = []
		for( var i=0; i<tabs.length; i++){
			var cid = tabs[i].setup[0]
			var label = tabs[i].label
			label.splice(0,0,cid+'Btn')
			label.splice(3,0,null)
			btns.push({'plugin':'btn', 'setup':label})
			contents.push(tabs[i])
		}
		var bar = {'plugin':'navbar', 'setup':[id+'Bar', btns, {'client':id, 'method':'open'}, {'class':'w3-light-grey w3-medium'}]}
		var content = {'plugin':'container', 'setup':['container', id+'Content', contents, '100%', 'rest']}
		var c = super.setup(parent, 'tab', id, [bar,content], width, height, config )
		c.initial = initial
		return c
	}

	/** 
	 * Creates a tab component manager 
	 * @param id Tab id
	 * @param tabs Collection of tabs managed by the component
	 */
	constructor(){ 
		super(...arguments) 
		this.open(this.initial+'Btn')
	}
	
	/**
	 * Shows the given tab
	 * @param page Tab to display
	 */
	open(page) {
		var x = this
		page = page.substring(0,page.length-3)
		function check(){
			if( Konekti.vc(page) !== undefined && Konekti.vc(page+'Btn') !== undefined &&
				Konekti.vc(page) !== null && Konekti.vc(page+'Btn') !== null){
				if(x.current===undefined) x.current=page
				var btn
				if(x.current!==page){
					btn = Konekti.vc(x.current+'Btn')
					btn.className = btn.className.replace("w3-grey", "") + " w3-light-grey"
				}
				x.current=page
				var tabs = x.children[1].children
				btn = Konekti.vc(x.current+'Btn')
				btn.className = btn.className.replace("w3-light-grey", "") + " w3-grey"
				for( var c in tabs ) tabs[c].vc().style.display = "none"  
				Konekti.vc(page).style.display = "initial"
				Konekti.resize()
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
 * @param parent Parent component
 * @param id Id of the tab component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
 * @param tabs Tab configurations 
 * @param config Style of the tab
 */
Konekti.tab = function(parent, id, width, height, initial, tabs, config={}){
	return new Tab(parent, id, width, height, initial, tabs, config)
}
})