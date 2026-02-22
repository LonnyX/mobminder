using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO.Ports;
using System.Threading;

namespace SmsBox
{
    public class SerialWrapper
    {
        public SerialPort port;
        public CascadeError ErrorMessage;
        private const string errorprefix = "SerialWrapper.";
        private Queue queuemain;
        public SerialWrapper(Queue queuemain_)
        {
            queuemain = queuemain_;
        }
        private int internalReadTimeout;
        private Mutex mutex = new Mutex();

        public int ReadTimeout
        {
            get
            {
                try
                {
                    mutex.WaitOne();
                    //LogHelper.WriteLine(ELogLevel.info, errorprefix + "ReadTimeout.getter");
                    return internalReadTimeout;
                }
                finally
                {
                    mutex.ReleaseMutex();
                }
            }
            set
            {  
                try
                {
                    LogHelper.WriteLine(ELogLevel.info, errorprefix + "ReadTimeout.setter");
                    mutex.WaitOne();
                    internalReadTimeout = value;
                }
                finally
                {
                    mutex.ReleaseMutex();
                }
            }
        }

        public bool Open(string portname, int readtimeoutsec)
        {
            port = new SerialPort();
            port.PortName = portname;
            port.BaudRate = 9600;
            port.DataBits = 8;
            port.Parity = Parity.None;
            port.StopBits = StopBits.One;
            port.Handshake = Handshake.None;
            port.ReadBufferSize = 1024;
            port.ReadTimeout = readtimeoutsec*1000;

            try
            {
                port.Open();
                ErrorMessage = null;
                return true;
            }
            catch (Exception ex)
            {
                ErrorMessage = new CascadeError(errorprefix + ex.Message);
                return false;
            }
        }
        private string InternalConvertchar2string(char c)
        {
            byte b = (byte)c;
            if (b >= 32)
            {
                return "[" + c + "]";
            }
            else
            {
                return "[" + b + "]";
            }
        }
        public bool ReadUntil(out string result)
        {
            int delay = 500;
            int counter = 0;
            while (counter < ReadTimeout)
            {
                //LogHelper.WriteLine(ELogLevel.info, "SerialWrapper.readuntil.readtimeout=" + counter + "/" + ReadTimeout);

                string line;
                if (!queuemain.get(out line))
                {
                    ErrorMessage = new CascadeError(errorprefix+".ReadUntil - " + queuemain.ErrorMessage);
                    result = null;
                    return false;
                }
                else
                {
                    if (line == null)
                    {
                        Thread.Sleep(delay);
                        counter += delay;
                    }
                    else
                    {
                        result = line;
                        return true;
                    }
                }
            }
            ErrorMessage = new CascadeError(errorprefix + ".ReadUntil - timeout exceeded : " + ReadTimeout);
            result = null;
            return false;
        }
      
        public void Write(string cmd)
        {
            //lock (port)
            {
                port.Write(cmd);
            }
        }
    }
}
