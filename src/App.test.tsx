import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the board title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /team workflow board/i })).toBeInTheDocument()
  })
})
