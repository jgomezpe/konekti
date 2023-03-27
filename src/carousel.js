Konekti.dom.css(".carouselslide {display:none} \n.w3-left, .w3-right, .w3-badge {cursor:pointer} \n.w3-badge {height:13px;width:13px;padding:0}")

/** Konekti plugin for carousel elements */
class CarouselPlugin extends PlugIn{
	constructor(){ super('carousel') }

   	/**
	 * Creates an image carousel component
	 * @param id Id of the image carousel component
	 * @param imgs URLs of the carousel images 
     * @param delay Delay between image display (milliseconds)
     * @param onclick Function called when an image is selected 
	 * @param config Style of the header
	 * @param parent Parent component
	 */
    setup(parent, id, imgs, delay, onclick, config={}){
        config.class = (config.class || '') + ' w3-content w3-display-container'
        config.onclick ='Konekti.client["'+id+'"].select()'
        var c = super.setup(parent, id, '', config)
        c.onclick = onclick
        c.delay = delay
        c.imgs = imgs
        return c
    }
    
	client(config){ return new Carousel(config) }
}

/** Registers the carousel plugin in Konekti */
new CarouselPlugin()

/**
 * An image carousel manager.
 */
class Carousel extends Client{
	/**
	 * Creates an image carousel component
	 */
	constructor(config){ 
        super(config) 
        var x = this
        Konekti.daemon(function(){ return x.vc()!==undefined && x.vc()!==null },
            function(){
                x.setImages(x.imgs)
                function carousel() {
                    x.plusDivs(1)
                    setTimeout(carousel, x.delay)
                }
                carousel()    
            }
        )    
    }

    setImages( imgs ){
        var img_code = ''
        var span_code = "<div class='w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle' style='width:100%'>\n" +
                        "<div class='w3-left w3-hover-text-khaki' onclick='Konekti.client[\""+this.id+"\"].plusDivs(-1)'>&#10094;</div>\n" +
                        "<div class='w3-right w3-hover-text-khaki' onclick='Konekti.client[\""+this.id+"\"].plusDivs(1)'>&#10095;</div>\n"
        for( var i=0; i<imgs.length; i++ ){
            img_code += "<img class='carouselslide' src='"+imgs[i]+"' style='width:100%'></img>\n"
            span_code += "<span class='w3-badge carouselspan w3-border w3-transparent w3-hover-white' onclick='Konekti.client[\""+this.id+"\"].currentDiv("+i+")'></span>\n"
        }
        span_code += "</div>"
        var c = this.vc()
        c.innerHTML = img_code + span_code
        this.slideIndex = imgs.length-1
        this.showDivs(this.slideIndex)
    }

    
    plusDivs(n) { this.showDivs(this.slideIndex += n) }
    
    currentDiv(n) { this.showDivs(this.slideIndex = n) }
    
    select(){ eval(Konekti.dom.onclick(''+this.slideIndex, this.onclick)) }
    
    showDivs(n) {
      var i
      var x = document.getElementsByClassName("carouselslide")
      var dots = document.getElementsByClassName("carouselspan")
      if(n >= x.length) this.slideIndex = 0
      else if(n < 0) this.slideIndex = x.length
      for(i=0; i<x.length; i++) x[i].style.display = "none"
      for(i=0; i<dots.length; i++) dots[i].className = dots[i].className.replace(" w3-white", "")
      x[this.slideIndex].style.display = "block"
      dots[this.slideIndex].className += " w3-white"
    }    
}

/**
 * Creates image carousel component
 * @param parent Parent component
 * @param id Id of the image carousel component
 * @param imgs URLs of the carousel images 
 * @param delay Delay between image display (milliseconds)
 * @param onclick Function called when an image is selected 
 * @param config Carousel style
 * @param callback Function called when the carousel is ready
 */
Konekti.carousel = function(id, imgs, delay, onclick, config={}, callback=function(){}){ 
	Konekti.add({'plugin':'carousel', 'setup':['body', id, imgs, delay, onclick, config]}, callback)
}