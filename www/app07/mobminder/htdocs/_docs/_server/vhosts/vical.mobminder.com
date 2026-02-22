<VirtualHost *:80>
	ServerAdmin webmaster-noreply@mobminder.com
	ServerName vical.mobminder.com

	DocumentRoot /srv/web/be.mobminder.com/vical

	<Directory /srv/web/be.mobminder.com/vical>
		Options Indexes FollowSymLinks MultiViews
		AllowOverride All
		Order allow,deny
		allow from all
	</Directory>

	ErrorLog ${APACHE_LOG_DIR}/vical.mobminder.com-error.log

	# Possible values include: debug, info, notice, warn, error, crit,
	# alert, emerg.
	LogLevel warn

	CustomLog ${APACHE_LOG_DIR}/vical.mobminder.com-access.log combined
</VirtualHost>