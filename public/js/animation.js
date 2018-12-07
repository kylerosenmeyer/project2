//Green Sock Animation Content Goes Here.
console.log("animation.js loaded")

$(".chooseText").delay(3500).fadeIn(1500)

TweenMax.to("#hat1", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.from("#hat1", 5, {drawSVG:"0%"});
TweenMax.to("#hat1", 2, {css: {fillOpacity:1,}, delay: 2})

TweenMax.to("#hat2", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.from("#hat2", 5, {drawSVG:"0%"});
TweenMax.to("#hat2", 2, {css: {fillOpacity:1,}, delay: 2})

TweenMax.to("#hat3", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.from("#hat3", 5, {drawSVG:"0%"});
TweenMax.to("#hat3", 2, {css: {fillOpacity:1,}, delay: 2})

TweenMax.to("#hat4", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.from("#hat4", 5, {drawSVG:"0%"});
TweenMax.to("#hat4", 2, {css: {fillOpacity:1,}, delay: 2})

TweenMax.to("#hat5", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.from("#hat5", 5, {drawSVG:"0%"});
TweenMax.to("#hat5", 2, {css: {fillOpacity:1,}, delay: 2})

TweenMax.to("#hat6", 0.5, {css:{strokeOpacity:"1"}})
TweenMax.from("#hat6", 5, {drawSVG:"0%"});
TweenMax.to("#hat6", 2, {css: {fillOpacity:1,}, delay: 2})

$(".clickHat").click(function(){
    $(".choose").delay(3500).slideDown(1500)
    var clickHat = $(this).attr("data-class")
    for (let i=1; i<7; i++){
        var hat = $(".hat"+i).attr("data-class")
        if (clickHat!==hat){
            TweenMax.from("#hat"+i, 0.5, {css:{strokeOpacity:"0"}})
            TweenMax.to("#hat"+i, 5, {drawSVG:"0%"});
            TweenMax.to("#hat"+i, 2, {css: {fillOpacity:0,}})
        } 
    }
})  

