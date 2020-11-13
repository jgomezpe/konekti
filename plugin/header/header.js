/** Konekti Plugin for Header components */
class HeaderPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for Header components */
    constructor(){ 
        super('header') 
        this.replace = 'strict'
    }
    
    /**
     * Fills the html template with the specific header information
     * @param thing Header information
     * @return Html code associated to the header
     */
    fillLayout(thing){
        thing.style = thing.style || 'w3-center w3-blue'
        thing.size = thing.size || 3
        thing.icon = thing.icon || ''
       return Konekti.core.fromTemplate( this.htmlTemplate, thing )
    }
}

new HeaderPlugIn()

/**
 * @function
 * Konekti header
 * @param id Id of the header/Configuration of the header
 * @param icon Icon for the header (not required if configuration is provided)
 * @param caption Caption of the header
 * @param size Size of the header (1,2,3..) (not required if configuration is provided)
 * @param style Style of the header (not required if configuration is provided)
 */
Konekti.header = function(id, icon='', caption='', size=3, style='w3-center w3-blue' ){
    var thing
    if(typeof id==='string'){
        thing={"id":id, "caption":caption, "size":size, "style":style, "icon":icon}
    }else thing=id
    return Konekti.plugin.header.connect(thing)
}
