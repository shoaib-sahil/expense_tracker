import React, { useState, useEffect, useCallback, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import spinner from "../../assets/gg.gif";
import "./avatar.css";
import { Button } from "react-bootstrap";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Form } from "react-bootstrap";

// import Buffer from "buffer";
const {
  uniqueNamesGenerator,
  colors,
  animals,
  countries,
  names,
  languages,
} = require("unique-names-generator");

const SetAvatar = () => {
  const sprites = [
    "adventurer",
    "micah",
    "avataaars",
    "bottts",
    "initials",
    "adventurer-neutral",
    "big-ears",
    "big-ears-neutral",
    "big-smile",
    "croodles",
    "identicon",
    "miniavs",
    "open-peeps",
    "personas",
    "pixel-art",
    "pixel-art-neutral",
    "identicon",
  ];

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedSprite, setSelectedSprite] = React.useState(sprites[0]);

  const input = useRef();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  const randomName = () => {
    let shortName = uniqueNamesGenerator({
      dictionaries: [animals, colors, countries, names, languages], // colors can be omitted here as not used
      length: 2,
    });
    // console.log(shortName);

    return shortName;
  };

  const [imgURL, setImgURL] = React.useState([
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
    `https://api.dicebear.com/7.x/${sprites[0]}/svg?seed=${randomName()}`,
  ]);

  const setProfilePicture = async () => {
    const file = input.current?.files?.[0];

    if (!file) return toast.error("Select Image First", toastOptions);

    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);

    const formData = new FormData();
    formData.append("image", file);

    const token = JSON.parse(localStorage.getItem("token"));

    const { data } = await axios.post(setAvatarAPI, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Avatar selected successfully", toastOptions);
      navigate("/");
    } else {
      toast.error("Error while setting avatar", toastOptions);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  return (
    <>
      {/* <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#000",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
                // value: 200,
                value: 0,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffcc00",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
              random: true,
            },
            size: {
              value: 3,
              random: { enable: true, minimumValue: 1 },
            },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 2,
            },
            life: {
              duration: {
                sync: false,
                value: 3,
              },
              count: 0,
              delay: {
                random: {
                  enable: true,
                  minimumValue: 0.5,
                },
                value: 1,
              },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      /> */}
      <div id="bgimg">
        <img src="/bg.png" />
      </div>

      {loading === true ? (
        <>
          {/* <Container></Container> */}
          <div
            className="container containerBox"
            h={"100vh"}
            style={{ position: "relative", zIndex: "2 !important" }}
          >
            <div className="avatarBox">
              <image src={spinner} alt="Loading"></image>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="container containerBox"
            style={{ position: "relative", zIndex: "2 !important" }}
          >
            <div className="avatarBox">
              <h1 className="text-center text-white mt-5 mb-5">
                Choose Your Avatar
              </h1>
              <Form.Group className="mb-3" controlId="formSelect1">
                <Form.Control
                  type="file"
                  ref={input}
                  accept="image/png, image/jpeg"
                ></Form.Control>
              </Form.Group>
              <div>
                <Button
                  onClick={setProfilePicture}
                  type="submit"
                  className="mt-5"
                >
                  Set as Profile Picture
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  type="submit"
                  className="mt-5"
                  variant="danger"
                  style={{ marginLeft: "20px" }}
                >
                  Skip for now
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SetAvatar;
