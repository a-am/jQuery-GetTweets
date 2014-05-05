/*
  * GetTweets v@VERSION
  *
  * A jQuery plugin to retrieve tweets from multiple users
  *
  * https://github.com/a-am/jQuery-GetTweets
  *
  * Copyright 2011 by Adam Randlett
    * Released under the MIT License
    * http://en.wikipedia.org/wiki/MIT_License
*/

(function($){
  $.fn.getTweets = function(settings, callback){
      //default options for plugin
    var defaults = {
      twitter_timeline_url: 'timeline_response.php',
      twitter_search_url: 'search_response.php',
      twitter_rate_limit_url: 'rate_limit_status_response.php',
      twitter_users: [],
      twitter_queries: [],
      _isSearch: false,
      format: 'json',
      howmany: 4,
      retweets: false,
      no_replies: false,
      rate_limit_status: false,
      tweetstring: "<div class='tweet'><div class='header'><p class='summary'>{tweettext}</p><p class='meta'>{tweetdate} by <a href='https://twitter.com/{tweetuser:screenname}'>{tweetuser:name}</a></p></div> <div class='image'><a href='https://twitter.com/{tweetuser:screenname}'><img src='{tweetuser:image}' width='48' height='48'></a></div></div>",
      retweetstring: "<div class='tweet'><div class='header'><p class='summary'>{tweettext}</p><p class='meta'>{tweetdate} <a href='https://twitter.com/{retweetuser:screenname}'>{retweetuser:name}</a> <span class='rt'>retweeted</span> by <a href='https://twitter.com/{tweetuser:screenname}'>{tweetuser:name}</a> </p></div> <div class='image'><a href='https://twitter.com/{tweetuser:screenname}'><img src='{retweetuser:image}' width='48' height='48'></a></div></div>"
    };
        //extend default to options
        var options = $.extend(defaults, settings);
        return this.each(function(){
          var $this = $(this),
            //assign defaults to tweeoptions object
              tweetoptions = {
                twitter_timeline_url: options.twitter_timeline_url,
                twitter_search_url: options.twitter_search_url,
                twitter_rate_limit_url: options.twitter_rate_limit_url,
                twitter_users: options.twitter_users,
                twitter_queries: options.twitter_queries,
                howmany: options.howmany,
                tweetstring: options.tweetstring,
                retweetstring: options.retweetstring,
                retweets: options.retweets,
                no_replies: options.no_replies,
                rate_limit_status: options.rate_limit_status
              },
          global_tweets = [],
          user_count;


      // parses created_at
      function twitter_relative_time(time_value) {
        var values=time_value.split(" ");
        var time_value= values[1]+" "+values[2]+", "+values[5]+" "+values[3];var parsed_date=Date.parse(time_value);
        // var time_value= options._isSearch ? values[2]+" "+values[1]+", "+values[3]+" "+values[4] : values[1]+" "+values[2]+", "+values[5]+" "+values[3];
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
      String.prototype.parseUrl = function(){
        var urlRegex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
        return this.replace(urlRegex, function(url) {
                return '<a href="' + url + '">' + url + '</a>';
        });
      };


      //parsers twitter @usernames creates anchor for that username
      String.prototype.parseUsername = function() {
        return this.replace(new RegExp(/[@]+[A-Za-z0-9-_]+/g), function(u) {
          var username = u.replace("@","");
          return u.link("https://twitter.com/"+username);
        });
      };


      String.prototype.parseEmail = function(){
        var urlRegex = new RegExp(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})/gi);
        return this.replace(urlRegex, function(url) {
          return '<a href="mailto:' + url + '">' + url + '</a>';
        });
      };


      // parses hashtags and adds url to tiwtter search for that hashtag
      String.prototype.parseHashtag = function() {
        return this.replace(new RegExp(/[#]+[A-Za-z0-9-_]+/g), function(t) {
          var tag = t.replace("#","%23");
          return t.link("https://twitter.com/search?q="+tag);
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


      Storage.prototype.setObject = function(key, value) {
          this.setItem(key, JSON.stringify(value));
      };

      Storage.prototype.getObject = function(key) {
          return JSON.parse(this.getItem(key));
      };

      /*
       * Parses the tweetstring or retweetstring for the tweet variables
       */

      function twitter_parser(tweets){
        $.each(tweets, function(i,tweet){
          if(tweet.text !== undefined) {
              var tweettext = tweet.text,
                  tweetapi;
              if(options._isSearch){

                tweetapi = {
                  '{tweetdate}' : twitter_relative_time(tweet.created_at), // Calculate how many hours ago was the tweet posted
                  '{tweeturl}'  : 'https://www.twitter.com/' +  tweet.user.screen_name + '/status/' + tweet.id_str,
                  '{tweettext}' : tweettext.parseUrl().parseUsername().parseEmail().parseHashtag(),
                  '{tweetuser:name}' : tweet.user.name,
                  '{tweetuser:screenname}' : tweet.user.screen_name,
                  '{tweetuser:url}': tweet.user.url,
                  '{tweetuser:image}': tweet.user.profile_image_url,
                  '{tweetuser:location}' : tweet.user.location,
                  '{tweetuser:description}' : tweet.user.description
                };

              }else{

                tweetapi = {
                  '{tweetdate}' : twitter_relative_time(tweet.created_at) , // Calculate how many hours ago was the tweet posted
                  '{tweeturl}'  : 'https://www.twitter.com/' +  tweet.user.screen_name + '/status/' + tweet.id_str,
                  '{tweettext}' : tweettext.parseUrl().parseUsername().parseEmail().parseHashtag(),
                  '{tweetuser:name}' : tweet.user.name,
                  '{tweetuser:screenname}' : tweet.user.screen_name,
                  '{tweetuser:location}' : tweet.user.location,
                  '{tweetuser:description}' : tweet.user.description,
                  '{tweetuser:url}': tweet.user.url,
                  '{tweetuser:image}': tweet.user.profile_image_url,
                  '{tweetsource}': tweet.source
                };
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


      /*
       * Outputs the tweets to the assigned jquery object
       */
      function twitter_output(){
        global_tweets.sort(function(a,b){ return(b.id-a.id) });

	      for(var i = 0, ii = tweetoptions.howmany; i < ii; i++){
          $this.append(global_tweets[i].status);
        }

        if(typeof callback == 'function'){
          callback.call(this);
        }
      }



      /*
       * Displays rate limit status to javascritp console
       * rate limit status variable must be set to true for ouptut.
       */

      function rate_limit_return(request){
        $.getJSON(options.twitter_rate_limit_url,function(data){
          console.log("-------------------------------------------------------");
          console.log("RATE LIMIT STATUS");
          console.log("  User Timeline Limit: "+ data.resources.statuses['/statuses/user_timeline'].limit);
          console.log("  User Timeline Remaining: "+ data.resources.statuses['/statuses/user_timeline'].remaining);
          console.log("  -----  ");
          console.log("  Search Tweets Limit: "+ data.resources.search['/search/tweets'].limit);
          console.log("  Search Tweets Remaining: "+ data.resources.search['/search/tweets'].remaining);
          console.log("-------------------------------------------------------");
        });
      }


      /*
       * function to get the tweets for the twitter service
       * Uses jQuery ajax call
       * Using jsonp since we are calling cross urls
       */

      function get_tweets(index){
				
				var tweet_count = tweetoptions.howmany + 5; // pad with more tweets in case some are filtered out
				
        if(tweetoptions.twitter_queries.length > 0){

          options._isSearch = true;
          $.ajax({
            dataType: 'json',
            url: options.twitter_search_url+'?q='+encodeURIComponent(tweetoptions.twitter_queries[index])+'&include_entities=true'+'&count='+tweet_count,
            timeout: 1000,
            type: 'GET',
            async: false,
            crossDomain: false,
            error: function(){
              //console.log("An error has occurred fetching tweets.");
            },
            success: function(data){
              twitter_parser(data.statuses);
            },
            complete: function(){
              if(index < tweetoptions.twitter_queries.length -1){
                //run this function (recursivly) to get all tweets for the next user
                get_tweets(++index);
              }else{
                //if all tweets are loaded into the global_tweets array and launch twitter_render function
                twitter_output();
              }
            }//@end success
          }); //@end ajax

        }else{

          $.ajax({
            dataType: 'json',
            url: options.twitter_timeline_url+'?screen_name='+tweetoptions.twitter_users[index]+'&include_rts='+tweetoptions.retweets+'&exclude_replies='+tweetoptions.replies+'&count='+tweet_count,
            timeout: 1000,
            type: 'GET',
            async: false,
            crossDomain: false,
            error: function(){
              //console.log("An error has occurred fetching tweets.");
            },
            success:function(data){
              twitter_parser(data);
            },
            complete:function(){
              if(index < tweetoptions.twitter_users.length -1){
                //run this function (recursively) to get all tweets for the next user
                get_tweets(++index);
              }else{
                //if all tweets are loaded into the global_tweets array and launch twitter_render function
                twitter_output();
              }
            }//@end success
          }); //@end ajax
        }
      } // @end get_tweets

       /*
        * Shows ratelimit status if tweetoptions.rate_limit_status is true
        */

       if(tweetoptions.rate_limit_status){
         rate_limit_return();
       }
       //starts plugin process
       get_tweets(0);
    });
  };
})(jQuery);