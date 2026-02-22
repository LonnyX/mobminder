<?php

$systemLog = 'spoofy.php';
require '../utililib.php';


$out = h1('Spoofy operation - UTF8 collation fixing rescue');

if(isset($_GET['do'])) $do = $_GET['do']; if($do) $do = true; else $do = false;

	$m = 1024*3.6; // 3 Gig RAM
ini_set('memory_limit', $m.'M');


//////////////////////////////////////////////////////
//
//  !!! After execution, pass all tables to utf8mb4 AND all char fields to utf8 mb4
//

	// reservations
	$tables['archive_reservations'] = Array('note');  // this one needs 30 minutes to execute
	$tables['reservations'] = Array('note'); 


	// chat
	$tables['archive_chat_phylacteries'] = Array('bla'); // 2 minutes
	$tables['chat_phylacteries'] = Array('bla'); 

	$tables['archive_chat_threads'] = Array('creator','changer','title','note'); 
	$tables['chat_threads'] = Array('creator','changer','title','note');
	
	// notes and tasks
	$tables['note_details'] = Array('creator','changer','title','note','cssTags'); // 2 minutes
	$tables['task_descriptions'] = Array('creator','changer','title','description','cssTags'); // 2 minutes
	

	// connections
	$tables['archive_connections'] = Array('sessionId','surfer','account','agent','ip','surfer','surfer'); 
	$tables['connections'] = Array('sessionId','surfer','account','agent','ip','surfer','surfer'); 
	$tables['exceptions'] = Array('creator','class','function','msg');
	$tables['exceptions_smartapp'] = Array('creator','ua','version','criticity','class','function','msg');
	
	
	// cronofy
	$tables['cronofy_accesses'] = Array('creator'); 
	$tables['cronofy_calendar'] = Array('creator','changer','cro_calendar_id','cro_channel_id');
	$tables['cronofy_profile'] = Array('creator','changer','cro_profile_id','cro_provider_name','cro_profile_name');
	$tables['cronofy_user'] = Array('creator','changer','cro_account_id','cro_access_token','cro_refresh_token');
	
	
	// communication
	$tables['emails'] = Array('creator','changer','mailsubject','mailbody','recipients','sender'); // 10 minutes
	$tables['sms'] = Array('creator','changer','text','toNumber','replyNumber','correlator','opStatus','r2correlator','r3correlator','r3status','r3statusChangeStamp'); // 12 minutes
	
	
	
	// account config
	$tables['groups'] = Array('creator','changer','name','note','email','smsSenderId','defaultCssAppTag','defaultCssEventTag','defaultCssFcalTag','defaultCssVisitorTag','defaultCssNoteTag','defaultCssTaskTag','defaultCssChatTag','defaultCssFileTag'); 

	$tables['logins'] = Array('creator','changer','firstname','lastname','note','login','password','company','address','city','zipCode','country','email'
			,'eresaTitle','eresaUrl','eresaSkin','eresaNote','eresaHourlies','eresaDirections','eresaDirLabel','eresaDirUrl','eresaLink1label','eresaLink1url','eresaLink2label','eresaLink2url','eresaPalette','eresaFontTitle','eresaFontText','eresaCcss');
	$tables['contracts'] = Array('creator','changer','register','tax','firstname','lastname','company','address','residence','zipCode','city','country','registration','note','email'); 
	
	$tables['custom_css'] = Array('creator','changer','name','note');
	$tables['guidelines'] = Array('creator','changer','name','address','zipCode','city','country','email','mobile','phone','registration','directions','newvisi','appguide','reqguide','neverdo','tipstricks'); // 12 minutes
	
	
	$tables['hourlies'] = Array('creator','changer','name','note');
	$tables['hourliesusers'] = Array('creator','changer');
	
	
	// visitors
	$tables['visitors'] = Array('creator','changer','firstname','lastname','company','address','residence','zipCode','city','country','registration','reference','note','email','cssTags'); // this one needs 20 minutes to execute
	$tables['files'] = Array('creator','changer','name','note','cssTags');
	$tables['logos'] = Array('filename','note');
	
	
	


	$t = 'hourlies';
	
	// diagnostic
	$q = new Q('select count(1) as c from '.$t.';');
	$total = $q->c()+0;

$out .= h2('Found '.$t.': '.$total);


	$cueinMAIN = microtime(true);
	$c = 0;
	$f = 0;
	$b = 1000000;
	while($f<=$total) {
		
		$uc = 0;
		$utf8 = new Q('SET NAMES latin1;'); // switch to correct encoding for UTF-8 applications
		
		
			$sql = 'select id, ';
				$set = Array(); foreach($tables[$t] as $x=>$v) $set[] = $v;
			$sql .= implode(',',$set).' from '.$t.' limit '.($f+0).','.$b.';';

		$cuein = microtime(true);		
		$q = new Q($sql); // .' limit '.$f.',100000;
		$cueout = microtime(true);
		$cuedelta = deltasec($cuein,$cueout);
		$out .= h2('The '.$t.' table has been read in: '.$cuedelta.', it counts '.$q->cnt().' records from record '.$f);
		
		

		$utf8 = new Q('SET NAMES utf8;'); // switch to correct encoding for UTF-8 applications

		set_time_limit(180);

		// update visitors set lastname = CONVERT(CAST(lastname as BINARY) using utf8);  //   <<= the magic version?
		
		$cuein = microtime(true);
		while($r = $q->result->fetch_array()) {
		
			$sql = 'update '.$t.' set ';
				$set = Array(); foreach($tables[$t] as $x=>$v) $set[] = $v.'="'.addslashes($r[$v]).'"';
			$sql .= implode(',',$set).' where id = '.$r['id'].';';
			unset($set,$v,$x);
			
			if($do) {
				
				$o = new Q($sql);
				unset($o);
			}
			else {
				if($uc<=10) { 
					$out .= notice($sql);
					new Q($sql);
				}
			} 
			unset($sql);
			$c++; $uc++;
			unset($r);
		}
		$cueout = microtime(true);
		$cuedelta = deltasec($cuein,$cueout);
		$out .= h2(''.$t.' table was partly fixed in: '.$cuedelta.', '.$uc.' records were written');
		
		unset($q);
		$f += $b;
	}
	$cueoutMAIN = microtime(true);
	$cuedelta = deltasec($cueinMAIN,$cueoutMAIN);
	$out .= h1('The '.$t.' table was fixed in: '.$cuedelta.', '.$c.' records were written');
 
 

//////////////////////////////////////////////////////////////////////////////// 
//
//
//

$out .= h2('Successful');
echo html($out); die();

?>