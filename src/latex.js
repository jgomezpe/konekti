if(typeof window.MathJax=='undefined'){
	Konekti.resource.JS('https://polyfill.io/v3/polyfill.min.js?features=es6')
	Konekti.resource.JS('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js')
}

/** Latex editor */
class Latex extends Editor{
	/**
	 * Creates a Latex config object 
	 * @param parent Parent component
	 * @param id Id of the latex component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param config Extra configuration of the component
	 * @param tex Latex code
	 */
	setup(parent, id, width, height, tex, config={}){
		config.tag = 'div'
		config.style = 'padding:8px;overflow:auto;' + (config.style || '')
		var c = super.setup(parent, "latex", id, width, height, config)
		c.initial = tex
		return c
	}

	/**
	 * Creates a Latex config object 
	 */
	constructor(){ 
		super(...arguments) 
		this.setText(this.initial)
	}

	/**
	 * Gets current latex code in the component
	 * @return Current latex code in the component
	 */
	getText(){ return this.initial }

	/**
	 * Sets latex code for the latex component
	 * @param tex latex code to set in the latex component
	 */
	setText(tex){
		if( tex === undefined || tex===null) tex=''
		var x = this
		x.initial = tex
		function set(){
			if(window.MathJax !== undefined){
				var output = x.vc()
				output.innerHTML = tex.trim()
				window.MathJax.texReset()
				window.MathJax.typesetClear()
				window.MathJax.typesetPromise([output]).catch(function(err){
					output.innerHTML = ''
					output.appendChild(document.createTextNode(err.message))
				}).then(function(){});
			}else setTimeout(set, 100)
		}
		set()	
	}

	/**
	 * Updates the position of the scroll associated to the editor
	 * @param pos New position for the scroll
	 */
	 scrollTop(pos){
		if(typeof pos=='undefined') pos = this.vc().scrollHeight
		this.vc().scrollTop = pos
	}

}

/**
 * Associates/Adds a latex component
 * @method
 * latex
 * @param parent Parent component
 * @param id Id of the latex component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param tex Latex code
 * @param config Extra configuration of the component
 */
Konekti.latex = function(parent, id, width, height, tex, config = {}){ return new Latex(parent, id, width, height, tex, config) }