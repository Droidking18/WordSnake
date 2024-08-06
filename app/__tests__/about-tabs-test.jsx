// __tests__/About-test.jsx

import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import About from '../(tabs)/about';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native/Libraries/Image/Image', () => 'Image');
jest.mock('@/components/Collapsible', () => ({ Collapsible: 'Collapsible' }));
jest.mock('@/components/ExternalLink', () => 'ExternalLink');
jest.mock('@/components/ParallaxScrollView', () => 'ParallaxScrollView');
jest.mock('@/components/ThemedText', () => ({ ThemedText: 'ThemedText' }));
jest.mock('@/components/ThemedView', () => ({ ThemedView: 'ThemedView' }));

describe('About Screen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<About />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the header image', () => {
    const tree = renderer.create(<About />);
    const instance = tree.root;
    const headerImage = instance.findAllByType('Image');
    expect(headerImage).toBeTruthy();
  });

  it('contains the correct title', () => {
    const tree = renderer.create(<About />);
    const instance = tree.root;
    const titleText = instance.findByProps({ children: 'WordSnake' });
    expect(titleText).toBeTruthy();
  });

  it('contains the collapsible sections', () => {
    const tree = renderer.create(<About />);
    const instance = tree.root;
    const collapsibleSections = instance.findAllByType('Collapsible');
    expect(collapsibleSections.length).toBe(4);
  });
});
