import { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { IoMdCloseCircle } from "react-icons/io";
// import component
import Chat from "./components/chat/Chat";
import Poll from "./components/poll/Poll";
import LoginComp from "./components/login/LoginComp";
import NavBar from "./components/navbar/NavBar";
const socket = io.connect("https://chat-api-5l1t.onrender.com");
function App() {
  // authentication
  const [auth, setAuth] = useState(false);
  const [room, setRoom] = useState("polling");
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  // for mobile responsiveness
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );
  const [openComp, setOpenComp] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    // Add event listener for window resize
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // modal state
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAuth(true);
    }
    setUser(localStorage.getItem("token"));
    setUsername(localStorage.getItem("name"));
    setUserId(localStorage.getItem("uId"));
  }, []);
  const joinRoom = () => {
    if (user !== "" && room !== "") {
      socket.emit("join", room);
    }
  };
  useEffect(() => {
    joinRoom();
  }, []);

  // time format function
  const dateFormat = (isoDate) => {
    // Create a new Date object from the ISO date string
    const date = new Date(isoDate);

    // Extract the desired components
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    // Format the result to include parentheses around the time
    const dateParts = formattedDate.split(", ");
    const result = `${dateParts[0]}, ${dateParts[1]}`;
    return result;
  };

  return (
    <div className="App">
      {auth ? (
        <>
          <NavBar
            username={username}
            setAuth={setAuth}
            show={show}
            setShow={setShow}
            setOpenComp={setOpenComp}
          />
          <Container fluid>
            {!isMobile ? (
              <Row>
                <Col md={7} className="px-0">
                  {" "}
                  <div className="poll">
                    <Poll
                      socket={socket}
                      user={user}
                      username={username}
                      userId={userId}
                      room={room}
                      show={show}
                      setShow={setShow}
                      dateFormat={dateFormat}
                    />
                  </div>
                </Col>
                <Col md={5} className="px-0">
                  {" "}
                  <div className="chat">
                    <Chat
                      socket={socket}
                      user={user}
                      username={username}
                      userId={userId}
                      room={room}
                      dateFormat={dateFormat}
                    />{" "}
                  </div>
                </Col>
              </Row>
            ) : (
              <>
                {openComp === "" && (
                  <div className="mob-card-container">
                    <div
                      className="mob-card"
                      onClick={() => setOpenComp("poll")}
                    >
                      Open Poll
                    </div>
                    <div
                      className="mob-card"
                      onClick={() => setOpenComp("chat")}
                    >
                      Open Chat
                    </div>
                  </div>
                )}
                {openComp === "poll" && (
                  <>
                    <div className="poll close-mobile ">
                      <Button
                        className="close-mobile-btn"
                        onClick={() => setOpenComp("")}
                      >
                        Back
                      </Button>
                      <Poll
                        socket={socket}
                        user={user}
                        username={username}
                        userId={userId}
                        room={room}
                        show={show}
                        setShow={setShow}
                        dateFormat={dateFormat}
                      />
                    </div>
                  </>
                )}
                {openComp === "chat" && (
                  <>
                    <div className="chat close-mobile">
                      <Button
                        className="close-mobile-btn"
                        onClick={() => setOpenComp("")}
                      >
                        Back
                      </Button>
                      <Chat
                        socket={socket}
                        user={user}
                        username={username}
                        userId={userId}
                        room={room}
                        dateFormat={dateFormat}
                      />{" "}
                    </div>
                  </>
                )}
              </>
            )}
          </Container>
        </>
      ) : (
        <div className="login-container">
          <LoginComp
            setUser={setUser}
            setAuth={setAuth}
            setUsername={setUsername}
            setUserId={setUserId}
          />
        </div>
      )}
    </div>
  );
}

export default App;
