// async function loadFile() {
// 	const response = await fetch('data.txt');
// 	const text = await response.text();
// 	return text.split('\n').map(line => line.trim());
// }

// document.querySelector('.hero__btn').addEventListener('click', async () => {
// 	const input = document.querySelector('.hero__input').value.trim().toLowerCase();
// 	const resultElement = document.querySelector('.hero__result');

// 	if (!input) {
// 		resultElement.innerHTML = 'Write something to find.';
// 		return;
// 	}

// 	const lines = await loadFile();
// 	const matches = lines.filter(line => line.toLowerCase().includes(input));

// 	if (matches.length > 0) {
// 		resultElement.innerHTML = `${matches.length} match(es) found:<br><br>${matches.join('<br><br>')}`;
// 	} else {
// 		resultElement.innerHTML = 'Nothing found.';
// 	}
// });



/* global firebase */

// Конфіг Firebase
const firebaseConfig = {
	apiKey: "AIzaSyA0UOBuVeItZKXGdMqw8m2gNUF2FuwBRbc",
	authDomain: "done-list-c75b0.firebaseapp.com",
	databaseURL: "https://done-list-c75b0-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "done-list-c75b0",
	storageBucket: "done-list-c75b0.firebasestorage.app",
	messagingSenderId: "869690543705",
	appId: "1:869690543705:web:020f5bb25364c03b126b48",
	measurementId: "G-6PJBQ5F7Q1"
};

// Ініціалізація Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Логін через Google
document.getElementById('loginButton').addEventListener('click', () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	auth.signInWithPopup(provider)
		.then(result => {
			document.getElementById('userInfo').textContent = `You are logged in as: ${result.user.email}`;
			document.querySelector('.hero__add').style.display = 'block';
		})
		.catch(err => alert('Login error: ' + err.message));
});

// Пошук
document.getElementById('searchButton').addEventListener('click', async () => {
	const input = document.getElementById('searchInput').value.trim().toLowerCase();
	const resultElement = document.getElementById('searchResult');

	const snapshot = await db.ref('texts').once('value');
	const data = snapshot.val() || {};
	const matches = Object.values(data).filter(item => item.toLowerCase().includes(input));

	resultElement.innerHTML = matches.length > 0
		? `${matches.length} match(es) found:<br><br>${matches.join('<br><br>')}`
		: 'Nothing found.';
});

// Додавання нового запису
document.getElementById('addButton').addEventListener('click', () => {
	const newText = document.getElementById('addInput').value.trim();
	const addResult = document.getElementById('addResult');

	if (!newText) {
		addResult.textContent = 'Write something to find.';
		return;
	}

	db.ref('texts').push(newText)
		.then(() => {
			addResult.textContent = `Entry "${newText}" has been added.`;
			document.getElementById('addInput').value = '';
		})
		.catch(err => {
			addResult.textContent = `Error while adding: ${err.message}`;
		});
});
