jQuery(function($) {
    $(document).ready(function(){
        var scrolling = false;
        var navBar = $('.navbar');

        function setScrolling() {
            navBar.removeClass('scroll-top');
            navBar.addClass('scrolling');
        }

        function stopScrolling() {
            navBar.removeClass('scrolling');
            navBar.addClass('scrolling-top');
        }

        $(window).scroll(function() { scrolling = true; });

        setInterval(function() {
            if(scrolling) {
                scrolling = false;
                if ($(window).scrollTop() > 0) {
                    setScrolling();
                } else {
                    stopScrolling();
                }
            }
        }, 100);

    });
 });
