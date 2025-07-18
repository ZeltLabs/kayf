import React from "react"

// Webpack + React 17 fails to compile on the usage of `React.startTransition` or
// `React["startTransition"]` even if it's behind a feature detection of
// `"startTransition" in React`. Moving this to a constant avoids the issue :/
const START_TRANSITION = "startTransition"

export function startTransition(callback: () => void) {
  if (START_TRANSITION in React) {
    React[START_TRANSITION](callback)
  } else {
    callback()
  }
}
