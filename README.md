# Grouped sorting of JSX props (jsx-grouped-sort-props)

Specify a specific order of props or use named groups with loose ordering within each group.

## Rule Details

This rule checks all JSX components and verifies that all props are sorted correctly.

## Rule Options

```js
...
"jsx-grouped-sort-props/jsx-grouped-sort-props": [<enabled>, [
  { group: "reserved" },
  "foo",
  "bar",
  { group: "html" },
  { group: "aria" },
  { group: "data" },
  { group: "other" },
  { group: "callback" }
]]
...
```

### `reserved`

All reserved props, as listed in the [React docs](https://facebook.github.io/react/docs/special-non-dom-attributes.html).

```js
<Button key="1" ref="button" />
```

### `html`

All props that map to supported html attributes, as listed in the [React docs](https://facebook.github.io/react/docs/tags-and-attributes.html).

```js
<Button className="goodbye" />
```

### `aria`

All aria-* attributes. If not specified, aria-* attributes will be considered part of the `html` group.

```js
<Button aria-label="Submit" />
```

### `data`

All custom data-* attributes. If not specified, data-* attributes will be considered part of the `html` group.

```js
<Button data-id="submit" />
```

### `callback`

All props that match the pattern `onCallback`.

```js
<Button onClick={onClick} />
```

### `other`

All props that do not match a different group.

```js
<Button isLoading={true} />
```

## When not to use

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If prop sort order isn't a part of your coding standards, then you can leave this rule off.
