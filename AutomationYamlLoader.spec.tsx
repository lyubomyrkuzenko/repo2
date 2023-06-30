import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { defaultQueryFactory } from '@cloudbees/api-platform/defaultQueryFactory'
import { Auth0ProviderMock } from '@cloudbees/shared-auth/mocks'
import { render } from '@cloudbees/shared-test-utils/render'

import { YamlProvider } from '../context/YamlProvider'

import { AutomationYamlLoader } from './AutomationYamlLoader'
import { mockedDsl } from './Dsl.mock'

const mockURLParams = {
  organizationId: 'organization-id',
  serviceId: 'test-service-id',
  automationId: 'test-automation-id',
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: mockURLParams.organizationId,
    serviceId: mockURLParams.serviceId,
    automationId: mockURLParams.automationId,
  }),
}))

jest.mock('@cloudbees/api-platform/queries', () => ({
  ...jest.requireActual('@cloudbees/api-platform/queries'),
  useAutomationQuery: () => ({ yamlContent: mockedDsl }),
}))

const factory = () =>
  render(<AutomationYamlLoader />, [
    BrowserRouter,
    Auth0ProviderMock,
    [QueryClientProvider, { client: defaultQueryFactory.create() }],
    [YamlProvider, { yaml: mockedDsl }],
  ])

describe('AutomationYamlLoader', () => {
  it('should render successfully', () => {
    const { container } = factory()

    expect(container).toBeTruthy()
    expect(container).toMatchSnapshot()
  })
})
