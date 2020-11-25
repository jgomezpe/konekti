
/** Konekti Plugin for tab components */
class TabPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for tab components */
    constructor(){ super('tab') }

	/**
	 * Fills the html template with the specific tab information
 	 * @param thing Tab information
	 * @return Html code associated to the tab component
	 */
	fillLayout( thing ){
		var tabsHTML =''
		for( var i=0; i<thing.tab.length; i++ ){
			var btx = thing.tab[i]
			tabsHTML +="<div id='"+btx.id+"' style='position:relative;width:100%;height:100%' ></div>"
			btx.onclick= 'Konekti.client("'+thing.id+'").open("'+btx.id+'")'
			btx.id += '-tab'
		}
		thing.tabs = tabsHTML
		return Konekti.core.fromTemplate( this.htmlTemplate, thing)    
	}


	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new TabClient(thing) }    

	/** 
	 * Connects the tab component with the GUI component
	 * @param thing Tab component configuration
	 */
	connect( thing ){
		thing.ids=[]
		for( var i=0; i<thing.tab.length; i++ ){
			if( typeof thing.tab[i] === 'string' ) thing.tab[i] = Konekti.core.item(thing.tab[i])
			thing.ids.push(thing.tab[i].id)
		}
		thing.gui = this.html(thing) 
		Konekti.navbar(thing.navbarid || thing.id+'-bar', thing.tab, "select", "w3-light-grey w3-medium", thing.id)		
		var client = this.client(thing)
		setTimeout( function(){ client.open(thing.initial) }, 200 )
		return client
	}
}

new TabPlugIn()

/** Tab manager */
class TabClient extends KonektiClient{
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

/**
 * @function
 * Konekti tab
 * @param id Id of the tab component
 * @param initial Id of the tab that will be initially open
 * @param tabs Tab configurations 
 */
Konekti.tab = function(id, initial){
    var btn = []
    for(var i=2; i<arguments.length; i++){
        if(typeof arguments[i]==='string') btn.push(Konekti.core.item(arguments[i]))
        else btn.push(arguments[i])
    }
    return Konekti.plugin.tab.connect({'id':id, 'initial':initial, 'tab':btn})
}
