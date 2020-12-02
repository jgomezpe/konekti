if(typeof window.MathJax=='undefined'){
    Konekti.core.resource.script('text/javascript', 'https://polyfill.io/v3/polyfill.min.js?features=es6')
    Konekti.core.resource.JS('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml')
}

/** Konekti Plugin for latex (MathJax) components */
class LatexPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for latex components */
    constructor(){ super('latex') }

    /**
     * Fills the html template with the specific latex information
     * @param thing Latex information
     * @return Html code associated to the latex component
     */
    fillLayout( thing ){
        var c = Konekti.vc( thing.id )
        if( typeof thing.initial == 'string')	c.setAttribute('initial',thing.initial)
        else c.setAttribute('initial', '')
        return Konekti.core.fromTemplate( this.htmlTemplate, thing )
    }

    	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new LatexEditor(thing) }

	/**
	 * Creates a config object from parameters
	 * @param id Id/Configuration of the latex component
	 * @param tex Latex code
	 * @param client Client of the latex component
	 */
	config(id, tex=''){ return {"id":id, 'initial':tex} }

}

new LatexPlugIn()

/** Latex editor */
class LatexEditor extends KonektiEditor{
	/**
	 * Creates a latex editor
	 * @param thing Latex component configuration
	 */
	constructor(thing){
		super(thing) 
		this.innergui = this.vc('content')
		this.setText(thing.initial)
	}
	
	/**
	 * Gets current latex code in the component
	 * @return Current latex code in the component
	 */
	getText(){ return this.gui.getAttribute('initial') }

	/**
	 * Sets latex code for the latex component
	 * @param tex latex code to set in the latex component
	 */
	setText(tex){
		if( tex === undefined || tex===null) text=''
        	this.gui.setAttribute('initial', tex)
		var output = this.innergui
		var tout = null
		function set(){
			if(window.MathJax!==undefined){
				if( tout !=null ) clearTimeout(tout)
				output.innerHTML = tex.trim()
				window.MathJax.texReset()
				window.MathJax.typesetClear()
				window.MathJax.typesetPromise([output]).catch(function(err){
					output.innerHTML = ''
					output.appendChild(document.createTextNode(err.message))
					console.error(err)
				}).then(function(){});
			}else{ tout = setTimeout(set,1000) }
		}
		set()
	}
}

/**
 * @function
 * Konekti latex
 * @param id Id/Configuration of the latex component
 * @param tex Latex code
 * @param client Client of the latex component
 */
Konekti.latex = function(id, tex){
	if(typeof id === 'string') id=Konekti.plugin.latex.config(id,tex)
	return Konekti.plugin.latex.connect(id)
}

