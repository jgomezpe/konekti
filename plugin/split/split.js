/** Konekti Plugin for split components */
class SplitPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for split components */
    constructor(){ super('split') }

    /**
     * Fills the html template with the specific split information
     * @param thing Split information
     * @return Html code associated to the split component
     */
    fillLayout(thing) {
        var id = thing.id
        thing.type = thing.type || 'col'
        var x = thing.start || 50
        if (thing.type == 'col') {
            thing.mode = 'h'
            thing.float='float:left'
            thing.hOne = thing.hDrag = thing.hTwo = '100%'
            thing.wOne = x + "%"
            thing.wDrag = '1%'
            thing.wTwo = (99-x)+'%'
        } else {
            thing.mode = 'v'
            thing.float = ''
            thing.wOne = thing.wDrag = thing.wTwo = '100%'
            thing.hOne = x + "%"
            thing.hDrag = '1%'
            thing.hTwo = (99-x)+'%'
        }
        return Konekti.core.fromTemplate(this.htmlTemplate, thing)
    }
    
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ return new Split(thing) }
}

new SplitPlugIn()

/** Split manager */
class Split extends KonektiClient{
    /** 
     * Creates a split component manager 
     * @param thing Split configuration
     */
    constructor( thing ){
        super(thing)
	var x = this
        this.type = thing.type
        var c = this.vc('-drag')
        c.addEventListener("mousedown", function(e){ x.dragstart(e);} )
        c.addEventListener("touchstart", function(e){ x.dragstart(e); } )
        window.addEventListener("mousemove", function(e){ x.dragmove(e); } )
        window.addEventListener("touchmove", function(e){ x.dragmove(e); } )
        window.addEventListener("mouseup", function(){ x.dragend(); } )
        window.addEventListener("touchend", function(){ x.dragend(); } )
    }

    /**
     * Inits the drag of the split bar
     * @param e Event information
     */
    dragstart(e) {
        e.preventDefault();
        this.dragging = true;
    }
    
    /**
     * Checks the drag of the split bar
     * @param e Event information
     */
    dragmove(e) {
        var id = this.id
        if (this.dragging){
            var c = this.vc()
            var r = c.getBoundingClientRect()
            if (this.type == "col") {
                var leftPercentage = 100 * (e.pageX-r.left-window.scrollX) / r.width
                if (leftPercentage > 5 && leftPercentage < 98) {
                    var rightPercentage = 100-leftPercentage
                    this.vc('-one').style.width = (leftPercentage) + "%"
                    this.vc('-two').style.width = (rightPercentage-1) + "%"
                }
            } else {
               var leftPercentage = 100 * (e.pageY-r.top-window.scrollY) / r.height
                if (leftPercentage > 5 && leftPercentage < 98) {
                    var rightPercentage = 100-leftPercentage
                    this.vc('-one').style.height = (leftPercentage-1) + "%"
                    this.vc('-two').style.height = (rightPercentage-1) + "%"
                }
            }
        }
    }

    /**
     * Stops the drag of the split bar
     */
    dragend() { this.dragging = false }    
}

/**
 * @function
 * Konekti split
 * @param id Id of the split component
 * @param type Type of split 'col' Vertical, 'row' Horizontal
 * @param percentage Percentage of the first subcomponent relative to the component's size
 */
Konekti.split = function(id, type='col', percentage=50){
    return Konekti.plugin.split.connect({"id":id, "type":type, "start":percentage})
}
