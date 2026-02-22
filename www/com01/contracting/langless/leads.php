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
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leads Table</title>

    <link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico"> 	
    
    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="../assets/css/faws.css">
    <link rel="stylesheet" href="../assets/css/generics.css">
    <link rel="stylesheet" href="../assets/css/crm.css">
    <link rel="stylesheet" href="../assets/css/controls.css">

    <script src="../assets/js/jquery-3.2.1.js"></script>
    <script src="../assets/js/iscroll.52.js"></script>
    <script src="../assets/js/jquery.rightClick.js"></script>
    <script src="../assets/js/mobframe.js"></script>
    <script src="../assets/js/datasets.js"></script>
    <script src="../assets/js/controls.js"></script>
    <script src="../assets/js/loginCrm.js"></script>
    <script src="../assets/js/crm.js"></script>
    <script src="../assets/js/modalCRM.js"></script>
    <script src="../assets/js/loginCrm.js"></script>
</head>
<body id="body"> 
    <header id="stickymenu">
        <div id="topmenu">
            <div class="menu-banner slightwhite_a mob-txt-gray_d">
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

    

    <section id="leadsTableSection" class="leadsTableSection airupplus">
        <div class="shade"></div>
            <div class="wider">
                <div id="titleAndAddDiv">
                    <h1 class="leadsTableTitle mob-txt-gray_l">Leads Table</h1>
                    <div id="addUserDiv"></div>
                </div>

                <div id="divTable">
                    <table id="leadstable">
                        <colgroup>
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
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="white column2" style="background-color: #494D5A;"></th>
                                <th class="white column2" style="background-color: #494D5A;">ID</th>
                                <th class="white column2" style="background-color: #494D5A;">NAME</th>
                                <th class="white column3" style="background-color: #494D5A;">SURNAME</th>
                                <th class="white column4">CREATED</th>
                                <th class="white column5">MODIFIED</th>
                                <th class="white column5">FOLLOW UP</th>
                                <th class="white column6">COMPANY</th>
                                <th class="white column7">COUNTRY</th>
                                <th class="white column8">CITY</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                
                <div id="titleDiv">
                    <h1 class="leadsTableTitle mob-txt-gray_l">Lost Leads</h1>
                </div>

                <div id="divTable">
                    <table id="lostLeadstable">
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
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="white column2" style="background-color: #494D5A;"></th>
                                <th class="white column2" style="background-color: #494D5A;">ID</th>
                                <th class="white column2" style="background-color: #494D5A;">NAME</th>
                                <th class="white column3" style="background-color: #494D5A;">SURNAME</th>
                                <th class="white column4">CREATED</th>
                                <th class="white column5">MODIFIED</th>
                                <th class="white column5">FOLLOW UP</th>
                                <th class="white column6">COMPANY</th>
                                <th class="white column7">COUNTRY</th>
                                <th class="white column8">CITY</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                
                <div id="addUserTab" class="invisible">
                    <div class="modal">
                        <div id="inscription">
                            <div class="topAddUserBtnContainer">
                                <span id="closeModal"></span>
                                <span id="save"></span>
                                <span id="sign"></span>
                                <span id="date"></span>
                            </div>

                            <div id="idLead"></div>
                            <!--<h2 id="date"></h2>-->

                            <div id="topAddUserAMDrpDwn" class="right">
                                <legend>Account manager</legend>
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
                                <h2 class="subtitlePopUp">Follow-Up</h2>
                            </div>

                            <div id="followUpLead">
                                <div class="dropdownField" id="source"></div>
                                <div class="dropdownField" id="sourceDetails"></div>
                                <div class="dropdownField" id="FollowUp"></div>
                            </div>

                            <div id="demoLead" class="invisible">
                                <h2 class="subtitlePopUp">Demo</h2>    
                                <div class="inputField" id="demo_AcNr"></div>
                                <div class="inputField" id="demo_AcName"></div>
                            </div>

                            <div id="modalNote"></div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
                        
        <!--SCRIPT TO SHOW CLOUDS BEHIND THE TABLES 
            <script type="text/javascript">
            // frame reference for background animations
            var aframe = 0;
            var aframe_do = false;
            (function frame() {
                aframe++;
                aframe_do = (aframe%3)==0;
                requestAnimationFrame(frame);
            })();
            var clouds = document.querySelector("#leadsTableSection"); // let the clouds flow
            (function wind() {
                let d = (aframe)/16;
                if(aframe_do) clouds.style.backgroundPosition ="left "+d+"px bottom 50%"; // (*cp01*)
                requestAnimationFrame(wind);
            })();
        </script> -->
        
        <!-- <script type="text/javascript">
            //Get the input fields in the add user tab
            let c = new C_iLead('inscription', {
                target: $('#inscription')
            })
            c.display();
            c.activate();
        </script> -->

        <script type="text/javascript">
            //Get the add user button and show the user screen when clicked on a tr
            let l = new C_iLeadsTable('titleAndAddDiv', {logged:<?= $_SESSION['logged'] ?>}, 1);
            $('#titleAndAddDiv').find('#addUserDiv').html(l.display()); // (*cfs*)
            l.activate();
        </script>

        <script>
            let ll = new C_iLeadsTable('lostLeadstable', {}, 3);
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
            // row.firstChild.style.backgroundColor = TableStickyColumnMouseoverColor;
            children[1].style.backgroundColor = TableStickyColumnMouseoverColor;
            children[2].style.backgroundColor = TableStickyColumnMouseoverColor 
            children[3].style.backgroundColor = TableStickyColumnMouseoverColor 
        }

        // Function to change background color when user puts cursor away from the tr
        function RestoreBackgroundColor(row) {
            let children = document.getElementById(row.id).children;

            row.style.backgroundColor = TableBackgroundNormalColor; 
            // row.firstChild.style.backgroundColor = TableStickyColumnsNormalBackgroundColor;
            children[1].style.backgroundColor = TableStickyColumnsNormalBackgroundColor;
            children[2].style.backgroundColor = TableStickyColumnsNormalBackgroundColor;
            children[3].style.backgroundColor = TableStickyColumnsNormalBackgroundColor;
        }
        </script>

        <script>
            //copy to clipboard
            let date = document.getElementById('date');
            date.addEventListener('click',function(){
				navigator.clipboard.writeText(date.innerText);
			})            
        </script>

        
        <script src='../assets/js/crm.js'></script>
    </section>
</body>
</html>