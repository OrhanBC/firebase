const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
admin.initializeApp();

exports.selectColor = functions.https.onCall((data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can vote up requests"
    );
  }
  // get refs for user doc & request doc
  const user = admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid);
  const targetColor = admin
    .firestore()
    .collection("colors")
    .doc(data.id);

  return user.get().then((doc) => {
    if (doc.data().color !== "") {
      admin
        .firestore()
        .collection("colors")
        .doc(doc.data().color)
        .update({
          selected: false,
        });
    }

    // update the array in user document
    return user
      .update({
        color: data.id,
      })
      .then(() => {
        // update the votes on the request
        return targetColor.update({
          selected: true,
        });
      });
  });
});

exports.updateImage = functions.https.onCall((data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can vote up requests"
    );
  }
  // get refs for user doc & request doc
  const user = admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid);
  return user.update({
    imageURL: data.url,
  });
});

// auth trigger
exports.newUserSignup = functions.auth.user().onCreate((user) => {
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      email: user.email,
      imageURL: "",
      color: "",
    });
});

exports.userDeleted = functions.auth.user().onDelete((auth) => {
  const user = admin
    .firestore()
    .collection("users")
    .doc(auth.uid);
  return user.get().then((doc) => {
    if (doc.data().color !== "") {
      admin
        .firestore()
        .collection("colors")
        .doc(doc.data().color)
        .update({
          selected: false,
        });
    }

    if (doc.data().imageURL !== "") {
      storage.bucket("internship-prep-game.appspot.com/").deleteFiles({
        prefix: `images/${auth.uid}`,
      });
    }

    return user.delete();
  });
});
