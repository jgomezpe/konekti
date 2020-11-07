/** Konekti Plugin for applications with a sidebar */
class SideBarPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for sidebar applications */
    constructor(){ 
        super('sidebar') 
        this.replace = 'strict'
    }

    /**
     * Displays the sidebar
     * @param barId Sidebar's id
     */
    open( barId ){ Konekti.vc(barId).style.display = 'block' }

    /**
     * Hides the sidebar
     * @param barId Sidebar's id
     */
    close( barId ){ Konekti.vc(barId).style.display = 'none' }
}

new SideBarPlugIn()

/**
 * @function
 * Konekti sidebar
 * @param id Id of the sidebar component
 * @param width Width of the sidebar
 * @param height Height of the side bar
 */
Konekti.sidebar = function(id, width='200px', height='100%'){
    Konekti.plugin.sidebar.connect({'id':id, 'width':width, 'height':height})
}
