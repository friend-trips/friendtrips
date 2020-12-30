import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.aside`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 8.5%;
  bottom: 14%;
  right: 1%;
  width: 25%;
  border-left: 1px solid black;
  background-color: yellow;
`;

const Header = styled.header`
  position: relative;
  display: flex;
  width: 100%;
  height: 60px;
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
`;
const CommentForm = styled.form`
  padding: 2%;
  border: .5px solid black;
`;
const Input = styled.input`
  width: 80%;
`;
const Submit = styled.button`
  width: 20%;
`;

const MessageThread = ({ main, hideThread, replyToMsg }) => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const sendReply = (e) => {
    e.preventDefault();
    console.log('SENDREPLY', main, reply)
    setLoading(true);
    replyToMsg(main, reply);
    setReply('');
  };

    return (
      <Container>
        <Header>
          <H3>Thread</H3>
          <Close onClick={() => {hideThread()}}>
            X
        </Close>
        </Header>
        <Message>
          <p>{main.user_id + ': ' + main.message}</p>
        </Message>
        <CommentThread>
          {(main.comments) ?
            main.comments.map((comment) => (
              <li>
                <b>{comment.user_id + ': '}</b>{comment.comment}
              </li>
            )) : null}
        </CommentThread>

        <CommentForm onSubmit={(e) => {sendReply(e)}}>
          <Input value={reply} onChange={(e) => { setReply(e.target.value) }}></Input>
          <button type='submit'>&#8680;</button>
        </CommentForm>
      </Container>
    )
  // }

};

export default MessageThread;