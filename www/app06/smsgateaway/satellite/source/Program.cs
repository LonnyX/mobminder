using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.IO;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Globalization;
using System.IO.Ports;

namespace SmsBox
{
    //class order
    //      SmsShieldWrapper
    //==>   AtCommandWrapper
    //====> SerialWrapper
    enum EExitMode
    {
        none,
        reboot,
        halt
    }
    class Program
    {
        // SIGNATURE -----------------------------------------------------------
        private const string _signature = "v4.01";
        //----------------------------------------------------------------------

        //-------------------------------------------------------------------------------
        //update_bin_mode = 0 => download in release directory + call script.sh + exit
        //update_bin_mode = 1 => download in bin directory +exit
        //update_bin_mode = 2 => download in release directory + reboot
        private const int update_bin_mode = 2;

        
        //param keys------------------------------------------------------------
        private static string lastreportkey = "last";
        private static string lastreportsmssuccessmsg = "NETWORK UP";
        private static string lastreportsmsfailuremsg = "NETWORK DOWN";
        private static string DEFAULTband4disable = "DEFAULT";

        private static string configfilename = "sms.conf";

        private static string param_key_reporting_number = "reporting_number";
        private static string param_key_enable_rpi = "enable_rpi";
        private static string param_key_enable_grps = "enable_gprs";
        private static string param_key_force_signal = "force_signal";
        private static string param_key_enable_refreshlag = "enable_refreshlag";
        private static string param_key_enable_reporting_sms = "enable_reporting_sms";
        private static string param_key_serial_port = "serial_port";
        private static string param_key_registration_timeout_counter = "registration_timeout_counter";
        private static string param_key_serial_read_timeout_ms = "serial_read_timeout_ms";
        private static string param_key_wifi_config_filename = "wifi_config_filename";
        private static string param_key_log_level = "log_level";
        private static string param_key_log_console = "log_console";
        private static string param_key_log_history_day = "log_history_day";
        private static string param_key_serial_read_timeout_sec = "serial_read_timeout_sec";
        private static string param_key_queue_read_timeout_sec = "queue_read_timeout_sec";
        private static string param_key_queue_alive_timeout_sec = "queue_alive_timeout_sec";
        private static string param_key_queue_sendsms_timeout_sec = "queue_sendsms_timeout_sec";
        private static string param_key_lag_default_sec = "lag_default_sec";
        private static string param_key_gateway_proxy_timeout_sec = "gateway_proxy_timeout_sec";
        private static string param_key_gateway_server = "gateway_server";
        private static string param_key_ucs2 = "ucs2";
        private static string param_backup_queue_enable = "backup_queue_enable";
        private static string param_nickname = "nickname";
        private static string param_band = "band";
        private static string param_script_sh_update = "script_sh_update";
        private static string param_force_iccid = "force_iccid";
        private static string param_internet_gateway_ip = "internet_gateway_ip";
        private static string param_send_pdu = "send_pdu";
        private static string param_receive_pdu = "receive_pdu";
        private static string param_reply_forbidden = "reply_forbidden";
        private static string param_reporting_buffer_counter = "reporting_buffer_counter";
        private static string param_number_sms_error_before_restart = "number_sms_error_before_restart";
        
        
        //parameters--------------------------------------------------------------
        private static string defaultreportsmsphonenumber;
        private static bool rpimode;
        private static bool enablegprs;
        private static bool forcesignal;
        private static int registrationtimeoutcounter;
        private static int serial_read_timeout_ms;
        private static int lastsignalquality;
        private static string iccid;
        private static string nickname;
        private static string band;
        private static bool stoppreading = false;
        private static Queue queueserialread;
        private static Queue queuecds;
        private static Queue queuehttperror;
        private static Singleton singletondirectack;
        private static QueueInbound queuereceivedsms;
        private static Queue queueecho;
        private static Queue queuesms;
        private static SerialPort serialport;
        private static int gateway_proxy_timeout_sec;
        private static string gateway_server;
        public static string stringseparator = "[SEPARATOR]";
        //private static string dateformat = "dd/MM/yyyy HH:mm:ss";
        private static int forcesignalvalue = 20;
        private static string lastsmsreportfilename;
        //private static bool modeucs2 = true;
        private static bool running = true;
        private static bool modeunlock = false;
        private static bool modelock = false;
        private static bool modeiccid = false;
        private static string lockcode = null;
        private static bool enablereportingsms = false;
        private static int currentcputemp = 50;
        private static bool currentpowerstatus = true;
        private static string internetgatewayip;
        private static bool sendpdu = false;
        private static bool receivepdu = false;
        private static EExitMode exitmode = EExitMode.none;
        private static string defaultversiondate = "20190931";
        private static string defaultcommand = "nothing";
        private static string reply_forbidden = null;
        private static int countersmsreportmax;
        private static int countersmsreportcurrent;
        private static int sms_number_error_before_restart;
    
        static int Main(string[] args)
        {
            ////////////////////////////////////////////////////////////////////////////////////////////////
            //temporary code : forcing send_pdu and receive_pdu with true value in config file
            //List<KeyValuePair<string, string>> tmpnewparams = new List<KeyValuePair<string, string>>();
            //tmpnewparams.Add(new KeyValuePair<string, string>("send_pdu", "true"));
            //tmpnewparams.Add(new KeyValuePair<string, string>("receive_pdu", "true"));
            //FileHelper.OverrideConfigFileKeyValue(configfilename, tmpnewparams);
            ////////////////////////////////////////////////////////////////////////////////////////////////


            string[] mandatorykeys = new string[]{
                param_key_enable_rpi,param_key_log_level,param_key_log_console,param_key_log_history_day,param_key_reporting_number,param_key_enable_grps,param_key_force_signal,
                param_key_registration_timeout_counter,param_key_serial_read_timeout_ms,param_key_enable_refreshlag,param_key_enable_reporting_sms,param_key_serial_port,param_key_wifi_config_filename,
                param_key_gateway_proxy_timeout_sec,param_key_gateway_server,param_key_serial_read_timeout_sec,param_key_queue_read_timeout_sec,param_key_queue_alive_timeout_sec,param_key_queue_sendsms_timeout_sec,
                param_key_lag_default_sec,param_key_ucs2,param_backup_queue_enable,param_nickname,param_band,param_internet_gateway_ip,param_script_sh_update};

            if ((args.Length==1) && (args[0].StartsWith("unlock=")))
            {
                modeunlock = true;
                lockcode = args[0].Replace("unlock=", "");
            }
            else if ((args.Length == 1) && (args[0].StartsWith("lock=")))
            {
                modelock = true;
                lockcode = args[0].Replace("lock=", "");
            }
            else if ((args.Length == 1) && (args[0].Equals("iccid")))
            {
                modeiccid = true;
            }
            
            try
            {
                
                Console.CancelKeyPress += new ConsoleCancelEventHandler(myHandler);

                //PARAMS-----------------------------------------------------------------------------------------
                Dictionary<string, string> parameters = FileHelper.LoadConfigFileAllKeyValue(configfilename);

                foreach (string mandatorykey in mandatorykeys)
                {
                    if (!parameters.ContainsKey(mandatorykey))
                    {
                        LogHelper.WriteLine(ELogLevel.error, "parameter is missing : " + mandatorykey);
                        System.Environment.Exit(1);
                    }
                }


                rpimode = Boolean.Parse(parameters[param_key_enable_rpi]);
                string rootdirectory = ".."; //parameters[param_root_directory];
                string datadirectory = rootdirectory + DirectorySeparator + "data";

                string logdirectory = datadirectory + DirectorySeparator + "log";
                DirectoryInfo dilog = new DirectoryInfo(logdirectory);
                if (!dilog.Exists) dilog.Create();

                LogHelper.FileName = logdirectory + DirectorySeparator + "smsboxtrace.log";
                LogHelper.minimumLevel = (ELogLevel)Enum.Parse(typeof(ELogLevel), parameters[param_key_log_level]);
                LogHelper.EnableConsole = Boolean.Parse(parameters[param_key_log_console]);
                LogHelper.HistoryDay = Int32.Parse(parameters[param_key_log_history_day]);


                GpioWrapper.ScriptFileName = "." + DirectorySeparator + "python" + DirectorySeparator + "smspower.py";
                defaultreportsmsphonenumber = parameters[param_key_reporting_number];
                enablegprs = Boolean.Parse(parameters[param_key_enable_grps]);
                forcesignal = Boolean.Parse(parameters[param_key_force_signal]);
                registrationtimeoutcounter = Int32.Parse(parameters[param_key_registration_timeout_counter]);
                serial_read_timeout_ms = Int32.Parse(parameters[param_key_serial_read_timeout_ms]);

                bool enablerefreshlag = Boolean.Parse(parameters[param_key_enable_refreshlag]);
                enablereportingsms = Boolean.Parse(parameters[param_key_enable_reporting_sms]);
                string portname = parameters[param_key_serial_port];
                string wificonfigfilename = parameters[param_key_wifi_config_filename];

                string queueserialreadpath = datadirectory + DirectorySeparator + "queueserialread";
                string queuecdspath = datadirectory + DirectorySeparator + "queuecds";
                string queuedirectackpath = datadirectory + DirectorySeparator + "queuedirectack";
                string queuehttperrorpath = datadirectory + DirectorySeparator + "queuehttperror";
                string queuereceivedsmspath = datadirectory + DirectorySeparator + "queuereceivedsms";
                string queueechopath = datadirectory + DirectorySeparator + "queueecho";
                string queuesmspath = datadirectory + DirectorySeparator + "queuesms";


                gateway_proxy_timeout_sec = Int32.Parse(parameters[param_key_gateway_proxy_timeout_sec]);
                gateway_server = parameters[param_key_gateway_server];
                int serialreadtimeoutsec = Int32.Parse(parameters[param_key_serial_read_timeout_sec]);
                int queuereadtimeoutsec = Int32.Parse(parameters[param_key_queue_read_timeout_sec]);
                int queuealivereadtimeoutsec = Int32.Parse(parameters[param_key_queue_alive_timeout_sec]);
                int queuesendsmstimeoutsec = Int32.Parse(parameters[param_key_queue_sendsms_timeout_sec]);
                int defaultlagdelay = Int32.Parse(parameters[param_key_lag_default_sec]);
                int lagdelay = defaultlagdelay;
                //modeucs2 = Boolean.Parse(parameters[param_key_ucs2]);
                bool enable_backup_queue = Boolean.Parse(parameters[param_backup_queue_enable]);
                nickname = parameters[param_nickname];
                band = parameters[param_band];
                internetgatewayip = parameters[param_internet_gateway_ip];

                sendpdu = Boolean.Parse(parameters[param_send_pdu]);
                receivepdu = Boolean.Parse(parameters[param_receive_pdu]);

                if (parameters.ContainsKey(param_reply_forbidden))
                    reply_forbidden = parameters[param_reply_forbidden];
                else //default value
                    reply_forbidden = null;

                countersmsreportcurrent = 0;
                if (parameters.ContainsKey(param_reporting_buffer_counter))
                    countersmsreportmax = Int32.Parse(parameters[param_reporting_buffer_counter]);
                else //default value
                    countersmsreportmax = 5;


                sms_number_error_before_restart = 0;
                if (parameters.ContainsKey(param_number_sms_error_before_restart))
                    sms_number_error_before_restart = Int32.Parse(parameters[param_number_sms_error_before_restart]);
                else //default value
                    sms_number_error_before_restart = 10;


                //-------------------------------------------------------------------

                string lastsmsreportdirectory = datadirectory + DirectorySeparator + "lastsmsreport";
                DirectoryInfo lastsmsreportdi = new DirectoryInfo(lastsmsreportdirectory);
                if (!lastsmsreportdi.Exists) lastsmsreportdi.Create();
                lastsmsreportfilename = lastsmsreportdirectory + DirectorySeparator + "lastsmsreport.txt";
                FileInfo lastsmsreportfi = new FileInfo(lastsmsreportfilename);
                if (!lastsmsreportfi.Exists)
                {
                    StreamWriter sw = lastsmsreportfi.CreateText();
                    sw.WriteLine(lastreportkey + "=" + lastreportsmssuccessmsg);
                    sw.Close();
                }
                

                //----------------------------------------------------------------------------------------------
                LogHelper.WriteLine(ELogLevel.log, "");
                LogHelper.WriteLine(ELogLevel.log, "starting satellite version : " + _signature);

             
                
                string versiondir = datadirectory + DirectorySeparator + "version";
                string commanddir = datadirectory + DirectorySeparator + "command";
                //string programfilename = parameters[param_program_filename];
                string scriptshupdate = parameters[param_script_sh_update];

                //OPTIONAL FORCE ICCID-----------------------------------------------
                string forceiccid=null;
                if (parameters.ContainsKey(param_force_iccid))
                {
                    forceiccid = parameters[param_force_iccid];
                }
                //-------------------------------------------------------------------

                queueserialread = new Queue(queueserialreadpath, rpimode, enable_backup_queue);
                if (!queueserialread.clean())
                {
                    ManagerError(EReportErrorCode.InternalError, queueserialread.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                queuecds = new Queue(queuecdspath, rpimode, enable_backup_queue);
                singletondirectack = new Singleton(queuedirectackpath, rpimode);
                if (!singletondirectack.CleanIfNotFill())
                {
                    ManagerError(EReportErrorCode.InternalError, singletondirectack.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                queuehttperror = new Queue(queuehttperrorpath, rpimode, enable_backup_queue);
                queuereceivedsms = new QueueInbound(queuereceivedsmspath, rpimode, enable_backup_queue);
                queueecho = new Queue(queueechopath, rpimode, enable_backup_queue);
                
                queuesms = new Queue(queuesmspath, rpimode, enable_backup_queue);
                if (!queuesms.clean())
                {
                    ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                SmsShieldWrapper wrapper = new SmsShieldWrapper(queueserialread);

                LogHelper.WriteLine(ELogLevel.log, "opening AT connexion on port " + portname + " ...");
                if (!wrapper.Open(portname, serialreadtimeoutsec))
                {
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }
                serialport = wrapper.wrapper.wrapper.port;

                //timeout only for checkalive----------------
                wrapper.ReadTimeout = queuealivereadtimeoutsec * 1000;

                ThreadStart ts2 = new ThreadStart(SerialRead);
                Thread t2 = new Thread(ts2);
                t2.Start();
                Thread.Sleep(1000); //waiting serialread thread...


                #region checkalive
                LogHelper.WriteLine(ELogLevel.log, "checking is AT alive...");
                int checkalivecounter = 0;
                bool powerondone = false;
                while (true)
                {
                    if (!wrapper.CheckAlive())
                    {
                        if (checkalivecounter > 5)
                        {
                            LogHelper.WriteLine(ELogLevel.log, "waiting alive : retry exceeded");
                            //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                            ManagerError(EReportErrorCode.SmsShieldError, "alive retry exceeded:" + wrapper.ErrorMessage.ToString());
                            TryQuitting(rpimode, true);
                        }
                        else
                        {
                            if (rpimode && !powerondone)
                            {
                                LogHelper.WriteLine(ELogLevel.log, "trying PowerOnOff...");
                                GpioWrapper.PowerOnOff();
                                powerondone = true;
                            }

                            LogHelper.WriteLine(ELogLevel.log, "waiting shield alive - retry : " + checkalivecounter);
                            checkalivecounter++;
                        }
                    }
                    else
                    {
                        break;
                    }
                }
                #endregion

                if(false) // we doubt that the commands hereunder were useful
                {
                    wrapper.ReadTimeout = queuereadtimeoutsec * 1000;
                    LogHelper.WriteLine(ELogLevel.log, "resetting modem");
                    if (!wrapper.ResetModem())
                    {
                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                        TryQuitting(rpimode, true);
                    }

                    LogHelper.WriteLine(ELogLevel.log, "resetting device");
                    if (!wrapper.ResetDevice())
                    {
                        //System.Console.WriteLine("error : " + wrapper.ErrorMessage.ToString());
                        //if (rpimode) GpioWrapper.PowerOnOff();
                        //return 0;

                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                        TryQuitting(rpimode, true);
                    }

                    //waiting after reset device!----------------------------
                    //LogHelper.WriteLine(ELogLevel.log, "waiting reset (10 sec...)");
                    //Thread.Sleep(10 * 1000);
                    #region checkaliveafterreset
                    wrapper.ReadTimeout = queuealivereadtimeoutsec * 1000;
                    LogHelper.WriteLine(ELogLevel.log, "checking is AT alive after reset...");
                    checkalivecounter = 0;
                    while (true)
                    {
                        if (!wrapper.CheckAlive())
                        {
                            if (checkalivecounter > 5)
                            {
                                LogHelper.WriteLine(ELogLevel.log, "waiting alive after reset : retry exceeded");
                                ManagerError(EReportErrorCode.SmsShieldError, "alive retry exceeded:" + wrapper.ErrorMessage.ToString());
                                TryQuitting(rpimode, true);
                            }
                            else
                            {
                                LogHelper.WriteLine(ELogLevel.log, "waiting shield alive after reset - retry : " + checkalivecounter);
                                checkalivecounter++;
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                    #endregion
                    //-------------------------------------------------------
                }

                //timeout for all serial read
                wrapper.ReadTimeout = queuereadtimeoutsec * 1000;

                LogHelper.WriteLine(ELogLevel.log, "setting echo off");
                if (!wrapper.SetEcho(false))
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                iccid = wrapper.GetICCID();
                if (iccid==null)
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }
                else if (iccid.Equals(""))
                {
                    ManagerError(EReportErrorCode.SmsShieldError, "le numéro ICCID est vide");
                    TryQuitting(rpimode, true);
                }

                //force ICCID if needed--------
                if (forceiccid != null)
                {
                    iccid = forceiccid;
                }
                //-----------------------------

                
                LogHelper.WriteLine(ELogLevel.log, "iccid =" + iccid);
                

                #region mode ICCID
                //, on affiche juste le ICCID puis on sort du programme------------------------------
                if (modeiccid)
                {
                    System.Console.WriteLine("ICCID=" + iccid);
                    if (rpimode) GpioWrapper.PowerOnOff();
                    return 0;
                }
                #endregion
                #region mode lock
                // mode lock -----------------------------------------------------------------------------------
                else if (modelock)
                {
                    bool islocked;
                    LogHelper.WriteLine(ELogLevel.log, "getting sim status");
                    if (!wrapper.GetLock(out islocked))
                    {
                        System.Console.WriteLine("error : "+wrapper.ErrorMessage.ToString());
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    if (islocked)
                    {
                        System.Console.WriteLine("warning : sim is already locked!");
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    LogHelper.WriteLine(ELogLevel.log, "enable lock sim");
                    if (!wrapper.SetLock(true, lockcode))
                    {
                        System.Console.WriteLine("error : " + wrapper.ErrorMessage.ToString());
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    LogHelper.WriteLine(ELogLevel.log, "resetting device");
                    if (!wrapper.ResetDevice())
                    {
                        System.Console.WriteLine("error : " + wrapper.ErrorMessage.ToString());
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    
                    System.Console.WriteLine("success : sim has been locked");
                    if (rpimode) GpioWrapper.PowerOnOff();
                    return 0;
                    
                }
                #endregion
                #region mode unlock
                // mode unlock -----------------------------------------------------------------------------------
                else if (modeunlock)
                {
                    bool islocked;
                    LogHelper.WriteLine(ELogLevel.log, "getting sim status");
                    if (!wrapper.GetLock(out islocked))
                    {
                        System.Console.WriteLine("error : " + wrapper.ErrorMessage.ToString());
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    if (!islocked)
                    {
                        System.Console.WriteLine("warning : sim is already unlocked!");
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    LogHelper.WriteLine(ELogLevel.log, "unlocking sim pin");
                    if (!wrapper.SetCode(lockcode))
                    {
                        System.Console.WriteLine("error : " + wrapper.ErrorMessage.ToString());
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    LogHelper.WriteLine(ELogLevel.log, "disable lock sim");
                    if (!wrapper.SetLock(false, lockcode))
                    {
                        System.Console.WriteLine("error : " + wrapper.ErrorMessage.ToString());
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    LogHelper.WriteLine(ELogLevel.log, "resetting device");
                    if (!wrapper.ResetDevice())
                    {
                        System.Console.WriteLine("error : " + wrapper.ErrorMessage.ToString());
                        if (rpimode) GpioWrapper.PowerOnOff();
                        return 0;
                    }
                    
                    System.Console.WriteLine("success : sim has been unlocked");
                    if (rpimode) GpioWrapper.PowerOnOff();
                    return 0;
                    
                }
                #endregion
                //----------------------------------------------------------------------------------------------

                //LogHelper.WriteLine(ELogLevel.log, "setting encoding GSM...");
                //if (!wrapper.SetEncodingGSM())
                //{
                //    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                //    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                //    TryQuitting(rpimode, true);
                //}
                LogHelper.WriteLine(ELogLevel.log, "setting encoding UCS2...");
                if (!wrapper.SetEncodingUCS2())
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                LogHelper.WriteLine(ELogLevel.log, "setting text format...");
                if (sendpdu == receivepdu)
                {
                    if (!wrapper.SetTextMessageFormat(!sendpdu))
                    {
                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                        TryQuitting(rpimode, true);
                    }
                }

                LogHelper.WriteLine(ELogLevel.log, "setting message no indication...");
                if (!wrapper.SetTextMessageNoIndication())
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                LogHelper.WriteLine(ELogLevel.log, "setting text mode parameter...");
                if (!wrapper.SetTextModeParameter())
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                if (band.Equals(DEFAULTband4disable))
                {
                    LogHelper.WriteLine(ELogLevel.log, "setting mobile band is disabled");
                }
                else
                {
                    LogHelper.WriteLine(ELogLevel.log, "setting mobile band...");
                    if (!wrapper.SetBand(band))
                    {
                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                        TryQuitting(rpimode, true);
                    }
                }

                #region network registration
                //REGISTRATION--------------------------------------------------------------------------
                LogHelper.WriteLine(ELogLevel.log, "waiting network registration...");
                SmsShieldWrapper.ENetworkRegistred registredstatut;
                int waitingregistrationcounter = 0;
                while (true)
                {
                    if (!wrapper.IsNetworkRegistred(out registredstatut))
                    {
                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                        TryQuitting(rpimode, true);
                    }
                    else
                    {
                        if (registredstatut == SmsShieldWrapper.ENetworkRegistred.Registred)
                        {
                            break;
                        }
                        else if ((registredstatut == SmsShieldWrapper.ENetworkRegistred.Searching)
                                    || (registredstatut == SmsShieldWrapper.ENetworkRegistred.Unknown))
                        {
                            if (waitingregistrationcounter > registrationtimeoutcounter)
                            {

                                //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : registration waiting exceeded");
                                ManagerError(EReportErrorCode.SmsShieldError, "registration waiting timeout exceeded");
                                TryQuitting(rpimode, true);
                            }
                            else
                            {
                                LogHelper.WriteLine(ELogLevel.log, "waiting registration : " + waitingregistrationcounter);
                                waitingregistrationcounter++;
                                Thread.Sleep(1000);
                            }
                        }
                        else
                        {
                            //LogHelper.WriteLine(ELogLevel.info, "failure : registration invalid status :" + registredstatut.ToString());
                            ManagerError(EReportErrorCode.SmsShieldError, "registration returned invalid status :" + registredstatut.ToString());
                            TryQuitting(rpimode, true);
                        }

                    }
                }
                #endregion

                LogHelper.WriteLine(ELogLevel.log, "setting sim storage...");
                if (!wrapper.SetSimStorage())
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                if (!wrapper.SetGsmBusy())
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }

                if (!wrapper.SetTextModeParameters(true))
                {
                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                    TryQuitting(rpimode, true);
                }


                #region getsignal
                int getsignalqualityretrycounter = 0;
                while (true)
                {
                    int currentsignalquality = wrapper.GetSignalQuality();
                    if (currentsignalquality == -1)
                    {
                        if (getsignalqualityretrycounter >= 0)
                        {
                            //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                            ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                            TryQuitting(rpimode, true);
                        }
                        else
                        {
                            LogHelper.WriteLine(ELogLevel.log, "signal quality:error => retry " + getsignalqualityretrycounter + "... ");
                            getsignalqualityretrycounter++;
                            Thread.Sleep(1000);
                        }
                    }
                    else
                    {
                        LogHelper.WriteLine(ELogLevel.log, "signal quality=" + currentsignalquality);
                        if (forcesignal)
                        {
                            lastsignalquality = forcesignalvalue;
                        }
                        else
                        {
                            lastsignalquality = currentsignalquality;
                        }
                        break;
                    }
                }
                #endregion

                #region gettemperature & voltage
                if (rpimode)
                {
                    //check temperature
                    int t = GpioWrapper.ReadCpuTemperature();
                    if (t == -1)
                    {
                        ManagerError(EReportErrorCode.InternalError, "while reading temperature");
                        TryQuitting(rpimode, true);
                    }
                    else
                    {
                        currentcputemp = t;
                        LogHelper.WriteLine(ELogLevel.log, "cpu temperature=" + t.ToString());
                    }
                }


                //check voltage------------------------------------------------------------------
                bool? v = GpioWrapper.CheckVoltage(rpimode);
                if (!v.HasValue)
                {
                    ManagerError(EReportErrorCode.InternalError, "while reading voltage");
                    TryQuitting(rpimode, true);
                }
                else
                {
                    currentpowerstatus = v.Value;
                    LogHelper.WriteLine(ELogLevel.log, "check voltage=" + v.Value.ToString());
                }
                #endregion

                //simphonenumber = "32475982620";

                #region send STARTED sms
                if (enablereportingsms)
                {
                    string binversion = FileHelper.GetInformationFromFilename(versiondir,defaultversiondate);
                    if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(-1, defaultreportsmsphonenumber, nickname + " : STARTED (ver=" + binversion + ",sign=" + _signature + ") at " + DateTime.Now.ToString("HH:mm:ss dd/MM/yyyy", CultureInfo.InvariantCulture), MobEncoding.ascii)))
                    {
                        ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                        TryQuitting(rpimode, true);
                    }
                }
                #endregion

                #region main loop
                //string commandfromalive = null;
                int sendsmsgroupeindex = 0;

                int sendingerrorcounter = 0;
                while (true)
                {
                    //check voltage before loop---------------------------------------
                    bool? voltage = GpioWrapper.CheckVoltage(rpimode);
                    if (!voltage.HasValue)
                    {
                        ManagerError(EReportErrorCode.InternalError, "while reading voltage");
                        TryQuitting(rpimode, true);
                    }
                    else
                    {
                        currentpowerstatus = voltage.Value;
                        LogHelper.WriteLine(ELogLevel.info, "check voltage before loop=" + voltage.Value.ToString());
                        if (voltage.Value)
                        {
                            //HTTP BLOC -------------------------------------------------------------------------------------------------------    
                            IServiceClient proxy;
                            if (enablegprs)
                                proxy = ServiceFactory.GetProxy(gateway_server, gateway_proxy_timeout_sec, wrapper, internetgatewayip);
                            else
                                proxy = ServiceFactory.GetProxy(gateway_server, gateway_proxy_timeout_sec, null, internetgatewayip);

                            if (!proxy.Open())
                            {
                                ManagerError(EReportErrorCode.InternalError, proxy.GetErrorMessage());
                                TryQuitting(rpimode, true);
                            }

                            #region mise à jour bin ------------------------------------------------------------------------------
                            string commandfromalive1 = FileHelper.GetInformationFromFilename(commanddir, defaultcommand);
                            if (commandfromalive1.Equals("update"))
                            {
                                FileHelper.SetInformationIntoFilename(commanddir, defaultcommand);

                                LogHelper.WriteLine(ELogLevel.log, "getting last binary version...");

                                //byte[] downloadfilecontent;
                                //string downloadfilename;
                                GetBinaryResponse getbinaryresponse = proxy.GetBinary(iccid);
                                if (getbinaryresponse.ret == EServiceClientReturnCode.InternalError)
                                {
                                    EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(getbinaryresponse.ret);
                                    ManagerError(targetcode, proxy.GetErrorMessage());
                                    TryQuitting(rpimode, true);
                                    SendSmsReport(true, "");
                                }
                                else if (getbinaryresponse.ret == EServiceClientReturnCode.NetworkError)
                                {
                                    LogHelper.WriteLine(ELogLevel.error, getbinaryresponse.ret.ToString() + ": error while calling gateway.update : " + proxy.GetErrorMessage());
                                    SendSmsReport(false, proxy.GetErrorMessage());
                                }
                                else if (getbinaryresponse.ret == EServiceClientReturnCode.GatewayError)
                                {
                                    EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(getbinaryresponse.ret);
                                    ManagerError(targetcode, proxy.GetErrorMessage());
                                    SendSmsReport(true, "");
                                }
                                else //success
                                {
                                    SendSmsReport(true, "");

                                    LogHelper.WriteLine(ELogLevel.log, "updating version");
                                    string newversion = getbinaryresponse.filename.Substring(0, 8);
                                    FileHelper.SetInformationIntoFilename(versiondir, newversion);
                                    //binversion = newversion;
                                    //binversion = FileHelper.GetBinVersion(versiondir);

                                    //update_bin_mode = 0 => download in release directory + call script.sh + exit-------------------
                                    if (update_bin_mode == 0)
                                    {
                                        LogHelper.WriteLine(ELogLevel.log, "overriding release binary file (release directory)...");
                                        string releasedirectory = datadirectory + DirectorySeparator + "release";
                                        DirectoryInfo direlease = new DirectoryInfo(releasedirectory);
                                        if (!direlease.Exists) direlease.Create();

                                        string binaryfilename = releasedirectory + DirectorySeparator + "smsbox.exe";
                                        FileStream fsbinary = new FileStream(binaryfilename, FileMode.Create);
                                        fsbinary.Write(getbinaryresponse.content, 0, getbinaryresponse.content.Length);
                                        fsbinary.Close();

                                        if (rpimode)
                                        {
                                            LogHelper.WriteLine(ELogLevel.log, "starting override script...");
                                            //string redirection = logdirectory + DirectorySeparator + "script_sh_update.log";
                                            //string cmd = scriptshupdate + " >> " + redirection;
                                            //Process.Start("sudo", cmd);
                                            LogHelper.WriteLine(ELogLevel.log, "command : sudo " + scriptshupdate);
                                            if (!StartAndWaitProcess("sudo", scriptshupdate))
                                            {
                                                LogHelper.WriteLine(ELogLevel.error, "error while executing scriptshupdate");
                                            }
                                        }
                                        else
                                        {
                                            LogHelper.WriteLine(ELogLevel.log, "no override script because windows mode !");
                                        }

                                        TryQuitting(rpimode, false);
                                    }
                                    //update_bin_mode = 1 => download in bin directory +exit--------------------------------------
                                    else if (update_bin_mode == 1)
                                    {
                                        LogHelper.WriteLine(ELogLevel.log, "overriding binary file (bin directory)...");
                                        string bindirectory = rootdirectory + DirectorySeparator + "bin";
                                        //DirectoryInfo direlease = new DirectoryInfo(releasedirectory);
                                        //if (!direlease.Exists) direlease.Create();

                                        string binaryfilename = bindirectory + DirectorySeparator + "smsbox.exe";
                                        FileStream fsbinary = new FileStream(binaryfilename, FileMode.Create);
                                        fsbinary.Write(getbinaryresponse.content, 0, getbinaryresponse.content.Length);
                                        fsbinary.Close();

                                        TryQuitting(rpimode, false);
                                    }
                                    //update_bin_mode = 2 => download in release directory + reboot--------------------------
                                    else // else if (update_bin_mode==2) //?
                                    {
                                        LogHelper.WriteLine(ELogLevel.log, "overriding release binary file (release directory)...");
                                        string releasedirectory = datadirectory + DirectorySeparator + "release";
                                        DirectoryInfo direlease = new DirectoryInfo(releasedirectory);
                                        if (!direlease.Exists) direlease.Create();

                                        string binaryfilename = releasedirectory + DirectorySeparator + "smsbox.exe";
                                        FileStream fsbinary = new FileStream(binaryfilename, FileMode.Create);
                                        fsbinary.Write(getbinaryresponse.content, 0, getbinaryresponse.content.Length);
                                        fsbinary.Close();

                                        TryQuitting(rpimode, false, EExitMode.reboot);
                                    }
                                }
                            }
                            #endregion

                            #region gestion des erreur http ------------------------------------
                            LogHelper.WriteLine(ELogLevel.info, "reading queue http error....");
                            while (true)
                            {
                                string line;
                                string httperrorfilename;
                                if (!queuehttperror.getWithoutDelete(out line, out httperrorfilename))
                                {
                                    ManagerError(EReportErrorCode.InternalError, queuehttperror.ErrorMessage.ToString());
                                    TryQuitting(rpimode, true);
                                }
                                else
                                {
                                    if (line == null)
                                    {
                                        break;
                                    }
                                    else
                                    {
                                        if (line.Equals(""))
                                        {
                                            //empty file!
                                            queuehttperror.DeleteFile(httperrorfilename);
                                            ManagerError(EReportErrorCode.InternalError, "empty file found in http error queue");
                                        }
                                        else
                                        {
                                            string[] httperrorstructure = line.Split(new string[] { stringseparator }, StringSplitOptions.None);
                                            int currentlastsignalquality = Int32.Parse(httperrorstructure[0]);
                                            string serrorcode = httperrorstructure[1];
                                            string msg = httperrorstructure[2];
                                            int operatorid = Int32.Parse(httperrorstructure[3]);

                                            LogHelper.WriteLine(ELogLevel.log, "sending report error to server : " + serrorcode + " - " + msg);

                                            //ServiceClient proxy = ServiceFactory.GetProxy(gateway_server, gateway_proxy_timeout_sec);
                                            EServiceClientReturnCode sendreportstatut = proxy.SendReportError(iccid, currentlastsignalquality, serrorcode, msg, operatorid, currentcputemp, currentpowerstatus);
                                            if (sendreportstatut == EServiceClientReturnCode.Success)
                                            {
                                                LogHelper.WriteLine(ELogLevel.log, "report error sent to gateway");
                                                queuehttperror.DeleteFile(httperrorfilename);
                                                SendSmsReport(true, "");
                                            }
                                            else if (sendreportstatut == EServiceClientReturnCode.GatewayError)
                                            {
                                                LogHelper.WriteLine(ELogLevel.error, "GatewayError: error while sending report error to gateway : " + proxy.GetErrorMessage());
                                                queuehttperror.DeleteFile(httperrorfilename);
                                                SendSmsReport(true, "");
                                            }
                                            else if (sendreportstatut == EServiceClientReturnCode.InternalError)
                                            {
                                                EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(sendreportstatut);
                                                ManagerError(targetcode, proxy.GetErrorMessage());
                                                TryQuitting(rpimode, true);
                                                SendSmsReport(true, "");
                                            }
                                            else //EServiceClientReturnCode.NetworkError
                                            {
                                                LogHelper.WriteLine(ELogLevel.error, sendreportstatut.ToString() + ": error while calling gateway.log : " + proxy.GetErrorMessage());
                                                SendSmsReport(false, proxy.GetErrorMessage());
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            LogHelper.WriteLine(ELogLevel.info, "end of reading queue direct ack");
                            #endregion

                            #region gestion des direct ACK -------------------------------------
                            LogHelper.WriteLine(ELogLevel.info, "reading queue direct ack....");

                            string[] content;
                            if (!singletondirectack.getWithoutDelete(out content))
                            {
                                ManagerError(EReportErrorCode.InternalError, singletondirectack.ErrorMessage.ToString());
                                TryQuitting(rpimode, true);
                            }
                            else
                            {
                                if (content == null)
                                {
                                    //rien à faire
                                }
                                else
                                {
                                    //if empty file!
                                    if ((content.Length == 1) && (string.IsNullOrEmpty(content[0])))
                                    {
                                        singletondirectack.DeleteFile();
                                        ManagerError(EReportErrorCode.InternalError, "empty file found in direct ack queue");
                                    }
                                    else if ((!string.IsNullOrEmpty(content[0])) && (!string.IsNullOrEmpty(content[1])))
                                    {
                                        // +CMGS

                                        int smsfromserveurid = Int32.Parse(content[0]);

                                        //serveurid=-1 : SMS ne venant pas de la queue!, donc pas besoin d'envoyer un feedback
                                        if (smsfromserveurid == -1)
                                        {
                                            singletondirectack.DeleteFile();
                                        }
                                        else
                                        {
                                            int messageid = Int32.Parse(content[1]);
                                            string smsfromserveurnumero = content[2];
                                            int status = Int32.Parse(content[3]);

                                            //LogHelper.WriteLine(ELogLevel.warning, "feedback direct ack : mobminderid= " + smsfromserveurid + ", msgid=" + messageid + ", status=" + status + ", numero=" + smsfromserveurnumero);
                                            EServiceClientReturnCode updatestatusreturncode = proxy.UpdateSmsStatus(iccid, smsfromserveurid, messageid, smsfromserveurnumero, status);

                                            if (updatestatusreturncode == EServiceClientReturnCode.InternalError)
                                            {
                                                EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(updatestatusreturncode);
                                                ManagerError(targetcode, proxy.GetErrorMessage(), messageid);
                                                TryQuitting(rpimode, true);
                                                SendSmsReport(true, "");
                                            }
                                            else if (updatestatusreturncode == EServiceClientReturnCode.NetworkError)
                                            {
                                                LogHelper.WriteLine(ELogLevel.error, updatestatusreturncode.ToString() + ": error while calling gateway.feedback : " + proxy.GetErrorMessage());
                                                SendSmsReport(false, proxy.GetErrorMessage());

                                                //on est obligé de libéré le singleton ! sinon impossible d'envoyer un autre sms en cas de problème d'appel à l'api
                                                singletondirectack.DeleteFile();

                                            }
                                            else if (updatestatusreturncode == EServiceClientReturnCode.GatewayError)
                                            {
                                                EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(updatestatusreturncode);
                                                ManagerError(targetcode, proxy.GetErrorMessage(), messageid);
                                                singletondirectack.DeleteFile();
                                                SendSmsReport(true, "");
                                            }
                                            else //success
                                            {
                                                singletondirectack.DeleteFile();
                                                SendSmsReport(true, "");
                                            }
                                        }
                                    }
                                    else
                                    {
                                        //message id toujours = -1, donc ne pas traiter le message car le +CMGS n'a pas encore été récupéré!
                                    }
                                }
                            }
                            LogHelper.WriteLine(ELogLevel.info, "end of reading queue direct ack");
                            #endregion

                            #region gestion des ACK --------------------------------------------
                            LogHelper.WriteLine(ELogLevel.info, "reading queue cds....");
                            while (true)
                            {
                                string line;
                                string ackfilename;
                                if (!queuecds.getWithoutDelete(out line, out ackfilename))
                                {
                                    ManagerError(EReportErrorCode.InternalError, queuecds.ErrorMessage.ToString());
                                    TryQuitting(rpimode, true);
                                }
                                else
                                {
                                    if (line == null)
                                    {
                                        break;
                                    }
                                    if (line.Equals(""))
                                    {
                                        //empty file!
                                        queuecds.DeleteFile(ackfilename);
                                        ManagerError(EReportErrorCode.InternalError, "empty file found in cds ack queue");
                                    }
                                    else
                                    {
                                        int index = -1;
                                        string numero = null;
                                        DateTime date = DateTime.MinValue;
                                        int msgid = -1;
                                        ESmsReportStatus gsmstatut = ESmsReportStatus.MessageRejected;

                                        bool parsed;
                                        if (!receivepdu)
                                        {
                                            MatchCollection matches = new Regex("((?<=\")[^\"]*(?=\"(,|$)+)|(?<=,|^)[^,\"]*(?=,|$))").Matches(line);
                                            if (matches.Count <= 1)
                                            {
                                                LogHelper.WriteLine(ELogLevel.info, "ACK CDS not sent : " + line);
                                                queuecds.DeleteFile(ackfilename);
                                                parsed = false;
                                            }
                                            else
                                            {
                                                index = Int32.Parse(matches[0].Value.Replace("+CDS: ", ""));
                                                numero = matches[2].Value;
                                                string sdate = matches[4].Value.Substring(0, 8);
                                                string stime = matches[4].Value.Substring(9, 8);
                                                date = DateTime.ParseExact(sdate + " " + stime, "yy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture);

                                                msgid = Int32.Parse(matches[1].Value);

                                                gsmstatut = (ESmsReportStatus)Int32.Parse(matches[6].Value);
                                                parsed = true;
                                            }
                                        }
                                        else //mode PDU
                                        {
                                            try
                                            {
                                                string[] tmp = line.Split(',');
                                                index = Int32.Parse(tmp[0].Replace("+CDS: ", ""));

                                                string statuspdu = tmp[1];

                                                SMSStatusReport statusreport = new SMSStatusReport();
                                                SMSStatusReport.Fetch(statusreport, ref statuspdu);

                                                numero = statusreport.PhoneNumber;
                                                date = statusreport.ReportTimeStamp;
                                                msgid = statusreport.MessageReference;
                                                gsmstatut = (ESmsReportStatus)statusreport.ReportStatus;


                                                parsed = true;
                                            }
                                            catch (Exception ex)
                                            {
                                                ManagerError(EReportErrorCode.InternalError, "parsing +CDS PDU :" + ex.Message);
                                                parsed = false;
                                            }
                                        }

                                        if (parsed)
                                        {
                                            SmsShieldAck ack = new SmsShieldAck(index, date, numero, gsmstatut, msgid);

                                            string newnum;
                                            if (ack.numero.Length > 15)
                                            {
                                                newnum = UCSEncoding.HexStr2UnicodeStr(ack.numero);
                                            }
                                            else
                                            {
                                                newnum = ack.numero;
                                            }

                                            //LogHelper.WriteLine(ELogLevel.warning, "feedack second ack : mobminderid=-1, operatorid=" + ack.ackOriginalMessageId + ", status=" + ack.ackStatus + ", numero=" + newnum);
                                            //IServiceClient proxy = ServiceFactory.GetProxy(gateway_server, gateway_proxy_timeout_sec);
                                            EServiceClientReturnCode updatestatusreturncode = proxy.UpdateSmsStatus(iccid, -1, ack.ackOriginalMessageId, newnum, (int)ack.ackStatus);

                                            if (updatestatusreturncode == EServiceClientReturnCode.InternalError)
                                            {
                                                EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(updatestatusreturncode);
                                                ManagerError(targetcode, proxy.GetErrorMessage(), ack.ackOriginalMessageId);
                                                TryQuitting(rpimode, true);
                                                SendSmsReport(true, "");
                                            }
                                            else if (updatestatusreturncode == EServiceClientReturnCode.NetworkError)
                                            {
                                                LogHelper.WriteLine(ELogLevel.error, updatestatusreturncode.ToString() + ": error while calling gateway.feedback : " + proxy.GetErrorMessage());
                                                SendSmsReport(false, proxy.GetErrorMessage());
                                                break;
                                            }
                                            else if (updatestatusreturncode == EServiceClientReturnCode.GatewayError)
                                            {
                                                EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(updatestatusreturncode);
                                                ManagerError(targetcode, proxy.GetErrorMessage(), ack.ackOriginalMessageId);
                                                SendSmsReport(true, "");
                                                queuecds.DeleteFile(ackfilename);
                                            }
                                            else
                                            {
                                                queuecds.DeleteFile(ackfilename);
                                                SendSmsReport(true, "");
                                            }
                                        }
                                    }
                                }
                            }
                            LogHelper.WriteLine(ELogLevel.info, "end of reading queue cds");
                            #endregion

                            #region gestion des msg echo ---------------------------------------
                            LogHelper.WriteLine(ELogLevel.info, "reading queue echo....");
                            while (true)
                            {
                                string line;
                                if (!queueecho.get(out line))
                                {
                                    ManagerError(EReportErrorCode.InternalError, queueecho.ErrorMessage.ToString());
                                    TryQuitting(rpimode, true);
                                }
                                else
                                {
                                    if (line == null)
                                    {
                                        break;
                                    }
                                    else if (line.Equals(""))
                                    {
                                        //empty file!
                                        //rien à faire
                                        ManagerError(EReportErrorCode.InternalError, "empty file found in echo queue");
                                    }
                                    else
                                    {
                                        string[] echostructure = line.Split(new string[] { stringseparator }, StringSplitOptions.None);
                                        string numero = echostructure[0];
                                        string message = echostructure[1];

                                        EServiceClientReturnCode updatestatusreturncode = proxy.Echo(iccid, numero, message);

                                        if (updatestatusreturncode == EServiceClientReturnCode.InternalError)
                                        {
                                            EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(updatestatusreturncode);
                                            ManagerError(targetcode, proxy.GetErrorMessage());
                                            TryQuitting(rpimode, true);
                                            SendSmsReport(true, "");
                                        }
                                        else if (updatestatusreturncode == EServiceClientReturnCode.NetworkError)
                                        {
                                            LogHelper.WriteLine(ELogLevel.error, updatestatusreturncode.ToString() + ": error while calling gateway.echo : " + proxy.GetErrorMessage());
                                            SendSmsReport(false, proxy.GetErrorMessage());
                                            break;
                                        }
                                        else if (updatestatusreturncode == EServiceClientReturnCode.GatewayError)
                                        {
                                            //rien à faire
                                            SendSmsReport(true, "");
                                        }
                                        else //ok
                                        {
                                            //rien à faire
                                            SendSmsReport(true, "");
                                        }
                                    }
                                }
                            }
                            LogHelper.WriteLine(ELogLevel.info, "end of reading queue echo");
                            #endregion---

                            #region gestion des sms recu ---------------------------------------
                            LogHelper.WriteLine(ELogLevel.info, "reading queue received sms....");
                            while (true)
                            {
                                QIData line;
                                if (!queuereceivedsms.get(out line))
                                {
                                    ManagerError(EReportErrorCode.InternalError, queuereceivedsms.ErrorMessage.ToString());
                                    TryQuitting(rpimode, true);
                                }
                                else
                                {
                                    if (line == null)
                                    {
                                        break;
                                    }
                                    else if (line.Equals(""))
                                    {
                                        //rien à faire
                                        ManagerError(EReportErrorCode.InternalError, "empty file found in receive sms queue");
                                    }
                                    else
                                    {
                                        //string[] receivesmsstructure = line.Split(new string[] { stringseparator }, StringSplitOptions.None);
                                        //string numero = receivesmsstructure[0];
                                        //string message = receivesmsstructure[1];
                                        //string date = receivesmsstructure[2];
                                        //int nbpart = Int32.Parse(receivesmsstructure[3]);
                                        //int currentpart = Int32.Parse(receivesmsstructure[4]);
                                        //int groupindex = Int32.Parse(receivesmsstructure[5]);


                                        EServiceClientReturnCode sendreceivedsmsreturncode = proxy.SendReceivedSMS(iccid, line.numero, lastsignalquality, line.message, 1, 1, 0);

                                        if (sendreceivedsmsreturncode == EServiceClientReturnCode.InternalError)
                                        {
                                            EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(sendreceivedsmsreturncode);
                                            ManagerError(targetcode, proxy.GetErrorMessage());
                                            TryQuitting(rpimode, true);
                                            SendSmsReport(true, "");
                                        }
                                        else if (sendreceivedsmsreturncode == EServiceClientReturnCode.NetworkError)
                                        {
                                            LogHelper.WriteLine(ELogLevel.error, sendreceivedsmsreturncode.ToString() + ": error while calling gateway.inbound : " + proxy.GetErrorMessage());
                                            SendSmsReport(false, proxy.GetErrorMessage());
                                            break;
                                        }
                                        else if (sendreceivedsmsreturncode == EServiceClientReturnCode.GatewayError)
                                        {
                                            //rien à faire
                                            SendSmsReport(true, "");
                                        }
                                        else //ok
                                        {
                                            //rien à faire
                                            SendSmsReport(true, "");
                                        }

                                    }
                                }
                            }
                            LogHelper.WriteLine(ELogLevel.info, "end of reading queue received sms");
                            #endregion

                            #region recupération d'un sms à envoyer-----------------------------
                            if ((running) && (queuesms.isEmpty()) && (singletondirectack.isEmpty()))  //interdire envoi sms si queue sms et singleton directack ne sont pas vides!!!
                            {
                                #region getsignal
                                getsignalqualityretrycounter = 0;
                                while (true)
                                {
                                    //getsignal seulement si un sms est présent
                                    int currentsignalquality = wrapper.GetSignalQuality();
                                    if (currentsignalquality == -1)
                                    {
                                        if (getsignalqualityretrycounter == 0)
                                        {
                                            //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                            ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                            TryQuitting(rpimode, true);
                                        }
                                        else
                                        {
                                            LogHelper.WriteLine(ELogLevel.log, "signal quality:error => retry " + getsignalqualityretrycounter + "...");
                                            getsignalqualityretrycounter++;
                                            Thread.Sleep(1000);
                                        }
                                    }
                                    else
                                    {
                                        LogHelper.WriteLine(ELogLevel.log, "signal quality=" + currentsignalquality);
                                        if (forcesignal)
                                        {
                                            lastsignalquality = forcesignalvalue;
                                        }
                                        else
                                        {
                                            lastsignalquality = currentsignalquality;
                                        }
                                        break;
                                    }
                                }
                                #endregion

                                #region gettemperature & voltage
                                if (rpimode)
                                {
                                    //check temperature
                                    int t = GpioWrapper.ReadCpuTemperature();
                                    if (t == -1)
                                    {
                                        ManagerError(EReportErrorCode.InternalError, "while reading temperature");
                                        TryQuitting(rpimode, true);
                                    }
                                    else
                                    {
                                        currentcputemp = t;
                                        LogHelper.WriteLine(ELogLevel.info, "cpu temperature=" + t.ToString());
                                    }
                                }

                                //check voltage----------------------------------------------------------------------
                                voltage = GpioWrapper.CheckVoltage(rpimode);
                                if (!voltage.HasValue)
                                {
                                    ManagerError(EReportErrorCode.InternalError, "while reading voltage");
                                    TryQuitting(rpimode, true);
                                }
                                else
                                {
                                    currentpowerstatus = voltage.Value;
                                    LogHelper.WriteLine(ELogLevel.info, "check voltage=" + voltage.Value.ToString());

                                    //if (currentpowerstatus == false)
                                    //{
                                    //ManagerError(EReportErrorCode.InternalError, "low voltage occured - stopping process");
                                    //TryQuitting(rpimode, true);
                                    //}
                                }
                                
                                #endregion

                                List<ReceivedSms> listsmsfromserveur = new List<ReceivedSms>();

                                string binversion = FileHelper.GetInformationFromFilename(versiondir, defaultversiondate);

                                string commandfromalive2;
                                EServiceClientReturnCode getmessagestatus = proxy.GetSmsToSend(iccid, listsmsfromserveur, lastsignalquality, currentcputemp, currentpowerstatus, binversion, _signature, out commandfromalive2);
                                if (commandfromalive2 != null)
                                {
                                    FileHelper.SetInformationIntoFilename(commanddir, commandfromalive2);
                                }

                                if (getmessagestatus == EServiceClientReturnCode.InternalError)
                                {
                                    EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(getmessagestatus);
                                    ManagerError(targetcode, proxy.GetErrorMessage());
                                    TryQuitting(rpimode, true);
                                    SendSmsReport(true, "");
                                }
                                else if (getmessagestatus == EServiceClientReturnCode.NetworkError)
                                {
                                    LogHelper.WriteLine(ELogLevel.error, getmessagestatus.ToString() + ": error while calling gateway.alive : " + proxy.GetErrorMessage());
                                    SendSmsReport(false, proxy.GetErrorMessage());
                                }
                                else if (getmessagestatus == EServiceClientReturnCode.GatewayError)
                                {
                                    //on quitte car c'est trop violent! on ne peut rien faire d'autre ??? non, on quitte pas!
                                    EReportErrorCode targetcode = ConvertServiceClientReturnCodeToReportErrorCode(getmessagestatus);
                                    ManagerError(targetcode, proxy.GetErrorMessage());
                                    //TryQuitting(rpimode, true);
                                    SendSmsReport(true, "");
                                }
                                else //success
                                {
                                    if (listsmsfromserveur.Count > 0)
                                    {
                                        foreach (ReceivedSms smsfromserveur in listsmsfromserveur)
                                        {
                                            if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(smsfromserveur.serverid, smsfromserveur.numero, smsfromserveur.message, smsfromserveur.encoding)))
                                            {
                                                ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                                                TryQuitting(rpimode, true);
                                            }

                                            if (enablerefreshlag)
                                            {
                                                lagdelay = smsfromserveur.lag;
                                                LogHelper.WriteLine(ELogLevel.info, "next lag : " + lagdelay + "sec");
                                            }
                                            else
                                            {
                                                lagdelay = defaultlagdelay;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        //si pas de sms à envoyé, alors on utiliser le defaultlagdelay
                                        lagdelay = defaultlagdelay;
                                    }
                                    SendSmsReport(true, "");
                                }
                            }
                            //else
                            //{
                            //    //ne doit pas passer ici
                            //    LogHelper.WriteLine(ELogLevel.error, "tentative d'envoi d'un sms alors que la queue direct ack n'est pas vide!");
                            //}

                            if (!proxy.Close())
                            {
                                ManagerError(EReportErrorCode.InternalError, proxy.GetErrorMessage());
                                TryQuitting(rpimode, true);
                            }

                            #endregion

                            proxy = null;

                            //SMS BLOC --------------------------------------------------------------------------------------------------------

                            //check voltage before sending sms---------------------------------------
                            voltage = GpioWrapper.CheckVoltage(rpimode);
                            if (!voltage.HasValue)
                            {
                                ManagerError(EReportErrorCode.InternalError, "while reading voltage");
                                TryQuitting(rpimode, true);
                            }
                            else
                            {
                                currentpowerstatus = voltage.Value;
                                LogHelper.WriteLine(ELogLevel.info, "check voltage before sending sms=" + voltage.Value.ToString());
                                if (voltage.Value)
                                {
                                    #region envoi du SMS -----------------------------------------------
                                    //interdire envoi sms si le singleton direct ack n'est pas vide! il faut cloturer le sms précédent
                                    if (singletondirectack.isEmpty())
                                    {
                                        string smsline = null;
                                        if (!queuesms.get(out smsline))
                                        {
                                            ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                                            TryQuitting(rpimode, true);
                                        }
                                        //else if (smsline != null)
                                        //if not null And not empty
                                        else if (!string.IsNullOrEmpty(smsline))
                                        {
                                            LogHelper.WriteLine(ELogLevel.log, "1 sms found in queue!");

                                            //SmsShieldWrapper.ENetworkRegistred registredstatut;
                                            if (!wrapper.IsNetworkRegistred(out registredstatut))
                                            {
                                                ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                TryQuitting(rpimode, true);
                                            }
                                            else
                                            {
                                                LogHelper.WriteLine(ELogLevel.log, "current registration status : " + registredstatut.ToString());
                                            }

                                            string[] smsstructure = smsline.Split(new string[] { stringseparator }, StringSplitOptions.None);
                                            int smsserverid = Int32.Parse(smsstructure[0]);
                                            string smsnumero = smsstructure[1];
                                            if (!smsnumero.StartsWith("+"))
                                            {
                                                smsnumero = "+" + smsnumero;
                                            }
                                            string smsmessage = smsstructure[2];
                                            smsmessage = smsmessage.Replace("\\n", "" + (char)10);
                                            string encoding = smsstructure[3];


                                            bool sentreturncode = false;
                                            bool sentwithsuccess = false;

                                            //timeout for sending sms
                                            wrapper.ReadTimeout = queuesendsmstimeoutsec * 1000;

                                            DateTime dtstartofsendsms = DateTime.Now;

                                            if (!sendpdu)
                                            {
                                                LogHelper.WriteLine(ELogLevel.info, "sending in TXT mode");

                                                //string encodednum;
                                                //string encodedmsg;
                                                //if (modeucs2)
                                                //if (true)
                                                //{
                                                //if (!wrapper.SetEncodingUCS2())
                                                //{
                                                //    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                //    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                //    TryQuitting(rpimode, true);
                                                //}
                                                //encodednum = UCSEncoding.UnicodeStr2HexStr(smsnumero);
                                                //encodedmsg = UCSEncoding.UnicodeStr2HexStr(smsmessage);
                                                //encodednum = smsnumero;
                                                //encodedmsg = smsmessage;
                                                //}
                                                //else
                                                //{
                                                //if (!wrapper.SetEncodingGSM())
                                                //{
                                                //    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                //    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                //    TryQuitting(rpimode, true);
                                                //}
                                                //encodednum = smsnumero;
                                                //encodedmsg = smsmessage;
                                                //}

                                                string encodednum = UCSEncoding.UnicodeStr2HexStr(smsnumero);
                                                string encodedmsg = UCSEncoding.UnicodeStr2HexStr(smsmessage);

                                                if (sendpdu != receivepdu)
                                                {
                                                    if (!wrapper.SetTextMessageFormat(true))
                                                    {
                                                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                        TryQuitting(rpimode, true);
                                                    }
                                                }

                                                sentreturncode = wrapper.SendSms(encodednum, encodedmsg, out sentwithsuccess);
                                            }
                                            else
                                            {
                                                //smsmessage = "Xin chào tất cả các bạn. Mình không biết tiếng anh.";

                                                SMS.SMSEncoding pduformat;
                                                if (encoding.Equals("ucs2")) //UCS2 -----------------------------------------------------------------------
                                                {
                                                    pduformat = SmsBox.SMS.SMSEncoding.UCS2;

                                                    LogHelper.WriteLine(ELogLevel.log, "sending sms to " + smsnumero + ", message starts with : " + (smsmessage.Length <= 10 ? smsmessage : smsmessage.Substring(0, 10)) + "...");

                                                    if (sendpdu != receivepdu)
                                                    {
                                                        if (!wrapper.SetTextMessageFormat(false))
                                                        {
                                                            ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                            TryQuitting(rpimode, true);
                                                        }
                                                    }

                                                    if (smsmessage.Length <= 70)
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "sending in PDU mode in single part with encoding : " + encoding);
                                                        sentreturncode = wrapper.SendSmsPdu(smsnumero, smsmessage, null, out sentwithsuccess, -1, -1, -1, pduformat);
                                                    }
                                                    else
                                                    {
                                                        string fullmsg = smsmessage;
                                                        int currentpart = 1;

                                                        int packetsize = 67; //(140-6)/2

                                                        int modulo = fullmsg.Length % packetsize;
                                                        int nbpart = (fullmsg.Length - modulo) / packetsize;
                                                        if (modulo > 0) nbpart++;

                                                        sendsmsgroupeindex++;
                                                        if (sendsmsgroupeindex == 256) sendsmsgroupeindex = 0;

                                                        LogHelper.WriteLine(ELogLevel.log, "sending in PDU mode in multi parts (" + nbpart.ToString() + ") with encoding : " + encoding);

                                                        while (true)
                                                        {
                                                            if (string.IsNullOrEmpty(fullmsg))
                                                            {
                                                                break;
                                                            }
                                                            string currentmsg;
                                                            if (fullmsg.Length <= packetsize)
                                                            {
                                                                currentmsg = fullmsg;
                                                                fullmsg = null;
                                                            }
                                                            else
                                                            {
                                                                currentmsg = fullmsg.Substring(0, packetsize);
                                                                fullmsg = fullmsg.Substring(packetsize);
                                                            }

                                                            sentreturncode = wrapper.SendSmsPdu(smsnumero, currentmsg, null, out sentwithsuccess, sendsmsgroupeindex, nbpart, currentpart, pduformat);
                                                            if (!sentreturncode) break;
                                                            if (!sentwithsuccess) break;

                                                            currentpart++;
                                                        }
                                                    }


                                                }
                                                else //ASCII 7 ----------------------------------------------------------------------------------------------
                                                {
                                                    pduformat = SmsBox.SMS.SMSEncoding._7bit;
                                                    smsmessage = BspGSM7BitDecoder.CorrectUtf8String2BeReady4Ascii7GsmString(smsmessage);
                                                    byte[] msgsourceascii7 = BspGSM7BitDecoder.GSMChar(smsmessage);

                                                    LogHelper.WriteLine(ELogLevel.log, "sending sms to " + smsnumero + ", message starts with : " + (smsmessage.Length <= 10 ? smsmessage : smsmessage.Substring(0, 10)) + "...");

                                                    if (sendpdu != receivepdu)
                                                    {
                                                        if (!wrapper.SetTextMessageFormat(false))
                                                        {
                                                            ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                            TryQuitting(rpimode, true);
                                                        }
                                                    }

                                                    if (msgsourceascii7.Length <= 160)
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "sending in PDU mode in single part with encoding : " + encoding);

                                                        sentreturncode = wrapper.SendSmsPdu(smsnumero, null, msgsourceascii7, out sentwithsuccess, -1, -1, -1, pduformat);
                                                    }
                                                    else
                                                    {
                                                        byte[] fullmsg = (byte[])msgsourceascii7.Clone();
                                                        int currentpart = 1;

                                                        int packetsize = 153; // 153; //(160-7)

                                                        int modulo = fullmsg.Length % packetsize;
                                                        int nbpart = (fullmsg.Length - modulo) / packetsize;
                                                        if (modulo > 0) nbpart++;

                                                        sendsmsgroupeindex++;
                                                        if (sendsmsgroupeindex == 256) sendsmsgroupeindex = 0;

                                                        LogHelper.WriteLine(ELogLevel.log, "sending in PDU mode in multi parts (" + nbpart.ToString() + ") with encoding : " + encoding);

                                                        while (true)
                                                        {
                                                            if (fullmsg == null || fullmsg.Length == 0)
                                                            {
                                                                break;
                                                            }
                                                            byte[] currentmsg;
                                                            if (fullmsg.Length <= packetsize)
                                                            {
                                                                currentmsg = fullmsg;
                                                                fullmsg = null;
                                                            }
                                                            else
                                                            {
                                                                currentmsg = fullmsg.Take(packetsize).ToArray();
                                                                fullmsg = fullmsg.Skip(packetsize).ToArray();
                                                            }

                                                            sentreturncode = wrapper.SendSmsPdu(smsnumero, null, currentmsg, out sentwithsuccess, sendsmsgroupeindex, nbpart, currentpart, pduformat);
                                                            if (!sentreturncode) break;
                                                            if (!sentwithsuccess) break;



                                                            currentpart++;
                                                        }
                                                    }

                                                }


                                            }

                                            if (!sentreturncode) //technical return code = 
                                            {
                                                TimeSpan tsofsendsms = (DateTime.Now - dtstartofsendsms);
                                                LogHelper.WriteLine(ELogLevel.log, "sms sent (" + tsofsendsms.TotalSeconds + " sec) - return code = shield internal error : " + wrapper.ErrorMessage.ToString());
                                                ESmsReportStatus status = ESmsReportStatus.MessageTimeout;

                                                //if (smsserverid != -1) //only sms from queue
                                                //{
                                                //create direactack full mais en erreur!
                                                //on on ne recevras jamais de notification +CDS
                                                string[] directackstructure = new string[4];
                                                directackstructure[0] = smsserverid.ToString();
                                                directackstructure[1] = "-1";
                                                directackstructure[2] = smsnumero;
                                                directackstructure[3] = ((int)status).ToString();

                                                if (!singletondirectack.pushOrUpdate(directackstructure))
                                                {
                                                    ManagerError(EReportErrorCode.InternalError, singletondirectack.ErrorMessage.ToString());
                                                    TryQuitting(rpimode, true);
                                                }
                                                //}

                                                //on log l'erreur sur le serveur!
                                                ManagerError(EReportErrorCode.SmsShieldError, "timeout error while sending SMS to [" + smsnumero + "] : " + wrapper.ErrorMessage.ToString());

                                                sendingerrorcounter++;

                                                if (sendingerrorcounter >= sms_number_error_before_restart)
                                                {
                                                    ManagerError(EReportErrorCode.InternalError, "restarting software because sending error number = " + sendingerrorcounter);
                                                    TryQuitting(rpimode, true);
                                                }

                                            }
                                            else //technical return cde = false
                                            {
                                                if (sentwithsuccess) //logical return code = true (at return = OK)
                                                {
                                                    TimeSpan tsofsendsms = DateTime.Now - dtstartofsendsms;
                                                    LogHelper.WriteLine(ELogLevel.log, "sms sent (" + tsofsendsms.TotalSeconds + " sec) - return code = OK");
                                                    ESmsReportStatus status = ESmsReportStatus.MessageAccepted;

                                                    //if (smsserverid != -1) //only sms from queue
                                                    //{
                                                    string[] directackstructure = new string[4];
                                                    directackstructure[0] = smsserverid.ToString();
                                                    directackstructure[1] = null;
                                                    directackstructure[2] = smsnumero;
                                                    directackstructure[3] = ((int)status).ToString();

                                                    if (!singletondirectack.pushOrUpdate(directackstructure))
                                                    {
                                                        ManagerError(EReportErrorCode.InternalError, singletondirectack.ErrorMessage.ToString());
                                                        TryQuitting(rpimode, true);
                                                    }
                                                    //}

                                                    sendingerrorcounter = 0;
                                                }
                                                else //logical return code = false (at return = ERROR)
                                                {
                                                    TimeSpan tsofsendsms = DateTime.Now - dtstartofsendsms;
                                                    LogHelper.WriteLine(ELogLevel.log, "sms sent (" + tsofsendsms.TotalSeconds + " sec) - return code = ERROR");
                                                    ESmsReportStatus status = ESmsReportStatus.MessageRejected;

                                                    //if (smsserverid != -1) //only sms from queue
                                                    //{
                                                    //create direactack full mais en erreur!
                                                    //on on ne recevras jamais de notification +CDS
                                                    string[] directackstructure = new string[4];
                                                    directackstructure[0] = smsserverid.ToString();
                                                    directackstructure[1] = "-1";
                                                    directackstructure[2] = smsnumero;
                                                    directackstructure[3] = ((int)status).ToString();

                                                    if (!singletondirectack.pushOrUpdate(directackstructure))
                                                    {
                                                        ManagerError(EReportErrorCode.InternalError, singletondirectack.ErrorMessage.ToString());
                                                        TryQuitting(rpimode, true);
                                                    }
                                                    //}
                                                    //else
                                                    //{
                                                    //if (smsserverid == -1)
                                                    //{
                                                    ManagerError(EReportErrorCode.SmsShieldError, "operator error while sending SMS to [" + smsnumero + "] : return code = ERROR");
                                                    //}
                                                    sendingerrorcounter++;

                                                    if (sendingerrorcounter >= sms_number_error_before_restart)
                                                    {
                                                        ManagerError(EReportErrorCode.InternalError, "restarting software because sending error number = " + sendingerrorcounter);
                                                        TryQuitting(rpimode, true);
                                                    }

                                                }
                                            }

                                            //timeout for all serial read
                                            wrapper.ReadTimeout = queuereadtimeoutsec * 1000;


                                            //if (!wrapper.SetEncodingGSM())
                                            //{
                                            //    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                            //    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                            //    TryQuitting(rpimode, true);
                                            //}

                                        }
                                        else
                                        {
                                            if (smsline == null)
                                            {
                                                LogHelper.WriteLine(ELogLevel.log, "no sms to send");
                                                if (!running)
                                                {
                                                    break;
                                                }
                                            }
                                            else //smsline = "" = empty!
                                            {
                                                ManagerError(EReportErrorCode.InternalError, "empty file found in sending sms queue");

                                                LogHelper.WriteLine(ELogLevel.log, "no sms to send");
                                                if (!running)
                                                {
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        LogHelper.WriteLine(ELogLevel.log, "last direct ack has not been sent! sending sms is forbidden");
                                    }
                                    #endregion-------

                                    //check voltage before receiving sms---------------------------------------
                                    voltage = GpioWrapper.CheckVoltage(rpimode);
                                    if (!voltage.HasValue)
                                    {
                                        ManagerError(EReportErrorCode.InternalError, "while reading voltage");
                                        TryQuitting(rpimode, true);
                                    }
                                    else
                                    {
                                        currentpowerstatus = voltage.Value;
                                        LogHelper.WriteLine(ELogLevel.info, "check voltage before receiving sms=" + voltage.Value.ToString());
                                        if (voltage.Value)
                                        {
                                            #region reading sms ------------------------------------------------
                                            LogHelper.WriteLine(ELogLevel.info, "reading sms...");

                                            SmsShieldReceivedSms[] listsms;
                                            if (!receivepdu) //TXT MODE
                                            {
                                                LogHelper.WriteLine(ELogLevel.info, "receiving in TXT mode");
                                                if (sendpdu != receivepdu)
                                                {
                                                    if (!wrapper.SetTextMessageFormat(true))
                                                    {
                                                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                        TryQuitting(rpimode, true);
                                                    }
                                                }
                                                List<string> warnings = new List<string>();
                                                listsms = wrapper.ReadSms(warnings);
                                                if (warnings.Count > 0)
                                                {
                                                    foreach (string warning in warnings)
                                                    {
                                                        ManagerError(EReportErrorCode.SmsShieldError, warning);
                                                    }
                                                }
                                                if (listsms == null)
                                                {
                                                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                    TryQuitting(rpimode, true);
                                                }

                                                foreach (SmsShieldReceivedSms sms in listsms)
                                                {
                                                    if (sms.numero.Length > 15)
                                                    {
                                                        try
                                                        {
                                                            sms.numero = UCSEncoding.HexStr2UnicodeStr(sms.numero);
                                                        }
                                                        catch
                                                        {
                                                            LogHelper.WriteLine(ELogLevel.info, "HexStr2UnicodeStr : error when trying to parse numero");
                                                        }
                                                    }
                                                    //sinon pas de conversion car petit numéro!

                                                    try
                                                    {
                                                        sms.message = UCSEncoding.HexStr2UnicodeStr(sms.message);
                                                    }
                                                    catch
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.info, "HexStr2UnicodeStr : error when trying to parse message");
                                                    }

                                                }

                                            }
                                            else //PDU MODE
                                            {
                                                LogHelper.WriteLine(ELogLevel.info, "receiving in PDU mode");
                                                if (sendpdu != receivepdu)
                                                {
                                                    if (!wrapper.SetTextMessageFormat(false))
                                                    {
                                                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                        TryQuitting(rpimode, true);
                                                    }
                                                }
                                                List<string> warnings = new List<string>();
                                                listsms = wrapper.ReadSmsPdu(warnings);
                                                if (warnings.Count > 0)
                                                {
                                                    foreach (string warning in warnings)
                                                    {
                                                        ManagerError(EReportErrorCode.SmsShieldError, warning);
                                                    }
                                                }
                                                if (listsms == null)
                                                {
                                                    //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                    ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                    TryQuitting(rpimode, true);
                                                }
                                            }


                                            LogHelper.WriteLine(ELogLevel.info, "read sms counter = " + listsms.Length);

                                            if (listsms.Length != 0)
                                            {
                                                //si un message reçu, on force le lag à 1 seconde!------------------------
                                                lagdelay = 1;
                                                //------------------------------------------------------------------------

                                                bool callmobhalt = false;
                                                bool callmobrestart = false;
                                                bool callmobstop = false;
                                                string callmobiccidphoneback = null;
                                                string callmobwifi = null;
                                                string callmobwifiphoneback = null;

                                                foreach (SmsShieldReceivedSms sms in listsms)
                                                {
                                                    SmsToSend smstosend = new SmsToSend();
                                                    smstosend.date = sms.datereceived;

                                                    //never happen because check is already done at msg parsing
                                                    if (sms.message == null)
                                                        smstosend.message = "";
                                                    else
                                                        smstosend.message = sms.message;

                                                    smstosend.numero = sms.numero;

                                                    smstosend.nbpart = sms.nbpart;
                                                    smstosend.currentpart = sms.currentpart;
                                                    smstosend.groupeindex = sms.groupeindex;


                                                    if (smstosend.message.Equals("mobiccid"))
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "query from mobminder = " + smstosend.message);
                                                        callmobiccidphoneback = smstosend.numero;
                                                    }
                                                    else if (smstosend.message.StartsWith("mobreport="))
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "query from mobminder = " + smstosend.message);

                                                        defaultreportsmsphonenumber = smstosend.message.Replace("mobreport=", "");
                                                        List<KeyValuePair<string, string>> changes = new List<KeyValuePair<string, string>>();
                                                        changes.Add(new KeyValuePair<string, string>(param_key_reporting_number, defaultreportsmsphonenumber));
                                                        FileHelper.OverrideConfigFileKeyValue(configfilename, changes);
                                                    }
                                                    else if (smstosend.message.StartsWith("mobwifi"))
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "query from mobminder = " + smstosend.message);
                                                        callmobwifi = smstosend.message.Replace("mobwifi=", "");
                                                        callmobwifiphoneback = smstosend.numero;
                                                    }
                                                    else if (smstosend.message.Equals("oshalt"))
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "query from mobminder = " + smstosend.message);
                                                        callmobhalt = true;

                                                    }
                                                    else if (smstosend.message.Equals("osrestart"))
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "query from mobminder = " + smstosend.message);
                                                        callmobrestart = true;
                                                    }
                                                    else if (smstosend.message.Equals("smsboxstop"))
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "query from mobminder = " + smstosend.message);
                                                        callmobstop = true;
                                                    }
                                                    else if (smstosend.message.StartsWith("mobecho="))
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "query from mobminder = " + smstosend.message);
                                                        string echomsg = smstosend.message.Replace("mobecho=", "");
                                                        echomsg = echomsg.Replace("" + (char)10, "\\n");

                                                        List<string> echostructure = new List<string>();
                                                        echostructure.Add(sms.numero);
                                                        echostructure.Add(echomsg);
                                                        if (!queueecho.push(string.Join(stringseparator, echostructure.ToArray())))
                                                        {
                                                            ManagerError(EReportErrorCode.InternalError, queueecho.ErrorMessage.ToString());
                                                            TryQuitting(rpimode, true);
                                                        }
                                                    }
                                                    else //other messages
                                                    {
                                                        //try
                                                        //{
                                                        //    decodedmsg = UCSEncoding.HexStr2UnicodeStr(smstosend.message);

                                                        LogHelper.WriteLine(ELogLevel.log, "sms received from:" + smstosend.numero + ", message:" + smstosend.message);

                                                        //}
                                                        //catch
                                                        //{
                                                        //decodedmsg = smstosend.message;

                                                        //LogHelper.WriteLine(ELogLevel.log, "sms received from: " + smstosend.numero + "original message without decryption:" + decodedmsg);
                                                        //}

                                                        string decodedmsg = smstosend.message.Replace("" + (char)10, "\\n");

                                                        //List<string> receivesmsstructure = new List<string>();
                                                        //receivesmsstructure.Add(smstosend.numero);
                                                        //receivesmsstructure.Add(decodedmsg);
                                                        //receivesmsstructure.Add(smstosend.date.ToString(dateformat));
                                                        //receivesmsstructure.Add(smstosend.nbpart.ToString());
                                                        //receivesmsstructure.Add(smstosend.currentpart.ToString());
                                                        //receivesmsstructure.Add(smstosend.groupeindex.ToString());

                                                        string extension;
                                                        if (smstosend.nbpart == 1)
                                                        {
                                                            extension = CQIExtension.single;
                                                        }
                                                        else
                                                        {
                                                            if (smstosend.currentpart == smstosend.nbpart)
                                                            {
                                                                extension = CQIExtension.final;
                                                            }
                                                            else
                                                            {
                                                                extension = CQIExtension.part;
                                                            }
                                                        }

                                                        if (!queuereceivedsms.push(decodedmsg, smstosend.numero, smstosend.groupeindex, smstosend.nbpart, smstosend.currentpart, extension))
                                                        {
                                                            ManagerError(EReportErrorCode.InternalError, queuereceivedsms.ErrorMessage.ToString());
                                                            TryQuitting(rpimode, true);
                                                        }

                                                        if (!string.IsNullOrEmpty(reply_forbidden))
                                                        {
                                                            if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(-1, smstosend.numero, reply_forbidden, MobEncoding.ascii)))
                                                            {
                                                                ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                                                                TryQuitting(rpimode, true);
                                                            }
                                                        }
                                                    }
                                                }

                                                LogHelper.WriteLine(ELogLevel.info, "deleting all sms...");
                                                foreach (SmsShieldReceivedSms sms in listsms)
                                                {
                                                    LogHelper.WriteLine(ELogLevel.log, "deleting sms with index : " + sms.index);
                                                    if (!wrapper.DeleteSmsByIndex(sms.index))
                                                    {
                                                        //if (enabletrace) LogHelper.WriteLine(ELogLevel.info, "failure : " + wrapper.ErrorMessage);
                                                        ManagerError(EReportErrorCode.SmsShieldError, wrapper.ErrorMessage.ToString());
                                                        TryQuitting(rpimode, true);
                                                    }
                                                }

                                                if (callmobiccidphoneback != null)
                                                {
                                                    if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(-1, callmobiccidphoneback, iccid, MobEncoding.ascii)))
                                                    {
                                                        ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                                                        TryQuitting(rpimode, true);
                                                    }
                                                }
                                                else if (callmobwifi != null)
                                                {
                                                    string[] wifiparameters = callmobwifi.Split('/');
                                                    if (wifiparameters.Length != 3)
                                                    {
                                                        LogHelper.WriteLine(ELogLevel.log, "mobwifi failed, invalid parameter :" + callmobwifi);
                                                        if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(-1, callmobwifiphoneback, "mobwifi:invalid parameter!", MobEncoding.ascii)))
                                                        {
                                                            ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                                                            TryQuitting(rpimode, true);
                                                        }
                                                    }
                                                    else
                                                    {
                                                        List<KeyValuePair<string, string>> changes = new List<KeyValuePair<string, string>>();
                                                        changes.Add(new KeyValuePair<string, string>("ssid", "\"" + wifiparameters[0] + "\""));
                                                        changes.Add(new KeyValuePair<string, string>("psk", "\"" + wifiparameters[1] + "\""));
                                                        changes.Add(new KeyValuePair<string, string>("key_mgmt", wifiparameters[2]));
                                                        FileHelper.OverrideConfigFileKeyValue(wificonfigfilename, changes);

                                                        //------------------------------------------------------------------------------------------
                                                        if (rpimode)
                                                        {
                                                            string cmd = "wpa_cli -i wlan0 reconfigure";
                                                            LogHelper.WriteLine(ELogLevel.log, "update wifi settings : calling : " + cmd);
                                                            //Process p = Process.Start("ifconfig wlan0"); marche pas : ipconfig wlan02 up ou down...Etc..
                                                            //on force un start, non, reconfigure
                                                            //Process.Start("sudo", "shutdown -r now");
                                                            //Process.Start("sudo", cmd);
                                                            if (!StartAndWaitProcess("sudo", cmd))
                                                            {
                                                                ManagerError(EReportErrorCode.InternalError, "error while calling mobwifi");
                                                            }

                                                            if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(-1, callmobwifiphoneback, "mobwifi:success", MobEncoding.ascii)))
                                                            {
                                                                ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                                                                TryQuitting(rpimode, true);
                                                            }
                                                        }
                                                        //TryQuitting(rpimode, false);
                                                    }
                                                }
                                                else if (callmobhalt)
                                                {
                                                    TryQuitting(rpimode, false, EExitMode.halt);

                                                    //if (rpimode)
                                                    //{
                                                    //    //int messageid;
                                                    //    try
                                                    //    {
                                                    //        Process.Start("sudo", "halt");
                                                    //        TryQuitting(rpimode, false);
                                                    //    }
                                                    //    catch (Exception ex)
                                                    //    {
                                                    //        ManagerError(EReportErrorCode.InternalError, ex.Message);
                                                    //        LogHelper.WriteLine(ELogLevel.error, ex.StackTrace);
                                                    //    }
                                                    //}
                                                    //else
                                                    //{
                                                    //    LogHelper.WriteLine(ELogLevel.info, "rpimode=false:mobstop not implemented");
                                                    //}
                                                }
                                                else if (callmobrestart)
                                                {
                                                    TryQuitting(rpimode, false, EExitMode.reboot);

                                                    //if (rpimode)
                                                    //{
                                                    //int messageid;
                                                    //try
                                                    //{
                                                    //    Process.Start("sudo", "shutdown -r now");

                                                    //}
                                                    //catch (Exception ex)
                                                    //{
                                                    //    ManagerError(EReportErrorCode.InternalError, ex.Message);
                                                    //    LogHelper.WriteLine(ELogLevel.error, ex.StackTrace);
                                                    //}
                                                    //}
                                                    //else
                                                    //{
                                                    //    LogHelper.WriteLine(ELogLevel.info, "rpimode=false:mobrestart not implemented");
                                                    //}
                                                }
                                                else if (callmobstop)
                                                {
                                                    TryQuitting(rpimode, false);
                                                }
                                            }
                                            #endregion
                                        }
                                    }
                                }
                            }
                        }
                    }
                    LogHelper.WriteLine(ELogLevel.log, "waiting lag : " + lagdelay + " sec");
                    Thread.Sleep(lagdelay * 1000);
                    
                }
                #endregion

                if (rpimode) GpioWrapper.PowerOnOff();

                LogHelper.WriteLine(ELogLevel.log, "ending satellite with success...");

                if (exitmode==EExitMode.none)
                {
                    LogHelper.WriteLine(ELogLevel.log, "classic end without reboot or halt");
                }
                else if (exitmode==EExitMode.reboot)
                {
                    LogHelper.WriteLine(ELogLevel.log, "reboot requested!");

                    if (rpimode)
                    {
                        if (!StartAndWaitProcess("sudo", "shutdown -r now"))
                        {
                            LogHelper.WriteLine(ELogLevel.error, "error while executing shutdown -r now");
                        }
                    }
                    else
                    {
                        LogHelper.WriteLine(ELogLevel.log, "no reboot allowed in windows mode !");
                    }
                }
                else //halt
                {
                    LogHelper.WriteLine(ELogLevel.log, "halt requested!");

                    if (rpimode)
                    {
                        if (!StartAndWaitProcess("sudo", "halt"))
                        {
                            LogHelper.WriteLine(ELogLevel.error, "error while executing halt");
                        }
                    }
                    else
                    {
                        LogHelper.WriteLine(ELogLevel.log, "no halt allowed in windows mode !");
                    }
                }

                return 0;
            }
            catch (Exception ex)
            {
                string errorprefix = "Program.Main:";
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ManagerError(EReportErrorCode.InternalError,errorprefix + ex.Message);
                //Quit(rpimode, true);
                return 1;
            }
            finally
            {
                stoppreading = true;
                LogHelper.StopThread();
                LogHelper.WriteLine(ELogLevel.log, "end of main while");
            }
        }
        protected static void myHandler(object sender, ConsoleCancelEventArgs args)
        {
            LogHelper.WriteLine(ELogLevel.log, "\ncalling CancelKeyPress event : " + args.SpecialKey);
            args.Cancel = true;
            TryQuitting(rpimode, false);
        }
        private static EReportErrorCode ConvertServiceClientReturnCodeToReportErrorCode(EServiceClientReturnCode source)
        {
            EReportErrorCode target;
            switch (source)
            {
                case EServiceClientReturnCode.GatewayError: target = EReportErrorCode.GatewayEror; break;
                case EServiceClientReturnCode.InternalError: target = EReportErrorCode.InternalError; break;
                default: target = EReportErrorCode.NetworkError; break;
            }
            return target;
        }
        private static void ManagerError(EReportErrorCode errorcode, string msg,int operatorid=0)
        {
            LogHelper.WriteLine(ELogLevel.error, errorcode.ToString()+"-"+msg);

            List<string> httperrorstructure = new List<string>();
            httperrorstructure.Add(lastsignalquality.ToString());
            httperrorstructure.Add(errorcode.ToString());
            httperrorstructure.Add(msg);
            httperrorstructure.Add(operatorid.ToString());
            if (!queuehttperror.push(string.Join(stringseparator, httperrorstructure.ToArray())))
            {
                //pas de log ici!
                //ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                TryQuitting(rpimode, true);
            }
        }
        private static void SendSmsReport(bool wifiup,string additionalinformation)
        {
            if (!enablereportingsms) return;

            string lastvalue = FileHelper.LoadConfigFileKeyValue(lastsmsreportfilename, lastreportkey);
            string newvalue;
            if (wifiup)
            {
                newvalue = lastreportsmssuccessmsg;
            }
            else
            {
                try
                {
                    newvalue = lastreportsmsfailuremsg + " - " + additionalinformation.Substring(0, additionalinformation.IndexOf(':'));
                }
                catch
                {
                    //ne passe jamais ici!
                    newvalue = lastreportsmsfailuremsg + " - " + additionalinformation;
                }
            }

            string messagetosend = nickname + " : " + (wifiup ? lastreportsmssuccessmsg : (lastreportsmsfailuremsg+" - "+additionalinformation));

            //string newvalue = "ERROR: " + nickname + ": " + sendreportstatut.ToString() + "-" + errormsg;
            if (messagetosend.Length > 140) messagetosend = messagetosend.Substring(0, 140);
                
            if (lastvalue.Equals(newvalue))
            {
                //rien à faire car ideme dernier
                //LogHelper.WriteLine(ELogLevel.error, "no need to send sms report : " + newvalue);

                //reset
                countersmsreportcurrent = 0;
            }
            else
            {
                //send sms only if send report counter = max value!
                //for waiting X error or success before sending report sms
                countersmsreportcurrent++;
                if (countersmsreportcurrent == countersmsreportmax)
                {
                    countersmsreportcurrent = 0;

                    LogHelper.WriteLine(ELogLevel.error, "sending sms report : " + newvalue);

                    List<KeyValuePair<string, string>> changes = new List<KeyValuePair<string, string>>();
                    changes.Add(new KeyValuePair<string, string>(lastreportkey, newvalue));
                    FileHelper.OverrideConfigFileKeyValue(lastsmsreportfilename, changes);

                    if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(-1, defaultreportsmsphonenumber, messagetosend, MobEncoding.ascii)))
                    {
                        ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                        TryQuitting(rpimode, true);
                    }
                }
                
            }
            
        }
        private static void TryQuitting(bool rpimode, bool error, EExitMode exitmode_ = EExitMode.none )
        {
            exitmode = exitmode_;

            if (!error)
            {
                LogHelper.WriteLine(ELogLevel.log, "try quitting...");
                if (enablereportingsms)
                {
                    string msg = nickname +" : STOPPED at " + DateTime.Now.ToString("HH:mm:ss dd/MM/yyyy", CultureInfo.InvariantCulture);
                    if (!queuesms.push(QueueStructureHelper.CreateSmsQueueStructure(-1, defaultreportsmsphonenumber, msg, MobEncoding.ascii)))
                    {
                        //si erreur dans le push, alors on sort
                        ManagerError(EReportErrorCode.InternalError, queuesms.ErrorMessage.ToString());
                        LogHelper.WriteLine(ELogLevel.error, "ending satellite with error...");
                        if (rpimode) GpioWrapper.PowerOnOff();
                        System.Environment.Exit(1);
                    }
                }

                running = false;
            }
            else //si quit car erreur:
            {
                LogHelper.WriteLine(ELogLevel.error, "direct ending satellite with error...");
                if (rpimode) GpioWrapper.PowerOnOff();
                System.Environment.Exit(1);
            }
          
        }
        private static void SerialRead()
        {
            LogHelper.WriteLine(ELogLevel.log, "starting SerialRead thread...");
            string buffer = "";
            while (!stoppreading)
            {
                
                if (serialport.BytesToRead != 0)
                {
                    buffer += "" + (char)serialport.ReadChar();
                    //LogHelper.WriteLine(ELogLevel.info, "SerialRead buffering="+buffer);
                    
                    if (buffer.Equals("> "))
                    {
                        if (!queueserialread.push(buffer))
                        {
                            ManagerError(EReportErrorCode.InternalError, queueserialread.ErrorMessage.ToString());
                            TryQuitting(rpimode, true);
                        }
                        buffer = "";
                    }
                    else if (buffer.EndsWith("\r\n"))
                    {
                        buffer = buffer.Substring(0,buffer.Length-2);

                        #region if +CDS
                        if (buffer.StartsWith("+CDS"))
                        {
                            if (!receivepdu)
                            {
                                if (!queuecds.push(buffer))
                                {
                                    ManagerError(EReportErrorCode.InternalError, queuecds.ErrorMessage.ToString());
                                    TryQuitting(rpimode, true);
                                }
                            }
                            else //mode pdu
                            {
                                string cdspdu = serialport.ReadTo("\r\n");
                                string fullcds = buffer + "," + cdspdu;
                                if (!queuecds.push(fullcds))
                                {
                                    ManagerError(EReportErrorCode.InternalError, queuecds.ErrorMessage.ToString());
                                    TryQuitting(rpimode, true);
                                }
                            }
                        }
                        #endregion
                        #region else if +CMGS
                        else if (buffer.StartsWith("+CMGS:"))
                        {
                            try
                            {
                                int messageid = Int32.Parse(buffer.Replace("+CMGS: ", ""));

                                string[] content = new string[4];
                                content[0] = null;
                                content[1] = messageid.ToString();
                                content[2] = null;
                                content[3] = null;

                                if (!singletondirectack.pushOrUpdate(content))
                                {
                                    ManagerError(EReportErrorCode.InternalError, singletondirectack.ErrorMessage.ToString());
                                    TryQuitting(rpimode, true);
                                }
                            }
                            catch
                            {
                                ManagerError(EReportErrorCode.InternalError, "invalid +CMGS:XX : " + buffer);
                                TryQuitting(rpimode, true);
                            }

                        }
                        #endregion
                        #region else if RING or NO CARRIER
                        else if ((buffer.StartsWith("RING")) || (buffer.StartsWith("NO CARRIER")))
                        {
                            //on ne fait rien
                            //if (enabletrace) LogHelper.WriteLine(errorprefix + "RING...");
                        }
                        #endregion
                        else if (buffer.Equals(""))
                        {
                            //on ne fait rien
                        }
                        else
                        {
                            if (!queueserialread.push(buffer))
                            {
                                ManagerError(EReportErrorCode.InternalError, queueserialread.ErrorMessage.ToString());
                                TryQuitting(rpimode, true);
                            }
                        }
                        buffer = "";
                    }
                    
                }
                else
                {
                    Thread.Sleep(serial_read_timeout_ms);
                }
            }
            LogHelper.WriteLine(ELogLevel.log, "end of SerialRead loop");
        }
        public static string DirectorySeparator
        {
            get
            {
                if (rpimode)
                    return "/";
                else
                    return "\\";
            }
        }
        private static bool StartAndWaitProcess(string cmd, string args)
        {
            try
            {
                Process p = Process.Start(cmd,args);
                p.WaitForExit();
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, "eorror when calling Process.Start with cmd=["+cmd+"] and args=["+args+"]");
                LogHelper.WriteLine(ELogLevel.error, ex.StackTrace);
                return false;
            }
        }
    }
}
