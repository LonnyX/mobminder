using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SmsBox
{
    public enum ELogLevel
    {
        info = 0,
        log = 1,
        warning = 2,
        error = 3
    }
    public static class MobEncoding
    {
        public const string ucs2 = "ucs2";
        public const string ascii = "ascii";
    }
    public enum ESmsReportStatus
    {
        //Synchronous feedbacks (at SMS sending time)
        MessageAccepted = 0xAA, //Message accepted by operator. 170
        MessageRejected = 0xEE, // Message rejected by operator. 238
        MessageTimeout = 0xE1, // Message rejected by operator. 225
        
        //Asynchronous feedbacks (callback from operator)
        Success = 0x00, //Short message delivered successfully
        Forwared = 0x01, // Forwarded, but status unknown
        Replaced = 0x02, // Replaced
        
        Congestion = 0x20, // Congestion, still trying
        Recipientbusy = 0x21, // Recipient busy, still trying
        NoResponseRecipient = 0x22, // No response recipient, still trying
        ServiceRejected = 0x23, // Service rejected, still trying
        QOSNotAvailableStillTrying = 0x24, // QOS not available, still trying
        RecipientError = 0x25, // Recipient error, still trying
        
        RPCError = 0x40, // RPC Error
        IncompatibleDestination = 0x41, // Incompatible destination
        ConnectionRejected = 0x42, // Connection rejected
        NotObtainable = 0x43, // Not obtainable
        QOSNotAvailable = 0x44, // QOS not available
        NoInternetworkingAvailable = 0x45, // No internetworking available
        MessageExpired = 0x46, // Message expired
        MessageDeletedBySender = 0x47, // Message deleted by sender
        MessageDeletedBySMSC = 0x48, // Message deleted by SMSC
        DoesNotExist = 0x49, //Does not exist

    }

    public class CascadeError
    {
        public string Message;
        public CascadeError Child;

        public override string ToString()
        {
            if (Child == null)
            {
                return Message;
            }
            else
            {
                return Message + "\r\n" + Child.ToString();
            }
        }
        public CascadeError(string message_, CascadeError child_)
        {
            Message = message_;
            Child = child_;
        }
        public CascadeError(string message_)
        {
            Message = message_;
            Child = null;
        }
    }

    public class SmsShieldReceivedSms
    {
        public string numero;
        public string message;
        public DateTime datereceived;
        //public DateTime dateread;
        public int index;

        public int nbpart;
        public int currentpart;
        public int groupeindex;

        public SmsShieldReceivedSms(int index_, DateTime datereceived_, string numero_, string message_,int nbpart_,int currentpart_,int groupeindex_)
        {
            index = index_;
            numero = numero_;
            message = message_;
            datereceived = datereceived_;
            //dateread = DateTime.Now;
            nbpart = nbpart_;
            currentpart = currentpart_;
            groupeindex = groupeindex_;

        }

        public override string ToString()
        {
            return "date : " + datereceived.ToLongTimeString() + ",from : " + numero + ", message : " + message;
        }
    }

    public class SmsShieldAck
    {
        public string numero;
        public DateTime datereceived;
        public DateTime dateread;
        public int index;
        public bool isAck;
        public ESmsReportStatus ackStatus;
        public int ackOriginalMessageId;

        public SmsShieldAck(int index_, DateTime datereceived_, string numero_, ESmsReportStatus ackstatus_, int ackOriginalMessageId_)
        {
            index = index_;
            numero = numero_;
            datereceived = datereceived_;
            dateread = DateTime.Now;
            ackStatus = ackstatus_;
            ackOriginalMessageId = ackOriginalMessageId_;
        }

        public override string ToString()
        {
            return "date : " + datereceived.ToLongTimeString() + ",from : " + numero;
        }
    }

    public class ReceivedSms
    {
        public int serverid;
        public string numero;
        public string message;
        //public DateTime date;
        public int lag;
        public string encoding;
    }

    public class SmsToSend
    {
        public string numero;
        public string message;
        public DateTime date;

        public int nbpart;
        public int currentpart;
        public int groupeindex;
    }

    public enum EReportErrorCode
    {
        //InternError,
        GatewayEror,
        InternalError,
        SmsShieldError,
        //GatewayAccessError
        NetworkError
    }

    public class ReportError
    {
        public EReportErrorCode errorcode;
        public string errorMessage;

        public ReportError(EReportErrorCode errorcode_, string errorMessage_)
        {
            errorcode = errorcode_;
            errorMessage = errorMessage_;
        }
        public override string ToString()
        {
            return errorcode.ToString() + ":" + errorMessage;
        }
    }

    public enum EServiceClientReturnCode
    {
        Success,
        //InternetError,
        NetworkError,
        //GatewayAccessError,
        InternalError,
        GatewayError
    }

    class simulatorStructure
    {
        public string newindex;
        public DateTime? dtsent;
        public DateTime? dtack;
        public ESmsReportStatus status;
        public string number;

        public override string ToString()
        {
            return "BUFFER:newindex=" + newindex + ",number=" + number + ", dtsent=" + dtsent + ",dtack=" + dtack + ",status=" + status;
        }
    }

    static class QueueStructureHelper
    {
        public static string CreateSmsQueueStructure(int serverid, string numero, string message,string encoding)
        {
            List<string> smsstructure = new List<string>();
            smsstructure.Add(serverid.ToString());
            smsstructure.Add(numero);
            smsstructure.Add(message);
            smsstructure.Add(encoding);
                            
            return string.Join(Program.stringseparator, smsstructure.ToArray());
        }
    }

}
