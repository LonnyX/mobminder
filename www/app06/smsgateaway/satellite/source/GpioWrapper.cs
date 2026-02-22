using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.IO;

namespace SmsBox
{
    public static class GpioWrapper
    {
        public static string ScriptFileName = "./smspower.py";

        public static void PowerOnOff()
        {
            LogHelper.WriteLine(ELogLevel.log, "GpioWrapper.PowerOnOff");

            Process p = Process.Start(ScriptFileName);
            p.WaitForExit();

            //GPIOPinDriver pin = new GPIOPinDriver(GPIOPinDriver.Pin.GPIO7,GPIOPinDriver.GPIODirection.Out);
            //pin.State = GPIOPinDriver.GPIOState.Low;
            //Thread.Sleep(2000);
            //pin.State = GPIOPinDriver.GPIOState.High;
            //pin.Dispose();
        }
        public static int ReadCpuTemperature()
        {
            try
            {
                Process p = new Process();
                p.StartInfo = new ProcessStartInfo();
                p.StartInfo.FileName = "/opt/vc/bin/vcgencmd";
                p.StartInfo.Arguments = "measure_temp";
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;
                p.StartInfo.CreateNoWindow = true;
                p.Start();

                List<string> result = new List<string>();
                while (!p.StandardOutput.EndOfStream)
                {
                    var line = p.StandardOutput.ReadLine();
                    result.Add(line);
                }
                p.WaitForExit();

                string[] tmp = result[0].Split(new char[] { '=', '\'' });

                string value = tmp[1].Replace(".", "");

                return Int32.Parse(value);
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, ex.Message);
                LogHelper.WriteLine(ELogLevel.error, ex.StackTrace);
                return -1;
            }
        }
        public static bool? CheckVoltage(bool rpimode)
        {
            if (!rpimode)
            {
                return true;
            }
            else
            {

                FileStream fs = null;
                StreamReader sr = null;
                try
                {
                    fs = new FileStream("/sys/class/leds/led1/brightness", FileMode.Open);
                    sr = new StreamReader(fs);
                    string value = sr.ReadToEnd();
                    sr.Close();
                    fs.Close();
                    int ivalue = Int32.Parse(value);
                    return ivalue == 255;
                }
                catch (Exception ex)
                {
                    LogHelper.WriteLine(ELogLevel.error, ex.Message);
                    LogHelper.WriteLine(ELogLevel.error, ex.StackTrace);
                    return null;
                }
                finally
                {
                    try
                    {
                        if (sr != null) sr.Close();
                        if (fs != null) fs.Close();
                    }
                    catch
                    {

                    }
                }
            }
        }
    }
}
