'use strict';

//
// Requirements

var rule = require('../lib/jsx-grouped-sort-props');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

//
// Tests

var ruleTester = new RuleTester();

ruleTester.run('jsx-sort-props', rule, {
  valid: [
    {
      code: '<App className="foo" onBar />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" aria-label="bar" onBar />;',
      options: [[{ group: 'html' }, { group: 'aria' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App key="1" ref="app" onBar />;',
      options: [[{ group: 'reserved' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" aria-label="bar" data-qa-id="foobar" onBar />;',
      options: [[{ group: 'html' }, { group: 'aria' }, { group: 'data' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" onBar onFoo x y z />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" x y z onBar onFoo />;',
      options: [[{ group: 'html' }, { group: 'other' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App key="1" ref="app" aria-label="foo" data-qa-id="foobar" className="foo" x y z onBar onFoo />;',
      options: [['key', 'ref', { group: 'html' }, { group: 'other' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App aria-label="foo" key="1" data-qa-id="foobar" ref="app" className="foo" x y z onBar onFoo />;',
      options: [[{ group: 'aria' }, 'key', { group: 'data' }, 'ref', { group: 'html' }, { group: 'other' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App {...props} className="foo" onBar onFoo />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" onBar {...props} onFoo />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" onBar onFoo {...props} />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      parserOptions: parserOptions
    }
  ],
  invalid: [
    {
      code: '<App onBar className="foo" />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected className to be above onBar',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" onBar aria-label="bar" />;',
      options: [[{ group: 'html' }, { group: 'aria' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected aria-label to be above onBar',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App key="1" onBar ref="app" />;',
      options: [[{ group: 'reserved' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected ref to be above onBar',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App aria-label="bar" data-qa-id="foobar" className="foo" onBar />;',
      options: [[{ group: 'html' }, { group: 'aria' }, { group: 'data' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected className to be above aria-label',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" x y z onBar onFoo />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected onBar to be above x',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" x y onBar onFoo z />;',
      options: [[{ group: 'html' }, { group: 'other' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected z to be above onBar',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App key="1" aria-label="foo" data-qa-id="foobar" className="foo" ref="app" x y z onBar onFoo />;',
      options: [['key', 'ref', { group: 'html' }, { group: 'other' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected ref to be above aria-label',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App aria-label="foo" key="1" ref="app" data-qa-id="foobar" className="foo" x y z onBar onFoo />;',
      options: [['key', 'ref', { group: 'html' }, { group: 'other' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected key to be above aria-label',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App {...props} onBar className="foo" onFoo />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected className to be above onBar',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App className="foo" {...props} onFoo title="bar" />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected title to be above onFoo',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<App onBar className="foo" onFoo {...props} />;',
      options: [[{ group: 'html' }, { group: 'callback' }]],
      errors: [{
        message: 'Expected className to be above onBar',
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    }
  ]
});
