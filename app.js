/**
 * application javascript
 */

class App{
	constructor( file ){
		Konekti.init()
		var client = this
		client.id = file
		client.media={}
		client.edit={}

		client.dictionary = client.config(file)
		document.body.innerHTML = client.html(file)
		
		function callbackDictionary(){ client.goto(client.id) }

		function callbackLanguage(){
			client.languages = Konekti.server.languages[client.id]
			client.dictionary.id = client.id
			Konekti.build(client.dictionary, client.id, callbackDictionary)
		}

		var server = Konekti.server
		server.client[file] = this
		server.multiLanguage(client.id, Konekti.util.language(), callbackLanguage)
	}

	connect( dictionary, cid ){ Konekti.build(dictionary, cid) }

	goto(topic){
		var client = this
		function callback(dictionary){ 
			dictionary.client = client.id
			client.connect(dictionary, client.id)
		}
		Konekti.server.getConfigFile(topic, callback)
	}
	
	navbarHTML(){
		var x = '<div class="w3-row"><div class="w3-half"><div id="toc"></div>\n<div id="navbar" class="w3-bar"></div></div><div class="w3-half"><div id="extranavbar" class="w3-bar"></div></div></div>'
		return x
	}

	titleHTML(){
		var x = '<div id="title"  class="w3-container w3-center" >Title</div>'
		return x
	}

	html(id){
		var x = '<div id="'+id+'" class="w3-rest">'+
				this.titleHTML()+
				this.navbarHTML()+
				'<!-- Page Content -->'+
				'<div id="content" ></div>'+
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

	paused(id){ if( this.media[id] == null ) this.media[id] = {} }

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

	pause(id, f){
		if( this.media[id] == null ) this.media[id] = {}
		this.media[id].pause = f
	}

	play(id, f){
		if( this.media[id] == null ) this.media[id] = {}
		this.media[id].play = f
	}

	seek(id, f){
		if( this.media[id] == null ) this.media[id] = {}
		this.media[id].seek = f
	}

	editor(id, get, set, scrollTop){
		if( this.edit[id] == null ) this.edit[id] = {}
		this.edit[id].getText = get
		this.edit[id].setText = set
		if(scrollTop != null) this.edit[id].scrollTop = scrollTop
		else this.edit[id].scrollTop = function(pos){
			var ui = Konekti.util.vc(id)
			if(pos==null) pos = ui.scrollHeight
			ui.scrollTop = pos
		}
	}

	setLanguage(id, lang){
		Konekti.server.getConfigFile = function(file, next){ Konekti.server.getJSON('language/'+lang+'/'+file, next) } 
		this.goto(id)
	}
}
