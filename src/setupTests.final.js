import '@testing-library/jest-dom/extend-expect'
import {queryCache} from 'react-query'
import {setupServer} from 'msw/node'
import {handlers} from './test/server-handlers'

// we don't want to start the service worker in tests
// it wouldn't work anyway
jest.mock('./test/server', () => {})

const mockServer = setupServer(...handlers)
const serverReady = mockServer.listen()
window.__bookshelf_serverReady = serverReady

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => serverReady)
afterAll(() => mockServer.close())

// allow tests to mock the implementation of window.fetch
beforeEach(() => jest.spyOn(window, 'fetch'))
afterEach(() => window.fetch.mockRestore())

// general cleanup
afterEach(() => {
  window.localStorage.clear()
  queryCache.clear()
})
