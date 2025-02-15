// ✅ تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdf5AKFgLXgK2PYERHw1hgF_HsMmuTfuo",
    authDomain: "noproblem-55b97.firebaseapp.com",
    projectId: "noproblem-55b97",
    storageBucket: "noproblem-55b97.firebasestorage.app",
    messagingSenderId: "316010224446",
    appId: "1:316010224446:web:5d7e7f792e53ee4b396a6f",
    measurementId: "G-VKSGWBRKVL"
};

// ✅ تأكد من تحميل Firebase قبل استخدامه
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ إرسال إشعار إلى بوت تيليجرام
const TELEGRAM_CHAT_ID = "6798744902";  // استبدل بمعرف الشات الإداري
const TELEGRAM_BOT_TOKEN = "7834569515:AAHGBtlyJ-clDjc_jv2j9TDudV0K0AlRjeo";

function sendTelegramNotification(message) {
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        })
    }).then(response => console.log("✅ تم إرسال الإشعار إلى البوت"))
    .catch(error => console.error("❌ خطأ أثناء إرسال الإشعار إلى البوت:", error));
}

// ✅ إنشاء حساب جديد
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    if (!email || !password || !username) {
        alert("❌ الرجاء إدخال جميع البيانات!");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user.updateProfile({ displayName: username }).then(() => {
                return db.collection("users").doc(user.uid).set({
                    email: email,
                    username: username,
                    wallet: 0  // يبدأ الرصيد بـ 0 جنيه
                });
            }).then(() => {
                console.log("✅ المستخدم تمت إضافته إلى Firestore:", email);
                
                sendTelegramNotification(`🆕 مستخدم جديد سجل في الموقع!\n👤 الاسم: ${username}\n📧 البريد: ${email}`);

                alert('🎉 تم إنشاء الحساب بنجاح!');
                window.location.href = 'login.html';
            });
        })
        .catch((error) => {
            console.error("❌ خطأ أثناء تسجيل الحساب:", error);
            alert(error.message);
        });
}

// ✅ تسجيل الدخول
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("❌ الرجاء إدخال البريد وكلمة المرور!");
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("✅ تسجيل الدخول ناجح:", userCredential.user.email);
            sendTelegramNotification(`🔓 تسجيل دخول جديد!\n📧 البريد: ${userCredential.user.email}`);
            window.location.href = 'profile2.html';
        })
        .catch((error) => {
            console.error("❌ خطأ أثناء تسجيل الدخول:", error.message);
            alert(error.message);
        });
}

// ✅ جلب بيانات المستخدم في `profile2.html`
firebase.auth().onAuthStateChanged((user) => {
    const currentPage = window.location.pathname;

    if (user) {
        console.log("✅ المستخدم مسجل دخول:", user.email);

        // ✅ جلب بيانات المستخدم إذا كان في `profile2.html`
        if (currentPage === "/profile2.html") {
            db.collection("users").doc(user.uid).onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('user-username').textContent = userData.username;
                    document.getElementById('user-email').textContent = userData.email;
                    document.getElementById('user-wallet').textContent = userData.wallet + " جنيه";
                    console.log("✅ تم تحميل بيانات المستخدم:", userData);
                } else {
                    console.warn("⚠️ لم يتم العثور على بيانات المستخدم في Firestore.");
                    document.getElementById('user-wallet').textContent = "غير متاح";
                }
            }, (error) => {
                console.error("❌ خطأ أثناء جلب البيانات من Firestore:", error);
            });
        }

    } else {
        console.warn("⚠️ لا يوجد مستخدم مسجل دخول!");

        // ✅ إعادة التوجيه إلى `login.html` فقط للصفحات المحمية
        if (currentPage === "/profile2.html") {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }
    }
});

// ✅ تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        console.log("✅ تم تسجيل الخروج! يتم التوجيه إلى صفحة تسجيل الدخول...");
        sendTelegramNotification("🚪 تم تسجيل خروج أحد المستخدمين.");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}

// ✅ ربط الدوال بنافذة المتصفح لتكون متاحة في HTML
window.signUp = signUp;
window.login = login;
window.logout = logout;
