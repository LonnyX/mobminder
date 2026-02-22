using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace SmsBox
{
    //================> Used to encoding GSM message as UCS2
    public class UCSEncoding
    {
        public static String UnicodeStr2HexStr(String strMessage)
        {
            byte[] ba = Encoding.BigEndianUnicode.GetBytes(strMessage);
            String strHex = BitConverter.ToString(ba);
            strHex = strHex.Replace("-", "");
            return strHex;
        }

        public static String HexStr2UnicodeStr(String strHex)
        {
            byte[] ba = HexStr2HexBytes(strHex);
            return HexBytes2UnicodeStr(ba);
        }

        //================> Used to decoding GSM UCS2 message  
        public static String HexBytes2UnicodeStr(byte[] ba)
        {
            var strMessage = Encoding.BigEndianUnicode.GetString(ba, 0, ba.Length);
            return strMessage;
        }

        public static byte[] HexStr2HexBytes(String strHex)
        {
            strHex = strHex.Replace(" ", "");
            int nNumberChars = strHex.Length / 2;
            byte[] aBytes = new byte[nNumberChars];
            using (var sr = new StringReader(strHex))
            {
                for (int i = 0; i < nNumberChars; i++)
                    aBytes[i] = Convert.ToByte(new String(new char[2] { (char)sr.Read(), (char)sr.Read() }), 16);
            }
            return aBytes;
        }
    }
}