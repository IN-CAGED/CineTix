<?php

return [

	'paths' => ['api/*', 'sanctum/csrf-cookie'],

	'allowed_methods' => ['*'],

    // Kept your dynamic env() logic, but added your production URL to the fallback
	'allowed_origins' => array_values(array_filter(array_map(
		'trim',
		explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'https://cinetix.maallathifahcikbar.sch.id,https://projector.dpdns.org,http://localhost:5173,http://127.0.0.1:5173'))
	))),

	'allowed_origins_patterns' => [],

	'allowed_headers' => ['*'],

	'exposed_headers' => [],

	'max_age' => 0,

	'supports_credentials' => false, // Keep false if using standard Bearer tokens in localStorage

];