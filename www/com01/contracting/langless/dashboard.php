<!--
Chartjs version: 4.2.1

For the whole tooltip configuration possibilities: https://www.chartjs.org/docs/latest/configuration/tooltip.html

-->

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
    <title>Dashboard</title>

    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="../assets/css/controls.css">
    <link rel="stylesheet" href="../assets/css/faws.css">
    <link rel="stylesheet" href="../assets/css/generics.css">
    <link rel="stylesheet" href="../assets/css/crm.css">

    <link rel="shortcut icon" href="../assets/imgs/favicon/favicon.ico"> 	

    <script src="../assets/js/jquery-3.2.1.js"></script>
    <script src="../assets/js/iscroll.52.js"></script>
    <script src="../assets/js/jquery.rightClick.js"></script>
    <script src="../assets/js/mobframe.js"></script>
    <script src="../assets/js/datasets.js"></script>
    <script src="../assets/js/controls.js"></script>
    <script src="../assets/js/dashboard.js"></script>
    <script src="../assets/js/loginCrm.js"></script>

    <script src="../assets/js/Chart.js-4.2.1/chart.umd.js"></script>
</head>
<body>
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

    <section id="dashboardSection" class="wide">
        <div id="chartsDashboard">
            <h1 class="mob-txt-gray_l">Dashboard</h1>
            <div id="accountmSelectionDiv">
                <h3 class="mob-txt-blue">Account manager:</h3>
                <div id="accountmSelect"></div>
            </div>
            <div id="yearSelectionDiv">
                <h3 class="mob-txt-blue">Year:</h3>
                <div id="yearSelection"></div>
            </div>
            <div id="keyfigures">
                <div id="keyfiguresConversions">
                    <div class="keyfigure mob-bg-gray_through" id="receivedLeadsKeyFigure"><p>Received Leads</p><h2 id="receivedLeadsKeyFigureValue" class="mob-txt-lime"></h2></div>
                    <div class="keyfigure mob-bg-gray_through" id="convertedLeadsKeyFigure"><p>Converted Leads</p><h2 id="convertedLeadsKeyFigureValue" class="mob-txt-lime"></h2></div>
                    <div class="keyfigure mob-bg-gray_through" id="convertionRateKeyFigure"><p>Conversion Rate (%)</p><h2 id="conversionRate" class="mob-txt-lime"></h2></div>
                </div>
                <div id="keyfiguresTurnover">
                    <div class="keyfigure mob-bg-gray_through" id="generatedTurnoverKeyFigure"><p>Generated turnover / month (€)</p><h2 id="generatedTurnoverKeyFigureValue" class="mob-txt-lime"></h2></div>
                    <div class="keyfigure mob-bg-gray_through" id="averageBasketKeyFigure"><p>Average customer basket value (€)</p><h2 id="averageBasketKeyFigureValue" class="mob-txt-lime"></h2></div>
                    <div class="keyfigure mob-bg-gray_through" id="averageBasketPerLineKeyFigure"><p>Average customer basket / agenda (€)</p><h2 id="averageBasketPerLineKeyFigureValue" class="mob-txt-lime"></h2></div>
                </div>
            </div>
            
            <div id="barchartLeads">
                <canvas id="barchartDiagram"></canvas>
            </div>
            <div id="pieCharts">
                <canvas id="pieChartLeads" class="pieChart"></canvas>
                <canvas id="pieChartCustomers" class="pieChart"></canvas>
            </div>
        </div>

        <script>
            // Script to call the class to get the dropdown
            let am = new C_iStatistics('chartsDashboard', {target: $('#chartsDashboard'),logged:<?= $_SESSION['logged'] ?>})
            am.display();
            am.activate();
        </script>

        <script>
            let logout = new C_iLogOut('topmenu', {
                target: $('#topmenu')
            })
            logout.display();
            logout.activate()
        </script>
    </section>
</body>
</html>