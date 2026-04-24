import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WalletConnector } from '../WalletConnector'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('WalletConnector Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders connect button when wallet is not connected', () => {
    render(<WalletConnector />)
    const button = screen.getByRole('button', { name: /connect/i })
    expect(button).toBeInTheDocument()
  })

  it('displays loading state while connecting', async () => {
    render(<WalletConnector />)
    const button = screen.getByRole('button', { name: /connect/i })
    
    await user.click(button)
    
    // Check for loading indicator
    expect(screen.queryByText(/connecting/i)).toBeInTheDocument()
  })

  it('handles connection errors gracefully', async () => {
    render(<WalletConnector />)
    const button = screen.getByRole('button', { name: /connect/i })
    
    await user.click(button)
    
    // Error should be displayed
    expect(screen.queryByRole('alert')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<WalletConnector />)
    const button = screen.getByRole('button', { name: /connect/i })
    
    expect(button).toHaveAttribute('aria-label')
  })
})
