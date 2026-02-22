<?php
	public function html() {
	
		global $local;
		$path = 'http://be.mobminder.com/comm/'; if($local) $path = '../';
		
	
		$linkMobContact = '<a href="http://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
		$linkMob = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
		$linkOff = '<a href="https://medinect.offimed.be/" target="_blank" title="Découvrez Medinect" style="color: #336699;font-weight: normal;text-decoration: underline;">www.medinect.be</a>';

		$logoMob2 = '<a href="http://www.mobminder.com" target="_blank"><img src="'.$path.'mob-logo.jpg" style=" height:10em; max-height:10em;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoOffimed = '<a href="http://medinect.offimed.be" target="_blank"><img src="'.$path.'images/medinect.png" style=" height:9em; max-height:9em;" alt="DentaSoft" border="0" style="border:none;"></a>';
		
		$selfiers 		= '<img src="'.$path.'images/2selfiersCrop.jpg" style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$doctors 		= '<img src="'.$path.'images/doctors_3.jpg" 	style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$drseniors 		= '<img src="'.$path.'images/drsenior.png" 	style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$rightHalfCup 	= '<img src="'.$path.'images/rhalfcup.jpg" 		style="height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$leftHalfCup 	= '<img src="'.$path.'images/lhalfcup.jpg" 		style="height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$champaign 		= '<img src="'.$path.'images/champaign.jpg" 	style="height:36em; max-height:36em;" alt="Cup" border="0" style="border:none;">';		
		$duet 			= '<img src="'.$path.'images/duet.jpg" 			style="width:100%" alt="duet" border="0" style="border:none;">';		
		$minionWarn 	= '<img src="'.$path.'images/minionWarn.jpg" 	style="height:18em; max-height:18em;" alt="minion warns" border="0" style="border:none;">';		
		$minionsPile 	= '<img src="'.$path.'images/minionsPile.jpg" 	style="height:36em; max-height:36em;" alt="minions pile" border="0" style="border:none;">';	

		
		$sequence = Array();
		
		/////// Main communication body 
		//
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em; padding-bottom:0em;">
					<p style="text-align:left; padding-top:1em; padding-bottom:0em; margin:0em;">
						'.$this->dear.',<br/>Merci pour votre confiance. Cette année Médinect à presque doublé son nombre d\'utilisateurs!<br/>
					</p>
				</td>			
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p><strong>Medinect</strong> complète son service en intégrant désormais <strong>mobminder</strong>:</p>
					
					<ul>
						<li>Partage et co-gestion de votre agenda</li>
						<li>référencement Google, site Web, prise de RDV par internet</li>
						<li>secrétariat médical</li>
						<li>rappel de RDV par SMS et e-mail</li>
					</ul>
					<p>Mobminder est un produit belge créé il y a 10 ans, 3 millions de patients et 4000 professionnels leur font déjà confiance.</p>
				</td>			
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" style="text-align:right;">
					<div style="text-align:center; overflow:hidden;">'.$doctors.'</div>
				</td>
			</tr>
		</table>';
				
		
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>
						Développé à Bruxelles avec l\'aide de vos confrères, cette application est stable néttoyée de tout bugs de jeunesse. 
					</p>
					<p>
						Mobminder est compatible avec Windows, Mac et iPad, et s\'applique aussi bien à la pratique privée qu\'à des centres médicaux.
					</p>
				</td>			
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="bottom" style="text-align:right; padding-left:4em;">
					<div style="text-align:left; overflow:hidden;">'.$minionWarn.'</div>
				</td>
				<td colspan=2 valign="top" style="text-align:left; vertical-align:middle; padding-left:0em; padding-right:4em; padding-top:0em;">
					<p style="color:#FF6D13; font-size:1.6em; text-align:center; line-height:2em;">
						Pour les utilisateurs de Medinect, Mobminder offre un essais gratuit pendant 3 mois, sans engagement! <span style="font-size:70%">(*)</span>
					</p>
				</td>	
			</tr>
		</table>';

		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>
						Contactez sans hésiter:
					</p>
					<ul>
						<li>Giraud Derlet pour Bxl, BW, Mons et Tournai: giraud@mobminder.com</li>
						<li>Keevin Pierre pour Liège, Namur et Charleroi: keevin@mobminder.com</li>
					</ul>
					<ul>
						<li>Vincent Druart pour Mons et Bruxelles vincent.druart@offimed.be</li>
						<li>Alain Hernoe pour les spécialistes à Mons et Bruxelles alain.hernoe@offimed.be</li>
						<li>Frédérique Demoulin pour Liège et Luxembourg  frederique.demoulin@offimed.be</li>
						<li>Marie Christine Derval pour Charleroi, Namur et le BW  marie-christie.derval@offimed.be</li>
					</ul>
					
					<ul>
						<li>Pascal Vanhove, CEO pour Mobminder pascal@mobminder.com</li>
						<li>Bruno Willems, CEO pour Offimed bruno.willems@offimed.be</li>
					</ul>
					
					<p style="text-align:center; padding-top:1em; padding-bottom:0em;">
						Ou consultez nos sites web : 
					</p>
					<table style="width:100%;"><tr>
						<td style="width:50%; text-align:center;">'.$linkOff.'</td>
						<td style="width:50%; text-align:center;">'.$linkMob.'</td>
					</tr></table>
					<p style="margin-top:2em;">
						Medinect distribue également 4YourHealth, une application par laquelle le médecin communique à son patient, de manière sécurisée, des rapports, résultats d\'analyse de prélèvement ou prescriptions électroniques 
					</p>
					<p style="color:#FF6D13; margin-top:2em; font-size:90%;">
						(*) Offre valable pour toute commande passée avant le 31 décembre 2018
					</p>					
				</td>			
			</tr>
		</table>';
				
				
		/////// MOB LOGO Signature
		//
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="10" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" width="50%" style="text-align:center;">
				<div style="text-align:center;">'.$logoMob2.'</div>
			</td>
		</tr>
		</table>';
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:center; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>Mobminder est un partenaire officiel de Medinect</p>
				</td>
			</tr>
		</table>';
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="10" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" width="50%" style="text-align:center;">
				<div style="text-align:center;">'.$logoOffimed.'</div>
			</td>
		</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em; color:#7595AF;">
					<p>Société coopérative depuis 2014, complet et labellisé, 100% sécurisé, helpdesk performant, nouvelle version Windows opérationnelle.</p>
				</td>
			</tr>
		</table>';
		

		
		
		
		
		/////// Nesting inside body, adding headers
		//
		$main = '<table border="0" cellpadding="0" cellspacing="0" width="600" style="border:1px solid #DDDDDD; margin:50px auto; background-color:#FFFFFF;">
				<tr><td>'.implode('',$sequence).'</td></tr></table>';
		$center = '<center>'.$main.'</center>';

		return $center;
	}
	public function body() {
		$body = '<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#C3E351; width:100% !important;">'.$this->html().'</body>';
		return $body;

	}
?>