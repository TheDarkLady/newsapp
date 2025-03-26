import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import {
  Box,
  Button,
  Container,
  FormLabel,
  Input,
  Typography,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { FormData } from "../types/types";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

interface Props {
  feedBack: boolean;
  setFeedBack: (value: boolean) => void;
  gridView: boolean;
  setGridView: (value: boolean) => void;
}

const Sidebar: React.FC<Props> = ({
  feedBack,
  setFeedBack,
  gridView,
  setGridView,
}) => {
  const { user } = useUser();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    country: "",
    state: "",
    email: "",
    mobile: "",
    feedback: "",
  });

  useEffect(() => {
    if (user?.photo) {
      fetch(user.photo, { mode: "cors" })
        .then((res) => res.blob())
        .then((blob) => setImageSrc(URL.createObjectURL(blob)))
        .catch((err) => console.log("Image Fetch Failed:", err));
    }
  }, [user?.photo]);

  const handleFeedback = () => {
    setFeedBack(!feedBack);
    document.body.style.overflow = feedBack ? "auto" : "hidden"; // Toggle body scroll
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "feedback"), formData);
      console.log("Document written with ID: ", docRef.id);
      alert("Feedback Submitted Successfully");
      setFormData({
        name: "",
        address: "",
        country: "",
        state: "",
        email: "",
        mobile: "",
        feedback: "",
      });
      setFeedBack(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "auto",
        paddingLeft: "0px !important",
        paddingRight: "0px !important",
        backgroundColor: "#EBF2F7",
        ml: "0px !important",
        overflowY: "scroll !important",
        overflowX: "hidden !important",
        scrollbarWidth: "none !important",
       
      }}
    >
      <Container
        sx={{
          backgroundColor: "#EBF2F7",
          width: "auto",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          gap: "50px",
          margin: "50px 0px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            gap: "20px",
            padding: "20px",
            boxShadow: "0px 18px 88px -4px #18274B24",
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="User Avatar"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
          ) : (
            <p>Loading image...</p>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "20px", fontFamily: "Roboto", fontWeight: "700" }}
            >
              Hi {user?.name}
            </Typography>
            <Typography sx={{ fontSize: "16px" }}>Here's your News </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: feedBack ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            gap: "20px",
            padding: "20px",
            boxShadow: "0px 18px 88px -4px #18274B24",
            width: "100%",
          }}
        >
          <Typography
            sx={{ fontSize: "28px", fontFamily: "Roboto", fontWeight: "700" }}
          >
            View Toggle
          </Typography>
          <Box>
            <Button
              sx={{
                backgroundColor: gridView ? "#A3FFD3" : "#18274B24",
                borderTopLeftRadius: "8px !important",
                borderBottomLeftRadius: "8px !important",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
                padding: "20px 15px",
              }}
              onClick={() => setGridView(true)}
            >
              <GridViewIcon sx={{ color: gridView ? "#000" : "#9c9c9c" }} />
            </Button>
            <Button
              sx={{
                backgroundColor: gridView ? "#18274B24" : "#A3FFD3",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                padding: "20px 15px",
              }}
              onClick={() => setGridView(false)}
            >
              <ViewListIcon sx={{ color: gridView ? "#9c9c9c" : "#000" }} />
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            gap: "20px",
            padding: "20px",
            boxShadow: "0px 18px 88px -4px #18274B24",
            width: "100%",
          }}
        >
          <Typography
            sx={{ fontSize: "28px", fontFamily: "Roboto", fontWeight: "700" }}
          >
            Have A Feedback ?
          </Typography>
          <Button
            sx={{
              backgroundColor: feedBack ? "#FFAFAF" : "#A3FFD3",
              borderRadius: "8px",
              padding: "20px 15px",
            }}
            onClick={handleFeedback}
          >
            <Typography
              sx={{
                color: "#000",
                font: "20px",
                fontFamily: "Roboto",
                fontWeight: "700",
              }}
            >
              We are Listening
            </Typography>
          </Button>
        </Box>
      </Container>
      {feedBack && (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "50px 0px",
          }}
        >
          <Container>
            <Typography
              sx={{
                fontSize: "24px",
                fontFamily: "Roboto",
                fontWeight: "700",
                textAlign: "left",
                width: "100%",
              }}
            >
              Thank you so much for taking time !
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontFamily: "Roboto",
                fontWeight: "400",
                textAlign: "left",
                width: "100%",
              }}
            >
              Please provide the below details
            </Typography>
          </Container>
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <FormLabel htmlFor="name" sx={{ mb: "10px" }}>
                Name :
              </FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{
                  width: "70%",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  backgroundColor: "#ffffff",
                  border: "none !important",
                  mb: "20px",
                }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <FormLabel htmlFor="address" sx={{ mb: "10px" }}>
                Address :
              </FormLabel>
              <Input
                type="textarea"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                sx={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  backgroundColor: "#ffffff",
                  border: "none !important",
                  mb: "20px",
                }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <FormLabel htmlFor="country" sx={{ mb: "10px" }}>
                  Country :
                </FormLabel>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  sx={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    backgroundColor: "#ffffff",
                    border: "none !important",
                    mb: "20px",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <FormLabel htmlFor="state" sx={{ mb: "10px" }}>
                  State :
                </FormLabel>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  sx={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    backgroundColor: "#ffffff",
                    border: "none !important",
                    mb: "20px",
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <FormLabel htmlFor="email" sx={{ mb: "10px" }}>
                  Email :
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  sx={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    backgroundColor: "#ffffff",
                    border: "none !important",
                    mb: "20px",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <FormLabel htmlFor="mobile" sx={{ mb: "10px" }}>
                  Mobile Number :
                </FormLabel>
                <Input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  sx={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    backgroundColor: "#ffffff",
                    border: "none !important",
                    mb: "20px",
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <FormLabel htmlFor="feedback" sx={{ mb: "10px" }}>
                Feedback :
              </FormLabel>
              <Input
                type="textarea"
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                required
                sx={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  backgroundColor: "#ffffff",
                  border: "none !important",
                  mb: "20px",
                }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                sx={{ backgroundColor: "#5CC8A1", color: "#fff" }}
                onClick={handleSubmit}
              >
                Submit Feedback
              </Button>
            </Box>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default Sidebar;
