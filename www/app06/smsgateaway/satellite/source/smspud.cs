using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace SmsBox
{
    class UnknownSMSTypeException : Exception
    {
        public UnknownSMSTypeException(byte pduType) :
            base(string.Format("Unknow SMS type. PDU type binary: {0}.", Convert.ToString(pduType, 2))) { }
    }

    public class SMS : SMSBase
    {
        #region Members
        protected bool _moreMessagesToSend;
        protected bool _rejectDuplicates;
        protected byte _messageReference;
        protected string _phoneNumber;
        protected byte _protocolIdentifier;
        protected byte _dataCodingScheme;
        protected byte _validityPeriod;
        protected DateTime _serviceCenterTimeStamp;
        protected string _userData;
        protected byte[] _userDataHeader;
        protected string _message;
        protected byte[] _ascii7message = null;
        #endregion


        #region Properties
        public DateTime ServiceCenterTimeStamp { get { return _serviceCenterTimeStamp; } }

        public byte MessageReference
        {
            get { return _messageReference; }
            set { _messageReference = value; }
        }

        public string PhoneNumber
        {
            get { return _phoneNumber; }
            set { _phoneNumber = value; }
        }

        public string Message
        {
            get { return _message; }
            set
            {
                //if (value.Length > 70)
                //throw new ArgumentOutOfRangeException("Message.Length", value.Length, "Message length can not be greater that 70 chars.");

                _message = value;
            }
        }
        public byte[] Ascii7Message
        {
            get { return _ascii7message; }
            set
            {
                //if (value.Length > 70)
                //throw new ArgumentOutOfRangeException("Message.Length", value.Length, "Message length can not be greater that 70 chars.");

                _ascii7message = value;
            }
        }

        public bool RejectDuplicates
        {
            get
            {
                if (Direction == SMSDirection.Received)
                    throw new InvalidOperationException("Received message can not contains 'reject duplicates' property");

                return _rejectDuplicates;
            }
            set
            {
                if (Direction == SMSDirection.Received)
                    throw new InvalidOperationException("Received message can not contains 'reject duplicates' property");

                _rejectDuplicates = value;
            }
        }

        public bool MoreMessagesToSend
        {
            get
            {
                if (Direction == SMSDirection.Received)
                    throw new InvalidOperationException("Submited message can not contains 'more message to send' property");

                return _moreMessagesToSend;
            }
            set
            {
                if (Direction == SMSDirection.Received)
                    throw new InvalidOperationException("Submited message can not contains 'more message to send' property");

                _moreMessagesToSend = value;
            }
        }

        public TimeSpan ValidityPeriod
        {
            get
            {
                if (_validityPeriod > 196)
                    return new TimeSpan((_validityPeriod - 192) * 7, 0, 0, 0);

                if (_validityPeriod > 167)
                    return new TimeSpan((_validityPeriod - 166), 0, 0, 0);

                if (_validityPeriod > 143)
                    return new TimeSpan(12, (_validityPeriod - 143) * 30, 0);

                return new TimeSpan(0, (_validityPeriod + 1) * 5, 0);
            }
            set
            {
                if (value.Days > 441)
                    throw new ArgumentOutOfRangeException("TimeSpan.Days", value.Days, "Value must be not greater 441 days.");

                if (value.Days > 30) //Up to 441 days
                    _validityPeriod = (byte)(192 + (int)(value.Days / 7));
                else if (value.Days > 1) //Up to 30 days
                    _validityPeriod = (byte)(166 + value.Days);
                else if (value.Hours > 12) //Up to 24 hours
                    _validityPeriod = (byte)(143 + (value.Hours - 12) * 2 + value.Minutes / 30);
                else if (value.Hours > 1 || value.Minutes > 1) //Up to 12 days
                    _validityPeriod = (byte)(value.Hours * 12 + value.Minutes / 5 - 1);
                else
                {
                    _validityPeriodFormat = ValidityPeriodFormat.FieldNotPresent;

                    return;
                }

                _validityPeriodFormat = ValidityPeriodFormat.Relative;
            }
        }

        public virtual byte[] UserDataHeader { get { return _userDataHeader; } }

        #region "in parts" message properties
        //public bool  InParts
        //{
        //    get
        //    {
        //        if (_userDataHeader == null || _userDataHeader.Length < 5)
        //            return false;

        //        if 

        //        return (_userDataHeader[0] == 0x00 && _userDataHeader[1] == 0x03); // | 08 04 00 | 9F 02 | i have this header from siemenes in "in parts" message
        //    }
        //}

        //public int InPartsID
        //{
        //    get
        //    {
        //        if (!InParts)
        //            return 0;

        //        return (_userDataHeader[2] << 8) + _userDataHeader[3];
        //    }
        //}

        //public int Part
        //{
        //    get
        //    {
        //        if (!InParts)
        //            return 0;

        //        return _userDataHeader[4];
        //    }
        //}
        private bool isUdhValid
        {
            get
            {
                if (_userDataHeader == null) return false;
                else if ((_userDataHeader.Length != 5) && (_userDataHeader.Length != 6)) return false;
                else return true;
            }
        }
        private bool isCsms16Bit
        {
            get
            {
                if (!isUdhValid) return false;

                return (_userDataHeader[0] == 0x08);
            }
        }
        public int CsmsReferenceNumber
        {
            get
            {
                if (!isUdhValid) return 0;

                if (!isCsms16Bit) //CSMS 8 bit
                {
                    return _userDataHeader[2];
                }
                else //CSMS 16 bit
                {
                    return (_userDataHeader[2] << 8) + _userDataHeader[3];
                }
            }
        }
        public int TotalNumberOfParts
        {
            get
            {
                if (!isUdhValid) return 1; //no UDH => only one part!

                if (!isCsms16Bit)
                {
                    return _userDataHeader[3];
                }
                else
                {
                    return _userDataHeader[4];
                }
            }
        }
        public int ThisPartsNumber
        {
            get
            {
                if (!isUdhValid) return 1; //no UDH => only one part! => this part's number = 1!

                if (!isCsms16Bit)
                {
                    return _userDataHeader[4];
                }
                else
                {
                    return _userDataHeader[5];
                }
            }
        }


        #endregion

        public override SMSType Type { get { return SMSType.SMS; } }
        #endregion

        #region Public Statics
        public static void Fetch(SMS sms, ref string source)
        {
            SMSBase.Fetch(sms, ref source);

            if (sms._direction == SMSDirection.Submited)
                sms._messageReference = PopByte(ref source);

            sms._phoneNumber = PopPhoneNumber(ref source);
            sms._protocolIdentifier = PopByte(ref source);
            sms._dataCodingScheme = PopByte(ref source);

            if (sms._direction == SMSDirection.Submited)
                sms._validityPeriod = PopByte(ref source);

            if (sms._direction == SMSDirection.Received)
                sms._serviceCenterTimeStamp = PopDate(ref source);

            sms._userData = source;

            if (source == string.Empty)
                return;

            int userDataLength = PopByte(ref source);

            if (userDataLength == 0)
                return;

            SMSEncoding encoding = (SMSEncoding)sms._dataCodingScheme & SMSEncoding.ReservedMask;

            int totalpduheaderlength = 0;

            if (sms._userDataStartsWithHeader)
            {
                byte userDataHeaderLength = PopByte(ref source);

                sms._userDataHeader = PopBytes(ref source, userDataHeaderLength);

                userDataLength -= userDataHeaderLength + 1;

                totalpduheaderlength = userDataHeaderLength + 1;
            }

            if (userDataLength == 0)
                return;

            if (encoding == SMSEncoding._7bit)
            {
                //source = ConvertSeptet2Octetbernard(source, userDataLength, totalpduheaderlength);
                source = PascalDecoder.ConvertSeptet2Octetpascal(source, totalpduheaderlength);
                sms._message = DecodeAscii7bit(source, userDataLength);
            }
            else if (encoding == SMSEncoding._8bit)
            {
                sms._message = Decode8bit(source, userDataLength);
            }
            else if (encoding == SMSEncoding.UCS2)
            {
                sms._message = DecodeUCS2(source, userDataLength);
            }
        }
        #endregion

        #region Publics

        public override void ComposePDUType()
        {
            base.ComposePDUType();

            if (_moreMessagesToSend || _rejectDuplicates)
                _pduType = (byte)(_pduType | 0x04);

            if (_userDataStartsWithHeader)
            {
                //bit 6
                _pduType = (byte)(_pduType | 0x40);
                _pduType = (byte)(_pduType | 0x20);
            }
        }

        public virtual string Compose(SMSEncoding messageEncoding, int csmsreference, int totalnumberofpart, int thispartsnumber)
        {
            if (csmsreference == -1)
            {
                UserDataStartsWithHeader = false;
            }
            else
            {
                UserDataStartsWithHeader = true;
            }

            ComposePDUType();

            string encodedData = "00"; //Length of SMSC information. Here the length is 0, which means that the SMSC stored in the phone should be used. Note: This octet is optional. On some phones this octet should be omitted! (Using the SMSC stored in phone is thus implicit)

            encodedData += Convert.ToString(_pduType, 16).PadLeft(2, '0'); //PDU type (forst octet)

            encodedData += Convert.ToString(MessageReference, 16).PadLeft(2, '0');
            encodedData += EncodePhoneNumber(PhoneNumber);
            encodedData += "00"; //Protocol identifier (Short Message Type 0)
            
            encodedData += Convert.ToString((int)messageEncoding, 16).PadLeft(2, '0'); //Data coding scheme
            //encodedData += Convert.ToString((int)2, 16).PadLeft(2, '0'); //Data coding scheme

            if (_validityPeriodFormat != ValidityPeriodFormat.FieldNotPresent)
                encodedData += Convert.ToString(_validityPeriod, 16).PadLeft(2, '0'); //Validity Period


            byte[] messageBytes = null;

            int msglen;

            switch (messageEncoding)
            {
                case SMSEncoding.UCS2:
                    messageBytes = EncodeUCS2(_message);

                    msglen = messageBytes.Length;
                    if (csmsreference != -1)
                        msglen = msglen + 6;

                    break;
                case SMSEncoding._8bit:
                    //Encoding extAscii = Encoding.GetEncoding(437);
                    //Encoding win1252 = Encoding.GetEncoding(1252);
                    //byte[] bytes1252 = win1252.GetBytes(_message);
                    //messageBytes = Encoding.Convert(win1252, extAscii, bytes1252);//use of the objects

                    //Encoding extAscii = Encoding.GetEncoding(437);
                    //byte[] bytes437 = extAscii.GetBytes(_message);
                    //messageBytes = Encoding.Convert(extAscii, Encoding.UTF8, bytes437);//use of the objects

                    //le é est remplacé par un ?
                    //messageBytes = Encoding.ASCII.GetBytes(_message);

                    //perd le é ! le caractère est perdu
                    //messageBytes = BspGSM7BitDecoder.GSMChar(_message);
                
                    //sms perdu!
                    //messageBytes = Encoding.GetEncoding(437).GetBytes(_message);

                    //bug génère 2 fois trop d ebyte
                    //messageBytes = EncodeUCS2(_message);

                    byte[] utf8bytes = Encoding.UTF8.GetBytes(_message);
                    messageBytes = Encoding.Convert(Encoding.UTF8, Encoding.GetEncoding(437), utf8bytes);
                    msglen = messageBytes.Length;
                    if (csmsreference != -1)
                        msglen = msglen + 6;
                    break;
                default:
                    //messageBytes = new byte[0];
                    byte[] tmp = (Ascii7Message!=null?Ascii7Message:BspGSM7BitDecoder.GSMChar(_message));
                    int pduheaderlen = (csmsreference == -1) ? 0 : 6;
                    //messageBytes = ConvertOctet2Septedbernard(tmp, pduheaderlen);
                    messageBytes = PascalDecoder.bit7_stream(tmp, pduheaderlen);
                    msglen = tmp.Length;
                    if (csmsreference != -1)
                        msglen = msglen + 7;
                    break;
            }

            if (csmsreference == -1)
            {
                //encodedData += Convert.ToString(messageBytes.Length, 16).PadLeft(2, '0'); //Length of message
                encodedData += Convert.ToString(msglen, 16).PadLeft(2, '0'); //Length of message
                foreach (byte b in messageBytes)
                {
                    encodedData += Convert.ToString(b, 16).PadLeft(2, '0');
                }
            }
            else
            {
                //int messagelength = messageBytes.Length + 6;
                //encodedData += Convert.ToString(messagelength, 16).PadLeft(2, '0'); //Length of message
                encodedData += Convert.ToString(msglen, 16).PadLeft(2, '0'); //Length of message

                encodedData += Convert.ToString((int)5, 16).PadLeft(2, '0');
                encodedData += Convert.ToString((int)0, 16).PadLeft(2, '0');
                encodedData += Convert.ToString((int)3, 16).PadLeft(2, '0');
                encodedData += Convert.ToString(csmsreference, 16).PadLeft(2, '0');
                encodedData += Convert.ToString(totalnumberofpart, 16).PadLeft(2, '0');
                encodedData += Convert.ToString(thispartsnumber, 16).PadLeft(2, '0');

                foreach (byte b in messageBytes)
                {
                    encodedData += Convert.ToString(b, 16).PadLeft(2, '0');
                }
            }


            return encodedData.ToUpper();
        }

        #endregion

        public enum SMSEncoding
        {
            ReservedMask = 0x0C /*1100*/,
            _7bit = 0,
            _8bit = 0x04 /*0100*/,
            UCS2 = 0x08 /*1000*/
        }
    }

    public enum SMSDirection
    {
        Received = 0,
        Submited = 1
    }

    public enum SMSType
    {
        SMS = 0,
        StatusReport = 1
    }

    public enum ValidityPeriodFormat
    {
        FieldNotPresent = 0,
        Relative = 0x10,
        Enhanced = 0x08,
        Absolute = 0x18
    }

    public abstract class SMSBase
    {
        #region Public Statics (Pops, Peeks, Gets)

        public static byte[] GetInvertBytes(string source)
        {
            byte[] bytes = GetBytes(source);

            Array.Reverse(bytes);

            return bytes;
        }

        public static byte[] GetBytes(string source)
        {
            return GetBytes(source, 16);
        }

        public static byte[] GetBytes(string source, int fromBase)
        {
            List<byte> bytes = new List<byte>();

            for (int i = 0; i < source.Length / 2; i++)
                bytes.Add(Convert.ToByte(source.Substring(i * 2, 2), fromBase));

            return bytes.ToArray();
        }

        public static string ConvertSeptet2Octetbernard(string source, int length, int lengthudhpart)
        {
            //If 7 bit data is used and the TP-UD-Header does not finish on a septet boundary then fill bits are inserted 
            //after the last Information Element Data octet so that there is an integral number of septets for the entire 
            //TP-UD header. This is to ensure that the SM itself starts on an octet boundary so that an earlier phase mobile 
            //will be capable of displaying the SM itself although the TP-UD Header in the TP-UD field may not be understood

            int Offset = 7 - ((lengthudhpart * 8) % 7);  // fill bits

            byte[] bytes = GetInvertBytes(source);

            string binary = string.Empty;

            foreach (byte b in bytes)
            {
                binary += Convert.ToString(b, 2).PadLeft(8, '0');
            }

            binary = "0000000" + binary;

            if (lengthudhpart != 0)
            {
                if (Offset != 0)
                {
                    binary = binary.Substring(0, binary.Length - Offset);
                }
            }

            /*if (binary.Length % 7 != 0)
            {
                binary = binary.Substring(0, binary.Length - 1);
                length = binary.Length / 7;
            }*/


            //string result = string.Empty;

            List<byte> target = new List<byte>();
            for (int i = 1; i <= length; i++)
            {
                string tmp = binary.Substring(binary.Length - i * 7, 7);
                byte b = Convert.ToByte(tmp, 2);
                if (b != 0) target.Add(b);
            }

            byte[] array = target.ToArray();
            string res = string.Concat(array.Select(b => b.ToString("X2")).ToArray());
            return res;


            //return result;
            //return result.Replace('\x0', '\x40');

            //byte[] tmp1 = PduBitPacker.ConvertHexToBytes(source);
            //byte[] tmp2 = PduBitPacker.UnpackBytes(tmp1);
            //string targethexa = PduBitPacker.ConvertBytesToHex(tmp2);
            //string res = Decode8bit(targethexa, targethexa.Length / 2);
            //return res;


        }
        public static byte[] ConvertOctet2Septedbernard(byte[] bytes, int lengthudhpart)
        {
            //le lengthudhpart ne sert pas à l'envoi! donc pas d'offset ???
            //lengthudhpart = 0;

            int modulo = bytes.Length * 7 % 8;
            int length = bytes.Length * 7 / 8;
            if (modulo != 0) length++;

            int Offset = 7 - ((lengthudhpart * 8) % 7);  // fill bits

            Array.Reverse(bytes);

            string binary = string.Empty;

            foreach (byte b in bytes)
            {
                binary += Convert.ToString(b, 2).PadLeft(8, '0').Substring(1, 7);
            }

            binary = "00000000" + binary;

            if (lengthudhpart != 0)
            {
                if (Offset != 0)
                {
                    binary = binary + new string('0',Offset);
                }
            }

            /*if (binary.Length % 7 != 0)
            {
                binary = binary.Substring(0, binary.Length - 1);
                length = binary.Length / 7;
            }*/


            //string result = string.Empty;

            List<byte> target = new List<byte>();
            for (int i = 1; i <= length; i++)
            {
                string tmp = binary.Substring(binary.Length - i * 8, 8);
                byte b = Convert.ToByte(tmp, 2);
                //if (b != 0) 
                target.Add(b);
            }

            byte[] array = target.ToArray();
            return array;
        }


        public static string DecodeAscii7bit(string ssource, int length)
        {
            byte[] source = UCSEncoding.HexStr2HexBytes(ssource);
            string fullstring = new BspGSM7BitDecoder().GetCharsFromBytes(source);
            
            //double check!
            if (fullstring.Length > length)
            {
                fullstring = fullstring.Substring(0, length);
            }
            return fullstring;
        }

        public static string Decode8bit(string source, int length)
        {
            byte[] bytes = GetBytes(source.Substring(0, length * 2));

            //or ASCII?
            return Encoding.UTF8.GetString(bytes);
        }


        public static string DecodeUCS2(string source, int length)
        {
            byte[] bytes = GetBytes(source.Substring(0, length * 2));

            return Encoding.BigEndianUnicode.GetString(bytes);
        }

        public static byte[] EncodeUCS2(string s)
        {
            return Encoding.BigEndianUnicode.GetBytes(s);
        }

        public static string ReverseBits(string source)
        {
            return ReverseBits(source, source.Length);
        }

        public static string ReverseBits(string source, int length)
        {
            string result = string.Empty;

            for (int i = 0; i < length; i++)
                result = result.Insert(i % 2 == 0 ? i : i - 1, source[i].ToString());

            return result;
        }

        public static byte PeekByte(string source)
        {
            return PeekByte(source, 0);
        }

        public static byte PeekByte(string source, int byteIndex)
        {
            return Convert.ToByte(source.Substring(byteIndex * 2, 2), 16);
        }

        public static byte PopByte(ref string source)
        {
            byte b = Convert.ToByte(source.Substring(0, 2), 16);

            source = source.Substring(2);

            return b;
        }

        public static byte[] PopBytes(ref string source, int length)
        {
            string bytes = source.Substring(0, length * 2);

            source = source.Substring(length * 2);

            return GetBytes(bytes);
        }

        public static DateTime PopDate(ref string source)
        {
            byte[] bytes = GetBytes(ReverseBits(source.Substring(0, 12)), 10);

            source = source.Substring(14);

            return new DateTime(2000 + bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5]);
        }

        public static string PopPhoneNumber(ref string source)
        {
            int numberLength = PopByte(ref source);

            if ((numberLength = numberLength + 2) == 2)
                return string.Empty;

            return PopAddress(ref source, numberLength + (numberLength % 2));
        }

        public static string PopServiceCenterAddress(ref string source)
        {
            int addressLength = PopByte(ref source);

            if ((addressLength = addressLength * 2) == 0)
                return string.Empty;

            return PopAddress(ref source, addressLength);
        }

        public static string PopAddress(ref string source, int length)
        {
            string address = source.Substring(0, length);

            source = source.Substring(address.Length);

            byte addressType = PopByte(ref address);

            address = ReverseBits(address).Trim('F');

            if (0x09 == addressType >> 4)
                address = "+" + address;

            return address;
        }

        public static SMSType GetSMSType(string source)
        {
            byte scaLength = PeekByte(source);
            byte pduType = PeekByte(source, scaLength + 1);

            byte smsType = (byte)((pduType & 3) >> 1);

            if (!Enum.IsDefined(typeof(SMSType), (int)smsType))
                throw new UnknownSMSTypeException(pduType);

            return (SMSType)smsType;
        }

        public static void Fetch(SMSBase sms, ref string source)
        {
            sms._serviceCenterNumber = PopServiceCenterAddress(ref source);

            sms._pduType = PopByte(ref source);

            System.Collections.BitArray bits = new System.Collections.BitArray(new byte[] { sms._pduType });

            sms.ReplyPathExists = bits[7];
            sms.UserDataStartsWithHeader = bits[6];
            sms.StatusReportIndication = bits[5];

            sms.ValidityPeriodFormat = (ValidityPeriodFormat)(sms._pduType & 0x18);
            sms.Direction = (SMSDirection)(sms._pduType & 1);
        }

        #endregion

        #region Public Statics (Push)

        public static string EncodePhoneNumber(string phoneNumber)
        {
            bool isInternational = phoneNumber.StartsWith("+");

            if (isInternational)
                phoneNumber = phoneNumber.Remove(0, 1);

            int header = (phoneNumber.Length << 8) + 0x81 | (isInternational ? 0x10 : 0x20);

            if (phoneNumber.Length % 2 == 1)
                phoneNumber = phoneNumber.PadRight(phoneNumber.Length + 1, 'F');

            phoneNumber = ReverseBits(phoneNumber);

            return Convert.ToString(header, 16).PadLeft(4, '0') + phoneNumber;
        }

        #endregion

        #region Publics

        public virtual void ComposePDUType()
        {
            _pduType = (byte)Direction;
            _pduType = (byte)(_pduType | (int)ValidityPeriodFormat);

            if (StatusReportIndication)
                _pduType = (byte)(_pduType | 0x20);
        }

        #endregion

        #region Members
        //protected SMSType _type;
        protected byte _pduType;
        protected string _serviceCenterNumber;

        #region PDU type (first octet) data
        //Reply path. Parameter indicating that reply path exists.
        protected bool _replyPathExists;
        //User data header indicator. This bit is set to 1 if the User Data field starts with a header. (EMS?)
        protected bool _userDataStartsWithHeader;
        //Status report indication. This bit is set to 1 if a status report is going to be returned to the SME.
        protected bool _statusReportIndication;
        //Validity Period Format
        protected ValidityPeriodFormat _validityPeriodFormat = ValidityPeriodFormat.FieldNotPresent;
        //Message type indication
        //First bit
        protected SMSDirection _direction;
        #endregion

        #endregion

        #region Proreties
        public string ServiceCenterNumber
        {
            get { return _serviceCenterNumber; }
            set { _serviceCenterNumber = value; }
        }

        public bool ReplyPathExists
        {
            get { return _replyPathExists; }
            set { _replyPathExists = value; }
        }

        public bool UserDataStartsWithHeader
        {
            get { return _userDataStartsWithHeader; }
            set { _userDataStartsWithHeader = value; }
        }

        public bool StatusReportIndication
        {
            get { return _statusReportIndication; }
            set { _statusReportIndication = value; }
        }

        public ValidityPeriodFormat ValidityPeriodFormat
        {
            get { return _validityPeriodFormat; }
            set { _validityPeriodFormat = value; }
        }

        public SMSDirection Direction
        {
            get { return _direction; }
            set { _direction = value; }
        }

        public abstract SMSType Type { get; }
        #endregion

    }

    public enum ReportStatus
    {
        NoResponseFromSME = 0x62,
        NotSend = 0x60,
        Success = 0
    }

    public class SMSStatusReport : SMSBase
    {
        #region Members
        protected DateTime _reportTimeStamp;
        protected ReportStatus _reportStatus;
        protected byte _messageReference;
        protected string _phoneNumber;
        protected DateTime _serviceCenterTimeStamp;
        #endregion

        #region Public Properties
        public byte MessageReference { get { return _messageReference; } }
        public string PhoneNumber { get { return _phoneNumber; } }
        public DateTime ServiceCenterTimeStamp { get { return _serviceCenterTimeStamp; } }
        public DateTime ReportTimeStamp { get { return _reportTimeStamp; } }
        public ReportStatus ReportStatus { get { return _reportStatus; } }

        public override SMSType Type { get { return SMSType.StatusReport; } }
        #endregion

        #region Public Statics
        public static void Fetch(SMSStatusReport statusReport, ref string source)
        {
            SMSBase.Fetch(statusReport, ref source);

            statusReport._messageReference = PopByte(ref source);
            statusReport._phoneNumber = PopPhoneNumber(ref source);
            statusReport._serviceCenterTimeStamp = PopDate(ref source);
            statusReport._reportTimeStamp = PopDate(ref source);
            statusReport._reportStatus = (ReportStatus)PopByte(ref source);
        }
        #endregion
    }

    public static class PascalDecoder
    {
        public static string Decode7bitpascalold(string ssource, int lengthudhpart)
        {
            //int Offset = 7 - ((lengthudhpart * 8) % 7);  // fill bits

            byte[] source = UCSEncoding.HexStr2HexBytes(ssource);
            uint cut = 127; 	// base_convert('0000000001111111', 2, 10);
            uint mask = 65408; // base_convert('1111111110000000', 2, 10);
            uint rest = 0;
            int s = 0;
            List<byte> target = new List<byte>();
            //foreach (byte bb in source)
            for (int i = 0; i < source.Length; i++)
            {
                byte bb = source[i];

                //if (lengthudhpart != 0)
                //if (i == 0 && lengthudhpart != 0)
                //{
                //    bb = (byte)(bb >> Offset);
                //}

                uint b = (uint)bb;
                uint sum = (uint)((b << s) | rest);

                target.Add((byte)(sum & cut)); // cut the 7 least significant bits

                rest = (uint)((sum & mask) >> 7); // move the highest zootjes to the right

                s++;

                if (s == 7)
                {
                    target.Add((byte)rest);
                    s = 0;
                    rest = 0;
                }
            }

            //return System.Text.Encoding .ASCII.GetString(target.ToArray());

            //string fullstring = new BspGSM7BitDecoder().GetCharsFromBytes(target.ToArray());
            //if (fullstring.Length > length)
            //{
            //    fullstring = fullstring.Substring(0, length);
            //}
            //return fullstring;

            //string base64 = Convert.ToBase64String(target.ToArray());
            byte[] array = target.ToArray();
            string res = string.Concat(array.Select(b => b.ToString("X2")).ToArray());
            return res;


        }
        public static string ConvertSeptet2Octetpascal(string ssource, int lengthudhpart)
        {
            int o; //offset, nbr of bits to ignore at the beginning of the chain
            if (lengthudhpart == 0)
            {
                o = 0;
            }
            else
            {
                o = 7 - ((lengthudhpart * 8) % 7);  // fill bits  
            }


            byte[] source = UCSEncoding.HexStr2HexBytes(ssource);
            uint cut = 127; 	// base_convert('0000000001111111', 2, 10);
            uint mask = 65408; // base_convert('1111111110000000', 2, 10);
            uint rest = 0;
            int s = 0;
            List<byte> target = new List<byte>();
            foreach (byte bb in source)
            //for (int i = 0; i < source.Length; i++)
            {
                //byte bb = source[i];
                //if (lengthudhpart != 0)
                //if (i == 0 && lengthudhpart != 0)
                //{
                //    bb = (byte)(bb >> Offset);
                //}

                uint b = (uint)bb;
                uint sum = (uint)((b << s) | rest);

                uint tmp = sum & (cut << o);
                tmp = tmp >> o;
                target.Add((byte)tmp); // cut the 7 least significant bits

                rest = (uint)((sum & mask) >> (7 + o)); // move the highest zootjes to the right

                s++;
                s -= o;
                o = 0; // this applies only at the beginning of the chain

                if (s == 7)
                {
                    target.Add((byte)rest);
                    s = 0;
                    rest = 0;
                }
            }

            //return System.Text.Encoding .ASCII.GetString(target.ToArray());

            //string fullstring = new BspGSM7BitDecoder().GetCharsFromBytes(target.ToArray());
            //if (fullstring.Length > length)
            //{
            //    fullstring = fullstring.Substring(0, length);
            //}
            //return fullstring;

            //string base64 = Convert.ToBase64String(target.ToArray());
            byte[] array = target.ToArray();
            string res = string.Concat(array.Select(b => b.ToString("X2")).ToArray());
            return res;


        }

        public static byte[] bit7_stream(byte[] ascii7, int lengthudhpart) 
        {
            int o; //offset, nbr of bits to ignore at the beginning of the chain
            if (lengthudhpart == 0)
            {
                o = 0;
            }
            else
            {
                o = 7 - ((lengthudhpart * 8) % 7);  // fill bits  
            }

            // packs an ascii7 array of bytes into a 7 bits stream, each most significant bit removed
            
	        // $ascii7 is an array of bytes with each a value 0-127, representing an alphanum string as per ascii7 character table
	        // $o = offset, nbr of bits to insert at the beginning of the bitstream (least significant bit)

	        uint cut7 = 127; 		// base_convert('000000000000000001111111', 2, 10);
	        uint cut8 = 255; 		// base_convert('000000000000000011111111', 2, 10);
	        uint mask  = 16776960; 	// base_convert('111111111111111100000000', 2, 10);
	        uint reg = 0; // normally, each of the input byte has a 0 highest significant bit, but we make this suer by cutting it anyway
	        int s = 8; // s = shift increment
	        
            //$str = Array(); 	// output stream
            List<byte> target = new List<byte>();
	        
            foreach(byte bb in ascii7) 
            {
                uint b = (uint)bb;
                b = b & cut7; // normally, each of the input byte has a 0 highest significant bit, but we make this sure by cutting it anyway
		        if(s==8) 
                { 
			        reg = b<<o; 
                    s--; 
			        if(o!=0)  //(if ($o)???
                    { 
                        target.Add((byte)reg); 
                        s = 9 - o; 
                        o = 0; 
                    }
			        continue; 
		        } 
		        uint sum = ( b << s ) | reg; 
		        target.Add((byte)(sum & cut8));
		        reg = (sum & mask) >> 8; // move the highest zootjes to the right
		        s--; 
                if(s==0) 
                { 
                    s = 8; 
                    reg = 0; 
                };
	        }
	        if(s!=8) 
            {
                target.Add((byte)reg);
            }
	        
            byte[] array = target.ToArray();
            //string res = string.Concat(array.Select(b => b.ToString("X2")).ToArray());
            return array;
        }
    }

    class BspGSM7BitDecoder
    {
        // Basic Character Set
        private const string BASIC_SET =
                "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1bÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?" +
                "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";

        // Basic Character Set Extension 
        private const string EXTENSION_SET =
                "````````````````````^```````````````````{}`````\\````````````[~]`" +
                "|````````````````````````````````````€``````````````````````````";

        string[] BASIC_SET_ARRAY = BASIC_SET.Select(x => x.ToString()).ToArray();
        string[] EXTENSION_SET_ARRAY = EXTENSION_SET.Select(x => x.ToString()).ToArray();

        public string GetCharsFromBytes(byte[] bsource)
        {
            StringBuilder target = new StringBuilder();
            for (int i = 0; i < bsource.Length; i++)
            {
                byte b = bsource[i];
                try
                {
                    if (b == 27)
                    {
                        byte b2 = bsource[i + 1];
                        target.Append(EXTENSION_SET_ARRAY[b2]);
                        i++;
                    }
                    else
                    {
                        target.Append(BASIC_SET_ARRAY[b]);
                    }
                }
                catch { return string.Empty; }
            }
            return target.ToString();
        }

        public static byte[] GSMChar(string PlainText)
        {
            List<byte> target = new List<byte>();

            foreach (char cPlainText in PlainText.ToCharArray())
            {
                int intGSMTable = BASIC_SET.IndexOf(cPlainText);
                if (intGSMTable != -1)
                {
                    target.Add((byte)intGSMTable);
                    continue;
                }
                int intExtendedTable = EXTENSION_SET.IndexOf(cPlainText);
                if (intExtendedTable != -1)
                {
                    target.Add((byte)27);
                    target.Add((byte)intExtendedTable);
                }
            }
            return target.ToArray();
        }
        public static bool CharExists(char cPlainText)
        {
            int intGSMTable = BASIC_SET.IndexOf(cPlainText);
            if (intGSMTable != -1)
            {
                return true;
            }
            int intExtendedTable = EXTENSION_SET.IndexOf(cPlainText);
            if (intExtendedTable != -1)
            {
                return true;
            }
            return false;
        }
        public static string CorrectUtf8String2BeReady4Ascii7GsmString(string smsmessage)
        {
            //string tmp = RemoveDiactrics.RemoveDiacritics(smsmessage);
            char[] chars = smsmessage.ToArray();
            List<char> newchars = new List<char>();
            foreach (char c in chars)
            {
                if (BspGSM7BitDecoder.CharExists(c))
                {
                    newchars.Add(c);
                }
                else
                {
                    char corrected = RemoveDiactrics.RemoveDiacritics(c);
                    if (BspGSM7BitDecoder.CharExists(c))
                    {
                        newchars.Add(corrected);
                    }
                    else
                    {
                        //newchars.Add('.');
                    }
                }
            }
            return new string(newchars.ToArray());
        }

    }
    public static class RemoveDiactrics
    {
        static Dictionary<string, string> foreign_characters = new Dictionary<string, string>
        {
            { "äæǽ", "ae" },
            { "öœ", "oe" },
            { "ü", "ue" },
            { "Ä", "Ae" },
            { "Ü", "Ue" },
            { "Ö", "Oe" },
            { "ÀÁÂÃÄÅǺĀĂĄǍΑΆẢẠẦẪẨẬẰẮẴẲẶА", "A" },
            { "àáâãåǻāăąǎªαάảạầấẫẩậằắẵẳặа", "a" },
            { "Б", "B" },
            { "б", "b" },
            { "ÇĆĈĊČ", "C" },
            { "çćĉċč", "c" },
            { "Д", "D" },
            { "д", "d" },
            { "ÐĎĐΔ", "Dj" },
            { "ðďđδ", "dj" },
            { "ÈÉÊËĒĔĖĘĚΕΈẼẺẸỀẾỄỂỆЕЭ", "E" },
            { "èéêëēĕėęěέεẽẻẹềếễểệеэ", "e" },
            { "Ф", "F" },
            { "ф", "f" },
            { "ĜĞĠĢΓГҐ", "G" },
            { "ĝğġģγгґ", "g" },
            { "ĤĦ", "H" },
            { "ĥħ", "h" },
            { "ÌÍÎÏĨĪĬǏĮİΗΉΊΙΪỈỊИЫ", "I" },
            { "ìíîïĩīĭǐįıηήίιϊỉịиыї", "i" },
            { "Ĵ", "J" },
            { "ĵ", "j" },
            { "ĶΚК", "K" },
            { "ķκк", "k" },
            { "ĹĻĽĿŁΛЛ", "L" },
            { "ĺļľŀłλл", "l" },
            { "М", "M" },
            { "м", "m" },
            { "ÑŃŅŇΝН", "N" },
            { "ñńņňŉνн", "n" },
            { "ÒÓÔÕŌŎǑŐƠØǾΟΌΩΏỎỌỒỐỖỔỘỜỚỠỞỢО", "O" },
            { "òóôõōŏǒőơøǿºοόωώỏọồốỗổộờớỡởợо", "o" },
            { "П", "P" },
            { "п", "p" },
            { "ŔŖŘΡР", "R" },
            { "ŕŗřρр", "r" },
            { "ŚŜŞȘŠΣС", "S" },
            { "śŝşșšſσςс", "s" },
            { "ȚŢŤŦτТ", "T" },
            { "țţťŧт", "t" },
            { "ÙÚÛŨŪŬŮŰŲƯǓǕǗǙǛŨỦỤỪỨỮỬỰУ", "U" },
            { "ùúûũūŭůűųưǔǖǘǚǜυύϋủụừứữửựу", "u" },
            { "ÝŸŶΥΎΫỲỸỶỴЙ", "Y" },
            { "ýÿŷỳỹỷỵй", "y" },
            { "В", "V" },
            { "в", "v" },
            { "Ŵ", "W" },
            { "ŵ", "w" },
            { "ŹŻŽΖЗ", "Z" },
            { "źżžζз", "z" },
            { "ÆǼ", "AE" },
            { "ß", "ss" },
            { "Ĳ", "IJ" },
            { "ĳ", "ij" },
            { "Œ", "OE" },
            { "ƒ", "f" },
            { "ξ", "ks" },
            { "π", "p" },
            { "β", "v" },
            { "μ", "m" },
            { "ψ", "ps" },
            { "Ё", "Yo" },
            { "ё", "yo" },
            { "Є", "Ye" },
            { "є", "ye" },
            { "Ї", "Yi" },
            { "Ж", "Zh" },
            { "ж", "zh" },
            { "Х", "Kh" },
            { "х", "kh" },
            { "Ц", "Ts" },
            { "ц", "ts" },
            { "Ч", "Ch" },
            { "ч", "ch" },
            { "Ш", "Sh" },
            { "ш", "sh" },
            { "Щ", "Shch" },
            { "щ", "shch" },
            { "ЪъЬь", "" },
            { "Ю", "Yu" },
            { "ю", "yu" },
            { "Я", "Ya" },
            { "я", "ya" },
        };

        public static char RemoveDiacritics(char c)
        {
            foreach (KeyValuePair<string, string> entry in foreign_characters)
            {
                if (entry.Key.IndexOf(c) != -1)
                {
                    return entry.Value[0];
                }
            }
            return c;
        }

        public static string RemoveDiacritics(string s)
        {
            //StringBuilder sb = new StringBuilder ();
            string text = "";


            foreach (char c in s)
            {
                int len = text.Length;

                foreach (KeyValuePair<string, string> entry in foreign_characters)
                {
                    if (entry.Key.IndexOf(c) != -1)
                    {
                        text += entry.Value;
                        break;
                    }
                }

                if (len == text.Length)
                {
                    text += c;
                }
            }
            return text;
        }
    }

}
