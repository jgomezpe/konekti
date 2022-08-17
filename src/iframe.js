/** Konekti Plugin for iframe components */
class IFramePlugIn extends PlugIn{
	/** Creates a Plugin for iframe components */
	constructor(){ super('iframe') }

	/**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client(config){ return new IFrameEditor(config) }
}

/** Iframe component that works as an editor */
class IFrameEditor extends Editor{
	/**
	 * Creates an iframe component that works as an editor
	 * @param id Id of the iframe component
	 */
	constructor(id){ super(id) }
	
	getBlobURL(code, type){
		const blob = new Blob([code], {type})
		return URL.createObjectURL(blob)
	}

	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ 
		if( config.src === undefined || config.src === null ) config.src = ''
		if( !config.src.startsWith('https://') ){
			/*const getBlobURL = (code, type) => {
				const blob = new Blob([code], {type})
				return URL.createObjectURL(blob)
			}*/
			config.src = this.getBlobURL(config.src, 'text/html')
		}
		return "<iframe id='"+this.id+"' name='"+this.id+"' src='"+config.src+"' frameBorder='0'></iframe>" 
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
		/*const getBlobURL = (code, type) => {
			const blob = new Blob([code], {type})
			return URL.createObjectURL(blob)
		}*/
    		if( !config.src.startsWith('https://') ){
			this.vc().src = this.getBlobURL(txt, 'text/html')
		}else{ this.vc().src = txt }
	}
}

/** IFrame class */
if(Konekti.iframe===undefined) new IFramePlugIn()

/**
 * Creates an IFrame configuration object
 * @method
 * iframeConfig
 * @param id Id of the iframe container
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param src Url/code for the iframe component
 * @param parent Parent component
 */
Konekti.iframeConfig = function(id, width, height, src, parent='KonektiMain'){
	return {'plugin':'iframe', 'id':id, 'width':width,'height':height, 'src':src, 'parent':parent}
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
Konekti.iframe = function(id, width, height, src){
	return Konekti.build(Konekti.iframeConfig(id, width, height, src))
}
