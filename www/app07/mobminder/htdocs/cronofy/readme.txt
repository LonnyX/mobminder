
This /cronofy module is called and triggered from many sources

1. User on Mobminder web interface, managing his connections (init)
2. User on Mobminder interface, inserting or deleting events
3. Cronofy API, inserting or deleting events on remote calendars
4. Minute cron, executing delayed initialization tasks (init)

Files organization in /cronofy

1. html files: 

	welcome.php, 
	connecting.php, 
	syncing.php, 
	initialized.php, 
	refresh.php, 
	revoke.php, 
	revoked.php,
	cronofy.css

2. files for specific scenarios

	oauth.php		(obtains credentials from remote calendars)
	initialization.php  	(creates the dS_cronofy_inittask)
	minute.php		(called from /cron/minute.php to run init tasks)

3. files proper to the cronofy wekkit

	config.php
	/vendor/.. all the stuff there

4. mobminder to cronofy logical layer

	mobcronofy.php	
		- defines all DB records and DB access (cronofy related data we need to store in Mobminder)
		- defines a wrapper layer above cronofy class Cronofy
	cronofymanager.php (extends C_dS_mob_cronofy and uses dS classes defined in mobcronofy.php)
	cronasync.php	(called from a curl in cronofymanager.php so to start an asynchronous execution)
	callback.php	(this is where we want to be called from cronofy)


Database structure

