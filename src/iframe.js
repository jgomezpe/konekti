/** Konekti plugin for iframe elements */
class IFramePlugin extends PlugIn{
	constructor(){ super('iframe') }

	getBlobURL(code, type){
		const blob = new Blob([code], {type})
		return URL.createObjectURL(blob)
	}

	/**
	 * Creates an IFrame configuration object
	 * @param parent Parent component
	 * @param id Id of the iframe container
	 * @param src Url/code for the iframe component
	 * @param config Style of the youtube container
	 */
	setup(parent, id, src, config={}){
		config.tag = 'iframe'
		config = this.style(config)
		if( !src.startsWith('https://') ) config.src = this.getBlobURL(src, 'text/html') 
		else config.src = src
		config.frameBorder = 0
		config.name = id
		return super.setup(parent, id, '', config)  
	}

	client(config){ return new IFrameEditor(config) }
}

/** Registers the iframe plugin in Konekti */
let iframeplugin = new IFramePlugin()

/** Iframe component that works as an editor */
class IFrameEditor extends Editor{
	/**
	 * Creates an IFrame configuration object
	 */
	constructor(config){ super(config) }
	
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
    	if( !txt.startsWith('https://') ) this.vc().src = iframeplugin.getBlobURL(txt, 'text/html')
		else this.vc().src = txt 
	}
}

/**
 * Associates/Adds an IFrame 
 * @method
 * iframe
 * @param id Id of the iframe container
 * @param src Url/code for the iframe component
 * @param config Style of the youtube container
 * @param callback Function called when the iframe is ready
 */
Konekti.iframe = function(id, src='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'iframe', 'setup':['body', id, src, config]}, callback)
}