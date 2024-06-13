import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  Modal,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { CiClock2 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

import { apiService } from "../../service/api.service";
import "./poll.css";
const Poll = ({
  socket,
  user,
  username,
  userId,
  room,
  show,
  setShow,
  dateFormat,
}) => {
  const initialPoll = {
    poll_id: uuidv4(),
    poll_title: "",
    poll_desc: "",
  };

  const [newPoll, setNewPoll] = useState(initialPoll);
  const initialOptions = [
    {
      id: uuidv4(),
      name: "",
    },
    {
      id: uuidv4(),
      name: "",
    },
  ];
  const [pollOptions, setPollOptions] = useState(initialOptions);

  const [pollList, setPollList] = useState([]);
  console.log("pollList", pollList);
  const handleChangePoll = (e) => {
    const { name, value } = e.target;
    setNewPoll((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangePollOption = (e, index) => {
    const { name, value } = e.target;
    const data = [...pollOptions];
    const newData = data[index];
    newData[name] = value;
    data[index] = newData;
    setPollOptions(data);
  };

  const addNewPollOption = () => {
    setPollOptions((prevData) => [...prevData, { id: uuidv4(), name: "" }]);
  };
  const deletePollOption = (index) => {
    setPollOptions((prevData) => prevData.filter((_, i) => i !== index));
  };

  // function to handle vote apply
  const handleVote = async (pollId, optionId) => {
    const newVote = {
      author: username,
      room: room,
      userId: userId,
      poll_id: pollId,
      vote_id: uuidv4(),
      vote_applied: optionId,
      cAt: new Date(),
      uAt: new Date(),
    };
    await socket.emit("vote", newVote);
    setPollList((prevPollList) =>
      prevPollList.map((poll) =>
        poll.poll_id === pollId
          ? { ...poll, poll_details: [...poll.poll_details, newVote] }
          : poll
      )
    );
  };
  // close modal
  const handleClose = () => {
    setShow(false);
    setNewPoll(initialPoll);
    setPollOptions(initialOptions);
  };

  // create New Poll
  const onSubmit = async () => {
    const body = {
      ...newPoll,
      room: room,
      author: username,
      userId: userId,
      poll_options: pollOptions,
      poll_details: [],
      token: user,
      cAt: new Date(),
      uAt: new Date(),
    };
    const { poll_title, poll_options } = body;
    if (poll_title === "") {
      return alert("Please Fill All required Fields");
    }
    // poll_options.forEach((opt) => {
    //   if (opt.name === "") {
    //     alert("Please Fill All Options");
    //     return;
    //   }
    // });
    for (let i = 0; i < poll_options.length; i++) {
      if (poll_options[i].name === "") {
        return alert("Please Fill All Options");
      }
    }
    setPollList((list) => [...list, body]);
    await socket.emit("create_poll", body);
    handleClose();
  };
  const pollHistoryFunc = async () => {
    try {
      const config = {
        "access-token": user,
      };
      const response = await apiService.pollHistory(config);
      const { data } = response;
      setPollList(data.info);
    } catch (error) {
      console.log(error);
      alert("poll History Failed!");
    }
  };
  const calculateVoteShare = (poll) => {
    console.log("poll", poll);
    if (
      !poll ||
      !Array.isArray(poll.poll_options) ||
      !Array.isArray(poll.poll_details)
    ) {
      throw new Error("Invalid poll data");
    }

    const voteCounts = {};

    // Initialize vote counts for each option
    poll.poll_options.forEach((option) => {
      voteCounts[option.id] = 0;
    });

    // Count the votes for each option
    poll.poll_details.forEach((detail) => {
      if (voteCounts.hasOwnProperty(detail.vote_applied)) {
        voteCounts[detail.vote_applied]++;
      }
    });

    // Calculate total votes
    const totalVotes = poll.poll_details.length;

    // Calculate the percentage share for each option
    const voteShare = {};
    if (totalVotes === 0) {
      // If no votes, set all shares to 0
      Object.keys(voteCounts).forEach((optionId) => {
        voteShare[optionId] = 0;
      });
    } else {
      Object.keys(voteCounts).forEach((optionId) => {
        voteShare[optionId] = Math.round(
          (voteCounts[optionId] / totalVotes) * 100
        );
      });
    }

    return voteShare;
  };

  useEffect(() => {
    pollHistoryFunc();
  }, []);

  useEffect(() => {
    const handlePollReceive = (poll_data) => {
      setPollList((list) => {
        const isPresent = list.some(
          (poll) => poll.poll_id === poll_data.poll_id
        );
        if (!isPresent) {
          return [...list, poll_data];
        }
        return list;
      });
    };

    const handleNewVote = (voteData) => {
      setPollList((prevPollList) =>
        prevPollList.map((poll) =>
          poll.poll_id === voteData.poll_id
            ? { ...poll, poll_details: [...poll.poll_details, voteData] }
            : poll
        )
      );
    };
    socket.on("receive_poll", handlePollReceive);
    socket.on("vote", handleNewVote);

    // Cleanup on unmount
    return () => {
      socket.off("receive_poll", handlePollReceive);
      socket.off("vote", handleNewVote);
    };
  }, [socket]);
  return (
    <div className="poll-container">
      {pollList.length > 0 ? (
        <>
          {pollList.map((poll, i) => {
            const voteShare = calculateVoteShare(poll);

            return (
              <Card key={poll.poll_id} className="poll-card">
                <Card.Body>
                  <Card.Title>{poll.poll_title}</Card.Title>
                  <Card.Text>
                    {poll.poll_desc !== ""
                      ? poll.poll_desc
                      : "No Description for this poll"}
                  </Card.Text>

                  {poll.poll_options.map((opt) => {
                    return (
                      <>
                        <Form.Check
                          type={"radio"}
                          id={opt.id}
                          label={opt.name}
                          checked={poll?.poll_details.find(
                            (det) =>
                              det.userId === userId &&
                              det.vote_applied === opt.id
                          )}
                          disabled={poll?.poll_details.find(
                            (det) => det.userId === userId
                          )}
                          onChange={() => handleVote(poll.poll_id, opt.id)}
                        />

                        <ProgressBar
                          className="mb-4 mt-1"
                          now={voteShare[opt.id]}
                          label={`${voteShare[opt.id]}%`}
                        />
                      </>
                    );
                  })}
                </Card.Body>
                <Card.Footer className="text-muted mb-0">
                  <p className="mb-2 card-footer-main">
                    Total Vote: {poll?.poll_details.length}
                  </p>
                  <p className="mb-0 card-footer-sub">
                    Created By: {poll.author}
                  </p>
                  <p className="mb-0 card-footer-sub">
                    <CiClock2 /> {dateFormat(poll.cAt)}
                  </p>
                </Card.Footer>
              </Card>
            );
          })}
        </>
      ) : (
        <>
          <div className="empty-poll">No Poll Yet! Create one Now!</div>
        </>
      )}
      <Modal className="modal-class" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Poll</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail" className="form-group">
              <Form.Label>Poll Title*</Form.Label>
              <Form.Control
                type="text"
                name="poll_title"
                value={newPoll.poll_title}
                placeholder="Title of the poll"
                maxLength={100}
                onChange={handleChangePoll}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="form-group">
              <Form.Label>Poll Description</Form.Label>
              <Form.Control
                type="textarea"
                rows={3}
                name="poll_desc"
                value={newPoll.poll_desc}
                placeholder="Title of the poll"
                maxLength={350}
                onChange={handleChangePoll}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="form-group">
              <Form.Label>Options*</Form.Label>
              {pollOptions.map((singleOpt, i) => (
                <div>
                  {i > 1 ? (
                    <div className="opt-delete ">
                      <Form.Control
                        className="form mb-2"
                        type="text"
                        rows={3}
                        name="name"
                        value={singleOpt.name}
                        placeholder={`Option ${i + 1}`}
                        maxLength={350}
                        onChange={(e) => handleChangePollOption(e, i)}
                      />
                      <Button
                        className="text-danger floating-del"
                        type="button"
                        onClick={() => deletePollOption(i)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  ) : (
                    <Form.Control
                      className="form mb-2"
                      type="text"
                      rows={3}
                      name="name"
                      value={singleOpt.name}
                      placeholder={`Option ${i + 1}`}
                      maxLength={350}
                      onChange={(e) => handleChangePollOption(e, i)}
                    />
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <Button onClick={addNewPollOption}>Add Options</Button>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Create Poll
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Poll;
