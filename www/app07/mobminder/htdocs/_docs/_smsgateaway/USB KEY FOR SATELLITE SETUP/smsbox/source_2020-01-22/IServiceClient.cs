using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SmsBox
{
    public class GetBinaryResponse
    {
        public EServiceClientReturnCode ret;
        public byte[] content;
        public string filename;

        public GetBinaryResponse(EServiceClientReturnCode ret_, byte[] content_, string filename_)
        {
            ret = ret_;
            content = content_;
            filename = filename_;
        }
    }

    public interface IServiceClient
    {
        //bool CheckAlive();
        //bool IsOnline();
        bool Open();
        bool Close();
        EServiceClientReturnCode GetSmsToSend(string iccid, List<ReceivedSms> listsms, int csq,int ptmp,bool pwr,string version,string signature, out string command);
        EServiceClientReturnCode UpdateSmsStatus(string iccid, int serverindex, int shieldindex, string tophonenumber, int mobminderstatus);
        EServiceClientReturnCode SendReceivedSMS(string iccid, string numero, int csq, string message, int nbpart, int currentpart, int groupindex);
        EServiceClientReturnCode SendReportError(string iccid, int csq, string code, string msg, int operatorid,int ptmp,bool pwr);
        EServiceClientReturnCode Echo(string iccid,string numero, string message);
        GetBinaryResponse GetBinary(string iccid);
        string GetErrorMessage();
    }
}
