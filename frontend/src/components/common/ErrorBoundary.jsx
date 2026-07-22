import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg p-6 text-center">
          <h2 className="font-display text-lg font-semibold text-pine dark:text-paper">
            Something went wrong loading this page
          </h2>
          <p className="mt-2 text-sm text-pine/60 dark:text-paper/50">
            Try refreshing. If it keeps happening, log out and back in.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-stamp bg-ember px-4 py-2 text-sm font-medium text-paper"
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
