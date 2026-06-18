import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100svh', gap: 16,
          padding: 24, textAlign: 'center',
          background: 'var(--color-background)', color: 'var(--color-text)',
        }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-text-heading)' }}>
            Something went wrong
          </h2>
          <p style={{ maxWidth: 400, lineHeight: 1.65 }}>
            An unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
