// This javascript requires Konekti.js

/** Konekti Plugin for a Process Terminal */
class TerminalPlugIn extends PlugIn{
    /** Creates a Plugin for a Process Terminal */
    constructor(){ super('terminal') }
    
    /**
     * Creates a client for the plugin's instance
     * @param thing Instance configuration
     */
    client(thing){ return new Terminal(thing) }

    /**
     * Creates a config object from parameters
     * @param id Id/Configuration of the latex component
     * @param tex Latex code
     */
    config(id, initial=''){ return {"id":id, 'initial':initial} }
}

new TerminalPlugIn()

/** A Terminal Editor */
class Terminal extends Editor{
    /**
     * Creates the Process Terminal
     * @param thing Terminal configuration
     */
    constructor(thing){ 
        super(thing) 
        this.pos = -1
        this.input = ""
        this.update(thing)
        this.server = null
    }
    
    /**
     * Initializes the terminal
     */
    init(){
        this.edit.value = ""
        this.pos = -1
        this.input = ""
    }
    
    /**
     * Sets the Process server for input/output operations
     * @param  Process server
     */
    set( server ){ this.server = server; }
    
    /**
     * Updates the Process Terminal
     * @param thing Process terminal configuration
     */
    update(thing){
        var id = this.id
        var x = this        
        x.edit = x.vc('Area')
        x.edit.onkeyup = function(event){
            if( x.pos < 0 ){
                x.pos = x.edit.selectionEnd
                x.value = x.edit.value
            }
            var npos = x.selectionEnd
            if(npos<x.pos){
                x.edit.selectionEnd = x.pos
                x.edit.selectionStart = x.pos
            }
            x.input = x.edit.value.substring(x.pos,x.edit.value.length)
            
            var key = event.keyCode;
            if( key===13 && x.server !== null ){
                x.server.input(x.input)
                x.input = ""
                x.pos = x.edit.value.length
            }
        }     
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
        function checked(){
            if( x.edit !== undefined ){
                x.edit.value = txt 
                x.edit.selectionStart = txt.length 
                x.edit.selectionEnd = txt.length 
                x.pos = txt.length
                x.input = ""
            }else setTimeout( checked, 200 )
        }
        checked()
    }
    
    /**
     * Adds text to the process terminal (output to the terminal)
     * @param txt Text to be added to the process terminal (written to the terminal) 
     */ 
    output(txt){
        if( txt !== undefined && txt.length>0 ){
               this.edit.value = this.edit.value.substring(0,this.pos) + txt + this.input
                this.edit.selectionStart += txt.length 
                this.edit.selectionEnd += txt.length 
                this.pos += txt.length
        } 
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
 * Associates/Adds a process terminal 
 * @method
 * terminal
 * @param id Id/Configuration of the process terminal
 * @param initial Initial text in the process terminal
 */
Konekti.terminal = function(id, initial){
    if(typeof id ==='string') id=Konekti.plugins.terminal.config(id,initial)
    var c = Konekti.plugins.terminal.connect(id)
    c.update(id)
    return c
}
