import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Genres} from '../HomeScreen.interface';

type GenreFilterProps = {
  genres: Genres[];
  selectedGenres: string[];
  onSelectGenre: (genreId: string) => void;
};

const GenreFilter = ({
  genres,
  selectedGenres,
  onSelectGenre,
}: GenreFilterProps) => (
  <View style={styles.container}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        key="all"
        style={[
          styles.genreButton,
          selectedGenres.length === 0 && styles.selectedGenreButton,
        ]}
        onPress={() => onSelectGenre('all')}>
        <Text
          style={[
            styles.genreText,
            selectedGenres.length === 0 && styles.selectedGenreText,
          ]}>
          All
        </Text>
      </TouchableOpacity>
      {genres.map(genre => (
        <TouchableOpacity
          key={genre.id}
          style={[
            styles.genreButton,
            selectedGenres.includes(genre.id.toString()) &&
              styles.selectedGenreButton,
          ]}
          onPress={() => onSelectGenre(genre.id.toString())}>
          <Text
            style={[
              styles.genreText,
              selectedGenres.includes(genre.id.toString()) &&
                styles.selectedGenreText,
            ]}>
            {genre.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1d1d1d',
    paddingBottom: 12,
    marginLeft: 12,
  },
  genreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#444',
  },
  selectedGenreButton: {
    backgroundColor: '#e50914',
  },
  genreText: {
    color: '#fff',
  },
  selectedGenreText: {
    color: '#fff',
  },
});

export default GenreFilter;
