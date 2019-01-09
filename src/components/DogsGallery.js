import React from 'react'
import { Image, Flex } from 'rebass'
import styled from 'styled-components'

const Img = styled.div`
  display: inline-flex;
  width: ${p => p.width};
  height: ${p => p.height};
  background: no-repeat url(${p => p.src});
  background-size: cover;
  margin: 5px;
  border-radius: 3px;
`

export const DogsGallery = ({ dogs }) => (
  <Flex flexWrap="wrap">
    {dogs.map(dog => (
      <Img key={dog} src={dog} width="200px" height="200px" />
    ))}
  </Flex>
)
