Konekti.core.load('btn')

/** Konekti Plugin for navigation (buttons) bar components */
class NavBarPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for navbar components */
    constructor(){
        super('navbar')
        this.replace = 'strict'
    }

    /**
     * Fills the html template with the specific navbar information
     * @param thing Navbar information
     * @return Html code associated to the navbar component
     */
    fillLayout( thing ){
        var id = thing.id
        var client = thing.client 
        var size = thing.size || 'w3-xlarge'
        var btnsHTML = ''
        var btn = thing.btn
        if( btn != null ){
            for( var i=0; i<btn.length; i++ ){
                btn[i].style = (btn[i].style!==undefined?btn[i].style:'')+" w3-bar-item "+size
                btn[i].client = btn[i].client || client
                btn[i].arg = btn[i].arg || thing.arg
                btnsHTML += Konekti.plugin.btn.fillLayout( btn[i] ) 
            }
        }
        thing.btnsHTML = btnsHTML
        return Konekti.core.fromTemplate( this.htmlTemplate, thing) 
    }
}

new NavBarPlugIn()

/**
 * @function
 * Konekti navbar
 * @param container Id of the navbar component
 * @param btns Array of buttons to maintain by the navbar
 * @param color Color of the navbar
 * @param size Buttons size
 * @param client Client of the media component
 */
Konekti.navbar = function(container, btns, color, size, client){
    var dict = {"id":container, "btn":btns, "color":"w3-blue-grey", "size":"w3-xlarge"}
    if(color !== undefined && color!==null ) dict.color = color
    if(size !== undefined && size!==null) dict.size = size
    if(client!==undefined) dict.client = client
    Konekti.plugin.navbar.connect(dict)
}
