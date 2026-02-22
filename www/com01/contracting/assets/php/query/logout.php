<?php
    session_start();
    unset($_SESSION['logged']);
    echo('Logged out!');
?>