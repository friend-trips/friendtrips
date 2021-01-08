import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import FlightCard from "./FlightCard.jsx";

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  left: 0;
  top: 0;
  position: fixed;
  width: 80vw;
  height: 70vh;
  background-color: #f2f2f2;
  border: 3px solid rgb(82,82,82, 0.9);
  overflow: none;
  z-index: 10;
  margin: 15%;
`;

const SVG = styled.svg`
  border: 3px solid red;
  height: 25px;
  width: 25px;
  top: 0;
  right: 0;
  align-self: flex-end;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  border: 3px solid red;
  overflow: none;
  height: 100%;
`;

const Detail = styled.div`
  height: 100%;
  width: 50%;
  border: 3px solid blue;
`

const Comments = styled.div`
  height: 100%;
  width: 50%;
  border: 3px solid blue;
`
const Header = styled.div`
  font-family: "cerapro-bold",sans-serif;
  font-size: 25px;
  text-align: center;
`
const DetailInfo= styled.div`
  font-family: "cerapro-bold",sans-serif;
  font-size: 12px;
`

const DetailInfoHeader= styled.div`
  font-family: "cerapro-bold",sans-serif;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
`



const Modal = ({shouldRender, modalClick, data, upvotes, downvotes}) => {
  // if (shouldRender) {
  //   console.log(data);
  // }

  return shouldRender ? (
    <div>
      <ModalBox>
        <SVG onClick={modalClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.414 12l6.293-6.293a1 1 0 00-1.414-1.414L12 10.586 5.707 4.293a1 1 0 00-1.414 1.414L10.586 12l-6.293 6.293a1 1 0 101.414 1.414L12 13.414l6.293 6.293a1 1 0 001.414-1.414z"/>
        </SVG>
        <Info>
          <Detail>
            <Header>
              Detail
            </Header>
            <DetailInfo>
              <FlightCard data={data}/>
            </DetailInfo>

          </Detail>
          <Comments>
            <Header>
              Comment
            </Header>
            <DetailInfo>
              <DetailInfoHeader>
                <div>
                  Suggested By {data.meta.username}
                </div>
                <div>
                {upvotes} upvotes {downvotes} downvotes
                </div>

              </DetailInfoHeader>
            </DetailInfo>
          </Comments>
        </Info>
      </ModalBox>
    </div>
  ) : null;
}

export default Modal


