<?php
define('enable_eresa_url',true);

//TMP
define('webapp_server_ip_address','57.128.140.131,37.187.71.119,51.77.4.176');

class C_Eresa_Url
{
	public function __construct() 
	{
	}
    public function deleteReferencePage($postfixurl,$cron=false)
    {
        if(!enable_eresa_url) return;

        $postfixurl=trim($postfixurl);

        $eresarootdir = $this->getEresaDirectory($cron);
        $directory = $eresarootdir.'/'.$postfixurl;
        $indexfile = $eresarootdir.'/'.$postfixurl.'/index.php';

        if(file_exists($indexfile))
        {
            if(!unlink($indexfile)) 
            {
                return 'index.php file has not been removed : '.$indexfile;
            }
        }
        if(is_dir($directory))
        {
            if(!rmdir($directory))
            {
                return 'directory has not been removed : '.$directory;
            }
        }
        return null;
    }
    /*public function updateReferencePage($dS_login,$old_postfixurl)
    {
        if(!enable_eresa_url) return;

        if($old_postfixurl) //login already exists : remove old + add new postfixurl
        {
            $this->deleteReferencePage($old_postfixurl);
        }

        //$familymode = false;
        $isfamilymode = ($dS_login->eresaIdentMode==1?true:false);
        
        $this->createReferencePage($dS_login->eresaUrl,$isfamilymode);
    }*/
    public function synchronizePages($deleteall=false)
    {
        if(!enable_eresa_url) return;

        //$web = @$_GET['web']; if(isset($web)) $web = 1; else $web = 0;
        $web = crontest;

        if($web) echo 'starting task : synchronize web login pages'.'</br>';

        $urls = array();
        $eresaIdentModes = array();

        $q = new Q('SELECT id, trim(eresaUrl) as eresaUrl, eresaIdentMode FROM logins WHERE trim(eresaUrl) <> "";');
        while($r = $q->result->fetch_array()) 
        {
            $urls[$r['id']] = $r['eresaUrl'];
            $eresaIdentModes[$r['id']] = $r['eresaIdentMode'];
        }
	    //$urls = $q->ids(false); 
        //foreach ($familles as $famille) echo '- '.$famille.'</br>';
        
        //$duplicates = $this->array_not_unique($urls);
        //if(count($duplicates)>0)
        //if(false)
        //{
        //    echo 'error : duplicates values:</br>';
        //    foreach ($duplicates as $duplicate) echo '- '.$duplicate.'</br>';
        //}
        //else
        //{
            //echo 'no duplicates values'.'</br>';
            $eresarootdir = $this->getEresaDirectory(true);
            $allsubdirs = scandir($eresarootdir);

            //foreach($urls as $url) echo $url.'</br>';
            //echo '----------------'.'</br>';
        
            if($web) echo 'removing old postfixurl...'.'</br>';
            foreach($allsubdirs as $subdir) 
            {
                if($subdir=='.' || $subdir=='..' || $subdir=='_assets' || $subdir=='robots.txt') continue;

                if(!in_array($subdir, $urls) || $deleteall)
                {
                    //if($web) echo 'listing : '.$subdir;
                    $res = $this->deleteReferencePage($subdir,true);
                    if($res!=null) echo $res.(($web)?'</br>':chr(10));
                    if($web && $res==null) echo $subdir.' directory post fix url does not exist anymore => removed!</br>';
                    
                }
                //else
                //{
                //    echo 'found in array : '.$subdir.'</br>';
                //}
            }
            
            if(!$deleteall)
            {

                if($web) echo 'adding new postfixurl...'.'</br>';
            
                foreach($urls as $lid => $url)
                {
                    //0 =single
                    //1= family
                    $isfamilymode = ($eresaIdentModes[$lid]==1?true:false);

                    //echo $url.'</br>';
                    $subdir = $eresarootdir.'/'.$url;
                    
                    //if(!is_dir($subdir))
                    //{
                        $res = $this->createReferencePage($url,$isfamilymode,true);
                        if($res!=null) echo $res.(($web)?'</br>':chr(10));
                        if($web && $res==null) echo $subdir.' directory post fix url has been created with familymode = '.($isfamilymode?'yes':'no').'</br>';
                    //}
                    //else //directory already exists => override index.php file (we don't know if familymode has changed or not)
                    //{
                    //    $this->createReferencePage($url,$isfamilymode,true);
                    //    if($res!=null) echo $res.(($web)?</br>:chr(10);
                    //    if($web) echo $subdir.' index.php file been overrided with familymode = '.($isfamilymode?'yes':'no').'</br>';
                    //}
                }
            }
        //} 
        if($web) echo 'end of task synchronize web login pages'.'</br>';
    }
    public function createReferencePage($postfixurl,$eresaIdentMode,$cron=false)
	{
        if(!enable_eresa_url) return;

        $postfixurl=trim($postfixurl);

        $eresarootdir = $this->getEresaDirectory($cron);
        $directory = $eresarootdir.'/'.$postfixurl;
        $indexfile = $eresarootdir.'/'.$postfixurl.'/index.php';

        //create directory only if not exists
        if(!is_dir($directory))
        {
            if(!mkdir($directory,0777,false))
            {
                return 'directory has not been created : '.$directory;
            }
            if(!chown($directory,'www-data'))
            {
                return 'directory owner (www-data) has not been changed : '.$indexfile;
            }
            if(!chgrp($directory,'www-data'))
            {
                return 'directory group (www-data) has not been changed : '.$indexfile;
            }
            
        }

        $isfamilymode = ($eresaIdentMode==1?true:false);

        //$requirefile = $isfamilymode?'e-resa2.php':'e-resa.php';
        $requirefile = 'e-resa.php';
        $shared = $isfamilymode?'1':'0';
        
        $content = '<?php'.chr(10)
        .'$lines = explode(\'/\',$_SERVER[\'REQUEST_URI\']);'.chr(10)
        .'$prefixurl = $lines[count($lines)-2];'.chr(10)
        .'$_GET[\'p\'] = $prefixurl;'.chr(10)
        .'$_GET[\'f\'] = '.$shared.';'.chr(10)
        .'require \'../_assets/'.$requirefile.'\';'.chr(10)
        .'?>'.chr(10);

        if(!file_put_contents($indexfile,$content, LOCK_EX))
        {
            return 'index.php file has not been created : '.$indexfile;
        }
        if(!chown($indexfile,'www-data'))
        {
            return 'index.php file owner (www-data) has not been changed : '.$indexfile;
        }
        if(!chgrp($indexfile,'www-data'))
        {
            return 'index.php file group (www-data) has not been changed : '.$indexfile;
        }
        if(!chmod($indexfile,0775))
        {
            return 'index.php file permission (0775) has not been changed : '.$indexfile;
        }


        return null;
	}
    private function array_not_unique( $a = array() )
    {
        return array_diff_key( $a , array_unique( $a ) );
    }
    private function getEresaDirectory($cron) 
    {   
        //TEST
        if(false)
        {
            return 'C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\booking';
        }
        else //PROD
        {
            if(!$cron)
                return '/var/www/booking';
            else 
                return '/var/www/booking';
        }
    }
}
?>
