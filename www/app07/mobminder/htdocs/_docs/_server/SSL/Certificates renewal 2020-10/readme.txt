
Note: in 2020, rapidSSL turned into digicert, the new website to renew SSL certificate is 
www.digicert.com

Last buy: October 2020, for 6 years ( six years, $1370, renewel is yearly )

Doc source:
https://lpic2.unix.nl/ch09s02.html


When renewing, the following steps are followed:

A. Identification and payment
==============================

	1. Certificate information: *.mobminder.com

	2
	DCV (Domain Control Validation) they control if you are buying for a domain that you own :)
		
		Choose validation through email on domain
		admin@mobminder.com is an alias of pascal.vanhove@mobminder.com

	3.
	Certificate transparency  - do not edit

	4.
	Certificate transparency  - Pascal Vanhove

	5.
	Certificate transparency  - Pascal Vanhove



B. CSR - Provide a certificate signing request (CSR) for the certificate
========================================================================

	1. Generate a csr on the mobminder server
	
	Go to the folder /etc/apache2/ssl
	Execute: openssl req -new -sha256 - key privateKey.key -out mobminder.csr

	Verify your CSR using this site: https://www.sslshopper.com/csr-decoder.html 

	On the RapidSSL screen, submit the CSR through option 3: Paste CSR here

	- Open mobminder.csr in the notepad++, copy what is written inside the tags (exclude begin end end tags), paste in the window. Submit.


C. Verify domain control,  <= check your emails
===============================================

This is the email you get: (you need to click the validation link)

	We've received a RapidSSL certificate request for mobminder.com. 

	Order info:
	Domain name: mobminder.com
	Order number: 1557047799 
	Ordered on: 17 Oct 2018 
	Contact: Pascal Vanhove pascal.vanhove@mobminder.com 
	Certificate type: DV 

	What's next?

	Before we can issue your certificate, approve the request to verify that you control mobminder.com.

	View the order details and complete the request here (link is valid for 30 days):
	https://dcv.rapidssl.com/link/domain-control-validation/?t=531dyn247mt4zyxltbhmfxcvr3dtcznw

	Contact us if you have questions or need to reject the request here:
	https://www.rapidssl.com/contact/
	Support ID: 9755-1414-4943-8797 

	Thank you,
	RapidSSL Customer Support
	https://www.rapidssl.com/contact/



C. Certificate is ready,  <= check your emails
===============================================

	Website URL: *.MOBMINDER.COM
	Order number: 1557047799

	Hello Pascal Vanhove,

	Your RapidSSL certificate is ready.

	Get your certificate and installation instructions:
	https://getcert.rapidssl.com/process/trust/home?digest=f3826126e947439955344962de10ed7d&language=en

	To install your certificate, you need admin access to the server where you want to install the certificate. If you will not install the certificate, forward this email to your server admin or the person who will install it.

	Thank you,
	RapidSSL Customer Support
	http://www.rapidssl.com/support
	Live Chat: https://www.rapidssl.com/chat



D. Install the certificate on the server
========================================

	Start with the .com server, so you can validate it works fine.

	Didacticiel source:
	https://www.digicert.com/kb/csr-ssl-installation/ubuntu-server-with-apache2-openssl.htm


	1. From the "download your certificate", we get a .zip that contains the following two files:

	star_mobminder_com_66687115DigiCertCA.crt
	star_mobminder_com_66687115star_mobminder_com.crt

	2. locate the path for the .crt and key files

	After editing anything in the apache cfg :
	# apachectl configtest
	
	Then if the config is nicely ok:

	# service apapche2 reload  <= relis et repars sur la config 
	# service apache2 restart <= termine tous les process childs, et repars de zero


	Note importante : 
	mobminder.be n'a pas de certificat ssl, notre certificat ssl est seulement pour mobminder.com
	les autres url achetées qui pointent toutes vers le serveur com sont renseignées en tant qu'alias dans le fichier
	www.mobminder.com.conf 












