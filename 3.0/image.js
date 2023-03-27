/** Konekti plugin for iframe elements */
class ImagePlugin extends PlugIn{
	constructor(){ super('image') }

	/**
	 * Creates an Image configuration object
	 * @param parent Parent component
	 * @param id Id of the image container
	 * @param src Url/code for the image component
	 * @param config Style of the image container
	 */
	 setup(parent, id, src, config={}){
		config.src = src
		config.tag = 'img'
		return super.setup(parent, id, '', config)  
	}

	client(config){ return new Image(config) }
}

/** Registers the iframe plugin in Konekti */
let imageplugin = new ImagePlugin()

/** Iframe component that works as an editor */
class Image extends Editor{
	/**
	 * Creates an IFrame configuration object
	 */
	constructor(config){ super(config) }
	
	/**
	 * Gets current src of image component
	 * @return Current src of the image component
	 */
	getText(){ return this.vc().src }

	/**
	 * Sets src of the image component
	 * @param txt src of the image
	 */
	setText(txt){ this.vc().src = txt }
}

/**
 * Associates/Adds an Image 
 * @method * image
 * @param parent Parent component
 * @param id Id of the image container
 * @param src Url of the image component
 * @param config Style of the image container
 * @param callback Function called when the image is ready
 */
Konekti.image = function(parent, id, src, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==2) args[2] = ''
	if(args.length==3) args[3] = {}
	if(args.length==4) args[4] = function(){}
	Konekti.add('image', ...args)
}