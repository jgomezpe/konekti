/** Konekti Plugin for iframe components */
class IFramePlugIn extends KonektiPlugIn{
    /** Creates a Plugin for iframe components */
    constructor(){ super('iframe') }

    /** 
     * Connects (extra steps) the iframe component with the GUI component
     * @param thing Iframe component configuration
     */
    extra ( thing ){ new IFrameEditor(thing) }
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
 * @param container Id of the iframe container
 * @param url Url for the iframe component
 * @param client Client of the iframe component
 */
Konekti.iframe = function(container, url, client){
    var dict = {"id":container, "src":url}
    if(client!==undefined && client !==null) dic.client = client
    else dict.client = 'client'
    Konekti.plugin.iframe.connect(dict)
}
