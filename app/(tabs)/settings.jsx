import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabTwoScreen() {

  const [speed, setSpeed] = useState(100);
  const [speedError, setSpeedError] = useState(false);
  const [letterGenerationAmount, setLetterGenerationAmount] = useState(3);
  const [letterGenerationAmountError, setLetterGenerationAmountError] = useState(false);
  const [minWordLength, setMinWordLength] = useState(1);
  const [minWordLengthError, setMinWordLengthError] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [savingError, setSavingError] = useState(false);
  const [initSettings, setInitSettings] = useState({});

  const width = Dimensions.get('window').width;

  const fetchSettings = async () => {
    const speed = await AsyncStorage.getItem('speed') || '100';
    const letterGenerationAmount = await AsyncStorage.getItem('letterGenerationAmount') || '3';
    const minWordLength = await AsyncStorage.getItem('minWordLength') || '1';

    const initSettings = {
      speed,
      letterGenerationAmount,
      minWordLength,
    }

    setSpeed(speed);
    setLetterGenerationAmount(letterGenerationAmount);
    setMinWordLength(minWordLength);

    setInitSettings(initSettings);

  }

  useEffect(() => {

    fetchSettings();
  }, []);

  const processSetting = async (setting, value) => {
    const intValue = parseInt(value);
    switch (setting) {
      case 'speed':


        if (intValue < 50) {
          setSpeedError('Speed must be at least 50');
          break;
        }

        if (intValue > 200) {
          setSpeedError('Speed must be at most 200');
          break;
        }

        if (value.length < 1) {
          setSpeedError('Speed must be at least 50');
          break;
        }

        if (!value.match(/^[0-9]+$/)) {
          setSpeedError('Speed must be a number');
          break;
        }

        setSpeedError(false);
        break;
      case 'letterGenerationAmount':

        if (intValue < 1) {
          setLetterGenerationAmountError('Letter generation amount must be at least 1');
          break;
        }

        if (intValue > 6) {
          setLetterGenerationAmountError('Letter generation amount must be at most 6');
          break;
        }

        if (value.length < 1) {
          setLetterGenerationAmountError('Letter generation amount must be at least 1');
          break;
        }

        if (!value.match(/^[0-9]+$/)) {
          setLetterGenerationAmountError('Letter generation amount must be a number');
          break;
        }

        setLetterGenerationAmountError(false);
        break;
      case 'minWordLength':

        if (intValue < 1) {
          setMinWordLengthError('Minimum word length must be at least 1');
          break;
        }

        if (intValue > 6) {
          setMinWordLengthError('Minimum word length must be at most 6');
          break;
        }

        if (value.length < 1) {
          setMinWordLengthError('Minimum word length must be at least 1');
          break;
        }

        if (!value.match(/^[0-9]+$/)) {
          setMinWordLengthError('Minimum word length must be a number');
          break;
        }

        setMinWordLength(value);
        setMinWordLengthError(false);
        break;
    }
  }

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

        <View style={styles.innerContainer}>
          <ThemedText style={styles.headingText}>Configure your playing experience!</ThemedText>
          <Collapsible title="Select the speed of your snake">
            <ThemedText style={styles.subHeadingText}>
              100 is default speed, 200 is double speed, 50 is half speed.
              The faster the snake, the more points you get per word. 200 would be double points, but it will also be more difficult to control the snake.
            </ThemedText>
          </Collapsible>
          <ThemedText style={styles.subHeadingText}>Currently {initSettings.speed}</ThemedText>
          { speedError && <ThemedText style={{ color: 'red' }}>{speedError}</ThemedText> }
          <TextInput placeholder="Select a speed" style={{ height: 40, width: width * 0.8, borderColor: 'black', borderWidth: 1, borderRadius: 20, textAlign: 'center', marginBottom: 20 }} onChangeText={async (text) => {
            setSpeed(text);
            processSetting('speed', text);
          }} />

          <Collapsible title="Select the amount of letters to generate">
            <ThemedText style={styles.subHeadingText}>
              3 is default amount. 1 is minimum amount, 6 is maximum amount.
              This is the amount of letters that will be generated at a time.
              The less letters, the more points you get per word, but it will also be more difficult to form words.
            </ThemedText>
          </Collapsible>
          <ThemedText style={styles.subHeadingText}>Currently {initSettings.letterGenerationAmount}</ThemedText>
          { letterGenerationAmountError && <ThemedText style={{ color: 'red' }}>{letterGenerationAmountError}</ThemedText> }
          <TextInput placeholder="Select a letter generation amount" style={{ height: 40, width: width * 0.8, borderColor: 'black', borderWidth: 1, borderRadius: 20, textAlign: 'center', marginBottom: 20 }} onChangeText={async (text) => {
            setLetterGenerationAmount(text);
            processSetting('letterGenerationAmount', text);
          }} />

          <Collapsible title="Select the minimum word length">
            <ThemedText style={styles.subHeadingText}>
              The default is 1. The minimum is 1, the maximum is 6.
              This is the minimum amount of letters that a word must contain to be valid.
              The higher the minimum letters, the more points you get per word, but it will also be more difficult to form words.
            </ThemedText>
          </Collapsible>
          <ThemedText style={styles.subHeadingText}>Currently {initSettings.minWordLength}</ThemedText>
          {minWordLengthError && <ThemedText style={{ color: 'red' }}>{minWordLengthError}</ThemedText>}
          <TextInput placeholder="Select a min word length" style={{ height: 40, width: width * 0.8, borderColor: 'black', borderWidth: 1, borderRadius: 20, textAlign: 'center' }} value={minWordLength} onChangeText={async (text) => {
            setMinWordLength(text);
            processSetting('minWordLength', text);
          }} />
          <TouchableOpacity style={styles.button} onPress={async () => {

            if (speedError || letterGenerationAmountError || minWordLengthError) {
              setSavingError('Error saving settings. Please check the fields and try again.');
              return;
            }

            await AsyncStorage.setItem('speed', speed.toString());
            await AsyncStorage.setItem('letterGenerationAmount', letterGenerationAmount.toString());
            await AsyncStorage.setItem('minWordLength', minWordLength.toString());

            setSavingError(false);

            setHasSaved(true);

            fetchSettings();

            setTimeout(() => {
              setHasSaved(false);
            }, 5000);
          }}>
            <Ionicons name={hasSaved ? 'checkmark' : 'save'} size={24} color="white" style={{ textAlign: 'center' }} />
            <ThemedText style={{ color: 'white' }}>
              {hasSaved ? 'Settings saved!' : 'Save settings'}
            </ThemedText>

          </TouchableOpacity>
            { savingError && <ThemedText style={{ color: 'red', textAlign: 'center' }}>{savingError}</ThemedText> }
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    width: '33%',
    textAlign: 'center',
  },
  headingText: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 20,
  },
  subHeadingText: {
    textAlign: 'center',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
    marginTop: 10
  },
});
