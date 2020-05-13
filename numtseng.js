/**
 * Numtseng javascript
 */

var numtseng_dictionary
var numtseng

class Numtseng{
	html(id){
		var x = '<div id="'+id+'" class="w3-rest">'+
				'<div id="title"  class="w3-container w3-center" >Title</div>'+
				'<!-- Side bar -->'+
				'<div id="toc"></div>'+
				'<!-- Page Content -->'+
				'<div id="navbar" class="w3-bar"></div>'+
				'<div class="w3-row">'+
					'<div class="w3-container w3-half" >'+
						'<div id="top" ></div>'+
						'<div id="bottom" ></div>'+
					'</div>'+
					'<div class="w3-container w3-half"><div id="right" ></div> </div>'+
				'</div>'+
			'</div>'
		return x

	}

	config(id){
		var x = {
			"plugin":"",
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
				"search":true,
				"btn":[
					{"id":"prev","fa":"fa fa-caret-square-o-left"},
					{"id":"next","fa":"fa fa-caret-square-o-right"},
					{"id":"up","fa":"fa fa-caret-square-o-up"},
					{"id":"down","fa":"fa fa-caret-square-o-down"}
				]
			},
			"content":{}
 		}
		return x
	}

	constructor(dictionary){
		numtseng = this
		numtseng_dictionary = this.config(dictionary)
		document.body.innerHTML = this.html(dictionary)
		
		this.server = new Server()
		var server = this.server

		function callbackDictionary(){
			numtseng.goto(dictionary) 			
		}

		function callbackLanguage(){
			numtseng_dictionary.languages = server.languages[dictionary]
			numtseng_dictionary.id = dictionary
			PlugIn.build(server, numtseng_dictionary, callbackDictionary)
		}

		server.multiLanguage(dictionary, Util.language(), callbackLanguage)

	}

	goto(topic){
		var s = this.server
		function callback(dictionary){
			PlugIn.build(s, dictionary)
			numtseng_dictionary.content.navigation = dictionary.navigation
			numtseng_dictionary.content.scripts = dictionary.content.scripts
/*			if(dictionary.content != null) numtseng_dictionary.content = dictionary.content
			if(dictionary.nav.side.content != null)	numtseng_dictionary.nav.side.content = dictionary.nav.side.content */
		}
		this.server.getConfigFile(topic, callback) 		
	}
	
}

class Client{
	constructor(){
		this.media={}
		this.edit={}
	}

	prev(){ numtseng.goto(numtseng_dictionary.content.navigation.prev) }
	next(){	numtseng.goto(numtseng_dictionary.content.navigation.next) }
	up(){ numtseng.goto(numtseng_dictionary.content.navigation.up) }
	down(){	numtseng.goto(numtseng_dictionary.content.navigation.down) }
	select(id){ numtseng.goto(id) }

	paused(id){
		if( this.media[id] == null ) this.media[id] = {}
	}

	playing(id, time){
		if( this.media[id] == null ) this.media[id] = {}
		this.media[id].time = time
		var scripts = numtseng_dictionary.content.scripts
		for( var i=0; i<scripts.length; i++ ){
			var script = scripts[i]
			var i=script.mark.length-1
			while( i>=0 && script.mark[i].time>time ){ i-- }
			if(i>=0){
				var text = script.text.substring(0,script.mark[i].end) + script.mark[i].add
				this.edit[script.target].setText(text)
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

	editor(id, get, set){
		if( this.edit[id] == null ) this.edit[id] = {}
		this.edit[id].getText = get
		this.edit[id].setText = set
	}

	setLanguage(id, lang){
		numtseng.server.getConfigFile = function(file, next){ numtseng.server.getJSON('language/'+lang+'/'+file, next) } 
		numtseng.goto(id)
	}
}

window.client = new Client()
