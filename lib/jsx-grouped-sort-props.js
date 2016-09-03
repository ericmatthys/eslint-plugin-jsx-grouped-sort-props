'use strict';

const propName = require('jsx-ast-utils/propName');

const reservedProps = {
  key: true,
  ref: true,
  dangerouslySetInnerHTML: true
};

const htmlAttributes = {
  accept: true,
  acceptCharset: true,
  accessKey: true,
  action: true,
  allowFullScreen: true,
  allowTransparency: true,
  alt: true,
  async: true,
  autoComplete: true,
  autoFocus: true,
  autoPlay: true,
  capture: true,
  cellPadding: true,
  cellSpacing: true,
  challenge: true,
  charSet: true,
  checked: true,
  cite: true,
  classID: true,
  className: true,
  colSpan: true,
  cols: true,
  content: true,
  contentEditable: true,
  contextMenu: true,
  controls: true,
  coords: true,
  crossOrigin: true,
  data: true,
  dateTime: true,
  default: true,
  defer: true,
  dir: true,
  disabled: true,
  download: true,
  draggable: true,
  encType: true,
  form: true,
  formAction: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: true,
  formTarget: true,
  frameBorder: true,
  headers: true,
  height: true,
  hidden: true,
  high: true,
  href: true,
  hrefLang: true,
  htmlFor: true,
  httpEquiv: true,
  icon: true,
  id: true,
  inputMode: true,
  integrity: true,
  is: true,
  keyParams: true,
  keyType: true,
  kind: true,
  label: true,
  lang: true,
  list: true,
  loop: true,
  low: true,
  manifest: true,
  marginHeight: true,
  marginWidth: true,
  max: true,
  maxLength: true,
  media: true,
  mediaGroup: true,
  method: true,
  min: true,
  minLength: true,
  multiple: true,
  muted: true,
  name: true,
  noValidate: true,
  nonce: true,
  open: true,
  optimum: true,
  pattern: true,
  placeholder: true,
  poster: true,
  preload: true,
  profile: true,
  radioGroup: true,
  readOnly: true,
  rel: true,
  required: true,
  reversed: true,
  role: true,
  rowSpan: true,
  rows: true,
  sandbox: true,
  scope: true,
  scoped: true,
  scrolling: true,
  seamless: true,
  selected: true,
  shape: true,
  size: true,
  sizes: true,
  span: true,
  spellCheck: true,
  src: true,
  srcDoc: true,
  srcLang: true,
  srcSet: true,
  start: true,
  step: true,
  style: true,
  summary: true,
  tabIndex: true,
  target: true,
  title: true,
  type: true,
  useMap: true,
  value: true,
  width: true,
  wmode: true,
  wrap: true
};

function isDataAttribute(name) {
  return /data-\w+/.test(name);
}

function isAriaAttribute(name) {
  return /aria-\w+/.test(name);
}

function isCallbackProp(name) {
  return /^on[A-Z]/.test(name);
}

function isGroup(orderItem) {
  return typeof orderItem === 'object';
}

function getNamed(order) {
  return order.reduce((named, orderItem) => {
    if (!isGroup(orderItem)) {
      named[orderItem] = [];
    }
    return named;
  }, {});
}

function getGrouped(order) {
  return order.reduce((grouped, orderItem) => {
    if (isGroup(orderItem)) {
      grouped[orderItem.group] = [];
    }
    return grouped;
  }, { unsorted: [] });
}

function computeOrderSets(order, attributes) {
  let split = 0;

  return attributes.reduce((sets, decl) => {
    const actual = sets.actual;
    const expected = sets.expected;

    if (!actual[split]) {
      actual[split] = [];
      expected[split] = {
        named: getNamed(order),
        grouped: getGrouped(order)
      };
    }

    // Split sets at spreads since the order after a spread may be a deliberate override.
    if (decl.type === 'JSXSpreadAttribute') {
      split++;
      return sets;
    }

    actual[split].push(decl);

    const named = expected[split].named;
    const grouped = expected[split].grouped;
    const name = propName(decl);

    if (named.hasOwnProperty(name)) {
      named[name].push(decl);
      return sets;
    }

    if (reservedProps.hasOwnProperty(name)) {
      (grouped.reserved || grouped.other || grouped.unsorted).push(decl);
      return sets;
    }

    if (htmlAttributes.hasOwnProperty(name)) {
      (grouped.html || grouped.other || grouped.unsorted).push(decl);
      return sets;
    }

    if (isAriaAttribute(name)) {
      (grouped.aria || grouped.html || grouped.other || grouped.unsorted).push(decl);
      return sets;
    }

    if (isDataAttribute(name)) {
      (grouped.data || grouped.html || grouped.other || grouped.unsorted).push(decl);
      return sets;
    }

    if (isCallbackProp(name)) {
      (grouped.callback || grouped.other || grouped.unsorted).push(decl);
      return sets;
    }

    (grouped.other || grouped.unsorted).push(decl);
    return sets;
  }, { actual: [], expected: [] });
}

module.exports = {
  create(context) {
    const order = context.options[0];

    return {
      JSXOpeningElement(node) {
        const sets = computeOrderSets(order, node.attributes);
        const actual = sets.actual;
        const expected = sets.expected;

        for (let i = 0, splitCount = actual.length; i < splitCount; i++) {
          const actualSplit = actual[i];
          const expectedSplit = expected[i];
          const named = expectedSplit.named;
          const grouped = expectedSplit.grouped;

          let mergedExpected = order.reduce((acc, orderItem) => {
            return isGroup(orderItem) ?
              acc.concat(grouped[orderItem.group]) :
              acc.concat(named[orderItem]);
          }, []);

          mergedExpected = mergedExpected.concat(grouped.unsorted);

          for (let j = 0, declCount = actualSplit.length; j < declCount; j++) {
            const actualDecl = actualSplit[j];
            const expectedDecl = mergedExpected[j];

            if (actualDecl !== expectedDecl) {
              context.report({
                node: actualDecl,
                message: 'Expected ' + propName(expectedDecl) + ' to be above ' + propName(actualDecl)
              });
              return;
            }
          }
        }
      }
    };
  }
};
