import React from 'react'
import { Flex } from 'rebass'
import { Label, Combobox } from 'evergreen-ui'

export const BreedSelector = ({ breeds, selected, onChange }) => (
  <Flex py={3} px={2} alignItems="center">
    <Label marginRight={10}>Breed:</Label>
    <Combobox
      width={200}
      items={breeds}
      onChange={onChange}
      placeholder="Select a value..."
      selectedItem={selected}
    />
  </Flex>
)
