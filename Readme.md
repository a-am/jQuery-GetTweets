GetTweets
==========
A jQuery plugin for displaying tweets.

The GetTweets jQuery plugin can pull tweets from multiple users. The plugin has support for hiding/showing retweets and replies, custom output using variable plugs and specifying number of tweets*. 

Developed by Adam Randlett [@adamrandlett](http://twitter.com/adamrandlett)

##Features
*	**Twitter Users** Tweets from any number of users can be fetched.
*	**Twitter Search** Search by queries. Hashes, mentions or search term. **If used it will override tweets by twitter_users**
*   **Retweets**  Retweets can be turned off. On by default.
*   **Replies**   Replies can be turned off. On by default.
*   **Format**    The html output of the tweet can be specified uniqly for both Tweets & Retweets.
*   **Rate Limit Status**  *Twitter [limits](https://dev.twitter.com/docs/rate-limiting) the amount of data that can be returned per user to 150 requests per hour. This is mainly only an issue when testing your output. This feature can be turned on to see what your current rate is.  This will output a log into your browsers developer console.
*   **Rely & Hastag url**  The plugin automatically creates links to reply tags and hashtags in the tweet content.

##Requirements
*   jQuery 1.4.2 to 1.9.1. Version 2.0 is untested. 
*   All modern browsers are supported, as well as IE7 and newer.
*   Twitter application credentials [http://dev.twitter.com/apps](https://dev.twitter.com/apps)
*   An OAuth 1.0A library written in PHP by @themattharris, specifically for use with the Twitter API. [tmhOAuth](https://github.com/themattharris/tmhOAuth) 
*   Included php files to return json after authentication: timeline_response.php, search_response.php, app_tokens.php

##Getting Started
Add the three included php files (timeline_response.php, search_response.php, app_tokens.php, rate_status_limit_response.php *optional) to the site files where you specified the application url in your dev.twitter account for the application.

Add your application Consumer Key, Consumer Secret, Access Token and Access Token Secret to the app_tokes.php file.

    $consumer_key = '';
    $consumer_secret = '';
    $user_token = '';
    $user_secret = '';

Make sure both [jQuery](http://jquery.com) and GetTweets are included in your html.

    <script src="jquery.min.js"></script>
    <script src="jquery.getTweets.js"></script>
    

Next create a html element with class or id.

    <div id='tweets'><div>

Then attach GetTweets to the element you just created.

    $("#tweets").getTweets({
       	twitter_users: ["adamrandlett"],
       	howmany: 20,
       	no_replies:true,
       	retweets:true
    },function(){

    });


##Options
*   **twitter_timeline_url** _string_, 'timeline_response.php'

	Url to the file that returns the timeline statuses json.

	---------------------------------------------------------------------------
*   **twitter_search_url** _string_, 'search_response.php'

	Url to the file that returns the search statuses json.

	---------------------------------------------------------------------------
*   **twitter_rate_limit_url** _string_, 'rate_limit_status_response.php'

	Url to the file that returns the rate limit data in json. This is optional. If you enable rate_limit_status you will need this url. 

	---------------------------------------------------------------------------
*   **twitter_users** _array_, ['monkdev','adamrandlett']

	An array of twitter usernames.

	---------------------------------------------------------------------------
*   **twitter_queries** _array_, ['#code','design']

	Get tweets by array of search queries. **If used it will override tweets by twitter_users.** 

	---------------------------------------------------------------------------
*   **howmany** _integer_, 4

	The number of total tweets to output. *_200 limit_
	
	_Default:_ 4

	---------------------------------------------------------------------------

*   **retweets** _boolean_, true

	Allow retweets of users to output from timeline
	
	_Default:_ true

	---------------------------------------------------------------------------

*   **no_replies** _boolean_, false

	Allow replies to be turned off
	
	_Default:_ false

	---------------------------------------------------------------------------

*   **rate_limit_status** _boolean_, false

	Output to javascript console the current Twitter rate limit status. It will show hourly limit, remaining hits and reset time.
	
	_Default:_ false

	---------------------------------------------------------------------------

*   **tweetstring** _html_

	HTML string with tweet variable plugs for the structure of the tweet.
	
	_Default:_ 

    	<div class='tweet'><div class='header'><p class='summary'>{tweettext}</p><p class='meta'>{tweetdate} by <a href='http://twitter.com/{tweetuser:screenname}'>{tweetuser:name}</a></p></div> <div class='image'><a href='http://twitter.com/{tweetuser:screenname}'><img src='{tweetuser:image}' width='48' height='48'></a></div></div>

	---------------------------------------------------------------------------

*   **retweetstring** _html_

	HTML string with tweet variable plugs for the structure of the retweet.
	
	_Default:_ 

    	<div class='tweet'><div class='header'><p class='summary'>{tweettext}</p><p class='meta'>{tweetdate} <a href='http://twitter.com/{retweetuser:screenname}'>{retweetuser:name}</a> <span class='rt'>retweeted</span> by <a href='http://twitter.com/{tweetuser:screenname}'>{tweetuser:name}</a> </p></div> <div class='image'><a href='http://twitter.com/{tweetuser:screenname}'><img src='{retweetuser:image}' width='48' height='48'></a></div></div>

##Tweet String Variables
* __Tweet Date__  The date of the tweet in nice format '_about 10 hours ago_'

  _Usage:_ __{tweetdate}__

* __Tweet URL__ The url of the tweet.

  _Usage:_ __{tweeturl}__

* __Tweet Text__ The text content of the tweet.

  _Usage:_ __{tweettext}__

* __Tweeter Name__ The name of the tweeter.

  _Usage:_ __{tweetuser:name}__

* __Tweeter Screen Name__ The screen name of the tweeter.

  _Usage:_ __{tweetuser:screenname}__

* __Tweeter Location__ The location of the tweeter.

  _Usage:_ __{tweetuser:location}__

* __Tweeter Description__ The description of the tweeter.

  _Usage:_ __{tweetuser:description}__

* __Tweeter URL__ The url to the tweeter.

  _Usage:_ __{tweetuser:url}__

* __Tweeter Image__ The image of the tweeter.

  _Usage:_ __{tweetuser:image}__

* __Tweet Source__ The source of the tweet.

  _Usage:_ __{tweetsource}__

	------------

* __reTweet User Name__ The name of the retweeter.

  _Usage:_ __{retweetuser:name}__

* __reTweet User Screen Name__ The screen name of the retweeter.

  _Usage:_ __{retweetuser:screenname}__

* __reTweet User Image__ The image of the retweeter.

  _Usage:_ __{retweetuser:image}__
  
 
##Tweet String Variables (Search Queries Only)
* __Tweet Date__  The date of the tweet in nice format '_about 10 hours ago_'

  _Usage:_ __{tweetdate}__

* __Tweet URL__ The url of the tweet.

  _Usage:_ __{tweeturl}__

* __Tweet Text__ The text content of the tweet.

  _Usage:_ __{tweettext}__

* __Tweeter Name__ The name of the tweeter.

  _Usage:_ __{tweetuser:name}__

* __Tweeter Screen Name__ The screen name of the tweeter.

  _Usage:_ __{tweetuser:screenname}__
  
* __Tweeter URL__ The url to the tweeter.

  _Usage:_ __{tweetuser:url}__

* __Tweeter Image__ The image of the tweeter.

  _Usage:_ __{tweetuser:image}__


##Feedback
Please open an issue to request a feature or submit a bug report. I'm am also available on twitter [@adamrandlett](http://www.twitter.com/adamrandlett).

#####Thanks
Adam Green [@140dev](http://twitter.com/140dev) for direction on OAuth for twitter. 



