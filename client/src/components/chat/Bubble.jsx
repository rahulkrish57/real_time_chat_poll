import React from "react";

const Bubble = ({ bubble_cname, msg, author, time }) => {
  return (
    <>
      <div className={bubble_cname}>
        {author && <p className="author-name">{author}</p>}
        <p className="mb-2">{msg}</p>
        <p className="mb-0 chat-time">{time}</p>
      </div>
    </>
  );
};

export default Bubble;
