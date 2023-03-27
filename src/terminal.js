/**
*
* terminal.js
* <P>Terminal (console) interface.</P>
* <P> Requires <A HREF="https://jgomezpe.github.io/konekti/src/konekti.js">https://jgomezpe.github.io/konekti/src/konekti.js</P> 
*
* Copyright (c) 2021 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/aplikigo">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Professor Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

/** Konekti Plugin for a Process Terminal */
class TerminalPlugIn extends PlugIn{
    /** Creates a Plugin for a Process Terminal */
    constructor(){ super('terminal') }

	/**
	 * Creates a terminal configuration object
	 * @param parent Parent component
	 * @param id Id of the terminal container
     * @param initial Initial text in the terminal
	 * @param config Style of the terminal container
	 */
    setup(parent, id, initial, config={}){
        var maxChars = config.maxChars || 1000000
 		config.tag = 'textarea'
		config.name = id
        config.rows = config.rows || '4'
        config.columns = config.columns || '80'
		var c = super.setup(parent, id, initial, config)
        c.maximum = maxChars
        return c  
	}
    
    /**
     * Creates a client for the plugin's instance
     * @param config Terminal configuration
     */
    client(config){ return new Terminal(config) }
}

if( Konekti.terminal===undefined) new TerminalPlugIn()

/** A Terminal Editor */
class Terminal extends Editor{
    /**
     * Creates the Process Terminal
     * @param config Terminal configuration
     */
    constructor(config){ 
        super(config) 
		var x = this
        x.input = ""
        x.server = null
		x.edit = x.vc()
		x.value = x.edit.value
		x.edit.onkeyup = function(event){
			var length = x.edit.value.length
            var npos = Math.min(x.selectionEnd,x.selectionStart)
            if(npos<x.value.length){
                x.edit.selectionEnd = x.value.length
                x.edit.selectionStart = x.value.length
            }
            x.input = x.edit.value.substring(x.value.length,length)
            var key = event.keyCode;
            if( key===13 && x.server !== null ){
				console.log(x.input)
                x.value += x.input
                x.server.input(x.input)
                x.input = ""
            }
        }     
    }
    
    /**
     * Initializes the terminal 
     * @param greetings An initial text in the terminal
     */
    init( greetings =''){
    	this.value = greetings
        this.edit.value = greetings
        this.input = ""
    }
    
    /**
     * Gets current text in the terminal
     * @return Current text in the terminal
     */
    getText(){ return this.edit.value }
    
    /**
     * Sets text in the process terminal
     * @param txt Text to set in the process terminal
     */
    setText(txt){
        var x = this
		if( txt === undefined || txt == null ) txt = ''
        else if( txt.length > x.maximum ) txt = txt.substring(txt.length-Math.floor(9*x.maximum/10))
        x.value = txt
        x.input = ''
        Konekti.daemon( function(){ return x.edit !== undefined }, 
            function(){
                x.edit.value = txt 
                x.edit.selectionStart = txt.length 
                x.edit.selectionEnd = txt.length
            }
        )
    }
    
    /**
     * Adds text to the process terminal (output to the terminal)
     * @param txt Text to be added to the process terminal (written to the terminal) 
     */ 
    output(txt){
    	if( txt === undefined || txt == null || txt.length == 0 ) return;
        var x = this
        x.value += txt
        if( x.value.length > x.maximum ) x.value = x.value.substring(x.value.length-Math.floor(9*x.maximum/10))
        function checked(){
        	if( x.edit !== undefined ){
        		setTimeout( function(){
        			if(x.input.length > 0) x.edit.value = x.value + x.input
 					else x.edit.value = x.value
 					
               		x.edit.selectionStart = x.value.length 
               		x.edit.selectionEnd = x.value.length 
              	}, 1 )
			}else setTimeout( checked, 50 ) 
        } 
        checked()
    }
    
    /**
     * Sets current position in the terminal (currently does nothing)
     * @param row Row for the terminal cursor
     * @param column Column for the terminal cursor
     */
    locateCursor(row, column){
        /*this.edit.moveCursorTo(row, column);
        this.edit.focus();*/
    }
    
    /**
     * Gets current position in the terminal (currently, returns 0)
     * @return [row,column] for the cursor
     */
    cursorLocation(){ return 0 /*this.edit.selection.getCursor()*/ }
    
    /**
     * Highlights a row in the terminal (currently does nothing)
     * @param row Row to highlight
     */
    highlight(row){ this.locateCursor( row,1 ) }
    
    /**
     * Gets current position in the editor (character count), currently returns 0.
     * @return Position of the cursor (character count)
     */
    cursorIndex(){ return 0 /*this.edit.session.doc.positionToIndex(this.edit.selection.getCursor())*/ }
    
    /**
     * Sets current position in the terminal (character count), currently does nothing
     * @param pos Position of the cursor (character count)
     */
    locateCursorIndex(pos){ /*this.edit.selection.moveTo(this.edit.session.doc.indexToPosition(pos))*/ }
    
    /**
     * Updates the position of the scroll associated to the terminal
     * @param pos New position for the scroll
     */
    scrollTop(pos){
        this.edit.scrollTop = pos
    }
}

/**
 * Associates/Adds a Terminal
 * @method
 * terminal
 * @param parent Parent component
 * @param id Id of the terminal container
 * @param initial Initial text in the terminal
 * @param config Style of the terminal container
 * @param callback Function called when the terminal is ready
 */
Konekti.terminal = function(id, initial='', config={}, callback=function(){}){ 
	Konekti.add({'plugin':'terminal', 'setup':['body', id, initial, config]}, callback)
}