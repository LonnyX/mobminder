<?php
define('windowsmode', false); //if testing from windows dev environment

require('../maillib.php');

echo "starting poc...<br/>";

$target ="bspoden@gmail.com";
//$target ="petergriffin-ZCSU@srv1.mail-tester.com";
//$target ="bspoden@gmail.com,bernard.spoden@hotmail.com,bernard@oxteo.com";

$subject = "RDV médical 😊, n'oubliez pas votré médécâment héhé";


if (true) //html body with utf8 + lorem ipsum + image from url + inline images
{
	$html =  "";
	$html =  '<img width="300" src="https://mobminder.com/assets/imgs/emails/mob-logo.png" alt="Mobminder" border="0" style="width:300px; max-width:300px; border:none;">';
	$html .= '<br>';
	$html .= "mon test 2 image avec une tonne d'accent https 😊";
	$html .= '<br>';
	$html .= 'Bâchez la queue du wagon-taxi avec les pyjamas du fakir.';
	$html .= 'Ou bien toutes les lettres et tout les accents :';
	$html .= "Portez ce vieux whisky au juge blond qui fume sur son île intérieure, à côté de l'alcôve ovoïde, où les bûches se consument dans l'âtre, ce qui lui permet de penser à la caenogénèse de l'être dont il est question dans la cause ambiguë entendue à Moÿ, dans un capharnaüm qui, pense-t-il, diminue çà et là la qualité de son œuvre.";
	$html .= '<br>';
	$html .= "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
	$html .= '<br>';
	$html .= "<img width='300' alt='Mobminder2' src='cid:image1'>";
	$html .= '<br>';
	$html .= "<img width='300' alt='Mobminder2' src='cid:image2'>";
}
else //fill html body with hmtl file
{
	$html = file_get_contents("mailcontent.html");
}

$filenames = Array();
$inlines = Array();

//__construct($replyto='', $subject='', $htmlbody='', $textbase64=true, $bgcolormail='white') {

//calling constructor with reply-to, subject and html body
//$mail = new C_b64_email('rdv@mobminder.com', $subject, $html);

//calling empty constructor
$mail = new C_b64_email();

if (windowsmode)
{
	$mail->addAttachedFilename('C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\testing\\pocdkimmultipart\\test\\covid19.pdf','covid19.pdf');
	$mail->addInline('C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\testing\\pocdkimmultipart\\test\\clouds_02_f.png','image1');
	$mail->addInline('C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\testing\\pocdkimmultipart\\test\\wavingdots_01.png','image2');
	$mail->addAttachedStream('<ceci est un stream texte>','monstream.txt');
}
else
{
	//attachement files + inline images + attached stream (file from memory string)
	$mail->addAttachedFilename('./covid19.pdf','covid19.pdf');
	$mail->addInline('./clouds_02_f.png','image1');
	$mail->addInline('./wavingdots_01.png','image2');
	$mail->addAttachedStream('<ceci est un stream texte>','monstream.txt');
}


//sendMail($addressee, $vid=0, $replyTo='', $subject='', $htmlbody='')

//call sendMail with reply-to + subject + html body
$res = $mail->sendMail($target,0,'rdv@mobminder.com',$subject, $html);


echo "target=".$target."\r\n";
echo "result=[".$res."]"."\r\n";
if ($res==false)
	echo "result=false"."\r\n";
else
	echo "result=true"."\r\n";
echo "end of poc"."\r\n";

?>

