// ------------------------------------
// NEW UI SYSTEM - WIP
// ------------------------------------
// Trying out a more complex UI system just for learning's sake.
// Aiming for dynamic layout calculation, immediate mode rendering, and general reusability.
// Not at all required for a small game, but I figured it would be fun to try.

// -- ENUMS
const LAYOUT_DIRECTIONS = Object.freeze({
  TOP_TO_BOTTOM: "top_to_bottom",
  LEFT_TO_RIGHT: "left_to_right",
});

const SIZING_TYPES = Object.freeze({
  FIXED: "fixed",
  GROW: "grow",
  FIT: "fit",
  PERCENT: "percent",
});

const HORIZONTAL_ALIGNMENT = Object.freeze({
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
});

const VERTICAL_ALIGNMENT = Object.freeze({
  TOP: "top",
  CENTER: "center",
  MIDDLE: "middle",
});

// STRUCTS
const CORNER_RADIUS = {
  topLeft: 0,
  topRight: 0,
  bottomLeft: 0,
  bottomRight: 0,
};

const CHILD_ALIGNMENT = {
  x: HORIZONTAL_ALIGNMENT.LEFT,
  y: VERTICAL_ALIGNMENT.TOP,
};

const CHILD_SIZING_MINMAX = {
  min: 0,
  max: 0,
};

const SIZING_AXIS = {
  size: {
    minMax: { ...CHILD_SIZING_MINMAX },
    percent: 0.0,
  },
  type: SIZING_TYPES.FIXED,
};

const SIZING = {
  width: { ...SIZING_AXIS },
  height: { ...SIZING_AXIS },
};

const POSITION = {
  x: 0,
  y: 0,
};

const PADDING = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

const LAYOUT_CONFIG = {
  sizing: { ...SIZING },
  padding: { ...PADDING },
  childGap: 0,
  childAlignment: { ...CHILD_ALIGNMENT },
  layoutDirection: LAYOUT_DIRECTIONS.LEFT_TO_RIGHT,
};

// -- UTILS
const FIXED = (number = 0) => {
  return number;
};

const FIT = () => {
  return 0;
};

// -- MODELS
const UI_ELEMENT = {
  id: "",
  layout: { ...LAYOUT_CONFIG },
  position: { ...POSITION },
  backgroundColor: "white",
  cornerRadius: { ...CORNER_RADIUS },
  children: [],
};

const UIElement = () => {
  return { ...UI_ELEMENT };
};

// LAYOUT CALCULATION
// -- Layout Pass
const OpenElement = (props = {}) => {
  const {
    position,
    sizing,
    backgroundColor,
    children,
    padding,
    layout,
    childGap,
  } = props;

  let leftOffset = padding?.left ?? 0;
  let topOffset = padding?.top ?? 0;
  children?.forEach((child) => {
    const childProps = { ...child };
    const { position: childPosition, sizing: childSizing } = childProps;

    // Parenting
    childProps.parent = props;

    // Parent to child positioning
    childPosition.x = childPosition?.x + position.x;
    childPosition.y = childPosition?.y + position.y;

    // Padding positioning
    childPosition.x += leftOffset;
    childPosition.y += topOffset;

    // Update offsets
    leftOffset +=
      layout?.layoutDirection == LAYOUT_DIRECTIONS.LEFT_TO_RIGHT
        ? childSizing?.width + childGap
        : 0;
    topOffset +=
      layout?.layoutDirection == LAYOUT_DIRECTIONS.TOP_TO_BOTTOM
        ? childSizing?.height + childGap
        : 0;

    // Recursive layout calc
    OpenElement(childProps);
    CloseElement(childProps);
  });
};

const CloseElement = (element) => {
  const { parent, padding } = element;

  if (padding) {
    element.sizing.width += padding.left + padding.right;
    element.sizing.height += padding.top + padding.bottom;
  }

  if (!element.parent) {
    return;
  }

  const childGap = (parent?.children?.length - 1) * parent.childGap ?? 0;
  if (parent.layout?.layoutDirection === LAYOUT_DIRECTIONS.LEFT_TO_RIGHT) {
    parent.sizing.width += element.sizing.width + childGap;
    parent.sizing.height = Math.max(
      parent.sizing.height,
      element.sizing.height
    );
  } else {
    parent.sizing.width = Math.max(parent.sizing.width, element.sizing.width);
    parent.sizing.height += element.sizing.height + childGap;
  }
};

const LayoutPass = (root) => {
  OpenElement(root);
  CloseElement(root);
  return root;
};

// -- Draw Pass
const DrawElement = (props) => {
  const {
    position,
    sizing,
    backgroundColor,
    children,
    padding,
    layout,
    childGap,
  } = props;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(position?.x, position?.y, sizing?.width, sizing?.height);

  children?.forEach((child) => {
    const childProps = { ...child };
    const { position: childPosition, sizing: childSizing } = childProps;

    // Recursive renders
    DrawElement(childProps);
  });
};

const DrawPass = (root) => {
  DrawElement(root);
};
