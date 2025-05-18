// ------------------------------------
// NEW UI SYSTEM - WIP
// ------------------------------------
// Trying out a more complex UI system inspired by Nic Barker's CLayout library (just for learning's sake).
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
const CORNER_RADIUS = Object.seal({
  topLeft: 0,
  topRight: 0,
  bottomLeft: 0,
  bottomRight: 0,
});

const CHILD_ALIGNMENT = Object.seal({
  x: HORIZONTAL_ALIGNMENT.LEFT,
  y: VERTICAL_ALIGNMENT.TOP,
});

const CHILD_SIZING_MINMAX = Object.seal({
  min: 0,
  max: 0,
});

const SIZING_AXIS = Object.seal({
  size: {
    minMax: { ...CHILD_SIZING_MINMAX },
    percent: 0.0,
  },
  type: SIZING_TYPES.FIXED,
});

const SIZING = Object.seal({
  width: { ...SIZING_AXIS },
  height: { ...SIZING_AXIS },
});

const POSITION = Object.seal({
  x: 0,
  y: 0,
});

const PADDING = Object.seal({
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});

const LAYOUT_CONFIG = Object.seal({
  sizing: { ...SIZING },
  padding: { ...PADDING },
  childGap: 0,
  childAlignment: { ...CHILD_ALIGNMENT },
  layoutDirection: LAYOUT_DIRECTIONS.LEFT_TO_RIGHT,
});

// -- MODELS
const UI_ELEMENT = Object.seal({
  id: "",
  layout: { ...LAYOUT_CONFIG },
  position: { ...POSITION },
  backgroundColor: "white",
  cornerRadius: { ...CORNER_RADIUS },
  children: [],
});

const UIElement = () => {
  return JSON.parse(JSON.stringify(UI_ELEMENT));
};

// LAYOUT CALCULATION
// -- Layout Pass
const OpenElement = (props = {}) => {
  const { position, children, layout } = props;
  const { childGap, padding } = layout;

  let leftOffset = padding?.left ?? 0;
  let topOffset = padding?.top ?? 0;
  children?.forEach((child) => {
    const childProps = { ...child };
    const { position: childPosition, layout: childLayout } = childProps;

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
        ? childLayout?.sizing?.width + childGap
        : 0;
    topOffset +=
      layout?.layoutDirection == LAYOUT_DIRECTIONS.TOP_TO_BOTTOM
        ? childLayout?.sizing?.height + childGap
        : 0;

    // Recursive layout calc
    OpenElement(childProps);
    CloseElement(childProps);
  });
};

const CloseElement = (element) => {
  const { parent, layout } = element;
  const { padding } = layout;

  if (padding) {
    element.layout.sizing.width += padding.left + padding.right;
    element.layout.sizing.height += padding.top + padding.bottom;
  }

  if (!element.parent) {
    return;
  }

  const childGap = (parent?.children?.length - 1) * parent.layout.childGap ?? 0;
  if (parent.layout?.layoutDirection === LAYOUT_DIRECTIONS.LEFT_TO_RIGHT) {
    parent.layout.sizing.width += element.layout.sizing.width + childGap;
    parent.layout.sizing.height = Math.max(
      parent.layout.sizing.height,
      element.layout.sizing.height
    );
  } else {
    parent.layout.sizing.width = Math.max(
      parent.layout.sizing.width,
      element.layout.sizing.width
    );
    parent.layout.sizing.height += element.layout.sizing.height + childGap;
  }
};

const LayoutPass = (root) => {
  OpenElement(root);
  CloseElement(root);
  return root;
};

// -- Draw Pass
const DrawElement = (props) => {
  const { position, backgroundColor, children, layout } = props;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(
    position?.x,
    position?.y,
    layout?.sizing?.width,
    layout?.sizing?.height
  );

  children?.forEach((child) => {
    const childProps = { ...child };
    DrawElement(childProps);
  });
};

const DrawPass = (root) => {
  DrawElement(root);
};
