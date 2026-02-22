<?php


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	 G R A P H I C S   D I S P L A Y   C L A S S E S
//


class C_bargraph {

	public $data;
	public $title;
	public $xname;
	public $yname;
	public $color;
	public $scale;
    public function __construct($data, $title=false, $xname=false, $yname=false, $color="#a4b357", $scale=1) {
    	$this->data = $data;
    	$this->title = $title;
    	$this->xname = $xname;
    	$this->yname = $yname;
		$this->color = $color;
		$this->scale = $scale;
    }

    public function displayhead_h() {
    		$th1 = '<th class="left">'.$this->yname.'</th>'; //'<th class="left">'.$this->yname.'</th>';
			$th2 = '<th class="right">'.$this->xname.'</th>'; //'<th class="right">'.$this->xname.'</th>';
			$thr = '<tr class="header">'.$th1.$th2.'</tr>';
			$tcols = '<colgroup></colgroup>';
		return $thr.$tcols;	
	}


    public function display_h() {
    	$trs = '';

		foreach($this->data as $idx => $val) {
				$vald = $val*$this->scale;
			$label = '<div style= "display:inline-block; font-size:90%;">&nbsp;'.$val.'</div>';
			$div = '<div style= "display:inline-block; background-color:'.$this->color.'; width:'.$vald.'px; max-width:800px;">&nbsp;</div>';
			$bar = '<td class="bar" style="white-space:nowrap;">'.$div.$label.'</td>';
    		$trs  .= '<tr class="bars"> <td class="rightbarlabel">'.$idx.'</td>'.$bar.'</tr>';
    	}
    	return $trs;
    }


    public function html_table_h() {
		
		echo '<table class="bargraph_h">';
			echo '<thead>';
				echo $this->displayhead_h();
			echo '</thead>';

			echo '<tbody>';
				echo $this->display_h();
				if($this->title)
					echo '<tr class="title"><td colspan="2" style="text-align:center; font-weight: bold;">'.$this->title.'</td></tr>';
			echo '</tbody>';
		echo '</table>';
    }


    public function html_table_v() {
		$tdv = '';
		$c = 1;
		foreach($this->data as $idx => $val) {
			$vald = $val*$this->scale;
			$val = '<div style="text-align:center; font-size:90%;">'.$val.'</div>';
			$bar = '<div style= "display:block; background-color:'.$this->color.'; min-height: '.$vald.'px; width: 35px; text-align: center;"></div>';
    		$tdv  .= '<td style= "vertical-align: bottom;">'.$val.$bar.'</td> ';
    		$c = $c+1;
    	}
    	$tdi = '';

		foreach($this->data as $idx => $val) {
    		$tdi  .= '<td style= "text-align: center;">'.$idx.'</td> ';
    	}

		echo '<table class="bargraph_v" style="width=100%;">';
			echo '<tbody>';
				echo '<tr class="bars"><th>'.$this->yname.'</th>'.$tdv.'</tr>';
				echo '<tr class="idx"><th>'.$this->xname.'</th>'.$tdi.'</tr>';

				echo '<tr class="title"><th colspan='.$c.'>'.$this->title.'</td></tr>';
			echo '</tbody>';
		echo '</table>';
    }
}


?>