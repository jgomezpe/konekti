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
 * @param container id of the header
 * @param header_config Caption of the header/Configuration of the header
 * @param size Size of the header (1,2,3..) (not required if configuration is provided)
 * @param style Style of the header (not required if configuration is provided)
 * @param icon Icon for the header (not required if configuration is provided)
 */
Konekti.header = function(container, header_config, size, style, icon ){
    var dict
    if(typeof header_config==='string'){
        size = size || 3
        style = style || 'w3-center w3-blue'
        icon = icon || ''
        dict={"caption":header_config, "size":size, "style":style, "icon":icon}
    }else dict=header_config
    dict.id=container
    Konekti.plugin.header.connect(dict)
}
