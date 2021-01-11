const auth = firebase.auth();

const whenSignedIn = document.getElementById('signedIn');
const whenSignedOut = document.getElementById('signedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        //signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3><p>User ID: ${user.uid}</p>`;
    } else {
        //signed out
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

//firestore

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubsribe;

auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = db.collection('things');

        createThing.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                weight: faker.random.number({min:1, max:10}),
                createdAt: serverTimestamp()
            });
        }

        unsubsribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {
               const items = querySnapshot.docs.map(doc => {
                   return `<li>${ doc.data().name }</li>`
               });
               thingsList.innerHTML = items.join('');
            });
    } else {
        thingsList.innerHTML = '';

        unsubsribe && unsubsribe();
    }
});


