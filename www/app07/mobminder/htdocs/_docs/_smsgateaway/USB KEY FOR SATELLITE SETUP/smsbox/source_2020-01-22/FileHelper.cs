using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace SmsBox
{
    public static class FileHelper
    {
        public static void OverrideConfigFileKeyValue(string filename, List<KeyValuePair<string, string>> changes)
        {
            List<string> lines = File.ReadAllLines(filename).ToList();

            foreach (KeyValuePair<string, string> change in changes)
            {
                bool found = false;
                for (int i = 0; i < lines.Count; i++)
                {
                    string oldline = lines[i];

                    if (oldline.Contains(change.Key))
                    {
                        string[] tmpline = oldline.Split('=');
                        string newline = tmpline[0] + "=" + change.Value;
                        lines[i] = newline;
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    lines.Add(change.Key + "=" + change.Value);
                }
            }
            File.WriteAllLines(filename, lines);
        }
        public static string LoadConfigFileKeyValue(string filename, string key)
        {
            string[] lines = File.ReadAllLines(filename);

            for (int i = 0; i < lines.Length; i++)
            {
                string line = lines[i];
                
                if (string.IsNullOrEmpty(line)) continue;
                
                if (line.StartsWith("#")) continue;

                if (line.StartsWith(key))
                {
                    string[] tmpline = line.Split('=');
                    if (tmpline.Length != 2)
                    {
                        continue;
                    }
                    else
                    {
                        return tmpline[1];
                    }
                }
            }
            return null;
        }
        public static Dictionary<string, string> LoadConfigFileAllKeyValue(string filename)
        {
            Dictionary<string, string> dico = new Dictionary<string, string>();
            string[] lines = File.ReadAllLines(filename);

            for (int i = 0; i < lines.Length; i++)
            {
                string line = lines[i];

                if (string.IsNullOrEmpty(line))
                {
                    continue;
                }

                if (line.StartsWith("#"))
                {
                    continue;
                }

                string[] tmpline = line.Split('=');
                if (tmpline.Length != 2)
                {
                    continue;
                }
                else
                {
                    dico.Add(tmpline[0], tmpline[1]);
                }
            }
            return dico;
        }

        public static string GetInformationFromFilename(string versiondirectory,string defaultvalue)
        {
            DirectoryInfo di = new DirectoryInfo(versiondirectory);
            if (!di.Exists)
            {
                di.Create();
            }
            FileInfo[] fis = di.GetFiles().OrderByDescending(f => f.Name).ToArray();
            FileInfo fi;
            if (fis.Length == 0)
            {
                fi = new FileInfo(versiondirectory + Program.DirectorySeparator + defaultvalue + ".txt");
                FileStream fs = fi.Create();
                fs.Close();
                
            }
            else
            {
                fi = fis[0];
                foreach (FileInfo other in fis)
                {
                    if (other != fi) other.Delete();
                }
            }
            return fi.Name.Replace(".txt", "");

        }
        public static void SetInformationIntoFilename(string versiondirectory,string newvalue)
        {
            DirectoryInfo di = new DirectoryInfo(versiondirectory);
            if (!di.Exists)
            {
                di.Create();
            }
            FileInfo[] fis = di.GetFiles().OrderByDescending(f => f.Name).ToArray();
            FileInfo fi;
            if (fis.Length == 0)
            {
                fi = new FileInfo(versiondirectory + Program.DirectorySeparator + newvalue + ".txt");
                FileStream fs = fi.Create();
                fs.Close();
            }
            else
            {
                fi = fis[0];
                fi.MoveTo(versiondirectory + Program.DirectorySeparator + newvalue + ".txt");
                foreach (FileInfo other in fis)
                {
                    if (other != fi) other.Delete();
                }
            }
        }
    }
}
