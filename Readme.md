GetTweets
==========
A jQuery plugin for displaying tweets.

The GetTweets jQuery plugin can pull tweets from multiple users. The plugin has support for hiding/showing retweets and replyies, custom output using variable plugs and specifying number of tweets*. 

Developed by Adam Randlett at [Monk Development](http://www.monkdevelopment.com)

##Features
*	**Twitter Users** Tweets from any number of users can be fetched.
*   **Retweets**  Retweets can be turned off. On by default.
*   **Replies**   Replies can be turned off. On by default.
*   **Format**    The html output of the tweet can be specified uniqly for both Tweets & Retweets.
*   **Rate Limit Status**  *Twitter [limits](https://dev.twitter.com/docs/rate-limiting) the amount of data that can be retunred per user to 150 requests per hour. This is mainly only an issue when testing your output. This feature can be turned on to see what your current rate is.  This will output a log into your browsers developer console.
*   **Rely & Hastag url**  The plugin automatically creates links to reply tags and hashtags in the tweet content.

##Requirements
*   jQuery 1.4.2 or newer.
*   All modern browsers are supported, as well as IE 6 and newer.

##Getting Started
To start make sure both [jQuery](http://jquery.com) and GetTweets are included in your html.

    <script src="jquery.min.js"></script>
    <script src="jquery.getTweets.js"></script>


Next create a html element with class or id.

    <div id='tweets'><div>

Then attach GetTweets to the element you just created.

    $("#tweets").getTweets({
       	twitter_users: ["monkdev","adamrandlett"],
       	howmany: 20,
       	replies:true,
       	retweets:true
    });


##Options
*   **twitter_users** _array_, ['monkdev','adamrandlett']

	An array of twitter usernames.

	---------------------------------------------------------------------------
*   **howmany** _integer_, 4

	The number of total tweets to output. *_200 limit_
	
	_Default:_ 4

	---------------------------------------------------------------------------

*   **retweets** _boolean_, true

	Allow retweets of users to output from timeline
	
	_Default:_ true

	---------------------------------------------------------------------------

*   **replies** _boolean_, false

	Allow replies of users to output from timeline
	
	_Default:_ true

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

| __Name__             | __Usage__                   | __Description__                                          |                                                      
| ---------------------| --------------------------- | -------------------------------------------------------- |
| Tweet Date           | {tweetdate}                 | Post Date of tweet in nice format '_about 10 hours ago_' |
| Tweet Url	           | {tweeturl}                  | Url of the tweet                                         |
| Tweet Text           | {tweettext}                 | The content of the tweet                                 |
| Tweeter Name         | {tweetuser:name}            | The name of the tweeter                                  |
| Tweeter Screen Name  | {tweetuser:screenname}      | The screen name of the tweeter                           |
| Tweeter Location     | {tweetuser:location}        | The location of the tweeter                              |
| Tweeter Description  | {tweetuser:description}     | The description of the tweeter                           |
| Tweeter URL          | {tweetuser:url}             | The url of the tweeter                                   |
| Tweeter Image        | {tweetuser:image}           | The image of the tweeter                                 |
| Tweet Source         | {tweetsource}               | The source of the tweet                                  |
| reTweeter Name       | {retweetuser:name}          | The name of the retweeter                                |
| reTweeter Screen Name| {retweetuser:screenname}    | The name of the retweeter                                |
| reTweeter Description| {retweetuser:description}   | The description of the retweeter                         |


##Feedback
Please open an issue to request a feature or submit a bug report. I'm am also available on twitter [@adamrandlett](http://www.twitter.com/adamrandlett).



