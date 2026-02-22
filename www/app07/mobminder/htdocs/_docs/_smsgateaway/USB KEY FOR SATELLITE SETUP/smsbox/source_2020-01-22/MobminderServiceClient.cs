using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Net;
using System.Net.NetworkInformation;
using System.IO;


namespace SmsBox
{
    public static class HttpChannelFactory
    {
        public static IHttpChannel GetHttpChannel(SmsShieldWrapper wrapper)
        {
            if (wrapper == null)
            {
                return new NetworkHttpChannel();
            }
            else
            {
                return new GprsHttpChannel(wrapper);
            }
        }
    }
    public class PostDataReturnBytesResponse
    {
        public byte[] content;
        public string filename;

        public PostDataReturnBytesResponse(byte[] content_, string filename_)
        {
            content = content_;
            filename = filename_;
        }
    }
    public interface IHttpChannel
    {
        bool Open();
        bool Close();
        string PostData(string url, List<KeyValuePair<string, string>> parameters, int timeoutms);
        PostDataReturnBytesResponse PostDataReturnBytes(string url, List<KeyValuePair<string, string>> parameters, int timeoutms);
        string GetErrorMessage();
    }
    public class NetworkHttpChannel : IHttpChannel
    {
        private const string errorprefix = "NetworkHttpChannel.";
        public string ErrorMessage;

        public bool Open()
        {
            ErrorMessage = null;
            return true;
        }
        public bool Close()
        {
            ErrorMessage = null;
            return true;
        }
        public string PostData(string url, List<KeyValuePair<string,string>> parameters, int timeoutms)
        {
            int counter = 0;
            while (true)
            {
                try
                {
                    CustomWebRequest wr = new CustomWebRequest(url, timeoutms);
                    foreach (KeyValuePair<string, string> param in parameters)
                    {
                        wr.ParamsCollection.Add(new ParamsStruct(param.Key, param.Value));
                    }
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                    wr.PostData();
                    ErrorMessage = null;
                    return wr.ResponseString;
                    
                }
                catch (WebException wex)
                {
                    if (counter >= 0)
                    {
                        LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.Message);
                        LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.StackTrace);

                        ErrorMessage = errorprefix + "PostData:internet access error:" + wex.Message;
                        return null;
                    }
                    else
                    {
                        counter++;
                        LogHelper.WriteLine(ELogLevel.error, errorprefix+"PostData error - retry : "+counter+"...");
                        Thread.Sleep(1000);
                    }
                }
            }

        }
        public PostDataReturnBytesResponse PostDataReturnBytes(string url, List<KeyValuePair<string, string>> parameters, int timeoutms)
        {
            int counter = 0;
            while (true)
            {
                try
                {
                    CustomWebRequest wr = new CustomWebRequest(url, timeoutms);
                    foreach (KeyValuePair<string, string> param in parameters)
                    {
                        wr.ParamsCollection.Add(new ParamsStruct(param.Key, param.Value));
                    }
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "PostDataReturnBytes to " + url);
                    wr.PostData();
                    ErrorMessage = null;
                    MemoryStream ms = new MemoryStream();
                    wr.ResponseStream.CopyTo(ms);
                    byte[] ret = ms.ToArray();

                    string keycontentdisposition = "Content-Disposition";
                    if (!wr._myHttpWebResponse.Headers.AllKeys.Contains(keycontentdisposition))
                    {
                        ErrorMessage = errorprefix + "PostDataReturnBytes:headers[Content-Disposition] not found!";
                        return new PostDataReturnBytesResponse(null, null);
                    }
                    else
                    {
                        string[] contentdisposition = wr._myHttpWebResponse.Headers[keycontentdisposition].Split(';');
                        string filename = null;
                        foreach (string keyval in contentdisposition)
                        {
                            string keyval2 = keyval.Trim();
                            if (keyval2.Contains('='))
                            {
                                string[] tmp = keyval2.Split('=');
                                if (tmp[0].Equals("filename")) filename = tmp[1];
                            }
                        }
                        if (filename == null)
                        {
                            ErrorMessage = errorprefix + "PostDataReturnBytes:headers[Content-Disposition] without filename!";
                            return new PostDataReturnBytesResponse(null, null);
                        }
                        else
                        {
                            return new PostDataReturnBytesResponse(ret, filename);
                        }
                    }

                }
                catch (WebException wex)
                {
                    if (counter >= 0)
                    {
                        LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.Message);
                        LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.StackTrace);

                        ErrorMessage = errorprefix + "PostDataReturnBytes:internet access error:" + wex.Message;
                        return new PostDataReturnBytesResponse(null, null);
                    }
                    else
                    {
                        counter++;
                        LogHelper.WriteLine(ELogLevel.error, errorprefix + "PostDataReturnBytes error - retry : " + counter + "...");
                        Thread.Sleep(1000);
                    }
                }
            }

        }
        public string GetErrorMessage()
        {
            return ErrorMessage;
        }
    }
    public class GprsHttpChannel : IHttpChannel
    {
        //private SmsShieldWrapper wrapper;
        private const string errorprefix = "GprsHttpChannel.";
        public string ErrorMessage;

        public GprsHttpChannel(SmsShieldWrapper wrapper_)
        {
            //wrapper = wrapper_;
        }
        public bool Open()
        {
            return true;
        }
        public bool Close()
        {
            return true;
        }
        public string PostData(string url, List<KeyValuePair<string, string>> parameters, int timeoutms)
        {
            return null;
        }
        public PostDataReturnBytesResponse PostDataReturnBytes(string url, List<KeyValuePair<string, string>> parameters, int timeoutms)
        {
            PostDataReturnBytesResponse ret = new PostDataReturnBytesResponse(null, null);
            return ret;
        }
       
        public string GetErrorMessage()
        {
            return ErrorMessage;
        }
    }
    public class MobminderServiceClient : IServiceClient
    {
        private static Mutex m = null;

        private string baseurl = null; //"http://smsgateaway.mobminder.com";
        private const string errorprefix = "MobminderServiceClient.";
        public string ErrorMessage;
        
        private int timeoutms;
        private SmsShieldWrapper wrapper;
        private IHttpChannel channel;
        private string internetgatewayip;

        public MobminderServiceClient( string server_, int timeoutms_, SmsShieldWrapper wrapper_,string internetgatewayip_)
        {
            m = new Mutex();
            timeoutms = timeoutms_;
            baseurl = server_;
            wrapper = wrapper_;
            internetgatewayip = internetgatewayip_;
        }
        public bool Open()
        {
            channel = HttpChannelFactory.GetHttpChannel(wrapper);
            if (!channel.Open())
            {
                ErrorMessage = errorprefix + "Open:" + channel.GetErrorMessage();
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public bool Close()
        {
            if (!channel.Close())
            {
                ErrorMessage = errorprefix + "Close:" + channel.GetErrorMessage();
                return false;
            }
            else
            {
                ErrorMessage = null;
                return true;
            }
        }
        public EServiceClientReturnCode GetSmsToSend(string iccid, List<ReceivedSms> listsms, int csq, int ptmp, bool pwr, string version, string signature, out string command)
        {
            command = null;
            string spwr = pwr ? "1" : "0";
            m.WaitOne();
            try
            {
                ptmp = ptmp / 10;

                //smsgateaway.mobminder.com/satellite/alive.php?sim=32475982620&probe=1&web=1
                LogHelper.WriteLine(ELogLevel.log, errorprefix + "GetSmsToSend:calling gateway.alive with iccid=" + iccid + ",csq=" + csq + ",ptmp=" + ptmp + ",pwr=" + spwr+",ver="+version+",sign="+signature);

                string url = baseurl + "/satellite/alive.php";
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);

                List<KeyValuePair<string,string>> parameters = new List<KeyValuePair<string,string>>();
                parameters.Add(new KeyValuePair<string, string>("cid", iccid));
                parameters.Add(new KeyValuePair<string, string>("probe", "0"));
                parameters.Add(new KeyValuePair<string, string>("web", "0"));
                parameters.Add(new KeyValuePair<string, string>("csq", csq.ToString()));
                parameters.Add(new KeyValuePair<string, string>("ptmp", ptmp.ToString()));
                parameters.Add(new KeyValuePair<string, string>("pwr", spwr));
                parameters.Add(new KeyValuePair<string, string>("ver", version));
                parameters.Add(new KeyValuePair<string, string>("sign", signature));

                string s = channel.PostData(url,parameters,timeoutms);
                if (s == null)
                {
                    string networkerrorcode = CheckNetworkError(internetgatewayip);
                    if (networkerrorcode != null)
                    {
                        ErrorMessage = networkerrorcode;
                    }
                    else
                    {
                        ErrorMessage = "UNKNOWN:GetSmsToSend:" + channel.GetErrorMessage();
                    }
                    listsms.Clear();
                    return EServiceClientReturnCode.NetworkError;
                }

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "GetSmsToSend:received : [" + s + "]");

                if (s.StartsWith("error"))
                {
                    listsms.Clear();
                    ErrorMessage = errorprefix + "GetSmsToSend:returned error: [" + s+"]";
                    return EServiceClientReturnCode.GatewayError;
                }
                //if (s.StartsWith("<data></data>"))
                //{
                //    LogHelper.WriteLine(ELogLevel.info, errorprefix + "GetSmsToSend:success but no data");
                //    //Console.WriteLine(s);
                //    sms = null;
                //    ErrorMessage = null;
                //    return EServiceClientReturnCode.Success;
                //}
                else
                {
                    //sms = new ReceivedSms();
                    //traite <command>
                    if (s.Contains("<command>"))
                    {
                        string[] contentcommand = s.Split(new string[] { "<command>", "</command>" }, StringSplitOptions.None);
                        if (contentcommand.Length != 3)
                        {
                            listsms.Clear();
                            ErrorMessage = errorprefix + "GetSmsToSend:invalid returned structure : [" + s + "]";
                            return EServiceClientReturnCode.GatewayError;
                        }
                        else
                        {
                            command = contentcommand[1];
                            LogHelper.WriteLine(ELogLevel.log, "GetSmsToSend: command found : " + command);
                        }
                    }
                    else
                    {
                        LogHelper.WriteLine(ELogLevel.log, "GetSmsToSend: command not found");
                    }

                    //traite <data>
                    if (!s.Contains("<data>"))
                    {
                        listsms.Clear();
                        ErrorMessage = errorprefix + "GetSmsToSend:invalid returned structure : [" + s + "]";
                        return EServiceClientReturnCode.GatewayError;
                    }
                    else
                    {
                        string[] content = s.Split(new string[]{"<data>","</data>"},StringSplitOptions.None);
                       
                        if (content.Length != 3)
                        {
                            listsms.Clear();
                            ErrorMessage = errorprefix + "GetSmsToSend:invalid returned structure : [" + s + "]";
                            return EServiceClientReturnCode.GatewayError;
                        }
                        else if (string.IsNullOrEmpty(content[1]))
                        {
                            LogHelper.WriteLine(ELogLevel.info, errorprefix + "GetSmsToSend:success but no data");
                            //Console.WriteLine(s);
                            listsms.Clear();
                            ErrorMessage = null;
                            return EServiceClientReturnCode.Success;
                        }
                        else
                        {
                            string[] lines = content[1].Split(new string[] { "\n", "\r\n" }, StringSplitOptions.None);
                            foreach (string line in lines)
                            {
                                if (string.IsNullOrEmpty(line)) continue;

                                if (line.Equals("#C_dS_sms")) continue;

                                string[] row = line.Split('|');
                                if (row.Length < 4)
                                {
                                    listsms.Clear();
                                    ErrorMessage = errorprefix + "GetSmsToSend:invalid returned structure (column number = " + row.Length + "): [" + s + "]";
                                    return EServiceClientReturnCode.GatewayError;
                                }
                                else
                                {
                                    try
                                    {
                                        //<data>#C_dS_sms
                                        //20000205|32497462820|test push queue auto date=18:04:33|20
                                        //</data>
                                        //id: gateaway internal sms unique id. Must be returned by satellite as sid to /satellite/feedback.php at synchronous send operation
                                        //to: mobile number
                                        //bla: SMS message in UTF8 format
                                        //lag: expected timespan [seconds] before your next call to /smsgateaway/satellite/alive.php

                                        ReceivedSms sms = new ReceivedSms();
                                        sms.serverid = Int32.Parse(row[0]);
                                        sms.numero = row[1]; //"+32497462820";
                                        sms.encoding = row[2];
                                        sms.lag = Int32.Parse(row[3]);
                                        sms.message = row[4];  //"coucou bernard! il est : " + DateTime.Now.ToString("HH:mm:ss");
                                        
                                        listsms.Add(sms);
                                       
                                    }
                                    catch (Exception ex)
                                    {
                                        listsms.Clear();
                                        ErrorMessage = errorprefix + "GetSmsToSend:invalid returned structure (" + ex.Message + "): [" + s + "]";
                                        return EServiceClientReturnCode.GatewayError;
                                    }
                                }
                            }
                            if (listsms.Count > 0)
                            {
                                ErrorMessage = null;
                                LogHelper.WriteLine(ELogLevel.info, errorprefix + "GetSmsToSend:success with data");
                                return EServiceClientReturnCode.Success;
                            }
                            else
                            {
                                listsms.Clear();
                                ErrorMessage = errorprefix + "GetSmsToSend:invalid returned structure: [" + s + "]";
                                return EServiceClientReturnCode.GatewayError;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                listsms = new List<ReceivedSms>();
                ErrorMessage = errorprefix + "GetSmsToSend:" + ex.Message;
                return EServiceClientReturnCode.InternalError;
            }
            finally
            {
                m.ReleaseMutex();
            }
        }
        public EServiceClientReturnCode UpdateSmsStatus(string iccid, int serverindex, int shieldindex, string tophonenumber, int mobminderstatus)
        {
            m.WaitOne();
            try
            {
                //smsgateaway.mobminder.com/satellite/alive.php?sim=32475982620&probe=1&web=1

                LogHelper.WriteLine(ELogLevel.log, errorprefix + "UpdateSmsStatus:calling gateway.feedback with iccid=" + iccid + ",mobminder id=" + serverindex + ", operator id=" + shieldindex + ",tophonenumber=" + tophonenumber + ", status=" + (int)mobminderstatus);

                //string url = "smsgateaway.mobminder.com/satellite/feedback.php?sim=32475982620&sid=20000000&stt=120&oid=20000000&web=1";
                string url = baseurl + "/satellite/feedback.php";

                int istatus = (int)mobminderstatus;

                string oid;
                if (shieldindex==-1)
                {
                    oid = "0";
                }
                else
                {
                    oid = tophonenumber + shieldindex.ToString("000");
                }

                List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();
                parameters.Add(new KeyValuePair<string, string>("cid", iccid));
                parameters.Add(new KeyValuePair<string, string>("ost", istatus.ToString()));
                parameters.Add(new KeyValuePair<string, string>("oid", oid));
                parameters.Add(new KeyValuePair<string, string>("sid", serverindex.ToString()));
                parameters.Add(new KeyValuePair<string, string>("web", "0"));

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                string s = channel.PostData(url, parameters, timeoutms);

                if (s == null)
                {
                    string networkerrorcode = CheckNetworkError(internetgatewayip);
                    if (networkerrorcode != null)
                    {
                        ErrorMessage = networkerrorcode;
                    }
                    else
                    {
                        ErrorMessage = "UNKNOWN:UpdateSmsStatus:" + channel.GetErrorMessage();
                    }
                    return EServiceClientReturnCode.NetworkError;
                }

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "UpdateSmsStatus:received : [" + s + "]");

                if (s.StartsWith("error"))
                {
                    ErrorMessage = errorprefix + "UpdateSmsStatus:Invalid return message from gateway: [" + s +"]";
                    //info car pas grave, on a souvent des error (ex si sms de reporting, started, stopped...)
                    LogHelper.WriteLine(ELogLevel.info, ErrorMessage);
                    return EServiceClientReturnCode.GatewayError;
                }
                else
                {
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "UpdateSmsStatus:Valid return message from gateway");
                    //pas besoin de récuperer le retour
                    return EServiceClientReturnCode.Success;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "UpdateSmsStatus:" + ex.Message;
                return EServiceClientReturnCode.InternalError;
            }
            finally
            {
                m.ReleaseMutex();
            }
        }
        public EServiceClientReturnCode SendReceivedSMS(string iccid, string numero,int csq, string message, int nbpart, int currentpart, int groupindex)
        {
            m.WaitOne();
            try
            {
                LogHelper.WriteLine(ELogLevel.log, errorprefix + "SendReceivedSMS:calling gateway.inbound with iccid=" + iccid + ", frm=" + numero + ", csq=" + csq + ", bla=" + message + ", mid=" + groupindex + ", fid=" + currentpart + ", msz" + nbpart);

                //http://localhost/smsgateaway/satellite/inbound.php?cid=8932029862021146473&frm=32493655599&csq=31&bla=this%20is%20the%20received%20message&probe=1&web=1
                string url = baseurl + "/satellite/inbound.php";

                List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();
                parameters.Add(new KeyValuePair<string, string>("cid", iccid));
                parameters.Add(new KeyValuePair<string, string>("frm", numero));
                parameters.Add(new KeyValuePair<string, string>("csq", csq.ToString()));
                parameters.Add(new KeyValuePair<string, string>("bla", message));
                parameters.Add(new KeyValuePair<string, string>("web", "0"));
                parameters.Add(new KeyValuePair<string, string>("probe", "0"));
                parameters.Add(new KeyValuePair<string, string>("mid", groupindex.ToString()));
                parameters.Add(new KeyValuePair<string, string>("fid", currentpart.ToString()));
                parameters.Add(new KeyValuePair<string, string>("msz", nbpart.ToString()));

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                string s = channel.PostData(url, parameters, timeoutms);

                if (s == null)
                {
                    string networkerrorcode = CheckNetworkError(internetgatewayip);
                    if (networkerrorcode != null)
                    {
                        ErrorMessage = networkerrorcode;
                    }
                    else
                    {
                        ErrorMessage = "UNKNOWN:SendReceivedSMS:" + channel.GetErrorMessage();
                    }
                    return EServiceClientReturnCode.NetworkError;
                }

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "SendReceivedSMS:received : [" + s + "]");

                if (s.StartsWith("error"))
                {
                    ErrorMessage = errorprefix + "SendReceivedSMS:Invalid return message from gateway: [" + s+"]";
                    //info car pas grave, on a souvent des error (ex si sms de reporting, started, stopped...)
                    LogHelper.WriteLine(ELogLevel.error, ErrorMessage);
                    return EServiceClientReturnCode.GatewayError;
                }
                else
                {
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "SendReceivedSMS:valid return message from gateway");
                    //pas besoin de récuperer le retour
                    return EServiceClientReturnCode.Success;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "SendReceivedSMS:" + ex.Message;
                return EServiceClientReturnCode.InternalError;
            }
            finally
            {
                m.ReleaseMutex();
            }
        }
        public EServiceClientReturnCode SendReportError(string iccid, int csq, string code, string msg, int operatorid, int ptmp, bool pwr)
        {
            string spwr = pwr ? "1" : "0";
            m.WaitOne();
            try
            {
                ptmp = ptmp / 10;

                LogHelper.WriteLine(ELogLevel.log, errorprefix + "SendReportError:calling gateway.log with iccid=" + iccid + ", errorcode=" + code + ",msg=" + msg + ",ptmp=" + ptmp + ",pwr=" + spwr);

                string url = baseurl + "/satellite/log.php";

                List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();
                parameters.Add(new KeyValuePair<string, string>("cid", iccid));
                parameters.Add(new KeyValuePair<string, string>("csq", csq.ToString()));
                parameters.Add(new KeyValuePair<string, string>("opid", operatorid.ToString()));
                parameters.Add(new KeyValuePair<string, string>("title", code));
                parameters.Add(new KeyValuePair<string, string>("level",  "critical"));
                parameters.Add(new KeyValuePair<string, string>("bla", msg));
                parameters.Add(new KeyValuePair<string, string>("web","0"));
                parameters.Add(new KeyValuePair<string, string>("ptmp", ptmp.ToString()));
                parameters.Add(new KeyValuePair<string, string>("pwr", spwr));
                
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                string s = channel.PostData(url, parameters, timeoutms);

                if (s == null)
                {
                    string networkerrorcode = CheckNetworkError(internetgatewayip);
                    if (networkerrorcode != null)
                    {
                        ErrorMessage = networkerrorcode;
                    }
                    else
                    {
                        ErrorMessage = "UNKNOWN:SendReportError:" + channel.GetErrorMessage();
                    }
                    return EServiceClientReturnCode.NetworkError;
                }

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "SendReportError:received : [" + s + "]");

                if (s.StartsWith("error"))
                {
                    ErrorMessage = errorprefix + "SendReportError:Invalid return message from gateway: [" + s +"]";
                    LogHelper.WriteLine(ELogLevel.error, errorprefix + ErrorMessage);
                    return EServiceClientReturnCode.GatewayError;
                }
                else
                {
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "SendReportError:Valid return message from gateway");
                    //pas besoin de récuperer le retour
                    return EServiceClientReturnCode.Success;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "SendReportError:" + ex.Message;
                return EServiceClientReturnCode.InternalError;
            }
            finally
            {
                m.ReleaseMutex();
            }

        }
        public string GetErrorMessage()
        {
            m.WaitOne();
            try
            {
                return ErrorMessage;
            }
            finally
            {
                m.ReleaseMutex();
            }
        }
        private string CheckNetworkError(string internetgatewayip)
        {
            //check isnetworkavailable
            if (!NetworkInterface.GetIsNetworkAvailable())
            {
                return "INTERFACE NOT AVAILABLE:(GetIsNetworkAvailable)";
            }
            
            //check internet gatewayip
            try
            {
                if (new Ping().Send(internetgatewayip).Status != IPStatus.Success)
                {
                    return "PING " + internetgatewayip + ":NOT AVAILABLE";
                }
            }
            catch (PingException ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.InnerException.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.InnerException.StackTrace);
                return "PING " + internetgatewayip + ":" +ex.InnerException.Message;
            }
            catch (Exception exe)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + exe.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + exe.StackTrace);
                return "PING " + internetgatewayip + ":" + exe.Message;
            }

            //check mobminder server
            Uri uri = new Uri(baseurl);
            try
            {
                if (new Ping().Send(uri.Host).Status != IPStatus.Success)
                {
                    return "PING "+uri.Host+":NOT AVAILABLE";
                }
            }
            catch (PingException ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.InnerException.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.InnerException.StackTrace);
                return "PING "+uri.Host + ":" + ex.InnerException.Message;
            }
            catch (Exception exe)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + exe.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + exe.StackTrace);
                return "PING " + uri.Host + ":" + exe.Message;
            }
            //other
            return null;
        }
        
        //private bool internalCheckOnline()
        //{
        //    try
        //    {
        //        if (!NetworkInterface.GetIsNetworkAvailable())
        //        {
        //             Network does not available.
        //            ErrorMessage = errorprefix + "internalCheckOnline:GetIsNetworkAvailable=false";
        //            return false;
        //        }

        //        Uri uri = new Uri("https://www.google.com");

        //        Ping ping = new Ping();
        //        PingReply pingReply = ping.Send(uri.Host);
        //        if (pingReply.Status != IPStatus.Success)
        //        {
        //            ErrorMessage = errorprefix + "internalCheckOnline:google pingReply=false";
        //            return false;
        //        }

        //        return true;

        //    }
        //    catch (WebException wex)
        //    {
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.Message);
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + wex.StackTrace);
        //        ErrorMessage = errorprefix + "internalCheckOnline:" + wex.Message;

        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
        //        ErrorMessage = errorprefix + "internalCheckOnline:" + ex.Message;
        //        return false;
        //    }
        //}
        public EServiceClientReturnCode Echo(string iccid,string numero, string message)
        {
            m.WaitOne();
            try
            {
                LogHelper.WriteLine(ELogLevel.log, errorprefix + "calling gateway.echo with iccid=" + iccid + ",numero=" + numero + ", message=" + message);

                string url = baseurl + "/satellite/echo.php";

                List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();
                parameters.Add(new KeyValuePair<string, string>("cid", iccid));
                parameters.Add(new KeyValuePair<string, string>("num", numero));
                parameters.Add(new KeyValuePair<string, string>("msg", message));

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);
                string s = channel.PostData(url, parameters, timeoutms);

                if (s == null)
                {
                    string networkerrorcode = CheckNetworkError(internetgatewayip);
                    if (networkerrorcode != null)
                    {
                        ErrorMessage = networkerrorcode;
                    }
                    else
                    {
                        ErrorMessage = "UNKNOWN:Echo:" + channel.GetErrorMessage();
                    }
                    return EServiceClientReturnCode.NetworkError;
                }

                LogHelper.WriteLine(ELogLevel.info, errorprefix + "received : " + s);

                if (s.StartsWith("error"))
                {
                    ErrorMessage = errorprefix + "Echo:Invalid return message from gateway: " + s;
                    LogHelper.WriteLine(ELogLevel.error, ErrorMessage);
                    return EServiceClientReturnCode.GatewayError;
                }
                else
                {
                    LogHelper.WriteLine(ELogLevel.log, errorprefix + "Echo:valid return message from gateway:" + s);
                    //pas besoin de récuperer le retour
                    return EServiceClientReturnCode.Success;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "Echo:" + ex.Message;
                return EServiceClientReturnCode.InternalError;
            }
            finally
            {
                m.ReleaseMutex();
            }
        }
        public GetBinaryResponse GetBinary(string iccid)
        {

            m.WaitOne();
            try
            {
                LogHelper.WriteLine(ELogLevel.log, errorprefix + "GetBinary:calling gateway.update with iccid=" + iccid);

                string url = baseurl + "/satellite/update.php";
                LogHelper.WriteLine(ELogLevel.info, errorprefix + "postdata to " + url);

                List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();
                parameters.Add(new KeyValuePair<string, string>("cid", iccid));

                PostDataReturnBytesResponse ret = channel.PostDataReturnBytes(url, parameters, timeoutms);
                if (ret == null)
                {
                    string networkerrorcode = CheckNetworkError(internetgatewayip);
                    if (networkerrorcode != null)
                    {
                        ErrorMessage = networkerrorcode;
                    }
                    else
                    {
                        ErrorMessage = "UNKNOWN:GetBinary:" + channel.GetErrorMessage();
                    }
                    return new GetBinaryResponse(EServiceClientReturnCode.NetworkError, null, null);
                }
                if (ret.content.Length == 0)
                {
                    ErrorMessage = errorprefix + "GetBinary : received byte array is empty!";
                    return new GetBinaryResponse(EServiceClientReturnCode.GatewayError, null, null);
                }
                else
                {
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "GetBinary:received byte array: length=" + ret.content.Length + "");
                    return new GetBinaryResponse(EServiceClientReturnCode.Success, ret.content, ret.filename);
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "GetBinary:" + ex.Message;
                return new GetBinaryResponse(EServiceClientReturnCode.InternalError, null, null);
            }
            finally
            {
                m.ReleaseMutex();
            }
        }
    }
  
}
