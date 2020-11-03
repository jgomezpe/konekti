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
     * Connects (extra steps) the split component with the GUI component
     * @param thing Split component configuration
     */
    extra( thing ){
        var id = thing.id
        var c = Konekti.vc(id+'-drag')
        c.addEventListener("mousedown", function(e){ Konekti.client(id).dragstart(e);} )
        c.addEventListener("touchstart", function(e){ Konekti.client(id).dragstart(e); } )
        window.addEventListener("mousemove", function(e){ Konekti.client(id).dragmove(e); } )
        window.addEventListener("touchmove", function(e){ Konekti.client(id).dragmove(e); } )
        window.addEventListener("mouseup", function(){ Konekti.client(id).dragend(); } )
        window.addEventListener("touchend", function(){ Konekti.client(id).dragend(); } )
    }
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
        this.type = thing.type
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
        var id = this.thing.id
        if (this.dragging){
            var c = Konekti.vc(this.thing.id)
            var r = c.getBoundingClientRect()
            if (this.type == "col") {
                var leftPercentage = 100 * (e.pageX-r.left) / r.width
                if (leftPercentage > 5 && leftPercentage < 98) {
                    var rightPercentage = 100-leftPercentage
                    Konekti.vc(this.id+'-one').style.width = (leftPercentage) + "%"
                    Konekti.vc(this.id+'-two').style.width = (rightPercentage-1) + "%"
                }
            } else {
                var leftPercentage = 100 * (e.pageY-r.top) / r.height
                if (leftPercentage > 5 && leftPercentage < 98) {
                    var rightPercentage = 100-leftPercentage
                    Konekti.vc(this.id+'-one').style.height = (leftPercentage-1) + "%"
                    Konekti.vc(this.id+'-two').style.height = (rightPercentage-1) + "%"
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
 * @param container Id of the split component
 * @param type Type of split 'col' Vertical, 'row' Horixontal
 * @param percentage Percentage of the first subcomponent
 */
Konekti.split = function(container, type, percentage){
    var d = {"id":container, "type":type, "start":percentage}
    var c = new Split(d)
    Konekti.plugin.split.connect(d)
    return c
}
