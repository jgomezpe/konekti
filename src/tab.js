/** Konekti plugin for tab elements */
class TabPlugin extends PlugIn{
	constructor(){ super('tab') }

	/**
	 * Creates a Tab panel configuration object 
	 * @param parent Parent component
	 * @param id Id of the tab component
	 * @param tabs Tab configurations 
	 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
	 * @param config Style of the tab
	 */
	setup(parent, id, tabs, initial, config){
		var btns = []
		var contents = []
		for( var i=0; i<tabs.length; i++){
			var cid = tabs[i].setup[0]
			var label = tabs[i].label
			label.splice(0,0,cid+'Btn')
			label.splice(3,0,null)
			label[4] = {'class': ' w3-border-left w3-border-top w3-border-right w3-round '}
			btns.push({'plugin':'btn', 'setup':label})
			contents.push(tabs[i])
		}
		var bar = {'plugin':'navbar', 'setup':[id+'Bar', btns, {'client':id, 'method':'open'}, {'class':' w3-light-grey w3-medium'}]}
		var content = {'plugin':'raw', 'setup':[id+'Content', contents, {'style':'width:100%;height:fit;'}]}
		var c = super.setup(parent, id, [bar,content], config )
		c.initial = initial
		return c
	}
	
	client(config){ return new Tab(config) }
}

/** Registers the tab plugin in Konekti */
new TabPlugin()

/** Tab manager */
class Tab extends Client{
	/** 
	 * Creates a tab component manager 
	 * @param id Tab id
	 * @param tabs Collection of tabs managed by the component
	 */
	constructor(config){ 
		super(config)
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
				Konekti.vc(page).style.display = ""
				if(Konekti.client[page].focus!==undefined) Konekti.client[page].focus()
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
 * @param tabs Tab configurations 
 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
 * @param config Style of the tab
 * @param callback Function called when the tab component is ready
 */
Konekti.tab = function(id, tabs, initial, config={}, callback=function(){}){
	Konekti.add({'plugin':'tab', 'setup':['body',id,tabs, initial, config]},callback)
}