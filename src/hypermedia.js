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

/** Konekti Plugin for hypermedia components */
class HyperMediaPlugIn extends PlugIn{
	/** Creates a Plugin for Hypermedia components */
	constructor(){ super('hypermedia') }
    
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( config ){ return new HyperMedia(config) }
}

/**
 * HyperMedia: A hypermedia component for Konekti (composed by a media component and several editor components).
 * When the media is played, the set of editors are updated accroding to thier associated scripts.
 */
 class HyperMedia extends MediaClient{
	/**
	 * Creates a hyper media client with the given id/client information, and registers it into the Konekti framework
	 * @param thing Hyper media client information
	 */	
	constructor(thing){
		super(thing)
		this.scripts = thing.scripts || []
		this.media = thing.media
		Konekti.client[this.media].addListener(this.id)
	}
	
	/**
	 * Updates the hypermedia client
	 * @param config Hyper media client information
	 * 
         */
	update(config){
		var x = this
		x.scripts = config.scripts || []
		x.media = config.media
		Konekti.bootstrap(config.children, x.id, function(components){
			x.vc().innerHTML = ''
			x.chidren = components
			Konekti.client[x.media].addListener(x.id)
		})
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
					var text;
					if(k>=0){
						if(script.mark[k].txt === undefined){
							var start = script.mark[k].start || 0
							var end = script.mark[k].end || script.text.length
							var add = script.mark[k].add || '' 
							text = script.text.substring(start,end) + add
						}else text = script.mark[k].txt
					}else text = script.text
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

if(Konekti.hypermedia === undefined) new HyperMediaPlugIn()

/**
 * Creates an hypermedia configuration object
 * @method
 * hypermediaConfig
 * @param id Id of the hypermedia component
 * @param width Width of the hypermedia component
 * @param height Height of the hypermedia component
 * @param layout Hypermedia layout
 * @param media Id of the media controller (must be a component of the layout)
 * @param scripts Scripts followed by the hypermedia
 * @param parent parent component
 */
Konekti.hypermediaConfig = function(id, width, height, layout, media, scripts, parent='KonektiMain'){
	return {'plugin':'hypermedia', 'id':id, 'parent':parent, 'with':width, 'height':height, 'media':media, 'scripts':scripts, 'children':layout}
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
 */
Konekti.hypermedia = function(id, width, height, layout, media, scripts){
	return Konekti.build(Konekti.hypermediaConfig(id, width, height, layout, media, scripts))
}