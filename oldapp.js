/**
 * application javascript
 */

class App extends KonektiClient{
	constructor( file ){
		super(file)
		var client = this

		client.dictionary = client.config(file)
		document.body.innerHTML = client.html(file)
		
		function callbackDictionary(){ client.goto(client.id) }

		function callbackLanguage(){
			client.languages = Konekti.server.languages[client.id]
			client.dictionary.id = client.id
			Konekti.build(client.dictionary, client.id, callbackDictionary)
		}

		var server = Konekti.server
		server.multiLanguage(client.id, Konekti.util.language(), callbackLanguage)
	}

	setLanguage(id, lang){
		Konekti.server.getConfigFile = function(file, next){ Konekti.server.getJSON('language/'+lang+'/'+file, next) } 
		this.goto(id)
	}

	goto(topic){
		var client = this
		function callback(dictionary){ 
			dictionary.client = client.id
			client.connect(dictionary, client.id)
		}
		Konekti.server.getConfigFile(topic, callback)
	}
	
	navbarHTML(){
		var x = '<div><div class="w3-half"><div id="toc"></div>\n<div id="navbar" class="w3-bar"></div></div><div class="w3-half"><div id="extranavbar" class="w3-bar"></div></div></div>'
		return x
	}

	titleHTML(){
		var x = '<div id="title"  class="w3-container w3-center" >Title</div>'
		return x
	}

	html(id){
		var x = '<div id="'+id+'" style="position:fixed;height:100%;width:100%">'+
				this.titleHTML()+
				this.navbarHTML()+
				'<!-- Page Content -->'+
				'<div id="content" style="position:relative; width:100%; height:calc(100%-94px); overflow:auto"></div>'+
			'</div>'
		return x

	}

	config(id){
		var x = {
			"plugin":"",
			"id":id,
			"client":"client",
			"nav":{
				"plugin":"navbar",
				"id":"navbar",
				"color":"w3-blue-grey",
				"side":{
					"plugin": "sidebar",
					"id":"toc",
					"content":{	
						"plugin":"accordion",
						"id":"tocContent",
						"caption":"Table of Content", "color":"w3-blue-gray", 
						"children":[]
					}
				},
				"btn":[]
			},
			"content":{"id":"content"}
 		}
		return x
	}


	select(id){ this.goto(id) }

	playing(id, time){
		if( this.media[id] == null ) this.media[id] = {}
		this.media[id].time = time
		var scripts = this.dictionary.content.scripts
		for( var i=0; i<scripts.length; i++ ){
			var script = scripts[i]
			if(typeof this.edit[script.target] != 'undefined'){
				if( typeof script.text == "undefined" || script.text == null ) script.text = this.edit[script.target].getText()
				if( typeof script.current == "undefined" ) script.current = -1
				var k=script.mark.length-1
				while( k>=0 && script.mark[k].time>time ){ k-- }
				if(k!=script.current){
					var text;
					if(k>=0 ){
						var start = 0
						if(typeof script.mark[k].start!='undefined') start = script.mark[k].start
						var end = script.text.length
						if(typeof script.mark[k].end!='undefined') end = script.mark[k].end
						var add=''
						if(typeof script.mark[k].add!='undefined') add = script.mark[k].add 
						text = script.text.substring(start,end) + add
					}else text = script.text
					this.edit[script.target].setText(text)
					if( k>=0 ) this.edit[script.target].scrollTop()
					script.current = k
				}
			}
		}
	}

	editor(e){ this.edit[e.id] = e }
}
