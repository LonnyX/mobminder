using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SmsBox
{
    public class SimulatorServiceClient : IServiceClient
    {
        private const string errorprefix = "SimulatorServiceClient.";
        private int counter = 0;
        private int max = 1;
        private List<simulatorStructure> buffer;
        public SimulatorServiceClient()
        {
            buffer = new List<simulatorStructure>();
        }
        public bool Open()
        {
            return true;
        }
        public bool Close()
        {
            return true;
        }
        public bool IsOnline()
        {
            return true;
        }
        public EServiceClientReturnCode GetSmsToSend(string iccid, List<ReceivedSms> listsms, int csq, int ptmp, bool pwr, string version, string signature, out string command)
        {
            List<ReceivedSms> res = new List<ReceivedSms>();
            command = null;
            //TESTING
            //sms = null;
            //return EServiceClientReturnCode.InternetError;

            foreach (simulatorStructure data in buffer)
            {
                //if (data.status != ESmsReportStatus.Success)
                //{
                System.Console.WriteLine(data);
                //}
            }

           

            counter++;
            if (counter <= max)
            {
                ReceivedSms sms = new ReceivedSms();
                //sms.isSmsAvailable = true;
                sms.serverid = 999;
                sms.numero = "+32497462820";
                //sms.numero = "+32493810271";

                //sms.numero = "+32123456789";
                //sms.numero = "+32497123456";//"
                sms.message = "bientôt noël ! coucou bernard! il est : " + DateTime.Now.ToString("HH:mm:ss");
                //sms.message = "début0000000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999000000000011111111112222222222333333333344444444445555555555566666666667777777777888888888889999999999fin";
                //sms.date = DateTime.Now;
                sms.lag = 3;
                res.Add(sms);
                return EServiceClientReturnCode.Success;
            }
            else
            {
                //sms = null;
                return EServiceClientReturnCode.Success;
            }
        }
        public EServiceClientReturnCode UpdateSmsStatus(string iccid, int serverindex, int shieldindex, string tophonenumber, int mobminderstatus)
        {
            //TESTING
            //return EServiceClientReturnCode.InternetError;

            LogHelper.WriteLine(ELogLevel.info, errorprefix + "SimulatorServiceClient.UpdateSmsStatus for index " + serverindex + ",shieldindex " + shieldindex + ", and status : " + mobminderstatus.ToString());

            string newindex = tophonenumber + shieldindex.ToString("000");

            ESmsReportStatus emobminderstatus = (ESmsReportStatus)mobminderstatus;

            if (emobminderstatus == ESmsReportStatus.MessageRejected || emobminderstatus == ESmsReportStatus.MessageAccepted)
            {
                if (buffer.Count(d => d.newindex == newindex) == 0)
                {
                    simulatorStructure data = new simulatorStructure();
                    data.newindex = newindex;
                    data.dtsent = DateTime.Now;
                    data.dtack = null;
                    data.status = emobminderstatus;
                    data.number = tophonenumber;
                    buffer.Add(data);
                }
                else
                {
                    simulatorStructure data = buffer.First(d => d.newindex == newindex);
                    data.dtsent = DateTime.Now;

                }
            }
            else
            {
                if (buffer.Count(d => d.newindex == newindex) == 0)
                {
                    //error

                    simulatorStructure data = new simulatorStructure();
                    data.newindex = newindex;
                    data.dtsent = null;
                    data.dtack = DateTime.Now;
                    data.status = emobminderstatus;
                    data.number = tophonenumber;
                    buffer.Add(data);

                }
                else
                {
                    simulatorStructure data = buffer.First(d => d.newindex == newindex);
                    data.dtack = DateTime.Now;
                    data.status = emobminderstatus;

                }
            }

            return EServiceClientReturnCode.Success;
        }
        public EServiceClientReturnCode SendReceivedSMS(string iccid, string numero, int csq, string message, int nbpart, int currentpart, int groupindex)
        {
            LogHelper.WriteLine(ELogLevel.info, errorprefix + "SimulatorServiceClient.SendReceivedSMS from numero " + numero + ", message : " + message);
            return EServiceClientReturnCode.Success;
        }
        public EServiceClientReturnCode SendReportError(string iccid, int csq, string code, string msg, int operatorid, int ptmp, bool pwr)
        {
            //TESTING
            //return EServiceClientReturnCode.InternetError;

            LogHelper.WriteLine(ELogLevel.info, errorprefix + "SimulatorServiceClient.SendReportError : " + code + "," + msg);
            return EServiceClientReturnCode.Success;
        }
        public string GetErrorMessage()
        {
            return "simulating error";
        }
        public EServiceClientReturnCode Echo(string iccid,string numero, string message)
        {
            return EServiceClientReturnCode.InternalError;
        }
        public GetBinaryResponse GetBinary(string iccid)
        {
            GetBinaryResponse ret = new GetBinaryResponse(EServiceClientReturnCode.Success,null,null);
            return ret;
        }
    }
}
