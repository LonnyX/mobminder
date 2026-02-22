<?php
 

  //dependancies
  // - jquery-1.7.2.js
  // - jquery-qrcode.min.js
  // - mobqrcodelib.js
  
  // 1. create an empty <div> with id 
  // 2. add a javascript
  // 3. create a e_QRcode object
  // 4. call display method (control,qrcodesize,imageurl=null,radius=0.0,logosize=0.3,correctionlevel='Q',minsymbolversion=5)
  
  echo '<html>
    <head>
        <!-- head definitions go here -->
        <script type="text/javascript" src="../jquery-3.2.1.js"></script>
        <!-- <script type="text/javascript" src="jquery-1.7.2.js"></script> -->
        <script type="text/javascript" src="jquery-qrcode.js"></script>
        <script type="text/javascript" src="mobqrcodelib.js"></script>
    </head>
    <body>
        <div id="qrcode"></div>
        <script type="text/javascript">
            
            //let qrcodegen = new e_QRcode(qrcode,400,null,0.2,0.3,\'H\',5);
            //let qrcodegen = new e_QRcode(qrcode,400,\'./14.jpg\',0.2,0.3,\'H\',5);
            //let qrcodegen = new e_QRcode(qrcode,400,\'./14.jpg\');
            //let qrcodegen = new e_QRcode(qrcode,400);
            //let qrcodegen = new e_QRcode({content:qrcode,qrcodesize:400});

		console.log("qrcode",qrcode);
            let qrcodegen = new e_QRcode(qrcode,400,\'./14.jpg\',0.2,0.3,\'H\',5);
		console.log("qrcode",qrcode);
            qrcodegen.display("bonjour je m\'appelle bernard spoden");

        </script>
    </body>
  </html>';

?>