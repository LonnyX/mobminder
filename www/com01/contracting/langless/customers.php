<!DOCTYPE html>
<?php
    // Control if person is logged in, to redirect to login page if not logged in
    session_start();
    if (!$_SESSION['logged']) {
        header('Location: '.'../index.php');
        die();
    }
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Table</title>

    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="../assets/css/faws.css">
    <link rel="stylesheet" href="../assets/css/generics.css">
    <link rel="stylesheet" href="../assets/css/crm.css">
    <link rel="stylesheet" href="../assets/css/controls.css">

    <link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico"> 	

    <script src="../assets/js/jquery-3.2.1.js"></script>
    <script src="../assets/js/iscroll.52.js"></script>
    <script src="../assets/js/jquery.rightClick.js"></script>
    <script src="../assets/js/mobframe.js"></script>
    <script src="../assets/js/datasets.js"></script>
    <script src="../assets/js/controls.js"></script>
    <script src="../assets/js/crm.js"></script>
    <script src="../assets/js/modalCRM.js"></script>
    <script src="../assets/js/loginCrm.js"></script>
</head>
<body id="body">
    <header id="stickymenu">
        <div id="topmenu">
            <div class="menu-banner slightwhite_a mob-txt-gray_d">
                <!-- <img class="mobminderLogoHeader" src="./img/icon-1.png" alt="mobminder logo"> -->
                <span>
                    <a href="./leads.php">
                        <i class="fad fa-user-plus mob-txt-lime"></i>
                        <span class="hidden-txt">Leads Table</span>
                    </a>
                </span>
                <span>
                    <a href="./customers.php">
                        <i class="fad fa-user-check mob-txt-lime"></i>
                        <span class="hidden-txt">Customer Table</span>
                    </a>
                </span>
                <span>
                    <a href="./dashboard.php">
                        <i class="fad fa-user-chart mob-txt-lime"></i>
                        <span class="hidden-txt">Dashboard</span>
                    </a>
                </span>
            </div>
            <div id='logoutBtn' class="toggle-label lang-toggle-label"></div>
        </div>
    </header>
    <section id="customerTableSection" class="customerTableSection airupplus">
        <div class="shade"></div>
            <div class="wider">
                <div id="titleAndAddDiv">
                    <h1 class="leadsTableTitle mob-txt-gray_l">Customers Table</h1>
                    <!-- <div class="divAddUser" id="divAddUser"><i class="fas fa-user-plus mob-txt-lime fa-2x"></i></div> -->
                </div>

                <div id="divTable">
                    <table id="customertable">
                        <colgroup>
                            <col class="sticky">
                            <col class="sticky">
                            <col class="sticky">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="white column1" style="background-color: #494D5A;">Client Nr.</th>
                                <th class="white column2" style="background-color: #494D5A;">ACCOUNT NAME</th>
                                <th class="white column3">COMPANY NAME</th>
                                <th class="white column4">SPECIALITY</th>
                                <th class="white column5">NAME</th>
                                <th class="white column6">SURNAME</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                                
                <div id="titleDiv">
                    <h1 class="leadsTableTitle mob-txt-gray_l">Lost Customers</h1>
                </div>

                <div id="divTable">
                    <table id="lostCustomertable">
                        <colgroup>
                            <col class="sticky">
                            <col class="sticky">
                            <col class="sticky">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                            <col class="seethrougColumn">
                        </colgroup>
                        <thead>
                            <tr>
                            <th class="white column1" style="background-color: #494D5A;">Client Nr.</th>
                                <th class="white column2" style="background-color: #494D5A;">ACCOUNT NAME</th>
                                <th class="white column3">COMPANY NAME</th>
                                <th class="white column4">SPECIALITY</th>
                                <th class="white column5">NAME</th>
                                <th class="white column6">SURNAME</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                
                <div id="CustomerModal" class="invisible">
                    <div class="modal">
                        <div id="inscription">
                            <div class="topAddUserBtnContainer">
                                <span id="closeModal"></span>
                                <span id="save"></span>
                                <span id="sign"></span>
                                <span id="date"></span>
                            </div>

                            <div id="idLead"></div>
                            <!-- <h2 id="date"></h2> -->

                            <div id="topAddUserAMDrpDwn" class="right">
                                <legend>Account manager:</legend>
                                <div class="dropdownAccountM" id="accountm"></div>
                            </div>
                            <div id="titleDetails">
                                <h2 class="subtitlePopUp">Details</h2>
                            </div>
                            <div id="firstpartDetails">
                                <div class="dropdownField" id="status"></div>
                                <div class="inputField" id="fn"></div>
                                <div class="inputField" id="ln"></div>
                                <div class="inputField" id="language"></div>
                                <div class="inputField" id="phoneNr"></div>
                                <div class="inputField" id="email"></div>
                            </div>
                            <div id="secondpartDetails">
                                <div class="inputField" id="cn"></div>
                                <div class="inputField" id="work"></div>
                                <div class="dropdownField" id="sector"></div>
                                <div class="inputField" id="country"></div>
                                <div class="inputField" id="city"></div>
                                <div class="inputField" id="address"></div>
                            </div>
                            
                            <div id="titleFollowUp">
                                <h2 class="subtitlePopUp">Contract</h2>
                            </div>

                            <div id="followUpLead">
                                <div class="inputField" id="acName"></div>
                                <div class="inputField" id="invName"></div>
                                <div class="inputField" id="monthlyP"></div>
                                <div class="inputField" id="nrSms"></div>
                                <div class="inputField" id="contractBd"></div>
                                <div class="inputField" id="typePay"></div>
                                <div class="inputField" id="contractNote"></div>
                            </div>

                            <div id="modalNote"></div>
                            <div id="invNote"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                        
        <!-- <script type="text/javascript">
            // frame reference for background animations
            var aframe = 0;
            var aframe_do = false;
            (function frame() {
                aframe++;
                aframe_do = (aframe%3)==0;
                requestAnimationFrame(frame);
            })();
            var clouds = document.querySelector("#customerTableSection"); // let the clouds flow
            (function wind() {
                let d = (aframe)/16;
                if(aframe_do) clouds.style.backgroundPosition ="left "+d+"px bottom 50%"; // (*cp01*)
                requestAnimationFrame(wind);
            })();
        </script> -->

        <script type="text/javascript">
            let c = new C_iCustomerTable('clientResume', {target: $('#clientResume')},2)
            c.display();
            c.activate();
        </script>

        <script type="text/javascript">
            let lc = new C_iCustomerTable('lostCustomertable', {target: $('#lostCustomertable')},4);
        </script>

        <script>
            let logout = new C_iLogOut('topmenu', {
                target: $('#topmenu')
            })
            logout.display();
            logout.activate()
        </script>

        <script type="text/javascript">

            // Variables with colors values defined for when the user hovers over a tr in the table
            let TableBackgroundNormalColor = "#ffffff";
            let TableStickyColumnsNormalBackgroundColor = "#F4F4F6";
            let TableStickyColumnMouseoverColor = "rgb(195,217,73)";
            let TableSeeThroughColumnMouseoverColor = "rgba(195,217,73,0.5)";

            // Function to change background color when user puts cursor over the tr
            function ChangeBackgroundColor(row) {
                let children = document.getElementById(row.id).children;
                
                row.style.backgroundColor = TableSeeThroughColumnMouseoverColor; 
                row.firstChild.style.backgroundColor = TableStickyColumnMouseoverColor;
                children[1].style.backgroundColor = TableStickyColumnMouseoverColor;
                // children[2].style.backgroundColor = TableStickyColumnMouseoverColor 
            }

            // Function to change background color when user puts cursor away from the tr
            function RestoreBackgroundColor(row) {
                let children = document.getElementById(row.id).children;

                row.style.backgroundColor = TableBackgroundNormalColor; 
                row.firstChild.style.backgroundColor = TableStickyColumnsNormalBackgroundColor;
                children[1].style.backgroundColor = TableStickyColumnsNormalBackgroundColor;
                // children[2].style.backgroundColor = TableStickyColumnsNormalBackgroundColor;
            }
        </script>

        <script>
            //copy to clipboard
            let date = document.getElementById('date');
            date.addEventListener('click',function(){
				navigator.clipboard.writeText(date.innerText);
			})            
        </script>
    </section>
</body>
</html>