<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking - Dev Environment</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .clients { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 20px; }
        .client { padding: 12px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; display: block; text-align: center; transition: background 0.3s; font-size: 13px; }
        .client:hover { background: #0056b3; }
        .info { background: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; margin-bottom: 20px; }
        .count { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📅 Booking System - Dev</h1>
        
        <div class="info">
            <strong>Environment de développement</strong><br>
            Sélectionnez un dossier client pour accéder à son interface de réservation
        </div>

        <div class="clients">
<?php
$dir = __DIR__;
$items = scandir($dir);
$clients = [];

foreach ($items as $item) {
    if ($item === '.' || $item === '..' || $item === '_assets' || $item[0] === '.' || !is_dir($dir . '/' . $item)) {
        continue;
    }
    $clients[] = $item;
}

sort($clients);

foreach ($clients as $client) {
    echo "            <a href=\"/$client/\" class=\"client\">$client</a>\n";
}
?>
        </div>
        
        <div class="count">
            Total clients: <strong><?php echo count($clients); ?></strong>
        </div>
    </div>
</body>
</html>
