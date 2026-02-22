
#####################################################################################
#
#   WINSERVICE : MS Windows Service Launcher
#       - regular calls to the mobminder sync webservice
#

import win32serviceutil
import win32service
import sys
import atx
import logging

from threading import Event

import mobminder

SLEEP = 10
WAITER = 1  # do not change, windows is touchy ...

logger = logging.getLogger("syncservice")

logging.basicConfig(
    filename=mobminder.INSTALL_DIR + '/service.log',
    level=logging.DEBUG,
    format='%(levelname)s %(asctime)s %(name)s: %(message)s',
    datefmt='%d/%m %H:%M:%S'
)

# Silence logs from the "requests" logger
requests_log = logging.getLogger("requests")
requests_log.setLevel(logging.WARNING)


try:
    class ServiceLauncher(win32serviceutil.ServiceFramework):
        _svc_name_ = 'mobmindersync'
        _svc_display_name_ = 'mobminder Synchroniser'
        _svc_description_ = 'Mobminder <-> DentAdmin web synchroniser'

        events = {
            'need_stop': Event(),
            'stopped': Event(),
            'paused': Event(),
        }

        def __init__(self, args):
            win32serviceutil.ServiceFramework.__init__(self, args)
            self.i = 0

        def SvcStop(self):
            logger.info("Stopping service")
            self.events['need_stop'].set()

            while not self.events['stopped'].is_set():
                logger.debug("Looping before stopping confirmation")
                self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
                self.events['stopped'].wait(WAITER)

            logger.info('Service stopped')
            self.ReportServiceStatus(win32service.SERVICE_STOPPED)

        def SvcPause(self):
            logger.info("Pausing service")
            self.events['need_stop'].set()

            while not self.events['stopped'].is_set():
                logger.debug("Looping before paused confirmation")
                self.ReportServiceStatus(win32service.SERVICE_PAUSE_PENDING)
                self.events['stopped'].wait(WAITER)

            logger.info('Service paused')
            self.ReportServiceStatus(win32service.SERVICE_PAUSED)

        def SvcContinue(self):
            logger.info("Continuing service")

        def SvcDoRun(self):
            logger.info("Booting service")

            while not self.events['need_stop'].is_set():
                self.loop()

                self.events['need_stop'].wait(SLEEP)

            self.events['stopped'].set()
            logger.debug("Stopping confirmation sent")

        def loop(self):

            if self.i % 30 == 0:
                atx.full_update()
            elif atx.has_changes():
                atx.full_update()
                self.i = 0

            self.i += 1

    if __name__ == '__main__':
        if "update" in sys.argv:
            logger.info("Updating service")
        elif "install" in sys.argv:
            logger.info("Installing service")

        win32serviceutil.HandleCommandLine(ServiceLauncher)

except Exception, e:
    logger.exception(e)
    sys.exit(-1)
