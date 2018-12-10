//Green Sock Animation Content Goes Here.
// console.log("animation.js loaded")

let width = window.innerWidth,
    height = window.innerHeight,
    widthPadding = -1*(width-381.91)/2,
    heightPadding = -1*(height-141.7)/2.5


//*-------------------------------COVER PAGE ANIMATIONS----------------------------------------------------
$("#logoSVG").attr("viewBox", widthPadding + " " + heightPadding + " " + width + " " + height)
                .attr("width", width)
                .attr("height", height)

$(".loginBtn").css({ "margin": "10px auto " + height + "px"})

let shrinkCover = function() {

    TweenMax.to(".svgWrapper", 2, { 
        css: { height: "20%" }, 
        delay: 4, 
        ease: Power1.easeIn } )

    TweenMax.to("#logoSVG", 2, { 
        attr: { 
            viewBox: widthPadding + " 0 " + width*2 + " " + height/9, 
            height: height/5 }, 
        y:"-20", 
        delay: 4, 
        ease: Power1.easeIn } )

    TweenMax.to(".loginWrapper", 2, {
        css: { 
            backgroundColor:"#0e3b43", 
            display: "block", 
            height: "80%"}, 
        delay: 4, 
        ease: Power1.easeIn } )

    TweenMax.to(".choose, .loginBtn", 2, {
        css: { display: "block"}, 
        delay: 4, 
        ease: Power1.easeIn } )
    
}

TweenMax.to("#logoPath", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.fromTo("#logoPath", 40, {drawSVG:"0%"}, {drawSVG: "100%", onComplete: shrinkCover()} )
TweenMax.to("#logoPath", 4, {css: {fillOpacity:1,}, delay: 2})








//*-----------------------------------------------Error Page Animations---------------------------------------------------

let padding404H = -1*(width-400)/2,
    padding404V = -1*(height-148)/3


$(".error404SVG").attr("viewBox", padding404H + " " + padding404V + " " + width + " " + height)
              .attr("width", width)
              .attr("height", height)


TweenMax.to(".error404Path", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.fromTo(".error404Path", 40, {drawSVG:"0%"}, {drawSVG: "100%", onComplete: shrinkCover()} )

