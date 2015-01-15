<?php

// Make sure search terms were sent
if (!empty($_GET['q'])) {

	// Strip any dangerous text out of the search
	$search_terms = htmlspecialchars($_GET['q']);

	// Create an OAuth connection
	require 'app_tokens.php';
	require 'tmhOAuth.php';
	$connection = new tmhOAuth(array(
			'consumer_key' => $consumer_key,
			'consumer_secret' => $consumer_secret,
			'user_token' => $user_token,
			'user_secret' => $user_secret
		));

	// Run the search with the Twitter API
	$http_code = $connection->request('GET',$connection->url('search/tweets'), array(
		'q' => $search_terms,
		'count' => $_GET['count'],
		'lang' => 'en',
		'type' => 'recent'
	));

	// Search was successful
	if ($http_code == 200) {
		header('Content-Type: application/json; charset=utf-8');
		// Extract the tweets from the API response
		print $connection->response['response'];
		// Handle errors from API request
	} else {
		if ($http_code == 429) {
			print 'Error: Twitter API rate limit reached';
		} else {
			print 'Error: Twitter was not able to process that search';
		}
	}

}

?>