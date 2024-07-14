navigator.serviceWorker.register("sw.js");

const baseUrl = "http://localhost:3080"
const backendApiUrl = "http://localhost:8080"

// const baseApiUrl = `${baseUrl}/api`

// const setUpMessage = async () => {
   
//     if (typeof Notification === "undefined") return
//     const permission = await Notification.requestPermission()
//     if (permission === "denied") return

//     const resp = await fetch(`${baseApiUrl}/auth/session`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })

//     if (resp.ok) {
//         const json = await resp.json()

//         if (json?.user) {
//             // save and return user
//             const user = json.user
//             const resp = await fetch(`${backendApiUrl}/user/${user.email}`, {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             })
//             if (resp.ok) {
//                 const json = await resp.json()
//                 const user = json.user
//                 var source = new EventSource(`${backendApiUrl}/stream/${user.email}`);

//                 source.addEventListener('message', function (e) {
//                     sendAlert(e, user.id)
//                 })
//             }
//         }
//     }
// }

// const sendAlert = (e, id) => {
//     const message = JSON.parse(e.data)
//     // let title = "JavaScript Jeep";

//     let icon = '/brand/logo.png';

//     // let body = "It's Your boarding time";
//     // return window.registration.showNotification(title, notificationOptions);

//     if (message.userid !== id) {
//         return
//     }
//     if (message.notification.value === "language") {
//         if (message.notification.action === "insert") {
//             var notification = new Notification("🔈 New Corpus", { 
//                 body: `New request "${message.notification.other_obj.text}" in language ${message.notification.value_obj.name} added`, 
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//         if (message.notification.action === "translate") {
//             var notification = new Notification("🔈 New Translation", {
//                 body: `New translation "${message.notification.other_obj.translation.text}" for corpus text "${message.notification.other_obj.corpustext.text}" in language ${message.notification.value_obj.name} added`,
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//     }

//     if (message.notification.value === "corpus") {
//         if (message.notification.action === "translate") {
//             var notification = new Notification("🔈 New Translation", {
//                 body: `New translation "${message.notification.other_obj.text}" for corpus text "${message.notification.value_obj.text}"`,
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//         if (message.notification.action === "update") {
//             var notification = new Notification("🔈 New Corpus Update", {
//                 body: `Corpus text "${message.notification.other_obj.text}" updated`,
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//         if (message.notification.action === "choosing") {
//             var notification = new Notification("🔈 New Translation Chosen", {
//                 body: `Translation "${message.notification.other_obj.text}" has been chosen for "${message.notification.value_obj.text}"`,
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//     }

//     if (message.notification.value === "translation") {
//         if (message.notification.action === "upvote") {
//             var notification = new Notification("🔈 New Translation Upvote", {
//                 body: `Translation "${message.notification.value_obj.text}" for corpus text "${message.notification.value_obj.text} has been upvoted`,
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//         if (message.notification.action === "downvote") {
//             var notification = new Notification("🔈 New Translation Downvote", {
//                 body: `Translation "${message.notification.value_obj.text}" for corpus text "${message.notification.value_obj.text} has been downvoted`,
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//         if (message.notification.action === "choosing") {
//             var notification = new Notification("🔈 New Translation Chosen", {
//                 body: `Translation "${message.notification.value_obj.text}" has been chosen for "${message.notification.other_obj.text}"`,
//                 icon
//             });
//             notification.onclick = () => {
//                 notification.close();
//                 window.parent.focus();
//             }
//         }
//     }
// }


// setUpMessage()

// self.addEventListener('push', function (event) {
// })

// class CustomPushEvent extends Event {
//     constructor(data) {
//         super('push');

//         Object.assign(this, data);
//         this.custom = true;
//     }
// }

// self.addEventListener('notificationclick', (event) => {
//     if (event?.notification?.data && event?.notification?.data?.link) {
//         self.clients.openWindow(event.notification.data.link);
//     }

//     // close notification after click
//     event.notification.close();
// });