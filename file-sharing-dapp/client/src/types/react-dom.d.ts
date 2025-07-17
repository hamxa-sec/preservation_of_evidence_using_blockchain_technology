import * as React from 'react';

declare module 'react-dom' {
  function render(
    element: React.ReactElement,
    container: Element | null,
    callback?: () => void
  ): void;
}
