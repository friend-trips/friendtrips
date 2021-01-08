import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.aside`
  position: fixed;
  display: flex;
  flex-direction: column;
  // bottom: 0%;
  // left: 75%;
  top: 1%;
  right: 1%;
  bottom: 2%;
  z-index: 2;
  width: 25%;
  border-left: 1px solid black;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: white;
`;

const Header = styled.header`
  position: relative;
  display: flex;
  width: 100%;
  height: 60px;
  // height: 8%;
  border-bottom: .5px solid black;
`;
const H3 = styled.h3`
  padding: 10px;
  margin: 0;
`;
const Close = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: white;
`;

const Message = styled.div`
  padding: 10px;
`;

const CommentThread = styled.ul`
  list-style: none;
  max-height: 80%;
  overflow-y: scroll;
`;
const CommentForm = styled.form`
  position: relative;
  padding: 2%;
  border-top: .5px solid black;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
const Input = styled.input`
  width: 80%;
  flex: 1;
`;
const Submit = styled.button`
  flex: 1;
`;

const MessageThread = ({ main, hideThread, replyToMsg }) => {
  const [reply, setReply] = useState('');
  const sendReply = (e) => {
    e.preventDefault();
    let comment = {
      message_id: main.message_id,
      comment: reply
    }
    replyToMsg(comment);
    setReply('');
  };
  return (
    <Container>
      <Header>
        <H3>Thread</H3>
        <Close onClick={() => { hideThread() }}>
          X
        </Close>
      </Header>
      <Message>
        <p>{main.username + ': ' + main.message}</p>
      </Message>
      <CommentThread>
        {(main.comments) ?
          main.comments.map((comment) => (
            <li>
              <b>{comment.username + ': '}</b>{comment.comment}
            </li>
          )) : null}
      </CommentThread>

      <CommentForm onSubmit={(e) => { sendReply(e) }}>
        <Input value={reply} onChange={(e) => { setReply(e.target.value) }}></Input>
        <button type='submit'>&#8680;</button>
      </CommentForm>
    </Container>
  )
};

export default MessageThread;