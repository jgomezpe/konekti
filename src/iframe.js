/** Iframe component that works as an editor */
class IFrameEditor extends Editor{
	/**
	 * Creates an IFrame configuration object
	 * @param parent Parent component
	 * @param id Id of the iframe container
	 * @param width Width of the div's component
	 * @param height Height of the div's component
	 * @param src Url/code for the iframe component
	 * @param config Style of the youtube container
	 */
	setup(parent, id, width, height, src, config={}){
		if( !src.startsWith('https://') ) config.src = this.getBlobURL(src, 'text/html') 
		else config.src = src
		config.tag = 'iframe'
		config.frameBorder = 0
		config.name = id
		return super.setup(parent, 'iframe', id, width, height, config)  
	}

	/**
	 * Creates an IFrame configuration object
	 */
	constructor(){ super(...arguments) }
	
	getBlobURL(code, type){
		const blob = new Blob([code], {type})
		return URL.createObjectURL(blob)
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
    	if( !txt.startsWith('https://') ) this.vc().src = this.getBlobURL(txt, 'text/html')
		else this.vc().src = txt 
	}
}

/**
 * Associates/Adds an IFrame 
 * @method
 * iframe
 * @param parent Parent component
 * @param id Id of the iframe container
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param src Url/code for the iframe component
 * @param config Style of the youtube container
 */
Konekti.iframe = function(parent, id, width, height, src, config={}){ return new IFrameEditor(parent, id, width, height, src, config) }