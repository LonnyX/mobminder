var vids = Array();

$(document).ready(function() {

    $("section.howdoesitwork ul.sub li.subtitle")
		.click(function(){
            var idvid = $(this).nextAll('div.vwrap').first().children("video").attr('id');
            $("section.howdoesitwork div.vwrap").hide(); $("section.howdoesitwork div.vwrap").css("opacity", 0);
            $(this).nextAll("div.vwrap").first().css("opacity", 1);
            $(this).nextAll('div.vwrap').first().show();
            // console.log(idvid);
            // console.log($(this).nextAll('div.vwrap').first().children("video").html());

            let options = {
                controls: true,
                autoplay: false,
                loop: false,
                preload: 'auto',
                fluid: true
            }

            for(id in vids){
                let vjs = vids[id];
                vjs.pause();
            }

            var videoready = function() { console.log('player ready: ', this.id_ ) };
            if(idvid) vids[idvid]= videojs(idvid, options, videoready);
        })
});

// var vids = Array();

// $(document).ready(function() {

//     $("section.howdoesitwork ul.sub li").click(function() {
//         var $clickedLi = $(this);
//         var $vwrap = $clickedLi.nextAll('div.vwrap').first();
//         var idvid = $vwrap.children("video").attr('id');

//         // Hide all vwraps and remove .visible class
//         $(this).siblings("li").nextAll('div.vwrap').each(function() {
//             $(this).removeClass('visible');
//             // Give time for opacity to fade out before display none
//             setTimeout(() => {
//                 if (!$(this).hasClass('visible')) $(this).css('display', 'none');
//             }, 500);
//         });

//         // Show the corresponding vwrap
//         $vwrap.css('display', 'block');
//         // Use timeout to trigger opacity transition
//         setTimeout(() => {
//             $vwrap.addClass('visible');
//         }, 10); // small delay to ensure transition

//         let options = {
//             controls: true,
//             autoplay: false,
//             loop: false,
//             preload: 'auto',
//             fluid: true
//         };

//         // Pause all videos
//         for (id in vids) {
//             let vjs = vids[id];
//             vjs.pause();
//         }

//         var videoready = function() {
//             console.log('player ready: ', this.id_);
//         };

//         if (idvid) vids[idvid] = videojs(idvid, options, videoready);
//     });

// });

