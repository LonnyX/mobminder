<!DOCTYPE html>
<html lang='fr'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <meta http-equiv='Cache-Control' content='no-cache, no-store, must-revalidate' />
  <meta http-equiv='Pragma' content='no-cache' />
  <meta http-equiv='Expires' content='0' />
  <title>Mobminder AI</title>
  <style>

    body {
      margin: 0;
      background: black;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
    }

    .phone {
      width: 360px;
      height: 720px;
      background: #000;
      border-radius: 40px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;

      /*no text select*/
      user-select: none;
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none;    /* Firefox */
      -ms-user-select: none;     /* Internet Explorer/Edge */
    }

    .screen {
      width: 100%;
      height: 100px;
      background: #222;
      border-radius: 20px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 20px;
      padding: 10px;
      text-align: center;
    }

    .keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      width: 100%;
      justify-items: center;
      align-items: center;
    }

    .key {
      width: 80px;
      height: 80px;
      background: #444;
      color: white;
      font-size: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 5px #000;
      cursor: pointer;
      transition: background 0.2s;
    }

    .key:hover {
      background: #666;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 20px;
      gap: 10px;
    }

    .control-button {
      flex: 1;
      background: #555;
      color: white;
      font-size: 1rem;
      height: 50px;
      border-radius: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background 0.2s;
    }

    .control-button:hover {
      background: #777;
    }

    .call-button {
      width: 100%;
      background: #28a745;
      color: white;
      font-size: 1.3rem;
      height: 60px;
      border-radius: 30px;
      margin-top: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background 0.2s;
      text-align: center;
      padding:15px;
    }

      .hangup-button {
      width: 100%;
      background: #ea6a6f;
      color: white;
      font-size: 1.3rem;
      height: 60px;
      border-radius: 30px;
      margin-top: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background 0.2s;
      text-align: center;
      padding:15px;
    }

    .call-button:hover {
      background: #218838;
    }
    .deviceList{
      color : white;
    }
  </style>
</head>
<body>
  <div class='phone'>
    <div class='screen' id='phone-display'>Appeler mon docteur</div>

    <div class='keypad' id='keypad'>
      <div class='key'>1</div>
      <div class='key'>2</div>
      <div class='key'>3</div>
      <div class='key'>4</div>
      <div class='key'>5</div>
      <div class='key'>6</div>
      <div class='key'>7</div>
      <div class='key'>8</div>
      <div class='key'>9</div>
      <div class='key'>*</div>
      <div class='key'>0</div>
      <div class='key'>#</div>
    </div>

    <div class='controls'>
      <div class='control-button' id='mute'>Mute</div>
      <div class='control-button' id='reply'>Reply</div>
    </div>

    <div class='call-button' id='start'>Appeler</div>
    <div class='hangup-button' id='stop'>Raccrocher</div>
    <div class='call-button' id='push'>Push to talk</div>
    <div class='deviceList'><ul id='deviceList'></ul></div>
  </div>

  <script>

    var mode = '<?= isset($_POST['mode']) ? $_POST['mode'] : '' ?>';
    var lgn = '<?= isset($_POST['lgn']) ? $_POST['lgn'] : '' ?>';
    var pwd = '<?= isset($_POST['pwd']) ? $_POST['pwd'] : '' ?>';
    var kid = '<?= isset($_POST['kid']) ? $_POST['kid'] : '' ?>';
    var rsid = '<?= isset($_POST['rsid']) ? $_POST['rsid'] : '' ?>';
    var gender = '<?= isset($_POST['gender']) ? $_POST['gender'] : '' ?>';
    var postfixurl = '<?= isset($_POST['postfixurl']) ? $_POST['postfixurl'] : '' ?>';
    var lastname = '<?= isset($_POST['lastname']) ? $_POST['lastname'] : '' ?>';
    var firstname = '<?= isset($_POST['firstname']) ? $_POST['firstname'] : '' ?>';
    var mobile = '<?= isset($_POST['mobile']) ? $_POST['mobile'] : '' ?>';
    var birthday = '<?= isset($_POST['birthday']) ? $_POST['birthday'] : '' ?>';
    var vadmode = '<?= isset($_POST['vadmode']) ? $_POST['vadmode'] : '' ?>';
    var testmode = '<?= isset($_POST['testmode']) ? $_POST['testmode'] : '0' ?>';

    var interruptresponse = '<?= isset($_POST['interruptresponse']) ? $_POST['interruptresponse'] : '1' ?>';
    var eagerness = '<?= isset($_POST['eagerness']) ? $_POST['eagerness'] : 'auto' ?>';
    var inputaudionoisereduction = '<?= isset($_POST['inputaudionoisereduction']) ? $_POST['inputaudionoisereduction'] : null ?>';

    const display = document.getElementById('phone-display');
    const keys = document.querySelectorAll('.key');

    if (mode=='asistant') display.innerText = 'Appeler ma secrétaire';
    else display.innerText = 'Appeler mon docteur';
    if (vadmode=='vad') display.innerText+='\n(VAD)'
    else if (vadmode=='push') display.innerText+='\n(PUSH)'
    else display.innerText+='\n(CONTINUOUS)'

    
  </script>
  <script src='app.js'></script>
</body>
</html>
