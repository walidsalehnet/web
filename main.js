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

// تأكد من تحميل Firebase قبل استخدامه
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// التحقق مما إذا كان المستخدم مسجل دخول
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("✅ المستخدم مسجل دخول:", user.email);

        // جلب بيانات المستخدم من Firestore
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
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
            })
            .catch((error) => {
                console.error("❌ خطأ أثناء جلب البيانات من Firestore:", error);
            });

    } else {
        console.warn("⚠️ لا يوجد مستخدم مسجل دخول! يتم التوجيه إلى صفحة تسجيل الدخول...");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500); // تأخير نصف ثانية قبل إعادة التوجيه
    }
});

// تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        console.log("✅ تم تسجيل الخروج! يتم التوجيه إلى صفحة تسجيل الدخول...");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500); // تأخير نصف ثانية قبل إعادة التوجيه
    });
}
