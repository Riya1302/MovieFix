import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const MovieCard = ({movie}) => {
  return (
    <View style={styles.card}>
      <Image
        source={{uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`}}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.genre}>Rating: {movie.vote_average}</Text>
        <Text style={styles.genre}>
          Genres: {movie.genre_names?.join(', ')}
        </Text>
        <Text style={styles.genre}>Overview: {movie.overview}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 8,
    margin: 8,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    width: width / 2 - 24,
  },
  image: {
    width: '100%',
    height: 225,
    borderRadius: 8,
  },
  info: {
    marginTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  genre: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
  },
});

export default MovieCard;
