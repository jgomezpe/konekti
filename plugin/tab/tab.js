
/** Konekti Plugin for tab components */
class TabPlugIn extends PlugIn{
    /** Creates a Plugin for tab components */
    constructor(){ super('tab') }

	/**
	 * Fills the html template with the specific tab information
 	 * @param thing Tab information
	 * @return Html code associated to the tab component
	 */
	fillTabs( thing ){
		var tabsHTML =''
		for( var i=0; i<thing.tab.length; i++ ){
			var btx = thing.tab[i]
			tabsHTML +="<div id='"+btx.id+"' style='position:relative;width:100%;height:100%' ></div>"
			btx.onclick= 'Konekti.client("'+thing.id+'").open("'+btx.id+'")'
			btx.id += '-tab'
		}
		thing.tabs = tabsHTML
		return thing.tabs    
	}

	/** 
	 * Computes the tabs-ids
	 * @param thing Tab configuration
	 */
	ids( thing ){
		thing.ids=[]
		for( var i=0; i<thing.tab.length; i++ ){
			if( typeof thing.tab[i] === 'string' ) thing.tab[i] = Konekti.dom.item(thing.tab[i])
			thing.ids.push(thing.tab[i].id)
		}
	}


	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new Tab(thing) }    

	/** 
	 * Connects the tab component with the GUI component
	 * @param thing Tab component configuration
 	* @param callback Function that will be executed as the box component is loaded
	 */
	connect( thing, callback ){
		this.ids(thing)
		var content = {"plugin":"html", "initial":this.fillTabs(thing)}
		Konekti.hcf( thing.id, content,  
			{"plugin":"navbar", "btn":thing.tab, "client":thing.id, "method":"select", "style":"w3-light-grey w3-medium"})
		function back(){
			for( var i=0; i<thing.tab.length; i++ )
				if(thing.tab[i].plugin!==undefined) Konekti[thing.tab[i].plugin](thing.tab[i])
			if( callback !== undefined ) callback()
		}
		for( var i=0; i<thing.tab.length; i++ ){
			thing.tab[i].id = thing.tab[i].id.substring(0,thing.tab[i].id.length-4)
			if(thing.tab[i].plugin !== undefined) uses.push(thing.tab[i].plugin)
		}
		var uses = Konekti.analize(thing)
		if(uses.length>0) Konekti.load(...uses,back)	
		var client = this.client(thing)
		setTimeout( function(){ client.open(thing.initial) }, 200 )
		return client
	}


	/**
	 * Creates a client for the plugin's instance
	 * @param id Id of the tab component
	 * @param initial Id of the tab that will be initially open
	 * @param ... Tab configurations 
	 */
	config(id, initial){
		var btn = []
		for(var i=2; i<arguments.length; i++){
			if(typeof arguments[i]==='string'){
				var item = Konekti.dom.item(arguments[i])
				btn.push(item)
		  	}else{
				btn.push(arguments[i])
			}
		}
		return {"id":id, "initial":initial, "tab":btn}
	}
}

/** Tab manager */
class Tab extends Client{
	/** 
	 * Creates a tab component manager 
	 * @param id Tab id
	 * @param tabs Collection of tabs managed by the component
	 */
	constructor( thing ){
		super(thing)
		this.tabs = thing.ids
	}

	/**
	 * Shows the given tab
	 * @param tabPage Tab to display
	 */
	open(tabPage) {
		if(this.current===undefined) this.current=tabPage
		if(this.current!==tabPage) Konekti.vc(this.current+'-tab').style.borderStyle='none'
		this.current=tabPage
		Konekti.vc(this.current+'-tab').style.borderStyle='groove'
		for (var i = 0; i < this.tabs.length; i++)
			Konekti.vc(this.tabs[i]).style.display = "none"  
		Konekti.vc(tabPage).style.display = "block"
		var ta = Konekti.vc(tabPage).getElementsByTagName('textarea')
		for( var k=0; k<ta.length; k++ ) ta[k].focus()
	}
}

/** Tab class */
if(Konekti.tab===undefined) new TabPlugIn()

/**
 * Associates/Adds a Tab panel
 * @method
 * tab
 * @param id Id of the tab component
 * @param initial Id of the tab that will be initially open or Function that will be executed as the box component is loaded
 * @param tabs Tab configurations 
 * @param callback Function that will be executed as the box component is loaded
 */
Konekti.tab = function(id, initial, tabs, callback){
	if( typeof id === 'string' ) id = Konekti.plugins.tab.config(id, initial, ...tabs)
	else callback = initial
	return Konekti.plugins.tab.connect(id, callback)
}
