<div id="chat" class="right">

	<div id="chat_area" class="chat-area">
		<div style="text-align:right; margin-bottom:10px;">
            <a id="popup_chat_cross"><i class="mob-txt-gray_m fa fa-times"></i></a>
        </div>

		<div class="left auto-msg mob-txt-gray_d">
			<p class="mob-txt-gray_d hide-small"><?= X('hello_txt') ?><br><br>
			<?= X('chat_intro_small') ?><br><br>
			</p>
			<p class="mob-txt-gray_d hide-big"><?= X('hello_txt') ?><br><br>
			<?= X('chat_intro_big') ?><br><br>
			</p>
		</div>	

		<div class="">
			<div class="flexinner col-8 d-sm-none whatsapp-link zoom airplus airupplus">
					<a href="https://api.whatsapp.com/send?phone=32492458530" target="_blank" rel="noopener nofollow"><i class="fab fa-whatsapp mob-txt-lime fa-1d5x"></i><span class="mob-txt-blue" style="font-size:110%;">&nbsp;&nbsp;+32 492 45 85 30</span></a>
			</div>
			<div class="flexinner d-none d-sm-block col-8 air airup">
					<a href="https://api.whatsapp.com/send?phone=32492458530" target="_blank"><img class="qrcode-img" src="../assets/imgs/qrcodes/qrcode-whatsappflo.png" alt="QR-code-whatsapp"></a>
			</div>

			<div class="flexinner col-4"> 
				
			</div>
		</div>

		<div>
			<img class="account-right-img" src="../assets/imgs/team/Florian3.png" alt="account-manager-pic">
		</div>
	</div>

	<div id="chat_call" class="chat-call" style="cursor: pointer;">
		<span class="call-msg centered">
			<i class="fa fa-comment-dots white" style="padding-right:10px;"></i><span class="mob-txt-gray_d"><?= X('chat_popup') ?></span>
		</span>

		<span class="call-pims">
			<img src="../assets/imgs/team/florian-chat.JPG" alt="">
		</span>
	</div>

</div>

<script type="text/javascript">

    $(document).ready( function() { 
        $('#chat_call').click(
            function(){
                console.log('Popup');
                $('#chat_area').css({'transform': 'translate(-380px,0px)'});
            })
        $('#popup_chat_cross').click(
            function(){
                $('#chat_area').css({'transform': 'translate(0px,0px)'});

            })
        });

		setTimeout(() => {
					$('#chat_call').css('transform', 'translate(-390px,0px)');
				}, 15000);


</script>

