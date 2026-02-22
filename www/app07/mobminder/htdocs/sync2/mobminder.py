
#####################################################################################
#
#   MOBMINDER :
#      - utilities functions for all modules. Nothing specific to the host software
#

import os
import pyodbc
import socket
import logging
import requests

DEBUG = True
ROOT_URL = "http://be.mobminder.com" if not DEBUG else "http://192.168.1.100"
INSTALL_DIR = "C:\Mobminder"
CFG_PATH = "C:\Mobminder\config.txt"


logger = logging.getLogger("mobminder")


def exit(comment=''):
	print comment
	raw_input('Press enter to close me')
	sys.exit()
	
	
def config_exists():
    return os.path.isfile(CFG_PATH)


def get_context():  # opens and reads the local config.txt file

    if config_exists() is False:
        logger.info("The config.txt file is not present in " + INSTALL_DIR)
        exit("Unable to open the config.txt file")

    class Context:  # used to contain parameters of the config.txt
        pass
    conf = Context()
    with open(CFG_PATH) as f:
        for line in f:
            if not "=" in line:
                continue
            splitted = line.split("=")
            key = splitted[0].strip()
            value = "=".join(splitted[1:]).strip()
            setattr(conf, key, value)  # we fill the Context object with the parameters read from the config file
    return conf


class db_IO:  # opens an access to the local DB

    def __init__(self, context):
        hostname = socket.gethostname()
        logger.info("Connecting to MSSQL (hostname={}, server={}, db={})".format(hostname, context.instance, context.db))

        try:
            self.cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=' + hostname + '\\' + context.instance + ';DATABASE=' + context.db + ';Trusted_Connection=yes')
            logger.debug("Connected to MSSQL")
            self.cursor = self.cnxn.cursor()
        except:
            logger.info("Unable to connect to database")
            exit("Unable to connect to database")

    def __del__(self):
        self.close()

    def close(self):
        if self.cnxn is not False:
            self.cnxn.close()
            self.cnxn = False



def request_sync_time(context, which = False): # which can be one of 'vis', 'app', 'cfg'
	
	print 'requesting last sync time'
	params = { 'login':context.login, 'passw':context.password }
	
	response = requests.post(ROOT_URL+'/sync/time.php',data=params)
	if response.status_code != 200: 
		logger.info("Unable to access mobminder web service")
		exit("Unable to access mobminder web service")
	
	split = response.text.split('\n')
	stimeCfg = str(split[0])
	stimeVis = str(split[1])
	stimeApp = str(split[2])
	print 'last sync for config:'+stimeCfg
	print 'last sync for visitors:'+stimeVis
	print 'last sync for appointments:'+stimeApp
	
	syncT = { 'cfg':stimeCfg, 'vis':stimeVis, 'app':stimeApp,  }
	
	if which: return syncT[which]
	else: return syncT
		

			