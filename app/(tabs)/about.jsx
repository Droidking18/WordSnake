import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function About() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#353636' }}
      headerImage={<Image source={require('../../assets/images/snakeLogo.png')} style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">WordSnake</ThemedText>
      </ThemedView>
      <ThemedText>Instructions to play the game:</ThemedText>
      <Collapsible title="What's the goal?">
        <ThemedText>
          The goal is simple! You need to form words by navigating the snake. When you have a word, you can lock it in
          by pressing the `claim your word` button. The longer the word, the more points you get!
        </ThemedText>
      </Collapsible>
      <Collapsible title="What if I collected in invalid word?">
        <ThemedText>
          That's not a problem! You can always press the `drop word` button to start a new word, you get to keep your previous points, but
          as a penalty, your snake will keep the same length, as if you had collected the points.
        </ThemedText>
      </Collapsible>
      <Collapsible title="I want to earn more points!">
        <ThemedText>
          Yay! You can earn more points by forming longer words. The longer the word, the more points you get!
          Another way to earn more points is by adjusting the difficulty levels. The higher the difficulty, the more points you get!
          There are many types of difficulty levels, the speed of the snake, and the number of letters. You can adjust these settings in the settings tab.
        </ThemedText>
      </Collapsible>
      <Collapsible title="How does the leader board work?">
        <ThemedText>
          The leader board is a list of the top players in the game. You can see your ranking and the ranking of other players.
          Note WordSnake does not require you to log in, just select a name in the leader tab, and you're good to go! Note,
          you aren't required to use the leader board, but it's a fun way to see how you compare to other players.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#ffffff',
    position: 'absolute',
    resizeMode: 'contain',
    height: '100%',
    width: '100%',

  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
