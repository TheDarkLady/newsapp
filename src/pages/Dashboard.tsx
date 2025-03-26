import {
  Container,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Box,
  Paper,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { NewsArticle } from "../types/types";

const Dashboard = () => {
  const newsAPIKey = import.meta.env.VITE_NEWS_API_KEY;

  const [open, setOpen] = useState<boolean>(false);
  const [gridView, setGridView] = useState<boolean>(true);
  const [feedBack, setFeedBack] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [selectedNewsUrl, setSelectedNewsUrl] = useState<string>("");
  const [hiddenNews, setHiddenNews] = useState<Set<number>>(new Set());
  const [switchApi, setSwitchApi] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {/* Sidebar */}
      <Container
        className="sidebar"
        sx={{
          display: "flex",
          flexDirection: "row",
          position: "fixed",
          width: feedBack ? "100vw" : "30vw",
          height: "100vh",
          top: "0",
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
          width: "70vw",
          marginRight: "0px !important",
          overflow: feedBack ? "hidden" : "scroll",
        }}
      >
         <Button
            onClick={handleSwitchApi}
            sx={{
              backgroundColor: switchApi ? "#FFAFAF" : "#A3FFD3",
              color: "#000",
              position:"absolute",
              top:"5%",
              right:"5%"
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
                      {loading ? 
                      "Loading Title" :
                      (data.title
                        ? data.title.length > 50
                          ? `${data.title.slice(0, 40)}...`
                          : data.title
                        : "")
                    }
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
                      {loading ? 
                       "Loading description....." 
                       :(data.description
                        ? data.description.length > 100
                          ? `${data.description.slice(0, 100)}...`
                          : data.description
                        : "")

                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ marginTop: "10px", color: "#B9B9B9" }}
                    >
                      <CalendarMonthIcon
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                     {loading ? 
                      "Loading dhat and time"
                       :
                       (switchApi
                        ? new Date(data.published_at).toUTCString()
                        : new Date(data.publishedAt).toUTCString())
                     }
                    </Typography>
                  </Container>
                  {loading ?
                  <Typography>
                    Loading Image
                  </Typography>
                  :
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
                  }
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
    </div>
  );
};

export default Dashboard;
