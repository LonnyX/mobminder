

<?php
	$session = session_start();
	
	// identifying the calling script
	$nl = chr(10);
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$split = Explode('/', $pathfile);
		$splitcont = count($split);
	$scriptname 	= $split[$splitcont - 1]; 
	$scriptfolder 	= $split[$splitcont - 2]; if($scriptfolder) $scriptfolder = '/'.$scriptfolder;
	$scopefolder 	= $split[$splitcont - 3]; if($scopefolder) $scopefolder = '/'.$scopefolder;
	$script = $scriptfolder.'/'.$scriptname;

	// check if we are in interractive Xlation mode  (see xlate.js for the definition of C_iXL)
	
	$ixl = 'off'; 
	if(isset($_SESSION['ixl'])) if($_SESSION['ixl']==1) $ixl = 'on'; 
	
	if(isset($_GET['ixl'])) { // interactive translation enabler
		if($_GET['ixl'] == 'tgx23PiQ') 
			{ $ixl = 'on'; $_SESSION['ixl'] = 1; }
		else 
			{ $ixl = 'off'; $_SESSION['ixl'] = 0; }
	}
		
	// connect to DB and bring all Xlations to their respective places
	
	$dbio = new mysqli('localhost' /*host*/, 'mobminder' /*user*/, 'tgx23PiQ' /*pw*/, 'elearning' /*db*/);
	$dbio->query('SET NAMES utf8');
	
	function X($tn, $page = false) {
		global $dbio, $l, $p, $ixl;
		if($page) $qp = $page; else $qp = $p;
		$r = $dbio->query('select id, fr, '.$l.' from xlations where tn = "'.$tn.'" and page = "'.$qp.'";');
		if($r===false) echo $dbio->errno.' -> '.$dbio->error;
		$c = $r->num_rows;
		if($c > 1) return '-?many-'.$tn.'-?-'; // 'Many XL for '.$tn.'/'.$qp; // mutliple entries for this combination of technical name and page
		if($c === 0) { 
				$id = 0; // will trigger the creation of a new record in xlations DB table
			if($ixl=='on') $xl = '<xl id="xl_'.$qp.'_'.$id.'" value="'.$tn.'">-?'.$tn.'?-</xl>'; // interactive translation
				else $xl = '-?'.$tn.'?-'; // 'No XL for '.$tn.'/'.$qp; // technical name/page not found in db
			$xl = nl2br($xl); // nl2br seems to leave the \n's inside the string was solved here (*xl_1*)
			return $xl;
			
		} else { // only one found, great!
			$row = $r->fetch_array();
				$xl = $row[$l]; if($xl=='') $xl = $row['fr']; // when the page is not yet translated in the requested language, the document displays french.
				$id = $row['id'];
			if($xl === '') return '-?empty?-';
			if($ixl=='on') $xl = '<xl id="xl_'.$qp.'_'.$id.'" value="'.$tn.'">'.$xl.'</xl>'; // interactive translation
			$xl = nl2br($xl); // nl2br seems to leave the \n's inside the string was solved here (*xl_1*)
			return $xl;
		}
	}
	
?>


<script type="text/javascript">

	window.onload = function () { 
		
		if('<?=$ixl?>'==='on') {
			$('body').find('xl').each(
				function() {
					$(this)
					.mouseover( function(){ $(this).addClass('xlpoint');} )
					.mouseout( function(){ $(this).removeClass('xlpoint');} )
					.click( function(e){ 
									var inner = $(this).html();
										var split = this.id.split('_');
									var xlid = split.pop();
									var page = split.pop();
									var tnam = $(this).attr('value');
								var n = new C_iXL('xl',{header:inner, page:page, tnam:tnam, xlid:xlid, lang:'<?=$l?>'}, {target:this});
							n.display(e);
							n.activate();
						} 
					) 
				} 
			)
			console.log('translate mode is on');
		} else 
			console.log('translate mode is off');
		
	}
</script>

