import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedText } from '../ThemedText';
import { ThemedTextInput } from '../ThemedTextInput';
import { ThemedView } from '../ThemedView';

import { Collapsible } from '../Collapsible';

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON();

  expect(tree).toMatchSnapshot();
});

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedTextInput />).toJSON();

  expect(tree).toMatchSnapshot();
});

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedView />).toJSON();

  expect(tree).toMatchSnapshot();
});

it(`renders correctly`, () => {
  const tree = renderer.create(<Collapsible title='Test'/>).toJSON();

  expect(tree).toMatchSnapshot();
});
