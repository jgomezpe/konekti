if(typeof window.MathJax=='undefined'){
	Konekti.resource.JS('https://polyfill.io/v3/polyfill.min.js?features=es6')
	Konekti.resource.JS('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js')
}

/** Konekti plugin for latex elements */
class LatexPlugin extends PlugIn{
	constructor(){ super('latex') }

	/**
	 * Creates a Latex config object 
	 * @param parent Parent component
	 * @param id Id of the latex component
	 * @param config Extra configuration of the component
	 * @param tex Latex code
	 */
	 setup(parent, id, tex, config={}){
		config = Konekti.config(config)
		config.style.padding = '8px'
		config.style.overflow='auto'
		var c = super.setup(parent, id, '', config)
		c.initial = tex
		return c
	}

	client(config){ return new Latex(config) }
}

/** Registers the latex plugin in Konekti */
new LatexPlugin()


/** Latex editor */
class Latex extends Editor{
	/**
	 * Creates a Latex config object 
	 */
	constructor(config){ 
		super(config) 
		var x = this
		Konekti.daemon(function(){ return x.vc()!==undefined && x.vc()!==null }, function(){ x.setText(x.initial) })
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
		Konekti.daemon(
			function (){ return (window.MathJax !== undefined) },
			function (){	
				var output = x.vc()
				output.innerHTML = tex.trim()
				window.MathJax.texReset()
				window.MathJax.typesetClear()
				window.MathJax.typesetPromise([output]).catch(function(err){
					output.innerHTML = ''
					output.appendChild(document.createTextNode(err.message))
				}).then(function(){});
			}
		)	
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
 * @param id Id of the latex component
 * @param tex Latex code
 * @param config Extra configuration of the component
 * @param callback Function called when the latex component is ready
 */
Konekti.latex = function(id, tex='', config={}, callback=function(){}){
	Konekti.add({'plugin':'latex', 'setup':['body',id,tex,config]},callback)
}