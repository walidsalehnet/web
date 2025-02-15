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

// تأكد من تحميل Firebase بالكامل قبل استخدام Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // 🔹 تم نقل التهيئة هنا بعد `initializeApp()`

// إنشاء حساب جديد وحفظه في Firestore
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user.updateProfile({ displayName: username }).then(() => {
                return db.collection("users").doc(user.uid).set({
                    email: email,
                    username: username,
                    wallet: 0 // يبدأ الرصيد بـ 0 جنيه
                });
            }).then(() => {
                console.log("✅ المستخدم تمت إضافته إلى Firestore!");

                // إرسال إشعار إلى بوت تيليجرام
                return fetch('https://api.telegram.org/bot7834569515:AAHGBtlyJ-clDjc_jv2j9TDudV0K0AlRjeo/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: '6798744902', // ضع معرف الشات الإداري هنا
                        text: `🆕 مستخدم جديد سجل في الموقع!\n👤 الاسم: ${username}\n📧 البريد: ${email}`
                    })
                });
            }).then(() => {
                alert('🎉 تم إنشاء الحساب بنجاح!');
                window.location.href = 'login.html';
            });
        })
        .catch((error) => {
            console.error("❌ خطأ أثناء تسجيل الحساب أو حفظه في Firestore:", error);
            alert(error.message);
        });
}

// تسجيل الدخول
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'profile2.html';
        })
        .catch((error) => {
            alert(error.message);
        });
}

// تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    });
}
