using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO.Ports;

namespace SmsBox
{
    public class SmsShieldWrapper
    {
        public AtCommandWrapper wrapper;
        public CascadeError ErrorMessage;
        private const string errorprefix = "SmsShieldWrapper.";

        public SmsShieldWrapper(Queue queuemain)
        {
            wrapper = new AtCommandWrapper(queuemain);
        }
        public int ReadTimeout
        {
            set
            {
                LogHelper.WriteLine(ELogLevel.info, errorprefix + ":set ReadTimeout with value " + value);
                wrapper.ReadTimeout = value;
            }
        }
        public bool Open(string portname, int readtimeoutsec)
        {
            if (!wrapper.Open(portname, readtimeoutsec))
            {
                ErrorMessage = new CascadeError(errorprefix + "Open", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public bool CheckAlive()
        {
            string resultinformation;
            string command = "AT";
            if (!wrapper.SendATCommand(command, out resultinformation,false,true))
            {
                ErrorMessage = new CascadeError(errorprefix + "CheckAlive", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        //ATZ0 - Soft Reset and Restore: Restore setting 0
        public bool ResetModem()
        {
            string resultinformation;
            string command = "ATZ0";
            if (!wrapper.SendATCommand(command, out resultinformation, false, true))
            {
                ErrorMessage = new CascadeError(errorprefix + "ResetModem", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        //AT+CFUN AT command  sets the level of functionality in the MT. Level "full functionality" is where the highest level of power is drawn. "Minimum functionality" is where minimum power is drawn.
        //Possible values are,
        //0 minimum functionality
        //1 full functionality
        //2 disable phone transmit RF circuits only
        //3 disable phone receive RF circuits only
        //4 disable phone both transmit and receive RF circuits
        //<rst> 1 Reset the MT before setting it to <fun> power level.
        public bool ResetDevice()
        {
            string resultinformation;
            string command = "AT+CFUN=1,1";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "ResetDevice", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                return true;
            }
        }
        //public bool PowerUp(bool enable)
        //{
        //    string resultinformation;
        //    string command = "AT+CFUN="+(enable?"1":"0");
        //    if (!wrapper.SendATCommand(command, out resultinformation, false, true))
        //    {
        //        ErrorMessage = new CascadeError(errorprefix + "PowerUp", wrapper.ErrorMessage);
        //        return false;
        //    }
        //    else
        //    {
        //        ErrorMessage = null;
        //        return true;
        //    }
        //}
        public bool GetLock(out bool res)
        {
            string resultinformation;
            string command = "AT+CPIN?";
            if (!wrapper.SendATCommand(command, out resultinformation, true, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "GetLock", wrapper.ErrorMessage);
                res = false;
                return false;
            }
            else
            {
                if (resultinformation.EndsWith("READY"))
                {
                    res = false;
                    return true;
                }
                else if (resultinformation.EndsWith("SIM PIN"))
                {
                    res = true;
                    return true;
                }
                else
                {
                    ErrorMessage = new CascadeError(errorprefix + "GetLock:resultinformation=" + resultinformation);
                    res = false;
                    return false;
                }
            }
        }
        public bool SetLock(bool locked, string lockcode)
        {
            string resultinformation;
            char flag = locked?'1':'0';
            //string end = locked ? "" : ",1";
            string command = "AT+CLCK=\"SC\"," + flag + ",\"" + lockcode + "\",1";
            if (!wrapper.SendATCommand(command, out resultinformation, true, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetLock", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                return true;
            }
        }
        public bool SetCode(string lockcode)
        {
            string resultinformation;
            string command = "AT+CPIN=\"" + lockcode + "\"";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "GetLock", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                return true;
            }
        }
        public bool SetEcho(bool value)
        {
            string resultinformation;
            string mode = (value ? "1" : "0");
            string command = "ATE" + mode;
            bool flagechoon = !value;
            if (!wrapper.SendATCommand(command, out resultinformation, false, flagechoon))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetEcho", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public bool SetTextMessageFormat(bool istext)
        {
            string resultinformation;
            string mode = (istext ? "1" : "0");
            string command = "AT+CMGF=" + mode;
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetTextMessageFormat", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        
        //Set SMS Text Mode Parameters
        public bool SetTextModeParameter()
        {
            string resultinformation;

            //string command = "AT+CSMP=49,167,0,0";
              string command = "AT+CSMP=49,167,0,8";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetTextModeParameter", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public enum ENetworkRegistred
        {
            NotRegistred = 0,
            Registred =1,
            Searching = 2,
            Denied = 3,
            Unknown = 4,
            RegistredRoaming = 5,
            Error=999
        }
        public bool IsNetworkRegistred(out ENetworkRegistred status)
        {
            string resultinformation;
            //string command = "AT+CPMS=\"SM\"";
            string command = "AT+CREG?";
            if (!wrapper.SendATCommand(command, out resultinformation, true, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "IsNetworkRegistred", wrapper.ErrorMessage);
                status = ENetworkRegistred.Error;
                return false;
            }
            else
            {
                string[] tmp1 = resultinformation.Split(new string[]{":"},StringSplitOptions.None);
                string[] tmp2 = tmp1[1].Trim().Split(new string[] { "," }, StringSplitOptions.None);
                string stat = tmp2[1];
                status = (ENetworkRegistred)Int32.Parse(stat);
                ErrorMessage = null;
                return true;
            }
        }
        //out int messageid
        public bool SendSms(string numero, string msg, out bool sentwithsuccess)
        {
            if (!wrapper.SendSms(numero, msg, false, out sentwithsuccess))
            {
                ErrorMessage = new CascadeError(errorprefix + "sending sms", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;

                //ErrorMessage = new CascadeError("testingbug");
                //return false;
            }
        }
        public bool SendSmsPdu(string numero, string msg, byte[] msgsourceascii7, out bool sentwithsuccess, int groupeindex, int nbpart, int currentpart, SMS.SMSEncoding pduformat)
        {
            if (!wrapper.SendSmsPdu(numero, msg,msgsourceascii7, false, out sentwithsuccess, groupeindex, nbpart, currentpart, pduformat))
            {
                ErrorMessage = new CascadeError(errorprefix + "sending sms", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;

                //ErrorMessage = new CascadeError("testingbug");
                //return false;
            }
        }
        public bool SetTextMessageNoIndication()
        {
            string resultinformation;
            //string command = "AT+CNMI=1,0,0,0,0";
            //string command = "AT+CNMI=2,2,0,1,0";
            //string command = "AT+CNMI=1,0,0,1,0";
            //string command = "AT+CNMI=1,0,0,0,0";
            //string command = "AT+CNMI=2,2,0,1,0";
            string command = "AT+CNMI=1,0,0,1,0"; //sinon pas de ACK
            //string command = "AT+CNMI=0,0,0,1,0";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetTextMessageNoIndication", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public bool SetSimStorage()
        {
            string resultinformation;
            //string command = "AT+CPMS=\"SM\"";
            //string command = "AT+CPMS=\"ME\"";
            //string command = "AT+CPMS=\"SR\"";
            string command = "AT+CPMS=\"ME\",\"ME\",\"ME\"";
            if (!wrapper.SendATCommand(command, out resultinformation, true, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetSimStorage", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public bool SetEncodingUCS2()
        {
            string resultinformation;
            string command = "AT+CSCS=\"UCS2\"";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetEncodingUCS2", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        //public bool SetEncodingGSM()
        //{
        //    string resultinformation;
        //    //string encoded = UCSEncoding.UnicodeStr2HexStr("\"GSM\"");
        //    string command = "AT+CSCS=\"GSM\"";
        //    if (!wrapper.SendATCommand(command, out resultinformation, false, false))
        //    {
        //        ErrorMessage = new CascadeError(errorprefix + "SetEncodingGSM", wrapper.ErrorMessage);
        //        return false;
        //    }
        //    else
        //    {
        //        ErrorMessage = null;
        //        return true;
        //    }
        //}
        public bool SetGsmBusy()
        {
            string resultinformation;
            string command = "AT+GSMBUSY=1";
            //string command = "AT+GSMBUSY=0";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetGsmBusy", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        
        //Show SMS Text Mode Parameters
        public bool SetTextModeParameters(bool v)
        {
            string resultinformation;
            string command = "AT+CSDH="+(v?"1":"0");
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetTextModeParameters", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
      
        public bool DeleteSmsByIndex(int index)
        {
            string resultinformation;
            string command = "AT+CMGD="+index+",0";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "DeleteSmsByIndex", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public SmsShieldReceivedSms[] ReadSms(List<string> warnings)
        {
            SmsShieldReceivedSms[] res = wrapper.ReadSms(false,warnings);
            if (res == null)
            {
                ErrorMessage = new CascadeError(errorprefix + "reading sms", wrapper.ErrorMessage);
                return null;
            }
            else
            {
                ErrorMessage = null;
                return res;
            }
        }
        public SmsShieldReceivedSms[] ReadSmsPdu(List<string> warnings)
        {
            SmsShieldReceivedSms[] res = wrapper.ReadSmsPdu(false, warnings);
            if (res == null)
            {
                ErrorMessage = new CascadeError(errorprefix + "reading sms", wrapper.ErrorMessage);
                return null;
            }
            else
            {
                ErrorMessage = null;
                return res;
            }
        }
        //public bool SetGprsAttachToNetwork(bool attach)
        //{
        //    string resultinformation;
            
        //    string command = "AT+CGATT="+(attach?"1":"0");
        //    if (!wrapper.SendATCommand(command, out resultinformation, false, false))
        //    {
        //        ErrorMessage = new CascadeError(errorprefix + "SetGprsAttachToNetwork", wrapper.ErrorMessage);
        //        return false;
        //    }
        //    else
        //    {
        //        ErrorMessage = null;
        //        return true;
        //    }
        //}
        //public bool SetGprsActivatePdpContext(bool active)
        //{
        //    string resultinformation;

        //    string command = " AT+CGACT=" + (active ? "1" : "0") + ",1";
        //    if (!wrapper.SendATCommand(command, out resultinformation, false, false))
        //    {
        //        ErrorMessage = new CascadeError(errorprefix + "SetGprsActivatePdpContext", wrapper.ErrorMessage);
        //        return false;
        //    }
        //    else
        //    {
        //        ErrorMessage = null;
        //        return true;
        //    }
        //}
        //public string GetGprsIpAdress()
        //{
        //    string resultinformation;
        //    string command = "AT+CGPADDR=1";
        //    if (!wrapper.SendATCommand(command, out resultinformation, true, false))
        //    {
        //        ErrorMessage = new CascadeError(errorprefix + "SetGprsAttach", wrapper.ErrorMessage);
        //        return null;
        //    }
        //    else
        //    {
        //        ErrorMessage = null;
        //        return resultinformation;
        //    }
        //}
        public int GetSignalQuality()
        {
            string command = "AT+CSQ";
            string resultinformation;
            if (!wrapper.SendATCommand(command, out resultinformation, true, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "CheckSignalQuality : " + resultinformation, wrapper.ErrorMessage);
                return -1;
            }
            string[] svalue = resultinformation.Replace("+CSQ:", "").Split(new string[] { "," }, StringSplitOptions.None);

            return Int32.Parse(svalue[0]);
        }
        public string GetICCID()
        {
            string command = "AT+CCID";
            string resultinformation;
            if (!wrapper.SendATCommand(command, out resultinformation, true, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "GetICCID : " + resultinformation, wrapper.ErrorMessage);
                return null;
            }
            if (resultinformation.Length > 19)
                return resultinformation.Substring(0, 19);
            else
                return resultinformation;
        }
        public bool SetBand(string band )
        {
            string resultinformation;
            string command = "AT+CBAND=\""+band+"\"";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "SetBand", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public string InitializeGprs(string apn)
        {
            string resultinformation;

            string command = "AT+SAPBR=0,1";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                //pas d'erreur car peut etre pas besoin d'en faire un
                //ErrorMessage = new CascadeError(errorprefix + "InitializeGprs:disable gprs", wrapper.ErrorMessage);
                //return null;
            }
            command = "AT+SAPBR=3,1,\"Contype\",\"GPRS\"";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "InitializeGprs:set contype gprs", wrapper.ErrorMessage);
                return null;
            }
            command = "AT+SAPBR=3,1,\"APN\",\"" + apn + "\"";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "InitializeGprs:set apn", wrapper.ErrorMessage);
                return null;
            }
            command = "AT+SAPBR=1,1";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "InitializeGprs:enable gprs", wrapper.ErrorMessage);
                return null;
            }
            command = "AT+SAPBR=2,1";
            if (!wrapper.SendATCommand(command, out resultinformation, true, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "InitializeGprs:get ipadr", wrapper.ErrorMessage);
                return null;
            }
            else
            {
                ErrorMessage = null;
                string[] tmp = resultinformation.Replace("+SAPBR:","").Split(',');
                return tmp[2].Replace("\"", "");
            }
        }
        public bool DisableGprs()
        {
            string command = "AT+SAPBR=0,1";
            string resultinformation;
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "DisableGprs:enable gprs", wrapper.ErrorMessage);
                return false;
            }

            return true;
        }
        public string PostHttp(string url, List<string> parameters)
        {
            url = url + "?" + string.Join("&", parameters.ToArray());

            string resultinformation;

            string command = "AT+HTTPTERM";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                //TODO
                //pas d'erreur car peut etre pas besoin d'en faire un
                //ErrorMessage = new CascadeError(errorprefix + "PostHttp:httpterm", wrapper.ErrorMessage);
                //return null;
            }
            command = "AT+HTTPINIT";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "PostHttp:httpinit", wrapper.ErrorMessage);
                return null;
            }
            command = "AT+HTTPSSL=1";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "PostHttp:httpssl=1", wrapper.ErrorMessage);
                return null;
            }
            command = "AT+HTTPPARA=\"URL\",\""+url+"\"";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "PostHttp:httppara url", wrapper.ErrorMessage);
                return null;
            }
            command = "AT+HTTPPARA=\"CID\",1";
            if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "PostHttp:httppara cid", wrapper.ErrorMessage);
                return null;
            }
            command = "AT+HTTPACTION=0";
            if (!wrapper.SendATCommand(command, out resultinformation,false, false))
            {
                ErrorMessage = new CascadeError(errorprefix + "PostHttp:httpaction=0", wrapper.ErrorMessage);
                return null;
            }
            while (true)
            {
                //trouver solution pour timeout!
                //if (!wrapper.ReadUntil("\r\n", out resultinformation,20000))
                {
                    ErrorMessage = new CascadeError(errorprefix + "PostHttp:httpaction=0", wrapper.ErrorMessage);
                    return null;
                }
                //if (resultinformation.StartsWith("+HTTPACTION"))
                //{
                    //break;
                //}
            }
            //string[] tmphttpactionresult = resultinformation.Replace("+HTTPACTION:", "").Split(',');
            //if (!tmphttpactionresult[1].Equals("200"))
            //{
            //    ErrorMessage = new CascadeError(errorprefix + "PostHttp:HTTPACTION <> 200", wrapper.ErrorMessage);
            //    return null;
            //}
            //// gerer result +HTTPACTION: 0,200,210

            //string content;
            //if (!wrapper.readHttp(out content))
            //{
            //    ErrorMessage = new CascadeError(errorprefix + "PostHttp:readHttp", wrapper.ErrorMessage);
            //    return null;
            //}

            //command = "AT+HTTPTERM";
            //if (!wrapper.SendATCommand(command, out resultinformation, false, false))
            //{
            //    ErrorMessage = new CascadeError(errorprefix + "PostHttp:httpterm", wrapper.ErrorMessage);
            //    return null;
            //}
           
            //return content;
         }
    }
}
