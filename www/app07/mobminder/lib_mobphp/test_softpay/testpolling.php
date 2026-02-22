<?php
    require '../softpayio.php';

    $clientid = '2hoi32oufl009vb69ppi59ptrk'; //'SPAY-done4you';
    $clientsecret = '183cs9lacj3mkiqo9gtbqn3uacokikget0hld2bngf9qoqjrbhai'; //'371c24545d0a4edebf2f78d011c2a4a0';

    $gw = new C_SoftPayIoGateaway($clientid,$clientsecret);


    //test get transaction ////////////////////////////////////////////////////////
    if (true)
    {
        $gw->token ='eyJraWQiOiJHTnZ2QThCMFJ6OHJXcnFtM0VsQWJXbHlOdjhhSlBXU1wvYUlkNms2dHJhYz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyaG9pMzJvdWZsMDA5dmI2OXBwaTU5cHRyayIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiaHR0cHM6XC9cL2FwaS5zYW5kYm94LnNvZnRwYXkuaW9cL2Nsb3VkIiwiYXV0aF90aW1lIjoxNjg2NjY0NDI1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9Pd01ISk5YVU4iLCJleHAiOjE2ODY2NjgwMjUsImlhdCI6MTY4NjY2NDQyNSwidmVyc2lvbiI6MiwianRpIjoiMTFlMzNiOWMtOTYxOS00ZTczLThjYWUtMjE0Y2YyZjg5ZmVmIiwiY2xpZW50X2lkIjoiMmhvaTMyb3VmbDAwOXZiNjlwcGk1OXB0cmsifQ.GYBcpVmSo7SLnJDFfnnrrQlyYdjHLFxYk-VUNa6n28It-TxzO814RoiBIRsuH1Czi-t3BVaPWxkFZkdjgzVRAasARvxNy-wRGl-6jZfqyJptR2GDfoHI2nltxZHNWiBAMYjhq5WbnZHHLGoODFaGsKFgjTxeQ4crUWK59jXDMJcN1Hua4vucfpDe4hRYuuUtItQyTZDTx4WetfS4R-PWBxzrRZ-1ufZ5BXyK1BOlOC7VQuGBmx36bCg8H-Rzg-wOLU0seYsF_DIdBrSKv8IMutF1DCgc996cWf2rCuXP6kJ4vw7--xMVqz7UijSrQLdH2S8jRADDEfr--0SY3FpQFg';
        $requestId = 'ebd18abb-6d5d-411f-95ab-72297d6f8adb';
        $resgettrans = $gw->getTransactionStatus($requestId);
        if ($resgettrans)
        {
            echo 'main.calling getTransaction = success'.'<br/>';
            
            echo 'main.calling getTransaction requestId = '.$resgettrans->get_requestId().'<br/>';
            echo 'main.calling getTransaction state = '.$resgettrans->get_state().'<br/>';
            echo 'main.calling getTransaction amountValue = '.$resgettrans->get_amountValue().'<br/>';
            echo 'main.calling getTransaction partialPan = '.$resgettrans->get_partialPan().'<br/>';
            echo 'main.calling getTransaction posReferenceNumber = '.$resgettrans->get_posReferenceNumber().'<br/>';
            echo 'main.calling getTransaction terminalId = '.$resgettrans->get_terminalId().'<br/>';
            echo 'main.calling getTransaction aid = '.$resgettrans->get_aid().'<br/>';
        }
        else
        {
            echo 'main.calling getTransaction = failure'.'<br/>';
            
        }
    }
    
?>