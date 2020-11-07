Konekti.core.load('btn')

/** Konekti Plugin for navigation (buttons) bar components */
class NavBarPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for navbar components */
    constructor(){
        super('navbar')
        this.replace = 'strict'
    }

    /**
     * Fills the html template with the specific navbar information
     * @param thing Navbar information
     * @return Html code associated to the navbar component
     */
    fillLayout( thing ){
        var id = thing.id
        var btnsHTML = ''
        var btn = thing.btn
	for( var i=0; i<btn.length; i++ )
		btnsHTML += Konekti.plugin.btn.fillLayout( Konekti.core.plugin.btn.config(btn[i]) ) 
        thing.btnsHTML = btnsHTML
        return Konekti.core.fromTemplate( this.htmlTemplate, thing) 
    }
}

new NavBarPlugIn()

/** A Navigation Bar manager */
class NavBar extends KonektiClient{
	/** 
	 * Creates a NavBar Manager
	 * @param thing Configuration of the navbar
	 */
	constructor(thing){
		super(thing.id)
		var flag = thing.method!==undefined && thing.method=='select'
		for( var i=0; i<thing.btn.length; i++ ){
			thing.btn[i].style = (thing.btn[i].style || '')+" w3-bar-item "
			thing.btn[i].onclick = thing.btn[i].onclick || {'client':thing.client, 'method':flag?'select':thing.btn[i].id}
		}		
		Konekti.plugin.navbar.connect(thing)		 
	}
	/** Adds a button to the navbar
	 * @param btn Button to add (configuration information)
	 */
	addBtn( btn ){ Konekti.core.append(this.id,'btn',btn) }
}

/**
 * @function
 * Konekti navbar
 * @param id Id of the navbar component
 * @param btns Array of buttons to maintain by the navbar
 * @param method Method of the client that will be called when a button is pressed and not 
 * it does not have associated a run code. 'name' indicates that a method with the same name as the id
 * of the button will be used. 'Array of buttons to maintain by the navbar
 * @param style Style of the navbar
 * @param client Client of the navbar component
 * @return A NavBar manager
 */
Konekti.navbar = function(id, btns=[], method='name', style="w3-blue-grey w3-xlarge", client='client'){
	return new NavBar( {"id":id, "method":method, "btn":btns, "style":style, "client":client} )
}
