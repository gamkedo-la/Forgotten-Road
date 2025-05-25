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

const TEXT_WRAP_MODE = Object.freeze({
  WRAP_WORDS: "wrap_words",
  WRAP_NEWLINES: "wrap_newlines",
  WRAP_NONE: "wrap_none",
});

const TEXT_ALIGNMENT = Object.freeze({
  LEFT: "align_left",
  CENTER: "align_center",
  RIGHT: "align_right",
});

const FLOATING_ATTACH_POINT_TYPE = Object.freeze({
  LEFT_TOP: "left_top",
  LEFT_CENTER: "left_center",
  LEFT_BOTTOM: "left_bottom",
  CENTER_TOP: "center_top",
  CENTER_CENTER: "center_center",
  CENTER_BOTTOM: "center_bottm",
  RIGHT_TOP: "right_top",
  RIGHT_CENTER: "right_center",
  RIGHT_BOTTOM: "right_bottom",
});

const POINTER_CAPTURE_MODE = Object.freeze({
  CAPTURE: "capture",
  PASSTHROUGH: "passthrough",
});

const ATTACH_TO_ELEMENT = Object.freeze({
  NONE: "none",
  PARENT: "parent",
  ELEMENT_WITH_ID: "element_with_id",
  ROOT: "root",
});

const FLOATING_CLIP_TO_ELEMENT = Object.freeze({
  NONE: "none",
  PARENT: "parent",
});

const ELEMENT_TYPE = Object.freeze({
  NONE: "none",
  BORDER: "border",
  FLOATING: "floating",
  CLIP: "clip",
  IMAGE: "image",
  TEXT: "text",
  CUSTOM: "custom",
  SHARED: "shared",
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

const DIMENSIONS = Object.seal({
  width: 0,
  height: 0,
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

const BORDER = Object.seal({
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  betweenChildren: 0,
});

const LAYOUT_CONFIG = Object.seal({
  sizing: { ...SIZING },
  padding: { ...PADDING },
  childGap: 0,
  childAlignment: { ...CHILD_ALIGNMENT },
  layoutDirection: LAYOUT_DIRECTIONS.LEFT_TO_RIGHT,
});

const TEXT_CONFIG = Object.seal({
  textColor: "#000000",
  fontId: 0,
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 16,
  wrapMode: TEXT_WRAP_MODE.WRAP_NONE,
  textAlignment: TEXT_ALIGNMENT.LEFT,
});

const IMAGE_CONFIG = Object.seal({
  dimensions: { ...DIMENSIONS },
  imageData: "",
});

const FLOATING_ELEMENT_CONFIG = Object.seal({
  offset: { x: 0, y: 0 },
  expand: { ...DIMENSIONS },
  parentId: 0,
  zIndex: 0,
  attachPoints: {
    element: FLOATING_ATTACH_POINT_TYPE.LEFT_TOP,
    parent: FLOATING_ATTACH_POINT_TYPE.LEFT_TOP,
  },
  pointerCaptureMode: POINTER_CAPTURE_MODE.CAPTURE,
  attachTo: ATTACH_TO_ELEMENT.NONE,
  clipTo: FLOATING_CLIP_TO_ELEMENT.NONE,
});

const CUSTOM_ELEMENT_CONFIG = Object.seal({
  customData: {},
});

const CLIP_ELEMENT_CONFIG = Object.seal({
  horizontal: false,
  vertical: false,
  childOffset: {
    x: 0,
    y: 0,
  },
});

const BORDER_ELEMENT_CONFIG = Object.seal({
  color: "#000000",
  width: { ...BORDER },
});

const SHARED_ELEMENT_CONFIG = Object.seal({
  backgroundColor: "#FFFFFF",
  cornerRadius: { ...CORNER_RADIUS },
});

const ELEMENT_CONFIG = Object.seal({
  type: ELEMENT_TYPE.NONE,
  config: {},
});

// -- MODELS
const UI_ELEMENT = Object.seal({
  id: 0,
  layout: { ...LAYOUT_CONFIG },
  position: { ...POSITION },
  backgroundColor: "white",
  cornerRadius: { ...CORNER_RADIUS },
  parent: null,
  children: [],
  dimensions: { ...DIMENSIONS },
  elementConfig: { ...ELEMENT_CONFIG },
});

const UIElement = (type = ELEMENT_TYPE.NONE, customConfig = {}) => {
  const newElement = JSON.parse(JSON.stringify(UI_ELEMENT));

  newElement.elementConfig.type = type;
  switch (type) {
    case ELEMENT_TYPE.TEXT:
      newElement.elementConfig.config = { ...TEXT_CONFIG };
      break;

    case ELEMENT_TYPE.IMAGE:
      newElement.elementConfig.config = { ...IMAGE_CONFIG };
      break;

    case ELEMENT_TYPE.BORDER:
      newElement.elementConfig.config = { ...BORDER_ELEMENT_CONFIG };
      break;

    case ELEMENT_TYPE.FLOATING:
      newElement.elementConfig.config = { ...FLOATING_ELEMENT_CONFIG };
      break;

    case ELEMENT_TYPE.CLIP:
      newElement.elementConfig.config = { ...CLIP_ELEMENT_CONFIG };
      break;

    case ELEMENT_TYPE.SHARED:
      newElement.elementConfig.config = {
        ...SHARED_ELEMENT_CONFIG_ELEMENT_CONFIG,
      };
      break;

    case ELEMENT_TYPE.CUSTOM:
      newElement.elementConfig.config = { ...CUSTOM_ELEMENT_CONFIG };
      newElement.elementConfig.config.customData = customConfig;
      break;

    default:
      break;
  }

  return newElement;
};

// CONSTANTS
const EPSILON = 0.01;
const MAX_FLOAT = 3.40282346638528859812e38;

// UTILS
const floatEqual = (left, right) => {
  let subtracted = left - right;
  return subtracted < EPSILON && subtracted > -1 * EPSILON;
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
