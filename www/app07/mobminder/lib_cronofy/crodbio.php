<?php 
require 'config.php';
//require_once '/../classes/language.php';
//require_once '/../../../lib_mobphp/dbio.php';




////////////////////////////////////////////////////////////////////////////////////////////////
//
// CRONOFY INITTASKS
//
class C_dS_cronofy_inittask extends C_dbID  { // group by cronofy_access_id
    public function getTableName() { return  'cronofy_inittasks'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $state; 
    public $startDate;
    public $endDate;
    public $refresh;
    public static $multilines = false;
    public static $defaults = array( 	
        'state'		=> 0,
        'startDate' => 0,
        'endDate' 	=> 0,
        'refresh' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }

}
?>