<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    a    F I L E   ( called from C_iFILE )
//

// we want to modify this script in such a way that when the heading 2 magic bytes of the file are '<?' indicating that is PHP, the upload gets refused

sleep(1);
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

echo 'Receiving...'.chr(10);

$perfReport->peak('::session retrieved');
		// $_FILES comes like:
		// 	Array
		// 	(
		// 		[3038_824420_4] => Array
		// 		(
		// 			[name] => Cobrastyle.mp3
		// 			[type] => audio/mpeg
		// 			[tmp_name] => C:\Program Files\EasyPHP-12.1\tmp\php825.tmp
		// 			[error] => 0
		// 			[size] => 4323985
		// 		)
		// )

if(!count($_FILES)) die('##1##'.chr(10).'No file has been posted'.chr(10));

$fileclass = @$_POST['c'];
echo chr(10).'File class is: '.$fileclass.chr(10).chr(10);


function fileStartsWithPhpOpenTag(string $path): bool {
    $fh = @fopen($path, 'rb');
    if ($fh === false) return false;

    $buf = fread($fh, 16); // assez pour BOM + "<?" dans UTF-32
    fclose($fh);
    if ($buf === false) return false;

    // 1) UTF-8 avec BOM
    if (strncmp($buf, "\xEF\xBB\xBF<?", 5) === 0) return true;

    // 2) ANSI / UTF-8 sans BOM
    if (strncmp($buf, "<?", 2) === 0) return true;

    // 3) (Optionnel) UTF-16 / UTF-32 avec BOM
    // UTF-16 LE: FF FE, puis 3C 00 3F 00
    if (strncmp($buf, "\xFF\xFE\x3C\x00\x3F\x00", 6) === 0) return true;
    // UTF-16 BE: FE FF, puis 00 3C 00 3F
    if (strncmp($buf, "\xFE\xFF\x00\x3C\x00\x3F", 6) === 0) return true;
    // UTF-32 LE: FF FE 00 00, puis 3C 00 00 00 3F 00 00 00
    if (strncmp($buf, "\xFF\xFE\x00\x00\x3C\x00\x00\x00\x3F\x00\x00\x00", 12) === 0) return true;
    // UTF-32 BE: 00 00 FE FF, puis 00 00 00 3C 00 00 00 3F
    if (strncmp($buf, "\x00\x00\xFE\xFF\x00\x00\x00\x3C\x00\x00\x00\x3F", 12) === 0) return true;

    return false;
}



foreach($_FILES as $postname => $filedescritpion) { // see (*F01*) to track this
	
	$size = $filedescritpion['size']+0;
	$tmpname = $filedescritpion['tmp_name'];
	$name = $filedescritpion['name'];
	$type = $filedescritpion['type'];
	$ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
	$dir = pathinfo($tmpname, PATHINFO_DIRNAME);
	
	switch($filedescritpion['error']) {
        case UPLOAD_ERR_OK:
		
			$fh = @fopen($tmpname, 'rb');
			if ($fh === false) {
				die('##4##'.chr(10).'Upload refused: unable to inspect file header.'.chr(10));
			}
			fclose($fh);

			if(fileStartsWithPhpOpenTag($tmpname)) {
				@unlink($tmpname);
				die('##5##'.chr(10).'Upload refused: PHP content not allowed (<? detected).'.chr(10));
			}
			
			echo '##0##'.chr(10).'File uploaded'.chr(10);
			break;
        case UPLOAD_ERR_NO_FILE:
			die('##1##'.chr(10).'No file received'.chr(10));
            break;
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
			die('##2##'.chr(10).'The file size has been exceeded'.chr(10));
            break;
        default:
			die('##3##'.chr(10).'Unknown error'.chr(10));
    }
	
	
	echo chr(10);
	echo 'name: '.$name.chr(10);
	echo 'type: '.$type.chr(10);
	echo 'ext: '.$ext.chr(10);
	echo 'tmpname: '.$tmpname.chr(10);
	echo 'directory: '.$dir.chr(10);
	echo 'size: '.$size.chr(10);
	
	
	switch($fileclass) {
		case 'C_dS_visitor':
			$destination = C_dS_file::$filesdir.$postname.'.'.$ext; // this destination path is relative to /post/file.php, which is where this script is executed
			break;
		case 'C_dS_logo':
			$destination = C_dS_logo::$filesdir.$postname.'.'.$ext; // this destination path is relative to /post/file.php, which is where this script is executed
			break;
		case 'C_dS_reservation':
			$destination = C_dS_resafile::$filesdir.$postname.'.'.$ext; // this destination path is relative to /post/file.php, which is where this script is executed
			break;
		default:
			die('Sorry, you were not exepected.');
	}
	$moved = move_uploaded_file($tmpname, $destination);
	if(!$moved) die('the file could NOT be MOVED!');
		// else echo 'the file has been moved properly to dir.name: '.$destination; // which is a name like "3608_1932406_0" posted from client side and made from "accountId_visitorId_0", see (*F01*)
}

$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'p_file');
?>