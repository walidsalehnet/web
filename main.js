// Firebase Configuration
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
const db = firebase.firestore(); // تأكد إنه هنا بعد التهيئة مباشرةً


// تسجيل الدخول
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                window.location.href = 'profile2.html';
            } else {
                alert('يرجى تأكيد البريد الإلكتروني قبل تسجيل الدخول.');
            }
        })
        .catch((error) => {
            alert(error.message);
        });
}

// إنشاء حساب جديد
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({ displayName: username });

            // حفظ بيانات المستخدم في Firestore
            db.collection("users").doc(user.uid).set({
                username: username,
                email: email,
                wallet: 0
            }).then(() => {
                // إرسال إشعار إلى بوت تيليجرام
                fetch('https://api.telegram.org/bot7834569515:AAHGBtlyJ-clDjc_jv2j9TDudV0K0AlRjeo/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: 'YOUR_ADMIN_CHAT_ID',
                        text: `🆕 مستخدم جديد سجل في الموقع!\n👤 الاسم: ${username}\n📧 البريد: ${email}`
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
emailVerified) {
        document.getElementById('user-username').textContent = user.displayName;
        document.getElementById('user-email').textContent = user.email;
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
