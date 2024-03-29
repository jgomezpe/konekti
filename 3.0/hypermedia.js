/**
*
* hypermedia.js
* <P>Hypermedia player.</P>
* <P> Requires konekti.js</P>
*
* Copyright (c) 2021 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/aplikigo">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Professor Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

/**
 * HyperMedia: A hypermedia plugin for Konekti 
 */
 class HyperMediaPlugin extends PlugIn{
	constructor(){ super('hypermedia') }

	/**
	 * Creates an hypermedia configuration object
	 * @param parent parent component
	 * @param id Id of the hypermedia component
	 * @param layout Hypermedia layout
	 * @param media Id of the media controller (must be a component of the layout)
	 * @param scripts Scripts followed by the hypermedia
	 * @param config Style of component
	 */
	setup(parent, id, layout, media, scripts, config={}){
		var c = super.setup(parent, id, layout, config)
		c.media = media
		c.scripts = scripts
		return c
	}

	/**
	 * Creates a hyper media client with the given id/client information, and registers it into the Konekti framework
	 */	
	client(config){ new HyperMedia(config) }
}

/** Registers the hypermedia plugin in Konekti */
new HyperMediaPlugin()

/**
 * HyperMedia: A hypermedia component for Konekti (composed by a media component and several editor components).
 * When the media is played, the set of editors are updated accroding to thier associated scripts.
 */
 class HyperMedia extends Client{
	/**
	 * Creates a hyper media client with the given id/client information, and registers it into the Konekti framework
	 */	
	constructor(config){
		super(config) 
		var x = this
		var tout
		function check(){
			if(Konekti.client[x.media] !== undefined && Konekti.client[x.media] !== null){
				clearTimeout(tout)
				Konekti.client[x.media].addListener(x.id)
			}else tout = setTimeout(check,Konekti.TIMER)
		}
		check()		
	}

	/**
	 * Plays the media component
	 * @param id The media id 
	 */
	play(id){ if( id === undefined ) this.media.play() }

	/**
	 * Pauses the media component
	 * @param id The media id 
	 */
	pause(id){ if( id === undefined ) this.media.pause() }

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	 locate(time){
		var scripts = this.scripts
		for( var i=0; i<scripts.length; i++ ){
			var script = scripts[i]
			var target = Konekti.client[script.target]
			if(target !== undefined){
				script.text =  script.text || target.getText()
				script.current = script.current || -1
				var k=script.mark.length-1
				while( k>=0 && script.mark[k].time>time ){ k-- }
				if(k!=script.current){
					var n = 0
					var text = ''
					for( var j=0; j<script.mark[k].replace.length; j++ ){
						text += script.text.substring(n,script.mark[k].replace[j].start || 0)
						text += script.mark[k].replace[j].text || ''
						n = script.mark[k].replace[j].end || script.text.length
					}
					text += script.text.substring(n)	
					target.setText(text)
					if(k>=0) target.scrollTop()
					script.current = k
				}
			}
		}
	}


	/**
	 * Locates the media component at the given time
	 * @param id The media id 
	 * @param time Time position for the media component
	 */
	seek(id,time){
		if(typeof id === 'string') this.locate(time)
		else Konekti.client[this.media].seek(time)
	}
}

/**
 * Creates an hypermedia client
 * @method
 * hypermediaConfig
 * @param id Id of the hypermedia component
 * @param width Width of the hypermedia component
 * @param height Height of the hypermedia component
 * @param layout Hypermedia layout
 * @param media Id of the media controller (must be a component of the layout)
 * @param scripts Scripts followed by the hypermedia
 * @param parent parent component
 * @param callback Function called when the hypermedia component is ready
 */
Konekti.hypermedia = function(parent, id, layout, media, scripts, config, callback){
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==5) args[5] = {}
	if(args.length==6) args[6] = function(){}
	Konekti.add('hypermedia', ...args)
}