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
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  const [rotateAnimation] = useState(new Animated.Value(0))

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

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Leaderboard</ThemedText>
      </ThemedView>

      { !savedUsername &&
        <View style={styles.innerContainer}>
          <ThemedText style={styles.headingText}>Please create a unique username to use the leaderboard feature</ThemedText>
          <TextInput placeholder="Enter a username" style={{ height: 40, width: width * 0.8, borderColor: 'black', borderWidth: 1, borderRadius: 20, textAlign: 'center' }} onChangeText={async (text) => {
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

            AsyncStorage.setItem('username', username);
            setSavedUsername(username);
          }}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={{ color: isTaken ? 'red' : 'green' }}>{getInfoText()}</ThemedText>
        </View>
      }

      { savedUsername &&
        <View style={styles.innerTableContainer}>
          <ThemedText style={styles.headingText}>Welcome back, {savedUsername || 'friend'}!</ThemedText>
          <TouchableOpacity style={styles.button} onPress={async () => {
            AsyncStorage.removeItem('username');
            setSavedUsername('');
          }} >
            <ThemedText style={{ color: 'white' }}>Delete me from leaderboard</ThemedText>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          { leaderboard && leaderboard.map((entry, index) => {
            return <View key={index + entry.name} style={{ flexDirection: 'row', justifyContent: 'space-between', width: width * 0.8, borderBottomWidth: 1, borderBottomColor: 'black', backgroundColor: entry.name === savedUsername ? 'lightblue' : index % 2 === 0 ? 'white' : 'lightgrey' }}>
              <ThemedText style={styles.column}>{index + 1}</ThemedText>
              <ThemedText style={styles.column}>{entry.name}</ThemedText>
              <ThemedText style={styles.column}>{entry.score}</ThemedText>
            </View>
          })}

          { isLeaderboardLoading &&
            <View style={styles.innerContainer}>
              <Animated.View style={[styles.loader, animatedRotate]} />
            </View>
          }


        </View>
      }

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
