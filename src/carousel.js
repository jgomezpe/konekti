Konekti.dom.css(".carouselslide {display:none} \n.w3-left, .w3-right, .w3-badge {cursor:pointer} \n.w3-badge {height:13px;width:13px;padding:0}")

/**
 * An image carousel manager.
 */
 class Carousel extends Client{
	/**
	 * Creates an image carousel component
	 * @param id Id of the image carousel component
	 * @param width Width of the div's component
	 * @param height Height of the div's component
     * @param delay Delay between image display (milliseconds)
	 * @param imgs URLs of the carousel images 
     * @param onclick Function called when an image is selected 
	 * @param parent Parent component
	 */
    setup(parent, id, width, height, delay, imgs, onclick, config={}){
        config.class = (config.class || '') + ' w3-content w3-display-container'
        config.onclick ='Konekti.client["'+id+'"].select()'
        var c = super.setup(parent, 'carousel', id, width, height, config)
        c.onclick = onclick
        c.delay = delay
        c.imgs = imgs
		return c
	}

	/**
	 * Creates an image carousel component
	 */
	constructor(){
		super(...arguments)
        var x = this
         x.setImages(x.imgs)
        function carousel() {
            x.plusDivs(1)
            setTimeout(carousel, x.delay)
        }
        carousel()    
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
 * @param id Id of the image carousel component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param delay Delay between image display (milliseconds)
 * @param imgs URLs of the carousel images 
 * @param onclick Function called when an image is selected 
 * @param parent Parent component
 * @param config Carousel style
 */
Konekti.carousel = function(parent, id, width, height, delay, imgs, onclick, config={}){ 
    return new Carousel(parent, id, width, height, delay, imgs, onclick, config) 
}