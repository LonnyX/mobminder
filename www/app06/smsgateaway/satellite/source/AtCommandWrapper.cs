using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO.Ports;
using System.Text.RegularExpressions;
using System.Globalization;

namespace SmsBox
{
    public class AtCommandWrapper
    {
        private static char controlZ = (char)26;
        public SerialWrapper wrapper;
        public CascadeError ErrorMessage;
        private const string errorprefix = "AtCommandWrapper.";
        public AtCommandWrapper(Queue queuemain)
        {
            wrapper = new SerialWrapper(queuemain);
        }
        public int ReadTimeout
        {
            set
            {
                wrapper.ReadTimeout = value;
            }
        }
        public bool Open(string portname,int readtimeoutsec)
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
        public bool SendATCommandDeprecated(string cmd, out string resultinformation, bool waitinformation, bool echoon)
        {
            try
            {
                string fullcmd = cmd + "\r";//13 
                wrapper.Write(fullcmd); 

                //if (echoon)
                //{
                //    string returnedecho;
                //    if (!wrapper.ReadUntil(out returnedecho))
                //    {
                //        ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.ReadUntil cr/ln (information)", wrapper.ErrorMessage);
                //        resultinformation = null;
                //        return false;
                //    }
                //}

                if (waitinformation)
                {
                    while (true)
                    {
                        if (!wrapper.ReadUntil(out resultinformation))
                        {
                            ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.ReadUntil cr/ln (information)", wrapper.ErrorMessage);
                            resultinformation = null;
                            return false;
                        }
                        if (resultinformation.Equals(fullcmd))
                        {
                            continue;
                        }
                        if (!string.IsNullOrEmpty(resultinformation))
                        {
                            break;
                        }
                    }
                }
                else
                {
                    resultinformation = null;
                }
                string returncode;
                while (true)
                {
                    if (!wrapper.ReadUntil(out returncode))
                    {
                        ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.ReadUntil cr/ln (returncode)", wrapper.ErrorMessage);
                        resultinformation = null;
                        return false;
                    }
                    if (returncode.Equals(fullcmd))
                    {
                        continue;
                    }
                    if (!string.IsNullOrEmpty(returncode))
                    {
                        break;
                    }
                }

                if (!returncode.Equals("OK"))
                {

                    ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.Result <> OK :" + returncode, wrapper.ErrorMessage);
                    resultinformation = null;
                    return false;
                }

                ErrorMessage = null;
                return true;
            }
            finally
            {

            }
        }
        public bool SendATCommand(string cmd, out string resultinformation, bool waitinformation, bool echoon)
        {
            resultinformation = "";

            string fullcmd = cmd + "\r";//13 
            wrapper.Write(fullcmd);
            
            while (true)
            {
                string tmpline;
                if (!wrapper.ReadUntil(out tmpline))
                {
                    ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.ReadUntil cr/ln (information)", wrapper.ErrorMessage);
                    resultinformation = null;
                    return false;
                }
                else if (tmpline.Equals(fullcmd))
                {
                    continue;
                }
                else if (string.IsNullOrEmpty(tmpline))
                {
                    continue;
                }
                else if (tmpline.EndsWith("OK"))
                {
                    ErrorMessage = null;
                    return true;
                }
                else if (tmpline.EndsWith("ERROR"))
                {
                    ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.Result = ERROR :" + tmpline, wrapper.ErrorMessage);
                    resultinformation = null;
                    return false;
                }
                else
                {
                    resultinformation = tmpline;
                }
            }
              
        }
        public bool SendSms(string numero, string msg, bool echoon, out bool sentwithsuccess)
        {
            string cmd = "AT+CMGS=\"" + numero + "\"";
            wrapper.Write(cmd + "\r"); //13 

            string res;
            if (!wrapper.ReadUntil(out res))
            {
                ErrorMessage = new CascadeError(errorprefix + "SendSms.WaitString cr ln prompt space", wrapper.ErrorMessage);
                sentwithsuccess = false;
                return false;
            }
            if (!res.Equals("> "))
            {
                ErrorMessage = new CascadeError(errorprefix + "SendSms.WaitString prompt space", wrapper.ErrorMessage);
                sentwithsuccess = false;
                return false;
            }

            wrapper.Write(msg);
            wrapper.Write("" + controlZ); //26

            while (true)
            {
                string result;
                if (!wrapper.ReadUntil(out result))
                {
                    ErrorMessage = new CascadeError(errorprefix + "SendSms.WaitString cr/ln", wrapper.ErrorMessage);
                    sentwithsuccess = false;
                    return false;
                }
                if (result.Equals("OK"))
                {
                    ErrorMessage = null;
                    sentwithsuccess = true; //OK
                    return true;
                }
                if (result.Equals("ERROR"))
                {
                    ErrorMessage = null; // new CascadeError(errorprefix + "SendSms received ERROR");
                    sentwithsuccess = false; //ERROR
                    return true;
                }
            }
        }


        public bool SendSmsPdu(string numero, string msgsource,byte[] msgsourceascii7, bool echoon, out bool sentwithsuccess, int groupeindex, int nbpart, int currentpart, SMS.SMSEncoding pduformat)
        {
            SMS sms = new SMS();
            
            sms.Direction = SMSDirection.Submited;
            sms.PhoneNumber = numero;
            sms.ValidityPeriod = new TimeSpan(2, 0, 0, 0);
            sms.Message = msgsource;
            sms.Ascii7Message = msgsourceascii7;
            sms.StatusReportIndication = true;

            string pduSource = sms.Compose(pduformat, groupeindex, nbpart, currentpart);
            int length = pduSource.Length / 2 - 1;

            string cmd = "AT+CMGS="+ length;
            wrapper.Write(cmd + "\r"); //13 

            string res;
            if (!wrapper.ReadUntil(out res))
            {
                ErrorMessage = new CascadeError(errorprefix + "SendSms.WaitString cr ln prompt space", wrapper.ErrorMessage);
                sentwithsuccess = false;
                return false;
            }
            if (!res.Equals("> "))
            {
                //string tmp = UCSEncoding.HexStr2UnicodeStr(res);

                ErrorMessage = new CascadeError(errorprefix + "SendSms.WaitString prompt space", wrapper.ErrorMessage);
                sentwithsuccess = false;
                return false;
            }

            wrapper.Write(pduSource); 
            wrapper.Write(""+controlZ); //26

            while (true)
            {
                string result;
                if (!wrapper.ReadUntil(out result))
                {
                    ErrorMessage = new CascadeError(errorprefix + "SendSms.WaitString cr/ln", wrapper.ErrorMessage);
                    sentwithsuccess = false;
                    return false;
                }
                //if (result.StartsWith("+CMGS:"))
                //{
                //    try
                //    {
                //        messageid = Int32.Parse(result.Replace("+CMGS: ", ""));
                //    }
                //    catch
                //    {
                //        ErrorMessage = new CascadeError(errorprefix + "SendSms received invalid +CMGS value : " + result);
                //        sentwithsuccess = false;
                //        return false;
                //    }
                //}
                if (result.Equals("OK"))
                {
                    //if (messageid == -1)
                    //{
                    //    ErrorMessage = new CascadeError(errorprefix + "SendSms received status OK without +CGMS: XX : " + result);
                    //    sentwithsuccess = false;
                    //    return false;
                    //}
                    //else
                    //{
                    
                    ErrorMessage = null;
                    sentwithsuccess = true; //OK
                    return true;
                    
                    //}
                }
                if (result.Equals("ERROR"))
                {
                    ErrorMessage = null; // new CascadeError(errorprefix + "SendSms received ERROR");
                    sentwithsuccess = false; //ERROR
                    return true;
                }
            }
        }
        public SmsShieldReceivedSms[] ReadSmsOld(bool echoon,List<string> warnings)
        {
            string cmd = "AT+CMGL=\"ALL\"";
            wrapper.Write(cmd + "\r"); //13 

            List<SmsShieldReceivedSms> listsms = new List<SmsShieldReceivedSms>();
            while (true)
            {
                string result;
                if (!wrapper.ReadUntil(out result))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.reading code : ReadUntil cr/ln", wrapper.ErrorMessage);
                    return null;
                }
                else if (result.Equals(""))
                {
                    //int i = 0;
                    //rien à faire
                }
                else if (result.Equals("ERROR"))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.return ERROR");
                    return null;
                }
                else if (result.Equals("OK"))
                {
                    return listsms.ToArray();
                }
                else if (result.StartsWith("+CMGL:"))
                {
                    LogHelper.WriteLine(ELogLevel.info,"ReadSms.warning.reading code = " +result);

                    string message;
                    if (!wrapper.ReadUntil(out message))
                    {
                        string msg = "ReadSms.warning.reading message content : ReadUntil cr/ln - " +  wrapper.ErrorMessage;
                        //ErrorMessage = new CascadeError(errorprefix + "ReadSms.reading message : ReadUntil cr/ln", wrapper.ErrorMessage);
                        warnings.Add(msg);
                        message = "";
                        //return null;
                    }
                    LogHelper.WriteLine(ELogLevel.info, "ReadSms.warning.reading content = " + message);

                    MatchCollection matches = new Regex("((?<=\")[^\"]*(?=\"(,|$)+)|(?<=,|^)[^,\"]*(?=,|$))").Matches(result);
                    if (matches[0].Value.StartsWith("+CMGL:"))
                    {
                        int index = Int32.Parse(matches[0].Value.Replace("+CMGL: ", ""));
                        string numero = matches[2].Value;
                        string sdate = matches[4].Value.Substring(0, 8);
                        string stime = matches[4].Value.Substring(9, 8);
                        DateTime date = DateTime.ParseExact(sdate + " " + stime, "yy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture);

                        int groupeindex = 0;
                        int currentpart = 1;
                        int nbpart = 1;

                        listsms.Add(new SmsShieldReceivedSms(index, date, numero, message,nbpart,currentpart,groupeindex));
                    }
                    else
                    {
                        ErrorMessage = new CascadeError(errorprefix + "ReadSms.not catched:" + result);
                        return null;
                    }
                }
                else
                {
                    //SMS sms = new SMS();
                    //SMS.Fetch(sms, ref result); = bug! pas bon format
                    //string message = sms.Message;
                    string msg = "ReadSms.warning returned invalid line : " + result;
                    LogHelper.WriteLine(ELogLevel.error, msg);
                    warnings.Add(msg);
                }
            }

        }
        public SmsShieldReceivedSms[] ReadSms(bool echoon, List<string> warnings)
        {
            string cmd = "AT+CMGL=\"ALL\"";
            wrapper.Write(cmd + "\r"); //13 

            List<SmsShieldReceivedSms> listsms = new List<SmsShieldReceivedSms>();
            List<string[]> buffer = new List<string[]>();
            while (true)
            {
                string result;
                if (!wrapper.ReadUntil(out result))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.reading line : ReadUntil cr/ln", wrapper.ErrorMessage);
                    return null;
                }

                LogHelper.WriteLine(ELogLevel.info, "ReadSms.reading line = " + result);
                
                if (result.Equals(""))
                {
                    //nothing to do
                }
                else if (result.Equals("ERROR"))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.return ERROR");
                    return null;
                }
                else if (result.Equals("OK"))
                {
                    break;
                }
                else if (result.StartsWith("+CMGL:"))
                {
                    string[] tmp = new string[]{result,""};
                    buffer.Add(tmp);
                }
                else //msg content
                {
                    if (buffer.Count > 0)
                    {
                        buffer[buffer.Count - 1][1] = result;
                    }
                    else
                    {
                        warnings.Add("ReadSms.reading line, received message content line without +CMGL line : "+result);
                    }
                }
            }

            foreach(string[] tmp in buffer)
            {
                string line1 = tmp[0];
                string line2 = tmp[1];
                    
                try
                {
                    LogHelper.WriteLine(ELogLevel.info, "ReadSms.parsing message = " + line1 + " - " + line2);
                    MatchCollection matches = new Regex("((?<=\")[^\"]*(?=\"(,|$)+)|(?<=,|^)[^,\"]*(?=,|$))").Matches(line1);

                    int index = Int32.Parse(matches[0].Value.Replace("+CMGL: ", ""));
                    string numero = matches[2].Value;
                    string sdate = matches[4].Value.Substring(0, 8);
                    string stime = matches[4].Value.Substring(9, 8);
                    DateTime date = DateTime.ParseExact(sdate + " " + stime, "yy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture);

                    int groupeindex = 0;
                    int currentpart = 1;
                    int nbpart = 1;

                    //patch to correct null message content
                    if (line2 == null) line2 = "";

                    listsms.Add(new SmsShieldReceivedSms(index, date, numero, line2, nbpart, currentpart, groupeindex));
                }
                catch (Exception ex)
                {
                    LogHelper.WriteLine(ELogLevel.error, ex.Message);
                    LogHelper.WriteLine(ELogLevel.error, ex.StackTrace);
                    warnings.Add("ReadSms.parsing +CMGL line with error : " + line1 +" - " + line2);
                }

            }
            return listsms.ToArray();

        }
        public SmsShieldReceivedSms[] ReadSmsPduOld(bool echoon)
        {
            string cmd = "AT+CMGL=0";
            wrapper.Write(cmd + "\r"); //13 

            List<SmsShieldReceivedSms> listsms = new List<SmsShieldReceivedSms>();
            while (true)
            {
                string result;
                if (!wrapper.ReadUntil(out result))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.reading code : ReadUntil cr/ln", wrapper.ErrorMessage);
                    return null;
                }
                else if (result.Equals(""))
                {
                    //int i = 0;
                    //rien à faire
                }
                else if (result.Equals("ERROR"))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.return ERROR");
                    return null;
                }
                else if (result.Equals("OK"))
                {
                    return listsms.ToArray();
                }
                else if (result.StartsWith("+CMGL:"))
                {
                    string content;
                    if (!wrapper.ReadUntil(out content))
                    {
                        ErrorMessage = new CascadeError(errorprefix + "ReadSms.reading message : ReadUntil cr/ln", wrapper.ErrorMessage);
                        return null;
                    }
                    LogHelper.WriteLine(ELogLevel.info, result + "|" + content);

                    MatchCollection matches = new Regex("((?<=\")[^\"]*(?=\"(,|$)+)|(?<=,|^)[^,\"]*(?=,|$))").Matches(result);
                    if (matches[0].Value.StartsWith("+CMGL:"))
                    {
                        SMS sms = new SMS();
                        SMS.Fetch(sms, ref content);
                        string message = sms.Message;

                        int index = Int32.Parse(matches[0].Value.Replace("+CMGL: ", ""));
                        //string numero = matches[2].Value;
                        //string sdate = matches[4].Value.Substring(0, 8);
                        //string stime = matches[4].Value.Substring(9, 8);
                        //DateTime date = DateTime.ParseExact(sdate + " " + stime, "yy/MM/dd HH:mm:ss", CultureInfo.InvariantCulture);

                        string numero = sms.PhoneNumber;

                        DateTime date = sms.ServiceCenterTimeStamp;

                        int groupeindex = sms.CsmsReferenceNumber;
                        int currentpart = sms.ThisPartsNumber;
                        int nbpart = sms.TotalNumberOfParts;

                        if (nbpart == 1) //only one frame!
                        {
                            groupeindex = 0;
                            currentpart = 1;
                            nbpart = 1;
                        }
                        //else
                        //{
                            //groupeindex = 0;
                            //currentpart = 0;
                            //nbpart = 0;
                        //}

                        listsms.Add(new SmsShieldReceivedSms(index, date, numero, message, nbpart, currentpart, groupeindex));
                    }
                    else
                    {
                        ErrorMessage = new CascadeError(errorprefix + "ReadSms.not catched:" + result);
                        return null;
                    }
                }
                else
                {
                    //SMS sms = new SMS();
                    //SMS.Fetch(sms, ref result); = bug! pas bon format
                    //string message = sms.Message;
                    LogHelper.WriteLine(ELogLevel.info,"ReadSms returned invalid line : "+ result );
                }
            }

        }
        public SmsShieldReceivedSms[] ReadSmsPdu(bool echoon, List<string> warnings)
        {
            string cmd = "AT+CMGL=0";
            wrapper.Write(cmd + "\r"); //13 

            List<SmsShieldReceivedSms> listsms = new List<SmsShieldReceivedSms>();
            List<string[]> buffer = new List<string[]>();
            while (true)
            {
                string result;
                if (!wrapper.ReadUntil(out result))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.reading code : ReadUntil cr/ln", wrapper.ErrorMessage);
                    return null;
                }
                LogHelper.WriteLine(ELogLevel.info, "ReadSms.reading line = " + result);
                
                if (result.Equals(""))
                {
                    //int i = 0;
                    //rien à faire
                }
                else if (result.Equals("ERROR"))
                {
                    ErrorMessage = new CascadeError(errorprefix + "ReadSms.return ERROR");
                    return null;
                }
                else if (result.Equals("OK"))
                {
                    break;
                }
                else if (result.StartsWith("+CMGL:"))
                {
                    string[] tmp = new string[] { result, "" };
                    buffer.Add(tmp);
                }
                else // msg content
                {
                    if (buffer.Count > 0)
                    {
                        buffer[buffer.Count - 1][1] = result;
                    }
                    else
                    {
                        warnings.Add("ReadSms.reading line, received message content line without +CMGL line : "+result);
                    }
                }
            }
            
            foreach(string[] tmp in buffer)
            {
                string line1 = tmp[0];
                string line2 = tmp[1];
                    
                try
                {
                    LogHelper.WriteLine(ELogLevel.info, "ReadSms.parsing message = " + line1 + " - " + line2);
                    MatchCollection matches = new Regex("((?<=\")[^\"]*(?=\"(,|$)+)|(?<=,|^)[^,\"]*(?=,|$))").Matches(line1);
                    
                    if (matches[0].Value.StartsWith("+CMGL:"))
                    {
                        SMS sms = new SMS();
                        SMS.Fetch(sms, ref line2);

                        //--------------------------------------------------------------------------------------------------
                        //2020-02-12 - correction of null object reference with SmsShieldReceivedSms.message
                        //the issue happens when SMS.Fetch returns an incomplete SMS with null Message (ex:userDataLength==0)
                        string message;
                        if (sms.Message == null)
                            message = "";
                        else
                            message = sms.Message;
                        //--------------------------------------------------------------------------------------------------

                        int index = Int32.Parse(matches[0].Value.Replace("+CMGL: ", ""));

                        string numero = sms.PhoneNumber;

                        DateTime date = sms.ServiceCenterTimeStamp;

                        int groupeindex;
                        int currentpart;
                        int nbpart;

                        if (sms.TotalNumberOfParts == 1) //only one frame!
                        {
                            groupeindex = 0;
                            currentpart = 1;
                            nbpart = 1;
                        }
                        else
                        {
                            groupeindex = sms.CsmsReferenceNumber;
                            currentpart = sms.ThisPartsNumber;
                            nbpart = sms.TotalNumberOfParts;
                        }

                        listsms.Add(new SmsShieldReceivedSms(index, date, numero, message, nbpart, currentpart, groupeindex));
                    }
                    else
                    {
                        ErrorMessage = new CascadeError(errorprefix + "ReadSms.not catched:" + line1 + " - " + line2);
                        return null;
                    }


                }
                catch (Exception ex)
                {
                    LogHelper.WriteLine(ELogLevel.error, ex.Message);
                    LogHelper.WriteLine(ELogLevel.error, ex.StackTrace);
                    warnings.Add("ReadSms.parsing +CMGL line with error : " + line1 +" - " + line2);
                }

            }
            return listsms.ToArray();
        }
    
        public bool ReadUntil(out string result)
        {
            if (!wrapper.ReadUntil(out result))
            {
                ErrorMessage = new CascadeError(errorprefix + "ReadUntil error", wrapper.ErrorMessage);
                return false;
            }
            else
            {
                return true;
            }
        }
        public bool readHttp(out string content)
        {
            wrapper.Write("AT+HTTPREAD\r"); //13 

            string returncode;
            if (!wrapper.ReadUntil(out returncode))
            {
                ErrorMessage = new CascadeError(errorprefix + "readHttp.ReadUntil cr/ln (returncode)", wrapper.ErrorMessage);
                content = null;
                return false;
            }
            if (returncode.Equals("OK"))
            {
                ErrorMessage = new CascadeError(errorprefix + "readHttp.waiting HTTPREAD but receives OK", wrapper.ErrorMessage);
                content = null;
                return false;
            }
            //int buffersize = Int32.Parse(returncode.Replace("+HTTPREAD:", ""));
            
            wrapper.ReadUntil(out content);

            while (true)
            {
                if (!wrapper.ReadUntil( out returncode))
                {
                    ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.ReadUntil cr/ln (returncode)", wrapper.ErrorMessage);
                    return false;
                }

                if (!returncode.Equals("OK"))
                {
                    ErrorMessage = new CascadeError(errorprefix + "internalSendATCommand.Result <> OK :" + returncode, wrapper.ErrorMessage);
                    return false;
                }
                else
                {
                    break;
                }
            }

            ErrorMessage = null;
            return true;
        }
    }
}
