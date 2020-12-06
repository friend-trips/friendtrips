import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.li`
  width: 80px;
  height: 20;
  border: 1px solid black;
  margin: 0;
  padding: 0;
`;

const Suggestion = ({data, index}) => {
  return (
    <Draggable key={`draggable-${data.id}`} index={index} draggableId={data.id.toString()}>
      {(provided, snapshot) => {
        return (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
            {data.id}
          </Container>
        )
      }}
    </Draggable>

  );
};

export default Suggestion;