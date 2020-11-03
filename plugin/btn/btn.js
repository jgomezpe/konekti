/** Konekti Plugin for buttons */
class ButtonPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for buttons */
    constructor(){ super('btn') }
    /**
     * Fills the html template with the specific button information
     * @param thing Button information
     * @return Html code associated to the button
     */
    fillLayout(thing){
        thing.client = thing.client || 'client'
        if( thing.run === undefined || thing.run === null ){
            thing.run = 'Konekti.client("'+thing.client+'").'
            if( typeof thing.arg === 'boolean' && thing.arg ) 
                thing.run += 'select("'+thing.id+'")'
            else 
                thing.run += thing.id+"()"
        }
        thing.caption = thing.caption || ''
        thing.title = thing.title || ''
        thing.caption = "<i id='"+thing.id+"-icon' class='"+(thing.icon !== undefined?thing.icon:"")+"'></i> "+thing.caption
        thing.style = thing.style || 'w3-bar-item w3-xlarge'
        return Konekti.core.fromTemplate( this.htmlTemplate, thing) 
    }
}

/** Creates and registers the button plugin */
new ButtonPlugIn()

/**
 * @function
 * Konekti btn
 * @param navbar id of the navbar where the button will be added
 * @param caption_config Caption of the button/Configuration of the button
 * @param onclick Method that wi be executed when button pressed (not required if configuration is provided)
 */
Konekti.btn = function(navbar, id, caption_config, onclick){
    var dict
    if(arguments.length==3) dict = caption_config
    else dict = {"caption":caption_config, "run":onclick}
    dict.id = id
    Konekti.core.append(navbar,'btn',dict)
}
