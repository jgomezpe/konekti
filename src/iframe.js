/** Iframe component that works as an editor */
class IFrameEditor extends Editor{
	/**
	 * Creates an IFrame configuration object
	 * @param id Id of the iframe container
	 * @param width Width of the div's component
	 * @param height Height of the div's component
	 * @param src Url/code for the iframe component
	 * @param parent Parent component
	 */
	setup(id, width, height, src, parent='KonektiMain'){ return {'plugin':'iframe', 'id':id, 'width':width,'height':height, 'src':src, 'parent':parent} }

	/**
	 * Creates an IFrame configuration object
	 * @param id Id of the iframe container
	 * @param width Width of the div's component
	 * @param height Height of the div's component
	 * @param src Url/code for the iframe component
	 * @param parent Parent component
	 */
	constructor(id, width, height, src, parent='KonektiMain'){ super(...arguments) }
	
	getBlobURL(code, type){
		const blob = new Blob([code], {type})
		return URL.createObjectURL(blob)
	}

	/**
	 * Associated html code
	 */
	html(){ 
		if( this.config.src === undefined || this.config.src === null ) this.config.src = ''
		if( !this.config.src.startsWith('https://') ){ this.config.src = this.getBlobURL(this.config.src, 'text/html') }
		return "<iframe id='"+this.id+"' name='"+this.id+"' src='"+this.config.src+"' frameBorder='0'></iframe>" 
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
 * @param id Id of the iframe container
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param src Url/code for the iframe component
 */
Konekti.iframe = function(id, width, height, src){ return new IFrameEditor(id, width, height, src) }