import {
  Container,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Box,
  Paper,
  FormLabel,
  Input,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { NewsArticle } from "../types/types";
import { useUser } from "../UserContext";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { FormData } from "../types/types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Dashboard = () => {
  const newsAPIKey = import.meta.env.VITE_NEWS_API_KEY;
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const [gridView, setGridView] = useState<boolean>(true);
  const [feedBack, setFeedBack] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [selectedNewsUrl, setSelectedNewsUrl] = useState<string>("");
  const [hiddenNews, setHiddenNews] = useState<Set<number>>(new Set());
  const [switchApi, setSwitchApi] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
      name: "",
      address: "",
      country: "",
      state: "",
      email: "",
      mobile: "",
      feedback: "",
    });
  const itemsPerPage = 6; // Show 5 items per page

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    console.log("News Data", newsData);
  }, [newsData]);

  useEffect(() => {
    fetchNews();
  }, [switchApi]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = switchApi
        ? `https://api.thenewsapi.com/v1/news/all?api_token=MIDG8z95yVbaMwSLHLUa1B0P9aKQGQjKOcWbz4Tb&search=usd`
        : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsAPIKey}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setNewsData(switchApi ? data.data : data.articles);
      console.log("News Data :", newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleClickOpen = (url: string) => {
    window.open(url, "_blank");
    setSelectedNewsUrl(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNewsUrl("");
  };

  const handleHideNews = (index: number) => {
    setHiddenNews((prev) => new Set([...prev, index]));
  };

  const handleSwitchApi = () => {
    setSwitchApi((prev) => !prev);
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
  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
          marginRight: "0px !important",
        },
      }}
    >
      {/* Sidebar */}
      <Container
        className="sidebar"
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "row",
          position: "fixed",
          width: feedBack ? "100vw" : "30vw",
          height: { xs: "auto", md: "100vh" },
          top: { xs: 0, md: "0" },
          left: "0",
          paddingLeft: "0px !important",
          paddingRight: "0px !important",
          zIndex: "100",
          backgroundColor: feedBack ? "rgb(0, 0, 0, 0.4)" : "none",
          maxWidth: "100vw !important",
          transition: "all 0.5s linear",
          backdropFilter: feedBack ? "blur(10px)" : "none",
          overflowY: "auto",
          boxShadow: "0px 18px 88px -4px #18274B24",
          borderTopRightRadius: "32px",
          borderBottomRightRadius: "32px",
        }}
      >
        <Sidebar
          feedBack={feedBack}
          setFeedBack={setFeedBack}
          gridView={gridView}
          setGridView={setGridView}
        />
      </Container>

      {/* News */}
      <Container
        sx={{
          width: { xs: "100vw", md: "70vw" },
          marginRight: "0px !important",
          overflow: feedBack ? "hidden" : "scroll",
        }}
      >
        <Container
          sx={{
            display: {
              xs: "flex",
              md: "none",
              flexDirection: "column",
              gap: "20px",
              marginTop: "20px",
            },
          }}
        >
          <Typography
            sx={{ fontSize: "20px", fontFamily: "Roboto", fontWeight: "700" }}
          >
            Hi {user?.name}
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
        </Container>
        <Button
          onClick={handleSwitchApi}
          sx={{
            backgroundColor: switchApi ? "#FFAFAF" : "#A3FFD3",
            color: "#000",
            position: "absolute",
            top: "5%",
            right: "5%",
          }}
        >
          {" "}
          Switch API{" "}
        </Button>
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: gridView
              ? "repeat(auto-fill, minmax(300px, 1fr))"
              : "repeat(auto-fill, minmax(100%, 1fr))",
            gap: "20px",
            padding: "20px",
            marginTop: "100px",
            position: "relative",
            zIndex: "1",
          }}
        >
          {currentItems.map((data: NewsArticle, index: number) => {
            if (hiddenNews.has(index)) return null;

            return (
              <Paper sx={{ borderRadius: "1rem" }} elevation={4} key={data.url}>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: gridView ? "column" : "row-reverse",
                    gap: "10px",
                    padding: "20px",
                    boxShadow: "0px 18px 88px -4px #18274B24",
                    borderRadius: "10px",
                    cursor: "pointer",
                    "&:hover": { boxShadow: "0px 18px 88px -4px #18274B44" },
                  }}
                  onClick={() => handleClickOpen(data.url)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "end",
                      padding: "0px",
                    }}
                  >
                    <Box
                      sx={{
                        padding: "0px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "end",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHideNews(index);
                      }}
                    >
                      <CloseIcon sx={{ color: "#FF9090" }} />
                    </Box>
                  </Box>
                  <Container sx={{ padding: "0px !important" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Roboto",
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#212121",
                      }}
                    >
                      {loading
                        ? "Loading Title"
                        : data.title
                        ? data.title.length > 50
                          ? `${data.title.slice(0, 40)}...`
                          : data.title
                        : ""}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Roboto",
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#212121",
                      }}
                    >
                      {loading
                        ? "Loading description....."
                        : data.description
                        ? data.description.length > 100
                          ? `${data.description.slice(0, 100)}...`
                          : data.description
                        : ""}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ marginTop: "10px", color: "#B9B9B9" }}
                    >
                      <CalendarMonthIcon
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                      {loading
                        ? "Loading dhat and time"
                        : switchApi
                        ? new Date(data.published_at).toUTCString()
                        : new Date(data.publishedAt).toUTCString()}
                    </Typography>
                  </Container>
                  {loading ? (
                    <Typography>Loading Image</Typography>
                  ) : (
                    <img
                      src={switchApi ? data.image_url : data.urlToImage}
                      alt={data.title}
                      style={{
                        width: gridView ? "100%" : "100px",
                        height: gridView ? "200px" : "100px",
                        objectFit: "cover",
                        borderRadius: gridView ? "10px" : "50%",
                      }}
                    />
                  )}
                </Container>
              </Paper>
            );
          })}
        </Container>

        {/* Pagination Buttons */}
        <Container
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            sx={{
              backgroundColor: "transparent",
              display: currentPage === 1 ? "none" : "block",
            }}
          >
            <NavigateBeforeIcon sx={{ color: "#BCBCBC" }} />
          </Button>

          {Array.from({ length: 3 }, (_, i) => currentPage + i)
            .filter((page) => page <= Math.ceil(newsData.length / itemsPerPage))
            .map((page) => (
              <Typography
                key={page}
                variant="h6"
                sx={{
                  padding: "5px 15px",
                  borderRadius: "50%",
                  backgroundColor: page === currentPage ? "#fff" : "#6b6b6b",
                  color: page === currentPage ? "#6d6d6d" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Typography>
            ))}

          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= Math.ceil(newsData.length / itemsPerPage)}
            sx={{
              backgroundColor: "transparent",
              display:
                currentPage >= Math.ceil(newsData.length / itemsPerPage)
                  ? "none"
                  : "block",
            }}
          >
            <NavigateNextIcon sx={{ color: "#BCBCBC" }} />
          </Button>
        </Container>
      </Container>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "black" }}
          >
            <CloseIcon />
          </IconButton>
          {selectedNewsUrl && (
            <iframe
              src={selectedNewsUrl}
              title="News Article"
              style={{ width: "100%", height: "80vh", border: "none" }}
            ></iframe>
          )}
        </DialogContent>
      </Dialog>

       <Container sx={{marginTop:"50px", display:{xs:"block", md:"none"}}}>
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
              display: {xs:"flex", md:"none"},
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
  );
};

export default Dashboard;
