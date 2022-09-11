uses('https://jgomezpe.github.io/konekti/src/btn.js')

/** Konekti Plugin for DropDown components */
class DropDown extends Btn{
	/**
	 * Creates a dropdown configuration object
	 * @param id Id of the dropdown
	 * @param icon Icon of the dropdown
	 * @param caption Caption of the dropdown
	 * @param style Style of the dropdown
	 * @param title Message that will be shown when mouse is over the dropdown
	 * @param content_type Type of content: 'free' or 'list'
	 * @param content Content
	 * @param parent Parent component
	 */
	 setup(id, icon, caption, style, title, content_type, content, parent='KonektiMain'){
		if( content_type === 'list' ){
			var options = content.options
			var onclick = content.onclick
			for( var i=0; i<options.length; i++ )
				if( typeof options[i] == 'string' ) options[i] = {'plugin':'btn', 'setup':[options[i], "", options[i], onclick, 'w3-bar-item', options[i], id+'Drop']}
				else options[i] = {'plugin':'btn', 'setup':[options[i].id, options[i].icon, options[i].caption, onclick, 'w3-bar-item', options[i].title, id+'Drop']}
			content = options
		}else{
			if(!Array.isArray(content) ) content = [content]
			for( var i=0; i<content.length; i++ ) content[i].parent = id +'Drop'
		}

		var config= super.setup(id, icon, caption, {"method":"drop", "client":id}, style, title, parent)
		
		var drop = {'plugin':'container', 'setup':[id+'Drop', '', '', "class='w3-dropdown-content w3-bar-block' style='margin-left:-16px;margin-top:6px'", content, id]}
		config.children.push(drop)
		config.plugin = 'dropdown'	
		return config
	}

	/**
	 * Creates a dropdown configuration object
	 * @param id Id of the dropdown
	 * @param icon Icon of the dropdown
	 * @param caption Caption of the dropdown
	 * @param style Style of the dropdown
	 * @param title Message that will be shown when mouse is over the dropdown
	 * @param content_type Type of content: 'free' or 'list'
	 * @param content Content
	 * @param parent Parent component
	 */
	constructor(id, icon, caption, style, title, content_type, content, parent='KonektiMain'){ super(...arguments) }    

	drop(){
		var x = this.vc('Drop')
		if (x.className.indexOf("w3-show") == -1) x.className += " w3-show"
		else x.className = x.className.replace(" w3-show", "")
	}
}

/**
 * Associates/Adds a dropdown
 * @method
 * dropdown
 * @param id Id of the dropdown
 * @param icon Icon of the dropdown
 * @param caption Caption of the dropdown
 * @param style Style of the dropdown
 * @param title Message that will be shown when mouse is over the dropdown
 * @param content_type Type of content: 'free' or 'list'
 * @param content Content
 * @param parent Parent component
 */
Konekti.dropdown = function(id, icon, caption, style, title, content_type, content, parent='KonektiMain'){
	return new DropDown(id, icon, caption, style, title, content_type, content, parent)
}