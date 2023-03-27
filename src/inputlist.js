/** Konekti plugin for input list elements */
class InputListPlugin extends PlugIn{
	constructor(){ super('inputlist') }

	/**
	 * Creates an input-list configuration object
	 * @param parent Parent component
	 * @param id Id of the input-list
	 * @param options List options
	 * @param onselect Method that will be executed when an option of the list is selected
	 * @param onenter Method that will be executed when the enter key is pressed
	 * @param config Style of the input-list
	 */
	setup(parent, id, options, onselect='', onenter='', config={}){
		config.tag = 'input'
		config = this.style(config)
		config.style['font-family'] ='FontAwesome, Arial, Verdana, sans-serif'
		config.class = (config.class||"") + " w3-input "

		config.placeholder = (config.placeholder || '')
		config.name = id
		config.list = id+'List'
		var c = super.setup(parent, id, '', config)
		c.options = options
		c.onenter = onenter
		c.onselect = onselect
		return c
	}

	client(config){ return new InputList(config) }
}

/** Registers the inputlist plugin in Konekti */
new InputListPlugin()

/** An InputList manager */
class InputList extends Client{

	/**
	 * Creates an inputlist client
	 */
	constructor(config){ 
		super(config)
		var x = this
		Konekti.raw('body', this.id+'List', '', {'tag':'datalist'})
		x.vc().onchange = function(){
			var value = x.vc().value
			var i=0
			while(i<x.options.length && x.options[i].caption!=value) i++
			if(i<x.options.length) eval(Konekti.dom.onclick(x.options[i].id,x.onselect))
			else eval(Konekti.dom.onclick(value,x.onenter))
			//x.vc().value = ''
		}

		this.set(this.options)
	}

	set(list){
		var x = this
		x.options = list
		var tout
		function check(){
			if(x.vc('List')!==undefined && x.vc('List')!==null){
				clearTimeout(tout)
				var options = ''
				for(var i=0; i<list.length; i++){
					options += '<option data-value="'+list[i].id+'">'+list[i].caption+'</option>\n'
				}
				x.vc('List').innerHTML = options
			}else tout = setTimeout(check, Konekti.TIMER)
		}
		check()
	}
}

/**
 * Associates/adds an inputlist
 * @method
 * inputlist
 * @param parent Parent component
 * @param id Id of the inputlist
 * @param options List of options
 * @param onselect Method that will be executed when an option of the list is selected
 * @param onenter Method that will be executed when the enter key is pressed
 * @param config Style of the inputlist
 * @param callback Function called when the inputlist is ready
 */
Konekti.inputlist = function(id, options=[], onselect='', onenter='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'inputlist', 'setup':['body', id, options, onselect, onenter, config]},callback)
}