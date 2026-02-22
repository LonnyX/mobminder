using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SmsBox
{
    public static class ServiceFactory
    {
        public static IServiceClient GetProxy(string server, int timeoutsec, SmsShieldWrapper wrapper,string internetgatewayip)
        {
            //proxy = new SimulatorServiceClient();
            //return new NetworkServiceClient(true,"login", "pwd");
            //return new GprsServiceClient(true, "test", "pwd");
            return new MobminderServiceClient(server, timeoutsec * 1000, wrapper, internetgatewayip);
        }
    }
}
