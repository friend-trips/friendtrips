import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const ModalDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  height: 25px;
  width: 25px;
  top: 0;
  right: 0;
`;

const Modal = ({shouldRender, modalClick}) => {

  return shouldRender ? (
    <div>
      <ModalDiv>
        text text
        <SVG onClick={modalClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.414 12l6.293-6.293a1 1 0 00-1.414-1.414L12 10.586 5.707 4.293a1 1 0 00-1.414 1.414L10.586 12l-6.293 6.293a1 1 0 101.414 1.414L12 13.414l6.293 6.293a1 1 0 001.414-1.414z"/></SVG>
      </ModalDiv>
    </div>
  ) : null;
}

export default Modal