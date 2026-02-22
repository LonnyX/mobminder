using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;

namespace SmsBox
{
    public class LocalServiceClient //: IServiceClient
    {
        private const string errorprefix = "LocalServiceClient.";
        public string ErrorMessage;
        private string login; 
        private string pwd; 
        public LocalServiceClient(string login_, string pwd_)
        {
            login = login_;
            pwd = pwd_;
        }
        public bool IsOnline()
        {
            return true;
        }
        public bool GetSmsToSend(string iccid, out ReceivedSms sms, int csq)
        {
            try
            {
                string url = "http://localhost:444/getsmstosend.html";
                CustomWebRequest wr = new CustomWebRequest(url, 5000);
                wr.ParamsCollection.Add(new ParamsStruct("login", login));
                wr.ParamsCollection.Add(new ParamsStruct("passw", pwd));
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                wr.PostData();
                string s = wr.ResponseString;
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "received : " + s);

                if (s.StartsWith("##"))
                {
                    ErrorMessage = s;
                    LogHelper.WriteLine(ELogLevel.error, errorprefix + ErrorMessage);
                    sms = null;
                    return false;
                }
                else if (s.StartsWith("0;no data"))
                {
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "success but no data");
                    //Console.WriteLine(s);

                    sms = null;
                    return true;
                }
                else
                {
                    //TODO
                    sms = null;
                    if (sms == null)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }

            }
            catch (WebException wex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.StackTrace);
                sms = null;
                return false;
            }
        }
        public bool UpdateSmsStatus(string iccid, int serverindex, int shieldindex, string tophonenumber, ESmsReportStatus mobminderstatus)
        {
            try
            {
                string url = "http://localhost:444/sendsmsstatus.html";
                CustomWebRequest wr = new CustomWebRequest(url, 5000);
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                wr.ParamsCollection.Add(new ParamsStruct("id", serverindex.ToString()));
                wr.ParamsCollection.Add(new ParamsStruct("status", mobminderstatus.ToString()));
                wr.PostData();
                string s = wr.ResponseString;
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "received : " + s);
                if (s.StartsWith("OK"))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (WebException wex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.StackTrace);
                return false;
            }

            //LogHelper.WriteLine(ELogLevel.info, errorprefix + "UpdateSmsStatus...");
            //return true;
        }
        public bool SendReceivedSMS(SmsToSend sms)
        {
            try
            {
                string url = "http://localhost:444/sendreceivedsms.html";
                CustomWebRequest wr = new CustomWebRequest(url, 5000);
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                wr.ParamsCollection.Add(new ParamsStruct("phonenumber", sms.numero));
                wr.ParamsCollection.Add(new ParamsStruct("message", sms.message));
                wr.PostData();
                string s = wr.ResponseString;
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "received : " + s);
                if (s.StartsWith("OK"))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (WebException wex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.StackTrace);
                return false;
            }

            //LogHelper.WriteLine(ELogLevel.info, errorprefix + "UpdateSmsStatus for index...");
            //return true;
        }
        public string GetErrorMessage()
        {
            return ErrorMessage;
        }
    }
}
