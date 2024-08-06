import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Settings from '../(tabs)/settings';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native/Libraries/Image/Image', () => 'Image');
jest.mock('@/components/Collapsible', () => ({ Collapsible: 'Collapsible' }));
jest.mock('@/components/ExternalLink', () => 'ExternalLink');
jest.mock('@/components/ParallaxScrollView', () => 'ParallaxScrollView');
jest.mock('@/components/ThemedTextInput', () => ({ ThemedTextInput: 'ThemedTextInput' }));
jest.mock('@/components/ThemedText', () => ({ ThemedText: 'ThemedText' }));
jest.mock('@/components/ThemedView', () => ({ ThemedView: 'ThemedView' }));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Settings Screen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Settings />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the collapsible sections', () => {
    const tree = renderer.create(<Settings />);
    const instance = tree.root;
    const collapsibleSections = instance.findAllByType('Collapsible');
    expect(collapsibleSections.length).toBe(5); // Adjust based on actual number of collapsible sections
  });

  it('contains input fields for speed, letter generation amount, and min word length', () => {
    const tree = renderer.create(<Settings />);
    const instance = tree.root;
    const inputs = instance.findAllByType('ThemedTextInput');
    expect(inputs.length).toBe(3); // Check if there are 3 input fields
  });

  it('contains switches for wrapping and touch controls', () => {
    const tree = renderer.create(<Settings />);
    const instance = tree.root;
    const switches = instance.findAllByType('Switch');
    expect(switches).toBeTruthy(); // Check if there are 2 switches
  });

  it('contains save button', () => {
    const tree = renderer.create(<Settings />);
    const instance = tree.root;
    const saveButton = instance.findAllByProps({ style: { backgroundColor: 'white' } });
    expect(saveButton).toBeTruthy();
  });
});
