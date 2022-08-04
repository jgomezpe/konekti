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
		this.scripts = config.scripts || []
		this.media = config.media
		Konekti.client[this.media].addListener(this.id)
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
