using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.IO;

namespace SmsBox
{
    public class Queue
    {
        private const string errorprefix = "Queue.";
        public string ErrorMessage;
        private Mutex mutex = new Mutex(false);
        private string directory;
        private bool enable_backup_queue;

        public Queue(string directory_,bool rpimode_,bool enable_backup_queue_)
        {
            directory=directory_;
            enable_backup_queue = enable_backup_queue_;

            DirectoryInfo di = new DirectoryInfo(directory);
            if (!di.Exists)
            {
                di.Create();
            }
        }
        private string BackupDirectory
        {
            get
            {
                return directory + "_backup";
            }
        }
        public bool clean()
        {
            mutex.WaitOne();
            try
            {
                DirectoryInfo di = new DirectoryInfo(directory);
                foreach (FileInfo fi in di.GetFiles()) fi.Delete();
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "push: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool isEmpty()
        {
            mutex.WaitOne();
            try
            {
                DirectoryInfo di = new DirectoryInfo(directory);
                List<FileInfo> files = di.GetFiles("*.txt").OrderBy(f => f.Name).ToList();
                if (files.Count == 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool push(string line)
        {
            mutex.WaitOne();
            try
            {
                Thread.Sleep(50);

                //ffffff = million of seconds!
                string filename = directory + Program.DirectorySeparator + DateTime.Now.ToString("yyyyMMddHHmmssffffff") + ".txt";
                FileStream fi = new FileStream(filename, FileMode.CreateNew);
                StreamWriter sw = new StreamWriter(fi, Encoding.UTF8);
                //sw.WriteLine(line);
                sw.Write(line);
                sw.Close();
                fi.Close();
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "push: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool get(out string result)
        {
            mutex.WaitOne();
            try
            {
                DirectoryInfo di = new DirectoryInfo(directory);
                List<FileInfo> files = di.GetFiles("*.txt").OrderBy(f => f.Name).ToList();
                if (files.Count == 0)
                {
                    result = null;
                    return true;
                }
                else
                {
                    StreamReader sr = files[0].OpenText();
                    //string line = sr.ReadLine();
                    string line = sr.ReadToEnd();
                    sr.Close();
                    
                    //DELETE----------
                    if (!enable_backup_queue)
                    {
                        files[0].Delete();
                    }
                    else
                    {
                        DirectoryInfo dibackup = new DirectoryInfo(BackupDirectory);
                        if (!dibackup.Exists) dibackup.Create();
                        files[0].MoveTo(BackupDirectory + Program.DirectorySeparator + files[0].Name);
                    }
                    //-----------------
                    result = line;
                    return true;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                result = null;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool getWithoutDelete(out string result, out string filename)
        {
            mutex.WaitOne();
            try
            {
                DirectoryInfo di = new DirectoryInfo(directory);
                List<FileInfo> files = di.GetFiles("*.txt").OrderBy(f => f.Name).ToList();
                if (files.Count == 0)
                {
                    result = null;
                    filename=null;
                    return true;
                }
                else
                {
                    filename = files[0].FullName;
                    StreamReader sr = files[0].OpenText();
                    string line = sr.ReadToEnd();
                    sr.Close();
                    result = line;
                    return true;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                result = null;
                filename=null;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool DeleteFile(string filename)
        {
            mutex.WaitOne();
            try
            {
                FileInfo fi = new FileInfo(filename);
                if (!enable_backup_queue)
                {
                    fi.Delete();
                }
                else
                {
                    DirectoryInfo dibackup = new DirectoryInfo(BackupDirectory);
                    if (!dibackup.Exists) dibackup.Create();
                    fi.MoveTo(BackupDirectory + Program.DirectorySeparator + fi.Name);
                }
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public string GetErrorMessage()
        {
            mutex.WaitOne();
            try
            {
                return ErrorMessage;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
    }

    public class Singleton
    {
        private const string filename = "data.txt";
        private const string errorprefix = "Singleton.";
        public string ErrorMessage;
        private Mutex mutex = new Mutex(false);
        private string directory;
        //private bool rpimode;

        public Singleton(string directory_, bool rpimode_)
        {
            directory=directory_;
            //rpimode = rpimode_;

            DirectoryInfo di = new DirectoryInfo(directory);
            if (!di.Exists)
            {
                di.Create();
            }
        }
        public bool isEmpty()
        {
            mutex.WaitOne();
            try
            {
                string fullname = directory + Program.DirectorySeparator + filename;
                FileInfo fi = new FileInfo(fullname);
                if (fi.Exists)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool CleanIfNotFill()
        {
            mutex.WaitOne();
            try
            {
                string fullname = directory + Program.DirectorySeparator + filename;
                FileInfo fi = new FileInfo(fullname);
                if (fi.Exists)
                {
                    StreamReader sr = fi.OpenText();
                    string line = sr.ReadToEnd();
                    sr.Close();

                    string[] content = line.Split(new string[] { Program.stringseparator }, StringSplitOptions.None);
                    if (content.Count(s => string.IsNullOrEmpty(s)) > 0)
                    {
                        fi.Delete();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool getWithoutDelete(out string[] content)
        {
            mutex.WaitOne();
            try
            {
                string fullname = directory + Program.DirectorySeparator + filename;
                FileInfo fi = new FileInfo(fullname);
                if (!fi.Exists)
                {
                    content = null;
                    return true;
                }
                else
                {
                    StreamReader sr = fi.OpenText();
                    string line = sr.ReadToEnd();
                    sr.Close();

                    content = line.Split(new string[]{Program.stringseparator},StringSplitOptions.None);
                    //fi.Delete();
                    return true;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                content = null;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool DeleteFile()
        {
            mutex.WaitOne();
            try
            {
                string fullname = directory + Program.DirectorySeparator + filename;
                FileInfo fi = new FileInfo(fullname);
                fi.Delete();
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        public bool pushOrUpdate(string[] newcontent)
        {
            mutex.WaitOne();
            try
            {
                string[] oldcontent;
                string fullname = directory + Program.DirectorySeparator + filename;
                FileInfo fi = new FileInfo(fullname);
                if (!fi.Exists)
                {
                    oldcontent = new string[newcontent.Length];
                    for (int i = 0; i < oldcontent.Length; i++) oldcontent[i] = "";
                }
                else
                {
                    StreamReader sr = fi.OpenText();
                    string line = sr.ReadToEnd();
                    sr.Close();
                    oldcontent = line.Split(new string[] { Program.stringseparator }, StringSplitOptions.None);
                }

                for (int i = 0; i < newcontent.Length; i++)
                {
                    if (newcontent[i] != null) oldcontent[i] = newcontent[i];
                }

                FileStream fs = new FileStream(fullname, FileMode.Create);
                StreamWriter sw = new StreamWriter(fs, Encoding.UTF8);
                sw.Write(string.Join( Program.stringseparator,oldcontent));
                sw.Close();
                fs.Close();
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "push: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
    }

    public class QIData
    {
        public string numero;
        public string message;
        //public string date;
        //int nbpart;
        //int currentpart;
        //int groupindex;
    }
    public class CQIExtension
    {
        public const string single = ".single";
        public const string final = ".final";
        public const string part = ".part";
    }
    public class QueueInbound
    {
        private const string errorprefix = "Queue.";
        public string ErrorMessage;
        private Mutex mutex = new Mutex(false);
        private string directory;
        private bool enable_backup_queue;

        public QueueInbound(string directory_, bool rpimode_, bool enable_backup_queue_)
        {
            directory = directory_;
            enable_backup_queue = enable_backup_queue_;

            DirectoryInfo di = new DirectoryInfo(directory);
            if (!di.Exists)
            {
                di.Create();
            }
        }
        private string BackupDirectory
        {
            get
            {
                return directory + "_backup";
            }
        }
        //public bool clean()
        //{
        //    mutex.WaitOne();
        //    try
        //    {
        //        DirectoryInfo di = new DirectoryInfo(directory);
        //        foreach (FileInfo fi in di.GetFiles()) fi.Delete();
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
        //        ErrorMessage = errorprefix + "push: " + ex.Message;
        //        return false;
        //    }
        //    finally
        //    {
        //        mutex.ReleaseMutex();
        //    }
        //}
        //public bool isEmpty()
        //{
        //    mutex.WaitOne();
        //    try
        //    {
        //        DirectoryInfo di = new DirectoryInfo(directory);
        //        List<FileInfo> files = di.GetFiles("*.txt").OrderBy(f => f.Name).ToList();
        //        if (files.Count == 0)
        //        {
        //            return true;
        //        }
        //        else
        //        {
        //            return false;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
        //        ErrorMessage = errorprefix + "get: " + ex.Message;
        //        return false;
        //    }
        //    finally
        //    {
        //        mutex.ReleaseMutex();
        //    }
        //}
        public bool push(string line, string numero,int groupeindex,int nbpart,int currentpart,string extension)
        {
            mutex.WaitOne();
            try
            {
                Thread.Sleep(50);

                //ffffff = million of seconds!
                string filename = directory + Program.DirectorySeparator + DateTime.Now.ToString("yyyyMMddHHmmssffffff") + generateSuffixe(numero, groupeindex, nbpart, currentpart,extension);

                FileStream fi = new FileStream(filename, FileMode.CreateNew);
                StreamWriter sw = new StreamWriter(fi, Encoding.UTF8);
                //sw.WriteLine(line);
                sw.Write(line);
                sw.Close();
                fi.Close();
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "push: " + ex.Message;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        private string generateSuffixe(string numero,int groupeindex,int nbpart,int currentpart, string extension)
        {
            return "_" + numero + "_" + groupeindex + "_" + nbpart +"_" +currentpart +extension;
        }
        public bool get(out QIData result)
        {
            mutex.WaitOne();
            try
            {
                DirectoryInfo di = new DirectoryInfo(directory);
                
                //cleaning ---------------------------------------------------------------------------
                string sdelayeddate = DateTime.Now.AddDays(-2).ToString("yyyyMMddHHmm");
                foreach (FileInfo everyfile in di.GetFiles("*").OrderBy(f => f.Name).ToList())
                {
                    string scurrentdate = everyfile.Name.Substring(0, 12);
                    if (scurrentdate.CompareTo(sdelayeddate)<0)
                    {
                        if (!enable_backup_queue)
                        {
                            everyfile.Delete();
                        }
                        else
                        {
                            DirectoryInfo dibackup = new DirectoryInfo(BackupDirectory);
                            if (!dibackup.Exists) dibackup.Create();
                            everyfile.MoveTo(BackupDirectory + Program.DirectorySeparator + everyfile.Name);
                        }
                    }
                }
                
    
                //------------------------------------------------------------------------------------
                
                List<FileInfo> files = di.GetFiles("*.single").OrderBy(f => f.Name).ToList();
                if (files.Count != 0)
                {
                    LogHelper.WriteLine(ELogLevel.info, "getting single inbound sms from queue...");

                    string[] finalname = Path.GetFileNameWithoutExtension(files[0].Name).Split('_');
                    string numero = finalname[1];

                    StreamReader sr = files[0].OpenText();
                    //string line = sr.ReadLine();
                    string line = sr.ReadToEnd();
                    sr.Close();

                    //string[] receivesmsstructure = line.Split(new string[] { Program.stringseparator }, StringSplitOptions.None);
                    result = new QIData();
                    result.numero = numero;
                    result.message = line;

                    //DELETE----------
                    if (!enable_backup_queue)
                    {
                        files[0].Delete();
                    }
                    else
                    {
                        DirectoryInfo dibackup = new DirectoryInfo(BackupDirectory);
                        if (!dibackup.Exists) dibackup.Create();
                        files[0].MoveTo(BackupDirectory + Program.DirectorySeparator + files[0].Name);
                    }
                    //-----------------
                    return true;
                }
                files = di.GetFiles("*.final").OrderBy(f => f.Name).ToList();
                if (files.Count != 0)
                {
                    LogHelper.WriteLine(ELogLevel.info, "getting single inbound sms from queue...");

                    foreach (FileInfo fi in files)
                    {
                        List<FileInfo> file2delete = new List<FileInfo>();
                        file2delete.Add(fi);

                        string[] finalname = Path.GetFileNameWithoutExtension(fi.Name).Split('_');
                        string numero = finalname[1];
                        int groupeindex = Int32.Parse(finalname[2]);
                        int nbpart = Int32.Parse(finalname[3]);
                        //int currentpart = Int32.Parse(finalname[4]);

                        StreamReader sr = files[0].OpenText();
                        string lastline = sr.ReadToEnd();
                        sr.Close();

                        result = new QIData();
                        result.numero = numero;
                        result.message = "";

                        
                        bool found = true;
                        for (int i = 1; i < nbpart; i++)
                        {
                            string suffixe = generateSuffixe(numero, groupeindex, nbpart, i, CQIExtension.part);
                            List<FileInfo> partfiles = di.GetFiles("*" + suffixe).ToList();
                            if (partfiles.Count == 0)
                            {
                                found = false;
                                break;
                            }
                            else
                            {
                                file2delete.Add(partfiles[0]);
                                StreamReader srpart = partfiles[0].OpenText();
                                string linepart = srpart.ReadToEnd();
                                srpart.Close();
                                result.message = result.message + linepart;
                            }
                        }
                        if (found)
                        {
                            LogHelper.WriteLine(ELogLevel.info, "getting single inbound sms from queue : found in " + nbpart + " parts");
                            result.message = result.message + lastline;

                            foreach (FileInfo fitodel in file2delete)
                            {
                                if (!enable_backup_queue)
                                {
                                    fitodel.Delete();
                                }
                                else
                                {
                                    DirectoryInfo dibackup = new DirectoryInfo(BackupDirectory);
                                    if (!dibackup.Exists) dibackup.Create();
                                    fitodel.MoveTo(BackupDirectory + Program.DirectorySeparator + fitodel.Name);
                                }
                            }

                            return true;
                        }
                    }
                }
                result = null;
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
                LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
                ErrorMessage = errorprefix + "get: " + ex.Message;
                result = null;
                return false;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        //public bool getWithoutDelete(out string result, out string filename)
        //{
        //    mutex.WaitOne();
        //    try
        //    {
        //        DirectoryInfo di = new DirectoryInfo(directory);
        //        List<FileInfo> files = di.GetFiles("*.txt").OrderBy(f => f.Name).ToList();
        //        if (files.Count == 0)
        //        {
        //            result = null;
        //            filename = null;
        //            return true;
        //        }
        //        else
        //        {
        //            filename = files[0].FullName;
        //            StreamReader sr = files[0].OpenText();
        //            string line = sr.ReadToEnd();
        //            sr.Close();
        //            result = line;
        //            return true;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
        //        ErrorMessage = errorprefix + "get: " + ex.Message;
        //        result = null;
        //        filename = null;
        //        return false;
        //    }
        //    finally
        //    {
        //        mutex.ReleaseMutex();
        //    }
        //}
        //public bool DeleteFile(string filename)
        //{
        //    mutex.WaitOne();
        //    try
        //    {
        //        FileInfo fi = new FileInfo(filename);
        //        if (!enable_backup_queue)
        //        {
        //            fi.Delete();
        //        }
        //        else
        //        {
        //            DirectoryInfo dibackup = new DirectoryInfo(BackupDirectory);
        //            if (!dibackup.Exists) dibackup.Create();
        //            fi.MoveTo(BackupDirectory + Program.DirectorySeparator + fi.Name);
        //        }
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.Message);
        //        LogHelper.WriteLine(ELogLevel.error, errorprefix + ex.StackTrace);
        //        ErrorMessage = errorprefix + "get: " + ex.Message;
        //        return false;
        //    }
        //    finally
        //    {
        //        mutex.ReleaseMutex();
        //    }
        //}
        public string GetErrorMessage()
        {
            mutex.WaitOne();
            try
            {
                return ErrorMessage;
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
    }

}

