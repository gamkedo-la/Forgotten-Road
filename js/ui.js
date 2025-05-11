// ------------------------------------
// UI SYSTEM - First Pass
// ------------------------------------

// UI Elements
const UIElement = (type, text, callback) => {
  return { type, text, callback };
};

const Button = (
  x = 0,
  y = 0,
  text = "TEXT",
  baseColor = "red",
  highlightColor = "green",
  textColor = "black",
  minWidth = 100,
  minHeight = 50,
  font = "13px sans-serif"
) => {
  // states
  let selected = false;
  let highlighted = false;

  // highlighted check
  highlighted =
    mouse.x >= x &&
    mouse.x <= x + minWidth &&
    mouse.y >= y &&
    mouse.y <= y + minHeight;

  // selected check
  selected = highlighted && mouse.clicked;

  // background
  ctx.fillStyle = highlighted ? highlightColor : baseColor;
  ctx.fillRect(x, y, minWidth, minHeight);
  ctx.fillStyle = textColor;

  // text
  let metrics = ctx.measureText(text);
  let fontHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  drawTextWithShadow(
    text,
    x + minWidth / 2,
    y + minHeight / 2 + fontHeight / 2,
    textColor,
    font,
    "center"
  );

  // tell the UI if we have been selected so that we can execute any logic related to this button
  return selected;
};

// Menus
const menus = [
  {
    id: "menu-1",
    elements: [
      UIElement("button", "MENU 1 TEST", () => console.log("MENU 1 TEST")),
      UIElement("button", "GO TO NEXT MENU", () => pushToStack("menu-2")),
    ],
  },
  {
    id: "menu-2",
    elements: [
      UIElement("button", "MENU 2 TEST", () => console.log("MENU 2 TEST")),
      UIElement("button", "BACK", () => popFromStack()),
    ],
  },
];

const Menu = (_x, _y, elements = []) => {
  let x = _x;
  let y = _y;
  let elementHeight = 80;
  elements.forEach((element) => {
    switch (element.type) {
      case "button":
        if (Button(x, y, element.text)) {
          element.callback();
        }
        break;
      default:
        break;
    }
    y += elementHeight;
  });
};

// UI Stack
const UI_STACK = [];

const pushToStack = (menu_id) => {
  const menu = menus.find((m) => m.id === menu_id);
  if (menu && !UI_STACK.find((m) => menu.id == m.id)) {
    UI_STACK.push(menu);
  }
};

const popFromStack = () => {
  UI_STACK.pop();
};

// Init test menu
pushToStack("menu-1");

// ------------------------------------
// NEW UI SYSTEM - Second Pass (WIP)
// ------------------------------------
// Trying out a more complex UI system just for learning's sake.
// Aiming for dynamic layout calculation, immediate mode rendering, and general reusability.
// Not at all required for a small game, but I figured it would be fun to try.

// -- ENUMS
const LAYOUT_DIRECTIONS = Object.freeze({
  TOP_TO_BOTTOM: "top_to_bottom",
  LEFT_TO_RIGHT: "left_to_right",
});

// -- UTILS
const FIXED = (number = 0) => {
  return number;
};

const FIT = () => {
  return 0;
};

// -- MODELS
const NewUIElement = (layout, position, size, backgroundColor) => {
  {
    layout, position, size, backgroundColor;
  }
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

    //  Parent to child positioning
    childPosition.x = childPosition?.x + position.x;
    childPosition.y = childPosition?.y + position.y;

    //  Padding positioning
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
    element.width += padding.left + padding.right;
    element.height += padding.top + padding.bottom;
  }

  if (!element.parent) {
    return;
  }

  const childGap = (parent?.children?.length - 1) * parent.childGap ?? 0;
  if (parent.layout?.layoutDirection === LAYOUT_DIRECTIONS.LEFT_TO_RIGHT) {
    element.width += childGap;
    parent.sizing.width += element.sizing.width;
    parent.sizing.height = Math.max(
      parent.sizing.height,
      element.sizing.height
    );
  } else {
    element.height += childGap;
    parent.sizing.width = Math.max(parent.sizing.width, element.sizing.width);
    parent.sizing.height += element.sizing.height;
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
