import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, TextInput, Dimensions, TouchableOpacity, useColorScheme, Modal } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';

import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';

const width = Dimensions.get('window').width;

export default function TabTwoScreen() {

  const getInfoText = () => {

    if (!username) {
      return 'Please enter a username';
    }
    if (isTaken) {
      return 'Username is taken, please choose another';
    }
    if (isLoading) {
      return 'Checking username availability...';
    }
    return 'Username is available!';
  }

  const [username, setUsername] = useState('');
  const [isTaken, setIsTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedUsername, setSavedUsername] = useState('');
  const [hasRemovedName, setHasRemovedName] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const [rotateAnimation] = useState(new Animated.Value(0));

  const fetchUsername = async () => {
    const leaderboardCall = await fetch(`http://dreamlo.com/lb/IJ2qfzvs9EajL-xtC5WPNQUvU9D-usC0-XVosLskLlrQ/json`);
    try {
      const username = await AsyncStorage.getItem('username');

      if (username) {
        setSavedUsername(username);
        const response = await leaderboardCall?.json();
        setIsLeaderboardLoading(false);
        setLeaderboard(response?.dreamlo?.leaderboard?.entry);
      }
    } catch (e) {}
  }

  useFocusEffect(() => {
    fetchUsername();
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(
        rotateAnimation,
        {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }
      )
    ).start();
  }, [])

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const animatedRotate = {
    transform: [{
      rotate: rotateInterpolate
    }]
  }

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Leaderboard</ThemedText>
      </ThemedView>

      { hasRemovedName &&
        <Modal animationType="slide" transparent={true} visible={hasRemovedName}>
          <ThemedView style={styles.innerContainer}>
            <ThemedText style={styles.headingText}>You have been removed from the leaderboard</ThemedText>
            <ThemedText style={styles.headingText}>You can rejoin by entering a new username</ThemedText>
            <TouchableOpacity style={styles.button} onPress={() => setHasRemovedName(false)}>
              <ThemedText style={{ color: 'white' }}>Close</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Modal>
      }

      { !savedUsername &&
        <ThemedView style={styles.innerContainer}>
          <ThemedText style={styles.headingText}>Please create a unique username to use the leaderboard feature</ThemedText>
          <TextInput
            placeholder="Enter a username"
            style={{
              height: 40,
              width: width * 0.8,
              borderColor: isDarkMode ? '#fff' : 'black',
              color: isDarkMode ? '#fff' : 'black',
              borderWidth: 1,
              borderRadius: 20,
              textAlign: 'center'
            }}
            onChangeText={async (text) => {
              setUsername(text);
              setIsLoading(true);
              const leaderboardCall = await fetch(`http://dreamlo.com/lb/IJ2qfzvs9EajL-xtC5WPNQUvU9D-usC0-XVosLskLlrQ/pipe-get/${text}`);
              const response = await leaderboardCall.text();
              setIsTaken(!!response);
              setIsLoading(false);
            }} />
          <TouchableOpacity style={styles.button} onPress={async () => {

            if (isTaken) {
              return;
            }
            const leaderboardCall = await fetch(`http://dreamlo.com/lb/IJ2qfzvs9EajL-xtC5WPNQUvU9D-usC0-XVosLskLlrQ/add/${username}/0`);

            AsyncStorage.setItem('username', username.toString());
            setSavedUsername(username);
            setUsername('');
          }}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={{ color: isTaken ? 'red' : 'green' }}>{getInfoText()}</ThemedText>
        </ThemedView>
      }

      { savedUsername &&
        <ThemedView style={styles.innerTableContainer}>
          <ThemedText style={styles.headingText}>Welcome back, {savedUsername || 'friend'}!</ThemedText>
          <TouchableOpacity style={styles.button} onPress={async () => {
            AsyncStorage.removeItem('username');
            await fetch(`http://dreamlo.com/lb/IJ2qfzvs9EajL-xtC5WPNQUvU9D-usC0-XVosLskLlrQ/remove/${savedUsername}`);
            setSavedUsername('')
            setHasRemovedName(true);

            setTimeout(() => {
              setHasRemovedName(false);
            }, 5000);
          }} >
            <ThemedText style={{ color: 'white' }}>Delete me from leaderboard</ThemedText>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          { leaderboard && leaderboard.map((entry, index) => {
            return (
              <ThemedView
                key={index + entry.name}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: width * 0.8,
                  borderBottomWidth: 1,
                  borderBottomColor: 'black',

                  borderColor: entry.name === savedUsername ? 'red' : 'transparent',
                  borderWidth: 2,
                  borderBottomWidth: 2,
                  borderBottomColor: entry.name === savedUsername ? 'red' : 'transparent',
                  backgroundColor: (isDarkMode ? index % 2 === 0 ? 'black' : 'darkgrey' : index % 2 === 0 ? 'white' : 'lightgrey')
                }}>
                <ThemedText style={[
                  styles.column,
                  index % 2 === 0 ? { color: isDarkMode ? 'white' : 'black' } : { color: 'black' }
                ]}>
                  {index + 1}
                </ThemedText>
                <ThemedText style={[
                  styles.column,
                  index % 2 === 0 ? { color: isDarkMode ? 'white' : 'black' } : { color: 'black' }
                ]}>
                  {entry.name}
                </ThemedText>
                <ThemedText style={[
                  styles.column,
                  index % 2 === 0 ? { color: isDarkMode ? 'white' : 'black' } : { color: 'black' }
                ]}>
                  {entry.score}
                </ThemedText>
              </ThemedView>
            )
          })}

          { isLeaderboardLoading &&
            <View style={styles.innerContainer}>
              <Animated.View style={[styles.loader, animatedRotate]} />
            </View>
          }


        </ThemedView>
      }

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
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
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  loader: {
    borderRightColor: 'blue',
    borderRightWidth: 3,
    borderRadius: 20 * width / 100,
    height: 20 * width / 100,
    width: 20 * width / 100,
  }
});
