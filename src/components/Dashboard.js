import React from "react";
import { auth, firestore, functions, storage } from "../firebase";
import {
  Typography,
  Button,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import { useState } from "react";

const Dashboard = (props) => {
  const containerStyle = {
    width: 500,
    margin: "auto",
  };

  const [imageURL, setImageURL] = useState("");
  const [selectedColor, setColor] = useState("Select a color");
  const [colors, setColors] = useState([]);
  const [image, setImage] = useState(null);
  const updateImage = functions.httpsCallable("updateImage");

  const selectColor = functions.httpsCallable("selectColor");

  const userRef = firestore.collection("users").doc(props.user.uid);

  userRef
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        // Document exists, so you can attach the listener
        userRef.onSnapshot((snapshot) => {
          setImageURL(snapshot.data().imageURL);
          setColor(snapshot.data().color);
        });
      } else {
        // Document doesn't exist
        console.log("Document does not exist.");
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the get() operation
      console.error("Error getting document:", error);
    });

  firestore.collection("colors").onSnapshot((snapshot) => {
    const newColors = [];
    snapshot.forEach((doc) => {
      newColors.push({ ...doc.data(), id: doc.id });
    });
    setColors(newColors);
  });

  if (selectedColor === "") {
    setColor("none");
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadTask = storage
      .ref(`images/${props.user.uid}/${image.name}`)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(props.user.uid)
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            updateImage({ url }).then(() => {
              if (imageURL !== "") {
                storage.refFromURL(imageURL).delete();
              }
              const form = document.querySelector("form");
              form.reset();
            });
          });
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "75vh",
      }}
    >
      <Container sx={containerStyle} size="sm">
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          Account Information
        </Typography>
        <div style={{ display: "flex" }}>
          <Avatar
            src={
              imageURL ||
              "https://www.personality-insights.com/wp-content/uploads/2017/12/default-profile-pic-e1513291410505.jpg"
            }
            sx={{ width: 56, height: 56 }}
          />
          <form onSubmit={handleUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <button type="submit">Upload</button>
          </form>
        </div>

        <Typography gutterBottom sx={{ marginTop: 3 }}>
          {" "}
          Email: {props.user.email}
        </Typography>

        <div>
          <FormControl sx={{ marginTop: 3 }} size="small">
            <Select
              name="color"
              value={selectedColor}
              onChange={(e) => selectColor({ id: e.target.value })}
            >
              <MenuItem value="none" disabled>
                Select a color
              </MenuItem>
              {colors.map((color) => (
                <MenuItem
                  key={color.id}
                  value={color.id}
                  disabled={color.selected}
                >
                  {color.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Button
          type="click"
          color="secondary"
          variant="contained"
          onClick={() => auth.signOut()}
          sx={{ marginTop: 3 }}
        >
          Sign Out
        </Button>
      </Container>
    </div>
  );
};

export default Dashboard;
