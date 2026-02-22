<div id="cookiesscreen"class="popup-screen">
	<div class="popup-box wide">
		<div class="centered logo airplus">
			<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
			<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
		</div>
        <p class="mob-txt-gray_d">
		<?= X('cookies_warning_p1','main') ?>
		</br></br>
		<?= X('cookies_warning_p21','main') ?>
		<span id="cookiesettings" style="text-decoration: underline;"><a><?= X('cookies_warning_p2_btn','main') ?></a></span>
		<?= X('cookies_warning_p22','main') ?>
		</p>
		<div>
		<a id="cookiesyes" class="cta_2"><?= X('cookies_cta_allyes','main') ?></a>
		</div>
    </div>
</div>


<div id="cookiesettingsscreen"class="popup-screen">
	<div class="popup-box wide">
		<div class="centered logo airplus">
			<img class="moblogo medium" src="../assets/imgs/icon-1.png" alt="mobminder logo">
			<span class="bold mobminder air" style="padding-left:0.1em;"><span class="mob-txt-blue">mob</span><span class="mob-txt-lime">minder</span></span>
		</div>
        <p class="mob-txt-gray_d airplus"><?= X('cookies_pref_p1','main') ?></p>
		<div id="allcookies" class="radio-box fancy square lefter">
			<div class="cookie-option">
				<p>
					<label id="cfull" class="mob-txt-gray_m bold left">
						<input id="cbfull" style="margin-right:10px;" type="checkbox" value="cfull"/>
						<span class="mob-txt-gray_d"><?= X('cookies_pref_optimal','main') ?>&nbsp;&nbsp;</span>
					</label>
					<i class="mob-txt-lime fa fa-chevron-right"></i>
				</p>
				<div id="exwrapcfull" class= "exwrap">
					<span class="mob-txt-gray_d"><?= X('cookies_pref_optimal_expl','main') ?></span>
				</div>
			</div>
			<div class="cookie-option">
				<p>
					<label id="crequired" class="mob-txt-gray_m bold left">
						<input style="margin-right:10px;" type="checkbox" value="crequired" checked="true" onclick="return false;"/> <!-- https://varunver.wordpress.com/2014/03/06/javascript-make-checkbox-checked-and-such-that-it-cannot-be-unchecked/ -->
						<span class="mob-txt-gray_d"><?= X('cookies_pref_mandatory','main') ?>&nbsp;&nbsp;</span>
					</label>
					<i class="mob-txt-lime fa fa-chevron-right"></i>
				</p>
				<div id="exwrapcrequired" class= "exwrap">
					<span class="mob-txt-gray_d"><?= X('cookies_pref_mandatory_expl','main') ?></span>
				</div>
			</div>
		</div>
		<div>
			<a id="cookiesyes2" class="cta_2 mob-bg-lime"><?= X('cookies_cta_allyes','main') ?></a>
		</div>
		<div style="display: flex; justify-content: center;">
			<a id="cookiespref" class="mob-txt-gray_m" style="text-decoration: underline;"><?= X('cookies_cta_savepref','main') ?></a>
		</div>
        <a id="cookiescross" class=""><i class="mob-txt-lime fa fa-times popupcross"></i></a>
    </div>
</div>



<script>

		/*function getCookies() { //returns the value of a specified cookie
			let cookiestring = decodeURIComponent(document.cookie); //Decode the cookie string, to handle cookies with special characters, e.g. '$'

			let cookiearray = cookiestring.split('; ');
			let keyvalues = new Array();
			
			for(let i in cookiearray) {
				let split = cookiearray[i].split('='); // split[0] = key, split[1] = value
				let key = split[0];
				let value = split[1];
				if(key!='expires' && key != 'path')
					keyvalues[key] = value;
			}
			return keyvalues;
		}*/

		// all consent optimal functions are defined in header.php 
		$(document).ready( function() { 
			let cookieoptimal = getCookieOptimal();
			
			if(cookieoptimal==null) { //optimal cookie is null (first time or cookie has expired)

				setTimeout(() => {
					$('#cookiesscreen').css('display', 'flex');
					$('#cookiesyes').click( // button 1 accept all cookies 
						function(){
							updateCookieOptimal(true);
							updateConsent(); 
							$('#cookiesscreen').css('display', 'none');
						}
					);
					$('#cookiesyes2').click( //button 2 accept all cookies 
						function(){
							updateCookieOptimal(true);
							updateConsent(); 
							$('#cookiesettingsscreen').css('display', 'none');
						}
					);
					$('#cookiespref').click( //button save preferences
						function(){
							let cookieoptimal = getCookieOptimal();
							if (cookieoptimal==null) updateCookieOptimal(false);

							updateConsent();
							$('#cookiesettingsscreen').css('display', 'none');
						}
					);
					$('#cbfull').change(function() { //change optimal checkbox value
						if($(this).prop('checked')) {
							updateCookieOptimal(true); 
                		} else {
                    		updateCookieOptimal(false);
                		}
            		});
				}, 2000);
			}
			else if (cookieoptimal=='0'){ 
				updateCookieOptimal(false);
				updateConsent();
			}
			else //optimal cookie = 1
			{
				updateCookieOptimal(true);
				updateConsent();
			}

		
		} );

		// Click handler for the chevron icon
		$("#allcookies i.fa-chevron-right").click(function() {
			let exwrap = $(this).closest('.cookie-option').find('.exwrap'); // Find exwrap within the same .cookie-option
			let ichevron = $(this);
			
			if (exwrap.hasClass('show')) {
				exwrap.removeClass('show');
				ichevron.removeClass('chevron-rotate');
			} else {
				$(".exwrap").removeClass('show');
				$(".fa-chevron-right").removeClass('chevron-rotate');
				exwrap.addClass('show');
				ichevron.addClass('chevron-rotate');
			}
		});

		document.getElementById("cookiesettings").addEventListener("click", function() {
			// Hide the cookiesscreen
			document.getElementById("cookiesscreen").style.display = "none";
			// Show the cookiessettingsscreen
			document.getElementById("cookiesettingsscreen").style.display = "flex";
		});

		document.getElementById("cookiescross").addEventListener("click", function() {
			// Hide the cookiesettingsscreen
			document.getElementById("cookiesettingsscreen").style.display = "none";
			// Show the cookiesscreen
			document.getElementById("cookiesscreen").style.display = "flex";
		});



</script> 