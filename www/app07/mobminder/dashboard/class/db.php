<?php
class db{
	var $mysql;

	var $results;
	var $results2;

	var $borne;
	var $borneFrom;
	var $borneTo;
	
	var $grandTotal=0;
	var $smallTotal=0;
	var $asciiTotal=0;
	var $utf8Total=0;
	var $otherTotal=0;
	
	var $encoding_ascii=0;
	var $encoding_utf8=0;
	var $encoding_other=0;
			
	function __construct(){
		$this->mysql = new mysqli('localhost', 'mobminder', 'tgx23PiQ', 'mobminder');
		if ($this->mysql->connect_error)
			die('Erreur de connexion (' . $this->mysql->connect_errno . ') '
			. $this->mysql->connect_error);
	}
	
	function freeResults(){
		$this->mysql->close();
	}
	
	function totalSMS(){ 			
		$query = "SELECT 
			s.groupId, 
			count(s.id) as total, 
			g.name as name
		FROM 
			sms s 
		JOIN groups g ON s.groupId = g.id 
		WHERE sendstamp>=".$this->borneFrom." and sendstamp <=".$this->borneTo."
		GROUP BY s.groupId
		ORDER BY total DESC";
			
		$this->results = $this->mysql->query($query);
		
		while ($row = $this->results->fetch_object()){
			$this->grandTotal += $row->total;
		}
		mysqli_data_seek($this->results,0);
		//echo $this->borne." :: query called $query";
 	}
 	
 	function analyseEncoding($g){
		$this->encoding_ascii=0;
		$this->encoding_utf8=0;
		$this->encoding_other=0;		
		
		$query = "SELECT s.text FROM sms s JOIN groups g ON s.groupId = g.id 
		WHERE sendstamp>=".$this->borneFrom." and sendstamp <=".$this->borneTo." and s.groupId = ".$g;

		$this->results2 = $this->mysql->query($query);
		while ($row = $this->results2->fetch_object()){
			$this->encoding($row->text);
		}
 	}
	
 	function querier($q){
		$this->results = $this->mysql->query($q);
 	}
	
 	function getBorne(){
		$this->borne = (@$_GET["b"])?$_GET["b"]:0;
 	}

	function setBornes(){	
		$decalage = $this->borne;
		$this->borneFrom 	= mktime(0, 0, 0, date('m')+$decalage , 1 , date('Y'));
		$this->borneTo 	= mktime(23, 59, 59, date('m')+$decalage+1, date('d')-date('j'), date('Y'));	
	}
	
	function showBornes(){
		$format="d M Y";
		echo "<ul class='bornes'>
				<li><a href='?b=".($this->borne-1)."'>-</a></li>
				<li><a href='?b=0'>From ".date($format, $this->borneFrom)." to ".date($format, $this->borneTo)."</a></li>
				<li><a href='?b=".($this->borne+1)."'>+</a></li>
				<li>Total: ".number_format($this->grandTotal, 0, ',', '.')."</li>
			</ul>";
	}
	
	function showResults(){	
		$i=1;
		echo "<table>
			<tr>
				<th>#</th>
				<th>GroupName</th>
				<th>Total</th>
				<th>% Gd Total</th>
				<th>ASCII</th>
				<th>UTF-8</th>
				<th>Other</th>
			</tr>";
		while ($row = $this->results->fetch_object()){
			$this->analyseEncoding($row->groupId);
			echo "<tr>
					<td>".$i."</td>
					<td class='l'>".$row->name."</td>
					<td>".number_format($row->total, 0, ',', '.')."</td>
					<td>".sprintf('%01.2f',$row->total/$this->grandTotal*100)."%</td>
					<td>".$this->encoding_ascii."</td>
					<td>".$this->encoding_utf8."</td>
					<td>".$this->encoding_other."</td>
				</tr>";
			$i++;
			flush();
		}
		echo "<tr>
				<th></th>
				<th></th>
				<th>".$this->smallTotal."</th>
				<th></th>
				<th>".$this->asciiTotal."</th>
				<th>".$this->utf8Total."</th>
				<th>".$this->otherTotal."</th>
			</tr>
			</table>
			<h1>Resume for ".number_format($this->smallTotal, 0, ',', '.')." SMS scanned</h1>
			<table>
				<tr><td>".number_format($this->asciiTotal, 0, ',', '.')."</td><td>ASCII</td><td>".sprintf('%01.2f',$this->asciiTotal/$this->smallTotal*100)."%</td></tr>
				<tr><td>".number_format($this->utf8Total, 0, ',', '.')."</td><td>UTF-8</td><td>".sprintf('%01.2f',$this->utf8Total/$this->smallTotal*100)."%</td></tr>
				<tr><td>".number_format($this->otherTotal, 0, ',', '.')."</td><td>OTHER</td><td>".sprintf('%01.2f',$this->otherTotal/$this->smallTotal*100)."%</td></tr>
			</table>";
	}
	
	function getResults(){
		$results = "";
		while ($row = $this->results->fetch_object()){
			$results .= $row->name."|".number_format($row->total, 0, ',', '.')."#";
		}
		echo $results;
	}
	
	function encoding($str){
		$encoding = mb_detect_encoding($str);
		$this->smallTotal++;
		switch($encoding){
			case "ASCII":
				$this->encoding_ascii++;
				$this->asciiTotal++;
				break;
			case "UTF-8":
				$this->encoding_utf8++;
				$this->utf8Total++;
				break;
			default:
				$this->encoding_other++;
				$this->otherTotal++;
				break;
		}
		return;
	}
};

?>