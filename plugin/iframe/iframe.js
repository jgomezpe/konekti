/** Konekti Plugin for iframe components */
class IFramePlugIn extends KonektiPlugIn{
    /** Creates a Plugin for iframe components */
    constructor(){ super('iframe') }

	/**
	 * Fills the html template with the specific iframe information
	 * @param thing Tree information
	 * @return Html code associated to the tree component
	 */
	fillLayout(thing){
		if( !thing.src.startsWith('https://') ){
       			const getBlobURL = (code, type) => {
            			const blob = new Blob([code], {type})
            			return URL.createObjectURL(blob)
        		}
        		thing.src = getBlobURL(thing.src, 'text/html')
		}
		return this.core.fromTemplate( this.htmlTemplate, thing ) 
	}

	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new IFrameEditor(thing) }

	/**
	 * Creates a config object from parameters 
	 * @param id Id of the iframe container
	 * @param url Url/code for the iframe component
	 */
	config(id, url=''){ return {"id":id, "src":url} }
}

new IFramePlugIn()

/** Iframe component that works as an editor */
class IFrameEditor extends KonektiEditor{
	/**
	 * Creates an iframe component that works as an editor
	 * @param id Id of the iframe component
	 */
    constructor(id){
        super(id)
        this.gui = this.vc('Frame')
    }
    
	/**
	 * Gets current html code in the iframe component
	 * @return Current html code in the iframe component
	 */
    getText(){ return this.gui.contentWindow.document.documentElement.outerHTML }

	/**
	 * Sets html code for the iframe component
	 * @param txt Html code to set in the iframe component
	 */
    setText(txt){
        const getBlobURL = (code, type) => {
            const blob = new Blob([code], {type})
            return URL.createObjectURL(blob)
        }
    
        this.gui.src = getBlobURL(txt, 'text/html')
    }
}

/**
 * @function
 * Konekti iframe
 * @param id Id of the iframe container
 * @param url Url/code for the iframe component
 */
Konekti.iframe = function(id, url){
	if(typeof id==='string') id=Konekti.plugin.iframe.config(id,url)
	return Konekti.plugin.iframe.connect(id)
}
