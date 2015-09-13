jQuery(document).ready(function() {
		jQuery(".profile img").fadeTo("slow", 0.8); 
        jQuery('.profile img').each(function() {
                jQuery(this).hover(
                    function() {
						jQuery(this).animate({ opacity: 0.5 }, 500);
						jQuery(this).attr("src", 'people/' + jQuery(this).attr("id") + '_color.jpg').animate({ opacity: 1 }, 500);
                    },
                   function() {
					   jQuery(this).attr("src", 'people/' + jQuery(this).attr("id") + '_gray.jpg').animate({ opacity: 0.72 }, 1000);
                   })
        });
});


jQuery(document).ready(function(){
	jQuery("#projects").click(function(e) {
		jQuery(this).find('a').attr("class","active");
		jQuery('#experiments a.active').removeClass('active');
		
		jQuery("#gallery1").css("display","block");
		jQuery("#gallery2").css("display","none");
		//jQuery("#gallery3").css("display","none");
		e.preventDefault();
	});
});
jQuery(document).ready(function(){
	jQuery("#experiments").click(function(e) {
		//jQuery("#gallery3").css("display","block");
		jQuery(this).find('a').attr("class","active");
		jQuery('#projects a.active').removeClass('active');
		
		jQuery("#gallery1").css("display","none");
		jQuery("#gallery2").css("display","block");
		e.preventDefault();
	});
});

jQuery.getJSON("http://vimeo.com/api/v2/hamzeen/videos.json?callback=?", function(data) {
	var thumbs = document.getElementById('thumbs');
	thumbs.innerHTML = '';
	var ul = document.createElement('ul');
	ul.setAttribute("class", "gallery");
	thumbs.appendChild(ul);
	var limit = 8;

	for (var i=0; i<limit;i++) {
			// create list item.
			//console.log(data[i].title);
			var thumb = document.createElement('img');
			thumb.setAttribute('src', data[i].thumbnail_medium);
			thumb.setAttribute('alt', data[i].title);
			thumb.setAttribute('title', data[i].title);
			
			var a = document.createElement('a');
			a.setAttribute("target", "_blank");
			a.setAttribute('href', data[i].url);
			a.appendChild(thumb);
				
			var li = document.createElement('li');
			li.appendChild(a);
			ul.appendChild(li);
	}
});

jQuery(document).ready(function () {

    //Prepare
    var nav = jQuery("#logos");
	
	var nav_height = nav.find("li a").outerHeight();
    nav.css({overflow:"hidden", height: nav_height});
    
    //Every button
    nav.find("li").each(function()
    {
        var font_weight = jQuery(this).find("a").css("font-weight");
        if(!jQuery(this).hasClass('current-menu-item')){ //Don't animate if the text is bold
            var content = jQuery(this).children();
            var clone = content.clone();
            jQuery(this).append(clone);
             jQuery(this).hover(function(){
				jQuery(this).find('a').stop().animate({top: -nav_height}, 200);
			},function(){
				jQuery(this).find('a').stop().animate({top: 0}, 160);
			});
        }
    });
});

jQuery(document).ready(function () {
	jQuery('#recent-posts').rssfeed('http://hamzeen.com/blog/?feed=rss2');
	jQuery.getJSON("https://api.twitter.com/1/statuses/user_timeline/hamzeen.json?count=3&include_rts=1&callback=?", function(data) {
		for (var key in data) {
			var date = " "+"<a class='news-title' target='_blank' href='http://twitter.com/hamzeen/status/"+data[key].id_str+"'>"+data[key].created_at.substr(11, 8)+ " - " + data[key].created_at.substr(0, 3)+" "+data[key].created_at.substr(4, 3)+" "+data[key].created_at.substr(8, 2)+"</a>";
			jQuery("#listticker").append("<li style='display: block;'><img src=\""+data[key].user.profile_image_url + "\"/>" + parseTweet(data[key].text)+date+"</li>");
		}
	});

	function parseTweet(text) { 
		var hashified = text.replace(/#([A-Za-z0-9\/]*)/g, function(m) {
			return '<a target="_new" href="http://twitter.com/search?q=' + m.replace('#','') + '">' + m + "</a>";
        });
		return hashified;
	}

	jQuery(document).ready(function(){
		var speed = 700;
		var pause = 2500;
		function tickerRecent()
		{
			last = jQuery('ul#listticker li:last').hide().remove();
			jQuery('ul#listticker').prepend(last);
			jQuery('ul#listticker li:first').slideDown("slow");
		}

		interval = setInterval(tickerRecent, pause);
		jQuery("#listticker").hover(function() {
			clearInterval(interval);
		}, function() {
			interval = setInterval(tickerRecent, pause);
		});
	});
});
