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
        this.input = ""
        this.server = null
		var x = this     
		this.maximum = config.maximum || 1000000
		x.edit = this.vc()
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
                x.value += x.input
                x.server.input(x.input)
                x.input = ""
            }
        }     
    }
    
	/**
	 * Associated html code
	 * @param config Client configuration
	 */
     html( config ){ 
		config.inner = config.inner || ''
		return "<textarea id='"+this.id+"' name='"+this.id+"' rows='4' columns='80'>"+config.inner+"</textarea>"
	}  

    /**
     * Initializes the terminal
     */
    init(){
    	this.value = ''
        this.edit.value = ""
        this.input = ""
    }
    
    /**
     * Sets the Process server for input/output operations
     * @param  Process server
     */
    set( server ){ this.server = server || null }
    
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
		if( txt === undefined || txt == null ) txt = ''
        else if( txt.length > this.maximum ) txt = txt.substring(txt.length-Math.floor(9*x.maximum/10))
        var x = this
        x.value = txt
        x.input = ''
        function checked(){
            if( x.edit !== undefined ){
                x.edit.value = txt 
                x.edit.selectionStart = txt.length 
                x.edit.selectionEnd = txt.length
            }else setTimeout( checked, 50 )
        }
        checked()
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
 * Creates a config object from parameters
 * @param id Id/Configuration of the terminal component
 * @param width Width of the terminal's component
 * @param height Height of the terminal's component
 * @param initial Initial text in the terminal
 * @param maxChars Maximum number of characters maintained by the terminal
 * @param parent Parent component
 */
Konekti.terminalConfig = function(id, width, height, initial, maxChars=1000000, parent='KonektiMain'){ 
    return {"plugin":'terminal', "id":id, 'width':width, 'height':height, 'inner':initial, 'maximum':maxChars, 'parent':parent} 
}

/**
 * Associates/Adds a process terminal 
 * @method
 * terminal
 * @param id Configuration of the process terminal
 * @param width Width of the terminal's component
 * @param height Height of the terminal's component
 * @param initial Initial text in the process terminal
 * @param maxChars Maximum number of characters maintained by the terminal
 */
Konekti.terminal = function(id, width, height, initial, maxChars=1000000){
    return Konekti.build(Konekti.terminalConfig(id, width, height, initial, maxChars))
}