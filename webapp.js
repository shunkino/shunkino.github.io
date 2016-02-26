var putElem;
window.addEventListener('load', function() {
	document.getElementById('register').addEventListener('click', register, false);
	document.getElementById('push').addEventListener('click', setPush , false);
	navigator.serviceWorker.ready.then(checkPush);
}, false);

function register() {
	navigator.serviceWorker.register('push.js').then(checkNotification);
}

function checkNotification() {
	Notification.requestPermission(function(permission) {
		if(permission !== 'denied')
			document.getElementById('push').disabled = false;
		else
			alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
	});
}
var subscription = null;

function checkPush(sw) {
	sw.pushManager.getSubscription().then(setSubscription, resetSubscription);
}

function setSubscription(s) {
	if(!s)
		resetSubscription();
	else {
		document.getElementById('register').disabled = true;
		subscription = s;
		console.log("Endpoint is:", subscription.endpoint);
		putElem = document.getElementById("endpoint");
		putElem.innerHTML = subscription.endpoint;
		var p = document.getElementById('push');
		p.textContent = 'プッシュ通知を解除する';
		p.disabled = false;
		registerNotification(s);
	}
}

function resetSubscription() {
	document.getElementById('register').disabled = true;
	subscription = null;
	var p = document.getElementById('push');
	p.textContent = 'プッシュ通知を有効にする';
	p.disabled = false;
}

function setPush() {
	if(!subscription) {
		if(Notification.permission == 'denied') {
			alert('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
			return;
		}
		navigator.serviceWorker.ready.then(subscribe);
	}
	else
		navigator.serviceWorker.ready.then(unsubscribe);
}

function subscribe(sw) {
	sw.pushManager.subscribe({
		userVisibleOnly: true
	}).then(setSubscription, resetSubscription);
}

function unsubscribe() {
	if(subscription) {
		// 自分のWebアプリサーバ等にプッシュ通知の解除を通知する処理をここに実装
		subscription.unsubscribe();
	}
	resetSubscription();
}

function registerNotification(s) {
	var endpoint = s.endpoint;
	// Chrome 43以前への対処
	if(('subscriptionId' in s) && !s.endpoint.match(s.subscriptionId))
		endpoint += '/' + s.subscriptionId;
	// 自分のWebアプリサーバ等にプッシュ通知を登録する処理をここに実装
	// endpointにプッシュサービスのエンドポイントのURLが格納される
}
