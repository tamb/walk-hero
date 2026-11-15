import React from "react";

/**
 * React 19 ignores defaultProps on function components. reactstrap 8 still
 * sets them (tag, widths, color, and so on) and crashes when they are missing.
 * JSX is compiled to React.createElement, so filling those defaults here keeps
 * the Bootstrap 4 components working.
 */
type ComponentWithDefaults = {
  defaultProps?: Record<string, unknown>;
};

const originalCreateElement = React.createElement;

function withDefaultProps(type: unknown, props: unknown): unknown {
  if (type == null || (typeof type !== "function" && typeof type !== "object")) {
    return props;
  }

  const defaults = (type as ComponentWithDefaults).defaultProps;
  if (!defaults) return props;

  const incoming = (props ?? {}) as Record<string, unknown>;
  const next: Record<string, unknown> = { ...defaults };
  for (const key of Object.keys(incoming)) {
    if (incoming[key] !== undefined) {
      next[key] = incoming[key];
    }
  }
  return next;
}

function createElementWithDefaultProps(
  type: Parameters<typeof originalCreateElement>[0],
  props: Parameters<typeof originalCreateElement>[1],
  ...children: unknown[]
) {
  return originalCreateElement(
    type,
    withDefaultProps(type, props) as Parameters<typeof originalCreateElement>[1],
    ...(children as []),
  );
}

React.createElement = createElementWithDefaultProps as typeof React.createElement;
