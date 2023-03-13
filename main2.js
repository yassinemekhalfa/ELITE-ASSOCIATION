setTimeout(function(){
	document.querySelector('.notify-alert-box').style.top='0';
},1000)

document.querySelector('#notify-button').onclick = async () => {
	localStorage.setItem('notify','true')
	notifyTrue()
	//notifyOption()
}
function notifyTrue(){
	if(localStorage.getItem('notify','true')){
		document.querySelector('.notify-alert-box').style.display='none';
	}
}
notifyTrue()

document.querySelector('#notify-cancel-button').onclick = async () => {
	localStorage.setItem('notify','false')
	notifyFalse()	
}
function notifyFalse(){
	if(localStorage.getItem('notify','false')){
		document.querySelector('.notify-alert-box').style.display='none';
	}
}
notifyFalse()


function showNotification(){
	var notificationBody = new Notification('New Message from IT',{
		body:'Hi Google',
		//icon:'images/notify-logo.png',
	});
	/*notificationBody.onclick = (e) =>{
		window.location.href = 'https://google.com'
	}*/
}
/*function showNotification2(){
	var notificationBody = new Notification('New Message2 from IT',{
		body:'Hi Invention Tricks'
	});
	notificationBody.onclick = (e) =>{
		window.location.href = 'https://youtube.com'
	}
}*/

//console.log(Notification.permission);
function notifyOption(){
	if(localStorage.notify == 'true'){
		const timestamp = new Date().getTime() + 5 * 1000;
		if(Notification.permission == "granted"){
			showNotification()
			/*if(localStorage.notifyMessage === undefined){
				localStorage.setItem('notifyMessage', timestamp)
				showNotification()
			}
			if(localStorage.notifyMessage2 === undefined){
				localStorage.setItem('notifyMessage2', timestamp)
				showNotification2()
			}*/
		}else if(Notification.permission !== "denied"){
			Notification.requestPermission().then(permission =>{
				//console.log(permisshion)
				//
				if(permission == "granted"){
					showNotification()
					/*if(localStorage.notifyMessage === undefined){
						localStorage.setItem('notifyMessage', timestamp)
						showNotification()
					}*/
					
					
				}
				
			})
		}

	}

}
notifyOption()


