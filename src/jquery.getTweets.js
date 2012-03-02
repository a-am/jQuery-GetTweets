/*
	* GetTweets v@VERSION
	*
	* A jQuery plugin to retrive tweets from multiple users
	*
	* https://github.com/adamatmonk/jquery-gettweets
	*
	* Copyright 2011 by Adam Randlett
    * Released under the MIT License
    * http://en.wikipedia.org/wiki/MIT_License
*/  

(function($){
	$.fn.getTweets = function(settings){
	    //default options for plugin 
		var defaults = {
			twitter_api_url: "http://api.twitter.com/1/statuses/user_timeline",
			twitter_users: ["monkdev"],
			format: "json",
			howmany: 4,
			retweets:true,
			no_replies:true,
			rate_limit_status:false,
			tweetstring:"<div class='tweet'><div class='header'><p class='summary'>{tweettext}</p><p class='meta'>{tweetdate} by <a href='http://twitter.com/{tweetuser:screenname}'>{tweetuser:name}</a></p></div> <div class='image'><a href='http://twitter.com/{tweetuser:screenname}'><img src='{tweetuser:image}' width='48' height='48'></a></div></div>",
		  
		    retweetstring:"<div class='tweet'><div class='header'><p class='summary'>{tweettext}</p><p class='meta'>{tweetdate} <a href='http://twitter.com/{retweetuser:screenname}'>{retweetuser:name}</a> <span class='rt'>retweeted</span> by <a href='http://twitter.com/{tweetuser:screenname}'>{tweetuser:name}</a> </p></div> <div class='image'><a href='http://twitter.com/{tweetuser:screenname}'><img src='{retweetuser:image}' width='48' height='48'></a></div></div>"
        }
        //extend default to options
        var options = $.extend(defaults, settings); 
        return this.each(function(){
		      var $this = $(this), 
		        //assign defaults to tweeoptions object
	  	      	tweetoptions = { 
	  				    twitter_users:options.twitter_users,
	  				    howmany:options.howmany,
	  				    tweetstring:options.tweetstring,
	  				    retweetstring:options.retweetstring,
	  				    retweets:options.retweets,
	  				    no_replies:options.no_replies,
					    rate_limit_status:options.rate_limit_status
	  			    },
				  global_tweets = [],
				  user_count,
				  twitter_users_last = tweetoptions.twitter_users.length -1;
			
			//$.ajaxSetup({ cache: true });  
			
			//provided by twitter
			function twitter_relative_time(time_value) {
			  var values=time_value.split(" ");
			  time_value=values[1]+" "+values[2]+", "+values[5]+" "+values[3];
			  var parsed_date=Date.parse(time_value);
			  var relative_to=(arguments.length>1)?arguments[1]:new Date();
			  var delta=parseInt((relative_to.getTime()-parsed_date)/1000);
			  delta=delta+(relative_to.getTimezoneOffset()*60);
			  if(delta<60){return 'less than a minute ago';}else if(delta<120){return 'about a minute ago';
			  }else if(delta<(60*60)){return (parseInt(delta/60)).toString()+' minutes ago';
			  }else if(delta<(120*60)){return 'about an hour ago';
			  }else if(delta<(24*60*60)){return 'about '+(parseInt(delta/3600)).toString()+' hours ago';
			  }else if(delta<(48*60*60)){return '1 day ago';
			  }else{return(parseInt(delta/86400)).toString()+' days ago';}
			} 
			// parses any url and adds anchor for that url
 			String.prototype.parseUrl = function() {
      	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
      		return url.link(url);
      	});
      };
 			String.prototype.parseEmail = function(){
 			  var urlRegex = new RegExp(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})/gi);
 			  return this.replace(urlRegex, function(url) {
 			    return '<a href="mailto:' + url + '">' + url + '</a>';
 			  });
 			};
			//parsers twitter @usernames creates anchor for that username
			String.prototype.parseUsername = function() {
				return this.replace(new RegExp(/[@]+[A-Za-z0-9-_]+(?:\s)/g), function(u) {
					var username = u.replace("@","")
					return u.link("http://twitter.com/"+username);
				});
			};
			// parses hashtags and adds url to tiwtter search for that hashtag
			String.prototype.parseHashtag = function() {
				return this.replace(new RegExp(/[#]+[A-Za-z0-9-_]+/g), function(t) {
					var tag = t.replace("#","%23")
					return t.link("http://search.twitter.com/search?q="+tag);
				});
			};
			// replaces multiple variable assignements in a string
			String.prototype.multiReplace = function ( hash ) {
				var str = this, key;
				for ( key in hash ) {
					str = str.replace( new RegExp( key, 'g' ), hash[ key ] );
				}
				return str;
			};
			
			// parses the tweetstring or retweetstring for the tweet variables
			function twitter_parser(tweets){
				$.each(tweets, function(i,tweet){
					if(tweet.text !== undefined) {
					    var tweettext = tweet.text;
					    var tweetapi = {
					    	'{tweetdate}' : twitter_relative_time(tweet.created_at) , // Calculate how many hours ago was the tweet posted  
 					    	'{tweeturl}'  : 'http://www.twitter.com/' +  tweet.user.screen_name + '/status/' + tweet.id_str ,
					    	'{tweettext}' : tweettext.parseUrl().parseEmail().parseUsername().parseHashtag(),
					    	'{tweetuser:name}' : tweet.user.name,
					    	'{tweetuser:screenname}' : tweet.user.screen_name,
					    	'{tweetuser:location}' : tweet.user.location,
					    	'{tweetuser:description}' : tweet.user.description,
					    	'{tweetuser:url}': tweet.user.url,
					    	'{tweetuser:image}': tweet.user.profile_image_url,
					    	'{tweetsource}': tweet.source
					    }
					    
					    var tweet_html,
					        output; 
					    // if the tweet is a retweet parse the tweet string for retweet variables
					    if(tweet.retweeted_status){
                            tweetapi['{retweetuser:name}'] = tweet.retweeted_status.user.name;
                            tweetapi['{retweetuser:screenname}'] = tweet.retweeted_status.user.screen_name;
                            tweetapi['{retweetuser:image}'] = tweet.retweeted_status.user.profile_image_url;
                            //output of the retweet
                            output = tweetoptions.retweetstring;
					    }else{
					        //output of tweet
					        output = tweetoptions.tweetstring;
					    }
					    //sets output html of the tweet
					    var tweet_html = output.multiReplace(tweetapi); 
						
						global_tweets.push({
							id:tweet.id,
							status:tweet_html
						});
	                }
				});	
			}
            //outputs the tweets to the assigned jquery object
			function twitter_output(){
				global_tweets.sort(function(a,b){return(b.id-a.id)});
				twitter_count=global_tweets.length;

				for(var i=0; i<tweetoptions.howmany; i++){
					$this.append(global_tweets[i].status);
				}
			} 
			// displays rate limit status to javascritp console
			// rate limit status variable must be set to true for ouptut.
			function rate_limit_return(request){
				$.getJSON("http://api.twitter.com/1/account/rate_limit_status.json?&callback=?",function(data){
				    console.log("-------------------------------------------------------");
					console.log("RATE LIMIT STATUS");
					console.log("  Hourly Limit: "+ data.hourly_limit);
					console.log("  Remaining Hits: "+ data.remaining_hits);
					console.log("  Reset Time: "+ data.reset_time);
					console.log("-------------------------------------------------------");
				}); 
			}
			// function to get the tweets for the twitter service
			// Uses jQuerys ajax call
			// Using jsonp since we are calling cross urls
			function get_tweets(index){ 
				$.ajax({
			  	    dataType:"jsonp", 
			  	    url: options.twitter_api_url+'.'+options.format+'?&screen_name='+tweetoptions.twitter_users[index]+'&include_rts='+tweetoptions.retweets+'&exclude_replies='+tweetoptions.no_replies+'&count='+tweetoptions.howmany+'&callback=?',
			  	    timeout: 1000,
			  	    type:"GET",
			  	    async:false,
					    crossDomain:true,
			  	    error: function(){ 
						    //console.log("An error has occured fetching tweets.");
			  	    },
					success:function(data){ 
					//console.log(data);
						twitter_parser(data);
					},
					complete:function(){
						if(index<twitter_users_last){
					      //run this function (recursivly) to get all tweets for the next user
					      get_tweets(++index);
					    }else{
					      //if all tweets are loaded into the global_tweets array and launch twitter_render function
					      twitter_output();
					    }
					}//@end success	
				});	//@end ajax
			} // @end get_tweets 
			
		   //shows ratelimit status if tweetoptions.rate_limit_status is true
		   if(tweetoptions.rate_limit_status){
			   rate_limit_return(); 
		   } 
		   //starts plugin process
		   get_tweets(0);
	  });
	};
})(jQuery);