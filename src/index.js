import React from 'react'
import ReactDOM from 'react-dom'
import { Flex, Box } from 'rebass'
import { Spinner } from 'evergreen-ui'
import { createResource, useResource } from './lib/xresource'

import * as api from './api'
import { BreedSelector } from './components/BreedSelector'
import { ShowingSelector } from './components/ShowingSelector'
import { DogsGallery } from './components/DogsGallery'

const DogResource = createResource({
  state: {
    selectedBreed: null,
    showingDogs: 30,
  },
  data: {
    breeds: async () => api.getBreeds(),
    dogs: async (data, state) => {
      if (!state.selectedBreed) return []
      return api.getDogs(state.selectedBreed)
    },
  },
  operations: {
    dogs: (dogs, state) => dogs.splice(0, state.showingDogs),
  },
})

const App = () => {
  const [data, state, setState] = useResource(DogResource)

  if (data.loading) {
    return (
      <Flex width="100vw" alignItems="center" justifyContent="center" p={3}>
        <Spinner size={24} />
      </Flex>
    )
  }

  return (
    <Box>
      <Flex>
        <BreedSelector
          breeds={data.breeds}
          selected={state.selectedBreed}
          onChange={selectedBreed => setState({ selectedBreed })}
        />
        {state.selectedBreed && (
          <ShowingSelector
            breeds={data.breeds}
            selected={state.showingDogs}
            onChange={ev =>
              setState({ showingDogs: parseInt(ev.target.value) })
            }
          />
        )}
      </Flex>
      <DogsGallery dogs={data.dogs} />
    </Box>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
