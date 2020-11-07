Konekti.core.load('navbar')

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
            tabsHTML +="<div id='"+thing.tab[i].id+"' style='position:relative;width:100%;height:100%' ></div>"
        }
        thing.tabs = tabsHTML
        return Konekti.core.fromTemplate( this.htmlTemplate, thing)    
    }

    /** 
     * Connects (extra steps) the tab component with the GUI component
     * @param thing Tab component configuration
     */
    extra( thing ){
        var mainclient = thing.client
        var id = thing.id
        var initial = thing.initial || thing.tab[0].id
        var tabs=[]
        for( var i=0; i<thing.tab.length; i++ ){
            tabs.push(thing.tab[i].id)
            var btx = thing.tab[i]
            btx.id += '-tab'
            btx.onclick= 'Konekti.client("'+id+'").open("'+tabs[i]+'")'
        }
        var tabClient = new TabClient(id, tabs)
	setTimeout( function(){ tabClient.open(thing.initial) }, 200 )
    
        var nav = thing.navbarid || id+'-bar'
        Konekti.navbar(nav, thing.tab, "select", "w3-light-grey w3-medium", id)
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
	constructor( id, tabs ){
		super(id)
		this.tabs = tabs
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
 * @param tabs Tab configurations 
 */
Konekti.tab = function(id, initial){
console.log(arguments.length)
    var btn = []
    for(var i=2; i<arguments.length; i++){
        if(typeof arguments[i]==='string') btn.push({'id':arguments[i], 'caption':arguments[i]})
        else btn.push(arguments[i])
    }
    var config = {'id':id, 'initial':initial, 'tab':btn}
    Konekti.plugin.tab.connect(config)
    return Konekti.client(config.id)
}
