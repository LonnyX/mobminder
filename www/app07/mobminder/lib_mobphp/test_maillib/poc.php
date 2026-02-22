<?php
define('devmode', false);

require('./maillib.php');

echo "starting poc...<br/>";

$target ="bspoden@gmail.com";
//$target ="petergriffin-SNYT@srv1.mail-tester.com";
//$target ="bspoden@gmail.com,bernard.spoden@hotmail.com,bernard@oxteo.com";

$subject = "RDV médical 😊, n'oubliez pas votré médécâment héhé";

//$html = "123456789012345678901234567890";
if (true)
{
	$html =  "";
	$html =  '<img width="300" src="https://mobminder.com/assets/imgs/emails/mob-logo.png" alt="Mobminder" border="0" style="width:300px; max-width:300px; border:none;">';
	$html .= '<br>';
	$html .= "mon test image avec une tonne d'accent https 😊";
	$html .= '<br>';
	$html .= 'Bâchez la queue du wagon-taxi avec les pyjamas du fakir.';
	$html .= 'Ou bien toutes les lettres et tout les accents :';
	$html .= "Portez ce vieux whisky au juge blond qui fume sur son île intérieure, à côté de l'alcôve ovoïde, où les bûches se consument dans l'âtre, ce qui lui permet de penser à la caenogénèse de l'être dont il est question dans la cause ambiguë entendue à Moÿ, dans un capharnaüm qui, pense-t-il, diminue çà et là la qualité de son œuvre.";
	$html .= '<br>';
	$html .= "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
	$html .= '<br>';
	$html .= "<img width='300' alt='Mobminder2' src='cid:image1'>";
	$html .= '<br>';
	//$html .= "<img width='300' alt='Mobminder2' src='cid:image2'>";
}
else
{
	$html = file_get_contents("mailcontent.html");
}

$filenames = Array();
$inlines = Array();

$mail = new C_email('rdv@mobminder.com', $subject, $html);

if (devmode)
{
	$mail->addAttachedFilename('C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\testing\\pocdkimmultipart\\facturemachineacafe.pdf','test1.pdf');
	$mail->addAttachedFilename('C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\testing\\pocdkimmultipart\\result.pdf','test2.pdf');

	$mail->addInline('C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\testing\\pocdkimmultipart\\clouds_02_f.png','image1');
	$mail->addInline('C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\testing\\pocdkimmultipart\\wavingdots_01.png','image2');
}
else
{
	$mail->addAttachedFilename('./test1.pdf','test11.pdf');
	//$mail->addAttachedFilename('./test2.pdf');

	$mail->addInline('../maintenance/assets/imgs/clouds/clouds_02_f.png','image1');
	//$mail->addInline('../maintenance/assets/imgs/clouds/clouds_03_a.png','image2');
	
	$mail->addAttachedStream('COUCOU','monstream.txt');
	//$mail->addAttachedStream('CA VA','monstream2.txt');
}


$res = $mail->send($target,true,123);
echo "target=".$target."\r\n";
echo "result=[".$res."]"."\r\n";
if ($res==false)
	echo "result=false"."\r\n";
else
	echo "result=true"."\r\n";
echo "end of poc"."\r\n";

?>

