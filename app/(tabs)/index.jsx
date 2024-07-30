import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import wordListA from '../../assets/json/word_list_a.json';
import wordListB from '../../assets/json/word_list_b.json';
import wordListC from '../../assets/json/word_list_c.json';
import wordListD from '../../assets/json/word_list_d.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CELL_SIZE = screenWidth / 20;
// Screen height is about 66% of the total height, but must be divisible by CELL_SIZE
const GAME_HEIGHT = Math.floor(screenHeight * 0.66 / CELL_SIZE) * CELL_SIZE;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 3, y: 3 }]);
  const [food, setFood] = useState([]);
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);
  const [isValidWord, setIsValidWord] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [letterGenerationAmount, setLetterGenerationAmount] = useState(3);
  const [minWordLength, setMinWordLength] = useState(1);
  const [isWrappingEnabled, setIsWrappingEnabled] = useState(false);
  const [isTouchControlEnabled, setIsTouchControlEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newHighscore, setNewHighscore] = useState(false);

  const navigate = useNavigation();


  const fetchSettings = async () => {


    const speed = await AsyncStorage.getItem('speed') || 100;
    const letterGenerationAmount = await AsyncStorage.getItem('letterGenerationAmount') || 3;
    const minWordLength = await AsyncStorage.getItem('minWordLength') || 1;
    const wrappingEnabled = await AsyncStorage.getItem('isWrappingEnabled') || false;
    const touchControlEnabled = await AsyncStorage.getItem('isTouchControlEnabled') || false;

    setSpeed(parseInt(speed));
    setLetterGenerationAmount(parseInt(letterGenerationAmount));
    setMinWordLength(parseInt(minWordLength));
    setIsWrappingEnabled(wrappingEnabled === 'true');
    setIsTouchControlEnabled(touchControlEnabled === 'true');
  }

  // If we want to run when tab is focused, we can use useFocusEffect from react-navigation

  useFocusEffect(() => {
    fetchSettings();
  });

  useEffect(() => {
    generateFruits();
  }, []);

  useEffect(() => {
    const lcWord = word.toLowerCase();
    if (wordListA[lcWord] || wordListB[lcWord] || wordListC[lcWord] || wordListD[lcWord]) {
      if (word.length >= minWordLength) {
        setIsValidWord(true);
      }
    } else {
      setIsValidWord(false);
    }
  }, [word]);

  const calculateScoreNumber = () => {
    const score =
            (word.length * 1.2 ** (word.length - 1))
            * (100 / speed)
            * (3 / letterGenerationAmount)
            * (3 / minWordLength);
    const roundedScore = Math.round(score * 100) / 100;
    return roundedScore;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isGameOver) {
        moveSnake();
      }
    }, speed);
    return () => clearInterval(intervalId);
  }, [snake, direction, isGameOver, speed]);

  const handlePress = (key) => {
    const currentDirection = direction;
    if (key === 'UP' && currentDirection !== 'DOWN') {
      setDirection('UP');
    } else if (key === 'DOWN' && currentDirection !== 'UP') {
      setDirection('DOWN');
    } else if (key === 'LEFT' && currentDirection !== 'RIGHT') {
      setDirection('LEFT');
    } else if (key === 'RIGHT' && currentDirection !== 'LEFT') {
      setDirection('RIGHT');
    }
  };

  const handleWord = () => {
    if (isValidWord) {
      const newScore = calculateScoreNumber() + score;
      const roundedScore = Math.round(newScore * 100) / 100;

      setWord('');
      setScore(roundedScore);
    }
  }

  const handleDropWord = () => {
    setWord('');
  }

  const calculateScore = () => {

    if (word.length === 0) {
      return 'Start collecting words!';
    }

    if (!isValidWord) {
      return `Invalid word - ${word}`;
    }

    const score = calculateScoreNumber();

    if (score === 1) return `Claim your word - "${word}" for ${score} point!`;

    return `Claim your word - "${word}" for ${score} points!`;
  }


  const moveSnake = async () => {
    const newSnake = [...snake];
    let head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (isWrappingEnabled) {
      if (head.x < 0) {
        head.x = screenWidth / CELL_SIZE - 1;
      }
      if (head.x >= screenWidth / CELL_SIZE) {
        head.x = 0;
      }
      if (head.y < 0) {
        head.y = GAME_HEIGHT / CELL_SIZE - 1;
      }
      if (head.y >= GAME_HEIGHT / CELL_SIZE) {
        head.y = 0;
      }
    }

    if (isOutOfBounds(head) || isCollision(newSnake, head)) {
      setIsGameOver(true);
      setModalVisible(true);
      setLoading(true);

      setScore(Math.round(score));

      let username = '';

      try {
        username = await AsyncStorage.getItem('username');
      } catch (e) {
        console.error(e);
      }
      const highscoreRes = await fetch('http://dreamlo.com/lb/IJ2qfzvs9EajL-xtC5WPNQUvU9D-usC0-XVosLskLlrQ/pipe-get/' + username);

      const highscoreText = await highscoreRes?.text();
      const highscore = highscoreText?.split('|')?.[1];

      if (score > highscore) {
        const res = await fetch('http://dreamlo.com/lb/IJ2qfzvs9EajL-xtC5WPNQUvU9D-usC0-XVosLskLlrQ/add/' + username + '/' + Math.round(score));
        setNewHighscore(true);
      }

      setLoading(false);
      return;
    }

    newSnake.unshift(head);

    if (isFoodEaten(head)) {
      setSnake(newSnake);
      generateFruits(head);
    } else {
      newSnake.pop();
      setSnake(newSnake);
    }
  };

  const generateFruits = (foodToRemove) => {
    let newFood = [ ...food ];
    if (foodToRemove) {
      newFood = newFood.filter(f => f.x !== foodToRemove.x || f.y !== foodToRemove.y);
    }
    while (newFood.length < letterGenerationAmount) {
      let x = Math.floor(Math.random() * (screenWidth / CELL_SIZE));

      // X shouldn't be right at the edge
      if (x === screenWidth / CELL_SIZE) {
        x -= 1;
      }
      if (x === 0) {
        x += 1;
      }

      let y = Math.floor(Math.random() * (GAME_HEIGHT / CELL_SIZE));

      // Y shouldn't be right at the edge
      if (y === GAME_HEIGHT / CELL_SIZE) {
        y -= 1;
      }
      if (y <5) {
        y += 5;
      }
      let letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));

      // Are there any vowels in food?
      if (!newFood.some(f => ['A', 'E', 'I', 'O', 'U'].includes(f.letter)) && letterGenerationAmount > 1) {
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        letter = vowels[Math.floor(Math.random() * 5)];
      }

      if (!snake.some(segment => segment.x === x && segment.y === y) && !newFood.some(f => f.x === x && f.y === y)) {
        newFood.push({ x, y, letter });
      }
    }
    setFood(newFood);
  };

  const isOutOfBounds = (head) => {
    return head.x < 0 || head.y < 0 || head.x >= screenWidth / CELL_SIZE || head.y >= GAME_HEIGHT / CELL_SIZE;
  };

  const isCollision = (snake, head) => {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    setSnake([{ x: 3, y: 3 }]);
    setDirection('RIGHT');
    setIsGameOver(false);
    setWord('');
    setScore(0);
    setFood([]);
    generateFruits();
  }

  const isFoodEaten = (head) => {
    for (let i = 0; i < food.length; i++) {
      if (food[i].x === head.x && food[i].y === head.y) {
        setFood(food.filter((_, index) => index !== i));
        setWord(word + food[i].letter);
        return true;
      }
    }
    return false;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {(modalVisible || !isStarted) && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            width: screenWidth,
            height: screenHeight,
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ margin: 20, backgroundColor: 'black', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
              {isStarted &&
                <>
                  <Text style={{ marginBottom: 20, color: 'white' }}>Game Over!</Text>
                  <Text style={{ marginBottom: 20, color: 'white' }}>Your score: {score}</Text>
                  {newHighscore && <Text style={{ marginBottom: 20, color: 'white' }}>New highscore!</Text>}
                </>
              }
              {
                !isStarted &&
                <>
                  <Text style={{ marginBottom: 20, color: 'white' }}>Welcome to WordSnake!</Text>
                  <Text style={{ marginBottom: 20, color: 'white' }}>Collect letters to form words</Text>
                  <Text style={{ marginBottom: 20, color: 'white' }}>Swipe to move the snake</Text>
                </>
              }
              <TouchableOpacity style={styles.button} onPress={() => {
                if (loading) {
                  return;
                }
                setModalVisible(false);
                setIsStarted(true);
                setNewHighscore(false);
                resetGame();
              }
              }>
                { loading && <Text>Loading...</Text> }
                { !loading && <Text>{isStarted ? 'Play Again' : 'Start Game'}</Text> }
              </TouchableOpacity>
              <>
                <Text style={{ marginVertical: 20, color: 'white' }}>Want to find out how to play?</Text>

                <TouchableOpacity style={styles.button} onPress={() => {
                  navigate.navigate('about');
                }}>
                  <Text>Show me the FAQs</Text>
                </TouchableOpacity>
              </>
            </View>
          </View>
        </View>
      ) ||

      <>
      <PanGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === 5) {
            const { translationX, translationY } = nativeEvent;
            if (Math.abs(translationX) > Math.abs(translationY)) {
              if (translationX > 0) {
                handlePress('RIGHT');
              } else {
                handlePress('LEFT');
              }
            } else {
              if (translationY > 0) {
                handlePress('DOWN');
              } else {
                handlePress('UP');
              }
            }
          }
        }}
      >
        <View style={styles.gameArea}>
          {snake.map((segment, index) => (
              index > 0 &&
                <View key={index} style={[styles.cell, {
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  backgroundColor: `rgb(${255 - segment.x * 10}, 0, ${255 - segment.y * 10})`,
                  zIndex: 0,
                }]} /> ||
                <View key={index} style={[styles.cell, {
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  backgroundColor: '#114e11',
                }]}>
                  <View style={styles.eyes}>
                    <View style={styles.eye} />
                    <View style={styles.eye} />
                  </View>
                  <View style={styles.fangs}>
                    <View style={styles.fang} />
                    <View style={styles.fang} />
                  </View>
                </View>
          ))}
          {food.map((fruit, index) => (
            <Text key={index} style={[styles.fruit, { left: fruit.x * CELL_SIZE, top: fruit.y * CELL_SIZE }]}>
              {fruit.letter}
            </Text>
          ))}
        </View>
      </PanGestureHandler>
      <View style={styles.controls}>


        <View style={styles.row}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            <TouchableOpacity style={styles.button} onPress={() => handleWord()}>
              <Text style={styles.word}>{calculateScore()}</Text>
            </TouchableOpacity>
            { !isValidWord && word.length > 0 && (
              <TouchableOpacity style={styles.button} onPress={() => handleDropWord()}>
                <Text style={styles.word}>Drop word</Text>
              </TouchableOpacity>
            )}

            <Text>Score: {score}</Text>
            <Text>Speed: {speed}</Text>
            <Text>Letter generation amount: {letterGenerationAmount}</Text>
            <Text>Minimum word length: {minWordLength}</Text>
          </View>

          { isTouchControlEnabled &&
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity style={styles.button} onPress={() => handlePress('UP')}>
                <Text>UP</Text>
              </TouchableOpacity>
              <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={() => handlePress('LEFT')}>
                  <Text>LEFT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePress('RIGHT')}>
                  <Text>RIGHT</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={() => handlePress('DOWN')}>
                <Text>DOWN</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
      </>
      }
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    height: GAME_HEIGHT,
    backgroundColor: 'black',
    position: 'relative',
    borderWidth: 1,
  },
  cell: {
    position: 'absolute',
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    zIndex: 0,
  },
  fruit: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    color: 'yellow',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: CELL_SIZE,
    borderWidth: 1,
    borderColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CELL_SIZE / 4,
  },
  controls: {
    marginTop: 10,
    height: screenHeight * 0.33,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    margin: 5,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  fangs: {
    position: 'absolute',
    top: CELL_SIZE / 1.1,
    width: CELL_SIZE,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fang: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: CELL_SIZE / 6,
    borderRightWidth: CELL_SIZE / 6,
    borderBottomWidth: CELL_SIZE / 1,
    transform: [{ rotate: '180deg' }],
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    elevation: 1,
    zIndex: 2,
  },
  eyes: {
    position: 'absolute',
    top: 0,
    width: CELL_SIZE,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  eye: {
    width: CELL_SIZE * 0.5,
    height: CELL_SIZE * 0.5,
    backgroundColor: 'black',
    borderRadius: CELL_SIZE * 0.25,
    borderWidth: CELL_SIZE * 0.1,
    borderColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
});

export default SnakeGame;
