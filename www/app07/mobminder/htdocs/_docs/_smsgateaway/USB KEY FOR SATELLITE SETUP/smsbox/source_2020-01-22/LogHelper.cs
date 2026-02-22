using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.IO;
using System.Globalization;

namespace SmsBox
{
  
    public static class LogHelper
    {
        private static Mutex mutex = new Mutex(false);
        public static string FileName = "trace.log";
        public static ELogLevel minimumLevel = ELogLevel.info;
        public static bool EnableConsole = true;
        public static int HistoryDay = 30;
        //private static bool running = true;
        //private static int secdelay = 10;

        static LogHelper()
        {
            //ThreadStart ts2 = new ThreadStart(run);
            //Thread t2 = new Thread(ts2);
            //running = true;
            //t2.Start();
        }
        public static void StopThread()
        {
            //running = false;
        }
        //public static void run()
        //{
        //    int counter = 0;
        //    while (running)
        //    {
        //        try
        //        {
        //            if (counter == secdelay)
        //            {
        //                TryBackupOldFile();
        //                counter = 0;
        //            }
        //            else
        //            {
        //                counter++;
        //                Thread.Sleep(1000);
        //            }
        //        }
        //        catch
        //        { 

        //        }
        //    }
        //}



        public static void WriteLine(ELogLevel level, string msg)
        {
            mutex.WaitOne();
            try
            {
                TryBackupOldFile();

                if (level >= minimumLevel)
                {
                    string line = DateTime.Now.ToString("dd/MM/yyyy-HH:mm:ss") + ">" + level.ToString() + ":" + msg;

                    if (EnableConsole)
                    {
                        System.Console.WriteLine(line);
                    }

                    FileStream fs = new FileStream(FileName, FileMode.Append);
                    StreamWriter sw = new StreamWriter(fs, Encoding.UTF8);
                    sw.WriteLine(line);
                    sw.Close();
                    fs.Close();
                }
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        private static void TryBackupOldFile()
        {
            mutex.WaitOne();
            try
            {
                FileInfo ficurrent = new FileInfo(FileName);
                DateTime today = DateTime.Today;
                if (ficurrent.Exists)
                {
                    if (ficurrent.LastWriteTime < today)
                    {
                        ficurrent.MoveTo(FileName.Replace(".log", "") + "[" + today.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) + "].log");
                    }
                }
                foreach (FileInfo row in ficurrent.Directory.GetFiles())
                {
                    if (row.Name.Contains("["))
                    {
                        string[] tmp = row.Name.Split(new char[] { '[', ']' });
                        DateTime date = DateTime.ParseExact(tmp[1], "yyyy-MM-dd", CultureInfo.InvariantCulture);
                        if (date < today.AddDays(-HistoryDay))
                        {
                            row.Delete();
                        }
                    }
                }

            }
            finally
            {
                mutex.ReleaseMutex();
            }   
        }
    }
}
