// تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdf5AKFgLXgK2PYERHw1hgF_HsMmuTfuo",
    authDomain: "noproblem-55b97.firebaseapp.com",
    projectId: "noproblem-55b97",
    storageBucket: "noproblem-55b97.firebasestorage.app",
    messagingSenderId: "316010224446",
    appId: "1:316010224446:web:5d7e7f792e53ee4b396a6f",
    measurementId: "G-VKSGWBRKVL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// إنشاء حساب جديد
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({ displayName: username });

            const userData = {
                id: user.uid,
                username: username,
                email: email,
                wallet: 0
            };

            // حفظ بيانات المستخدم في Firestore
            db.collection("users").doc(user.uid).set(userData).then(() => {
                // إرسال إشعار إلى بوت تيليجرام
                fetch('https://api.telegram.org/bot7834569515:AAHGBtlyJ-clDjc_jv2j9TDudV0K0AlRjeo/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: '6798744902',
                        text: `🆕 مستخدم جديد سجل في الموقع!\n👤 الاسم: ${username}\n📧 البريد: ${email}\n🆔 ID: ${user.uid}`
                    })
                });

                alert('🎉 تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.');
                window.location.href = 'login.html';
            });
        })
        .catch((error) => {
            alert(error.message);
        });
}

// تسجيل الدخول
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'profile2.html';
        })
        .catch((error) => {
            alert(error.message);
        });
}

// استرجاع بيانات الرصيد وعرضها في صفحة الحساب
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('user-username').textContent = user.displayName;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-id').textContent = user.uid;

        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                document.getElementById('user-wallet').textContent = doc.data().wallet;
            }
        });
    } else {
        window.location.href = 'login.html';
    }
});

// تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    });
}
