$(document).ready(function() {
	$("#results").load("load.php",function(data){
		
		data.split('##').forEach(function(ligne) { 
			ligne = ligne.split('|');
			var compte = ligne[0];
			var sms = ligne[1];
			
			document.write(compte+" ::::: "+sms+"<br/>");
		});
	});
});