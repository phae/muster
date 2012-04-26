/*jQuery(document).ready(function() {
  
  $("body").addClass("js-enabled");

  $("ol li.principle").muster({navigation: "nav a", keyevents: true, urls: false, fullheight: true});

});*/



/* 

Call .muster() on a set of elements
Expects you to do the full width / shadows etc. in your own CSS.
For nav to work, your anchors should match your hrefs (which'll still be useful sans JS).
For best results, specify image heights in CSS/attr to make sure heights are best calced
*/

(function($) {
  
  $.fn.muster = function (options) {

    var portHeight = $(document).height(),
        deck = this,
        slideRegister = new Array, 
        hasNavigation = false,
        hasKeyEvents = options.keyevents,
        hasNiceURLs = options.urls,
        hasFullHeightPages = options.fullheight; 
  

    if(options.navigation && $(options.navigation).length != 0){
      hasNavigation = true;
    }

    function browserSupportsHtml5HistoryApi() {
      return !! (history && history.replaceState && history.pushState);
    };
    var _init = function(){
      // lets go!
      _setupElements();
      _registerSlides();

      if(hasNavigation){
        _bindNavEvents();
      };
      if(hasKeyEvents){
        _bindKeyEvents();
      }
      if(hasNiceURLs){
        _initializeHistory();
      }
      $(window).resize(function() {
        _init();
      });

    }
    /*
      This sets up each of the slide pages, making them at least as tall as the viewport.
      It also also sets the bodyHeight to be the total of all pages, so it still scrolls,
      and uses z-index to stack the pages in the right order.
    */
    var _setupElements = function() {

      $(deck[0]).css("position", "absolute"); 
      
      if(hasFullHeightPages){
        $(deck).css("min-height", portHeight+"px");
      };

      var i = deck.length,
        j = 1;

     
      while(i--){
        $(deck[i]).css("z-index", j);
        j++;
      };

      var bodyHeight = 0;

      $(deck).each(function(){
        bodyHeight = bodyHeight + $(this).height();
      })

      $("body").height(bodyHeight+"px");

      _bindScroll();
    };

    /*
      Each time a scroll event is fired, it looks through our registered slides, 
      and positions accordingly.
    */
    var _checkPosition = function(){
      
      $.each(slideRegister, function(i){
        if($(window).scrollTop() >= this[2]){
          var pos = (this[2] - this[1]);
          $("#"+this[0]).next().css({"position": "absolute", "top": this[2]+"px"});
          if(hasNavigation){
            $(options.navigation).removeClass("sd-selected");
            $(options.navigation+"[href*='"+this[0]+"']").parent().next().children("a").addClass("sd-selected");
          }
        }
        else {
          $("#"+this[0]).next().css({"position": "fixed", "top": "0px"});
        };

      }); 
      // 
    };

    /*
      This just binds the event for scrolling.
    */
    var _bindScroll = function(){
      $(window).bind('scroll.slider', _checkPosition);
    };

    /*
      If we have a nav element specified, we bind events for those links.
    */
    var _bindNavEvents = function(){
      $(options.navigation).on("click", function(e){
        var hopTo = $(this).attr("href");
        var match = hopTo.split("#");
      
        $.each(slideRegister, function(){
          if(match[1] == this[0]){
            $("html, body").animate({scrollTop: this[2] - this[1]},1000, function(){
              $(this).addClass("sd-selected");
            });
          }
        });
        $(options.navigation).removeClass("sd-selected");
        


        if(hasNiceURLs && !browserSupportsHtml5HistoryApi() && window.location.pathname.match(/\/.*\//) ){
          data = {
            html_fragment: $(hopTo).html(),
            title: "Principle",
            url: hopTo
          };
          _manageURL(data);
        }


        e.preventDefault();
       
      });
    };

    var _bindKeyEvents = function(){

      $(document.documentElement).keyup(function (event) {
          if (event.keyCode == 37) {
            $(".sd-selected").parent().prev().children("a").trigger("click");
          } else if (event.keyCode == 39) {
            $(".sd-selected").parent().next().children("a").trigger("click");
          }
      });
      $(document.documentElement).keydown(function (event) {
          if (event.keyCode == 32) {
            $(".sd-selected").parent().next().children("a").trigger("click");
            event.preventDefault();
          }
      });
    };

    function _initializeHistory(data) {
      if (!browserSupportsHtml5HistoryApi() && window.location.pathname.match(/\/.*\//) ) {
        addToHistory({url: window.location.pathname});
      }

      data = {
        html_fragment: $('.smart_answer section').html(),
        title: "Question",
        url: "/"  
      };
      history.replaceState(data, data['title'], data['url']);
    };

    var _manageURL = function(data){

      // TODO: replace hashed with pushstate for those that can.  
      history.pushState(data, data['title'], data['url']);
    };
    
    var _registerSlides = function(){
      var position = 0,
          height = 0;

      $(deck).each(function(i){
        height = $(this).height();
        position = position + height;
        slideRegister.push([$(this).attr("id"), height, position])
      });
    };


    _init();

    return $(this);
  };

})(jQuery);
