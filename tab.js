Konekti.uses('navbar')
/** Konekti Plugin for tab components */
class TabPlugIn extends PlugIn{
	/** Creates a Plugin for tab components */
	constructor(){ super('tab') }

	/**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client(config){ return new Tab(config) }
}

/** Tab manager */
class Tab extends Client{
	/** 
	 * Creates a tab component manager 
	 * @param id Tab id
	 * @param tabs Collection of tabs managed by the component
	 */
	constructor( config ){ 
		super(config) 
		this.open(config.initial+'Btn')
	}
	
	/**
	 * Sets the parent's size (adjust each of its children components)
	 * @param parentWidth Parent's width
	 * @param parentHeight Parent's height
	 */
	setParentSize( parentWidth, parentHeight ){
		this.updateSize( parentWidth, parentHeight )
		var bar = this.children[this.id+'Bar']
		var tabs = this.children[this.id+'Content']
		bar.setParentSize(this.width-2,this.height)
		tabs.setParentSize(this.width-2,this.height-bar.height-2)
	}	

	/**
	 * Shows the given tab
	 * @param page Tab to display
	 */
	open(page) {
		page = page.substring(0,page.length-3)
		if(this.current===undefined) this.current=page
		var btn
		if(this.current!==page){
			btn = Konekti.vc(this.current+'Btn')
			btn.className = btn.className.replace("w3-grey", "w3-light-grey")
		}
		this.current=page
		console.log(this.current)
		var tabs = this.children[this.id+'Content'].children
		btn = Konekti.vc(this.current+'Btn')
		btn.className = btn.className.replace("w3-light-grey", "w3-grey")
		for( var c in tabs ) tabs[c].vc().style.display = "none"  
		Konekti.vc(page).style.display = "initial"
		var ta = Konekti.vc(page).getElementsByTagName('textarea')
		for( var k=0; k<ta.length; k++ ) ta[k].focus()
	}
}

/** Tab class */
if(Konekti.tab===undefined) new TabPlugIn()

/**
 * Creates a Tab panel configuration object 
 * @method
 * tabConfig
 * @param id Id of the tab component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
 * @param tabs Tab configurations 
 * @param parent Parent component
 */
Konekti.tabConfig = function(id, width, height, initial, tabs, parent){
	var btns = []
	var contents = []
	for( var i=0; i<tabs.length; i++){
		console.log(tabs[i].caption)
		btns.push(Konekti.btnConfig(tabs[i].content.id+'Btn', tabs[i].icon, tabs[i].caption, null, 'w3-light-grey', tabs[i].title))
		contents.push(tabs[i].content)
	}
	var bar = Konekti.navbarConfig(id+'Bar', 'w3-light-grey w3-medium', btns, id, 'open', id )
	var content = Konekti.divConfig(id+'Content', '100%', '100%', '', '', id)
	content.children = contents
	return {'plugin':'tab', 'id':id, 'initial':initial, 'children':[bar,content], 'width':width, 'height':height, 'parent':parent}
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
Konekti.tab = function(id, width, height, initial, tabs, parent){
	return Konekti.build(Konekti.tabConfig(id, width, height, initial, tabs, parent))
}
