if(typeof window.MathJax=='undefined'){
	Konekti.resource.script('text/javascript', 'https://polyfill.io/v3/polyfill.min.js?features=es6')
	Konekti.resource.JS('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js')
}

/** Konekti Plugin for latex (MathJax) components */
class LatexPlugIn extends PlugIn{
	/** Creates a Plugin for latex components */
	constructor(){ super('latex') }

	/**
	 * Creates a client for the plugin
	 * @param config Instance configuration
	 */
	client( config ){ return new Latex(config) }

}

/** Latex editor */
class Latex extends Editor{
	/**
	 * Creates a latex editor
	 * @param config Latex component configuration
	 */
	constructor(config){
		super(config) 
		this.gui = this.vc()
		this.initial = config.initial || ''
		this.setText(this.initial)
	}

	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ return "<div id='"+this.id+"' style='padding:8px;overflow:auto;'></div>" }

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
		this.initial = tex
		var output = this.vc()
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
				}).then(function(){});
			}else{ tout = setTimeout(set,100) }
		}
		set()
	}
}

/** Latex class */
if(Konekti.latex===undefined) new LatexPlugIn()

/**
 * Creates a Latex config object 
 * @method
 * latexConfig
 * @param id Id of the latex component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param tex Latex code
 * @param parent Parent component
 */
Konekti.latexConfig = function(id, width, height, tex, parent='KonektiMain'){
	return {"plugin":"latex", "id":id, "initial":tex, 'width':width, 'height':height, 'parent':parent}
}

/**
 * Associates/Adds a latex component
 * @method
 * latex
 * @param id Id of the latex component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param tex Latex code
 * @param parent Parent component
 */
Konekti.latex = function(id, width, height, tex){
	return Konekti.build(Konekti.latexConfig(id, width, height, tex))
}

