<?php
require './classes/language.php';
require './../lib_mobphp/dbio.php';
require './../lib_mobphp/chtml.php';



function sanitizeFilename($filename) {
    //remove all accents (diacritics
    $filename = iconv('UTF-8', 'ASCII//TRANSLIT', $filename);
    $filename = preg_replace("/[^a-zA-Z0-9]/", '', $filename);
    // Limit the length of the filename (adjust as needed)
    $max_length = 255;
    if (strlen($filename) > $max_length) {
        $filename = substr($filename, 0, $max_length);
    }
    return $filename;
}

//check parameters //////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(!isset($_GET['p'])) { sleep(2); header('location:https://maintenance.mobminder.com/oups.php'); die(); };

$postfixUrl = $_GET['p']; // (*30*)
if($postfixUrl=='') { sleep(1); header('location:https://maintenance.mobminder.com/oups.php'); die(); };

$demo = @$_GET['demo']; if(isset($demo)) $demo = 1; else $demo = 0;

$strippedp = preg_replace("/[^A-Za-z0-9]/",'X',$postfixUrl); // white space and special characters are not allowed
$strippedp = substr($strippedp,0,64); 	// 1. limit the length to the DB table eresaUrl fields max length (which is here 64 chars)
if($strippedp!=$postfixUrl) { if($demo) {} else { sleep(5); header('location:https://maintenance.mobminder.com/oups.php'); die(); } }

$time = @date('d/m/Y:H:i:s');

//get family mode if provided //////////////////////////////////////////////////////////////////////////////////////////////
$familyIdentMode = @$_GET['f']; if(!isset($familyIdentMode)) $familyIdentMode = 0; 
if ($familyIdentMode)
    $mode = 'family';
else
    $mode = 'unique';


//get calling url if provided //////////////////////////////////////////////////////////////////////////////////////////////
if(isset($_SERVER['HTTP_REFERER'])) 
    {
        $referer = $_SERVER['HTTP_REFERER'];
    }
    else
    {
        $referer='';
    }


    
$html = new C_html();

//$baseline = C_dS_system::baseline();
$baseline = 8;

// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushMeta('format-detection'		, 'date=no');

$html->pushMetaName('description', 'Mobminder - delete your personnal data' );
$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'black');
$html->pushMetaName('viewport', 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'); 
$html->pushMetaName('robots', 'noindex');

// css
$html->pushLink('./e-resa.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('./themes/default/colors_2023.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('./themes/default/controls.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('./themes/fonts/fonts.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('./themes/fonts/faws.css?b='.$baseline, 'stylesheet', 'text/css');

$html->pageTitle('Mobminder');





$q = new Q('SELECT id FROM logins WHERE eresaUrl="'.$strippedp.'";');
$loginId = $q->ids(); 
if(!$loginId) { //postfix url not found in databse ///////////////////////////////////////////////////////////////
    $L = new L(language_code_english);

    //log invalid postfixurl into log file
    $filename = '/var/log/www/postfixurl/0000-'.sanitizeFilename($postfixUrl).'.log';
    file_put_contents($filename,$time.';' . $postfixUrl . ';'.$mode.';'.$referer."\n", FILE_APPEND | LOCK_EX);
    sleep(1); 
    
    //display message
    $title = 'Mobminder';
    $message='Ce lien n’existe pas ou n’existe plus</br></br>Deze link bestaat niet of bestaat niet meer</br></br>This link does not exist or no longer exists';
    $accountname = false; //not used by invalid postfixurl
    $newlink = false; //not used by invalid postfixurl
}
else //acount exists for postfixurl ////////////////////////////////////////////////////////////////////////////
{
    $dS_login = new C_dS_login($loginId);
    $L = new L($dS_login->language);

    // Load keys associated with this login
    $dS_keys = new C_dbAccess_accesskey($loginId);

    if(!$dS_keys->count()) {
        // drop an exception, this login has no key anymore, that should never happen
        C_dS_exception::put('e-reservation.php', 'main:line60','This login has no key:'.$loginId);
        die('There is a technical problem with your web-reservation. Please contact your Mobminder support');
    }
    $dS_key = $dS_keys->last(); // there should be only one key anyway here attached to a web page login
    $dS_account = new C_dS_group($dS_key->accountId);


    //logging only if page is called by another url
    if ($referer!='')
    //if (true)
    {

        //load all key for this account
        $akeys_currgroup = new C_dbAccess_accesskey(); 
        $akeys_currgroup->loadOnAccount($dS_key->accountId); 
        $logIds = $akeys_currgroup->getGroupIdsList(); // all the logins having access to the current group 
        //load all logins with level 8 for this account
        $SQL = 'SELECT * FROM logins WHERE id IN ('.$logIds.') AND accessLevel = 8';
        $o_dbAccess_logins = new C_dbAccess_logins();
        $o_dbAccess_logins->loadMany($SQL);
        $directoryname = '/var/log/www/postfixurl/notfound';
        //take first login for creating sub directory
        foreach($o_dbAccess_logins->keyed as $dS_login)
        {
            $directoryname = '/var/log/www/postfixurl/'.sanitizeFilename($dS_login->getFullName());
            break;
        }
        if (!is_dir($directoryname)) mkdir($directoryname,0777,false);


        //log postfixurl call into log file (for statistics)
        //bsp issue : space before accountid! correction = rename without space
        //$oldfilename = '/var/log/www/postfixurl/ '.$dS_account->id."-".sanitizeFilename($dS_account->name).'.log';
        $filename = $directoryname.'/'.$dS_account->id."-".sanitizeFilename($dS_account->name).'.log';
        //if (file_exists($oldfilename)) rename($oldfilename, $filename);
        file_put_contents($filename,$time.';' . $postfixUrl . ';'.$mode.';'.$referer."\n", FILE_APPEND | LOCK_EX);

    }
    $title = $dS_account->name;
    $accountname = $dS_account->name;
    //$message =  'Le lien vers '..' n’est plus valable, ajoutez celui-ci dans vos favoris';
    $message = str_replace('[LINK]',$dS_account->name,L::XL('e-resa redir message'));
    $newlink = 'https://booking.mobminder.com/'.$postfixUrl;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main info zone

//$icon = '<div class="fa fa-2x fa-mobile" style="color:steelblue; text-align:left; display:inline-block; padding-right:.5em;"></div>';
$title = '<h1 style="color:white; padding-bottom:0.5em; padding-top:.5em;">'.$title.'</h1>';
$html->pushHTML('<section class="s-h1 minder-background" style="margin-bottom:2em;" id="s-h1">'.$title.'</section>');

//logo
$img = '<img src="./themes/logos/mobminder-logo-800-336.gif" style="vertical-align:top; height:auto; max-width:100%; max-height:150px;"/>';
$img = '<div style="text-align:center;">'.$img.'</div>'; 
$html->pushHTML('<section class="s-img" id="s-img">'.$img.'</section>');

//space
$html->pushHTML('</br></br></br></br>');

//warning message
//$msg = L::XL('powered by tail'); //TODO change translation key
$icon_info = '<div id="info-icon" class="fa fa-2x fa-info-circle" style="vertical-align:middle; text-align:right; padding-right:.5em;"></div>';
$infos = '<div style="color:red;text-align:center"><h2><table style="width:auto;margin:auto" ><tr><td>'.$icon_info.'</td><td width="20px"></td><td style="text-align:left" >'. $message.'</td></rd></table></h2></div>';

//new postfixurl link
if ($newlink)
{
    //TODO translation
    //$buttonlabel = 'Nouveau lien vers '.$accountname;
    $link = '<div class="container" style="color:#0066CC; word-wrap:break-word;" ><h2><a href="'.$newlink.'">'.$newlink.'</a></h2></div>';
}
else
{
    $link = '';
}
$html->pushHTML('<section class="s-info" id="s-info">'.$infos.$link.'</section>');

//space
$html->pushHTML('</br></br></br></br>');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Powered by mobminder
$moblink = L::XL('powered by').' <a href="https://www.mobminder.com'.'" title="'.L::XL('powered by title').'" target="_blank">www.mobminder.com</a> | '.L::XL('powered by tail');
$power = '<div style="font-size:smaller;">'.$moblink.'</div>';
$cright = '<div style="margin-top:2em; font-size:smaller;">'.'© 2006-2024 Mobminder is a trademark of Cloud-Tech Belgium'.'</div>';
$footer = '<div class="container" style="min-height:5em; padding-top:2em; padding-bottom:2em; text-align:center;">'.$power.$cright.'</div>';
$html->pushHTML('<section id="s-footer" class="c99 s-footer">'.$footer.'</section>');

$html->dropPage();
?>