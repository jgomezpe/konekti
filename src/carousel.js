Konekti.resource.css(".carouselslide {display:none} \n.w3-left, .w3-right, .w3-badge {cursor:pointer} \n.w3-badge {height:13px;width:13px;padding:0}")

/**
 * A media manager.
 */
 class Carousel extends Client{
	/**
	 * Creates a media component
	 * @param id Id of the media component
	 * @param width Width of the div's component
	 * @param height Height of the div's component
     * @param delay Delay between image display (milliseconds)
	 * @param imgs URLs of the carousel images 
     * @param select Function called when an image is selected 
	 * @param parent Parent component
	 */
    setup(id, width, height, delay, imgs, select, parent='KonektiMain'){ 
		return {"plugin":"carousel", "id":id, "delay":delay, "imgs":imgs, 'select':select, 'width':width, 'height':height, 'parent':parent } 
	}

	/**
	 * Creates a media component
	 * @param id Id of the media component
	 * @param width Width of the div's component
	 * @param height Height of the div's component
     * @param delay Delay between image display (milliseconds)
	 * @param imgs URLs of the carousel images 
     * @param select Function called when an image is selected 
	 * @param parent Parent component
	 */
	constructor( id, width, height, delay, imgs, select, parent='KonektiMain' ){
		super(...arguments)
        var x = this
        x.selmethod = x.config.select
        x.setImages(x.config.imgs)
        function carousel() {
            x.plusDivs(1)
            setTimeout(carousel, x.config.delay)
        }
        carousel()    
    }

	/**
	 * Associated html code
	 */
	html(){ 
        return "<div id='"+this.id+"' class='w3-content w3-display-container' onclick='Konekti.client[\""+this.id+"\"].select()' style='max-width:800px'></div>" 
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
    
    select(){ this.selmethod(this.slideIndex) }
    
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
 * Creates a media component
 * @param id Id of the media component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param delay Delay between image display (milliseconds)
 * @param imgs URLs of the carousel images 
 * @param select Function called when an image is selected 
 * @param parent Parent component
 */
Konekti.carousel = function(id, width, height, delay, imgs, select, parent='KonektiMain'){ 
    return new Carousel(id, width, height, delay, imgs, select, parent) 
}