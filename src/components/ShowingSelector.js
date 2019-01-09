import React from 'react'
import { Box } from 'rebass'
import { Label, Select } from 'evergreen-ui'

export const ShowingSelector = ({ breeds, selected, onChange }) => (
  <Box py={3} px={2} ml={4}>
    <Label marginRight={10}>Showing:</Label>
    <Select value={selected} onChange={onChange}>
      {[5, 10, 20, 30, 50, 100].map(idx => (
        <option key={idx} value={idx}>
          {idx}
        </option>
      ))}
    </Select>
  </Box>
)
