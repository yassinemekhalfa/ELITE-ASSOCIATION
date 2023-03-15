setTimeout(function(){
	document.querySelector('.notify-alert-box').style.top='0'
},1000);

document.querySelector('#notify-button').onclick = async () => {
	localStorage.setItem('notify','true');
	notifyTrue();
	notifyOption();
}

function notifyTrue(){
	if(localStorage.getItem('notify','true')){
		document.querySelector('.notify-alert-box').style.display='none'
    }
}
notifyTrue();


document.querySelector('#notify-cancel-button').onclick = async () => {
	localStorage.setItem('notify','False');
	notifyFalse();
}

function notifyTrue(){
	if(localStorage.getItem('notify','False')){
		document.querySelector('.notify-alert-box').style.display='none'
    }
}
notifyFalse();

function showNotification(){
	var notificationBody = new Notification('New Message from Google',{
		body:'Google world',
		icon:'images/notify-logo.png'

	})
	notificationBody.onclick = (e) =>{
		window.location.href = 'https://google.com'
	}
}

function showNotification2(){
	var notificationBody = new Notification('New Message from elite',{
		body:'elite world',
		icon:'images/notify-logo.png'

	})
	notificationBody.onclick = (e) =>{
		window.location.href = 'https://youtube.com'
	}
}

function showNotification3(){
	var notificationBody = new Notification('New Message from youtube',{
		body:'youtube world'

	})
}




function notifyOption(){
	if(localStorage.notify == 'true'){
		if(Notification.permission == "granted"){
			//showNotification();
			if(localStorage.notifyMessage === undefined){
				localStorage.setItem('notifyMessage','true');
				showNotification();
			}
			if(localStorage.notifyMessage2 === undefined){
				localStorage.setItem('notifyMessage2','true');
				showNotification2();
			}
			/*if(localStorage.notifyMessage3 === undefined){
				localStorage.setItem('notifyMessage3','true');
				showNotification3();
			}*/
	   }else if(Notification.permission !== "denied"){
		 Notification.requestPermission().then(permission =>{
			if(permission == "granted"){
				if(localStorage.notifyMessage === undefined){
					localStorage.setItem('notifyMessage','true');
					showNotification();
				} 
			} 
		})
	}


}

}
notifyOption();
