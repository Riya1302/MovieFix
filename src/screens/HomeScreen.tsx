import React, {useState, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  SectionList,
  StyleSheet,
} from 'react-native';
import MovieCard from './components/MovieCard';
import GenreFilter from './components/GenreFilter';
import {fetchMovies, fetchGenres} from '../api/tmdb';

const HomeScreen = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState(2012); // Start with the year 2012
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    loadGenres();
    loadMovies();
  }, []);

  useEffect(() => {
    loadMovies(false);
  }, [year, selectedGenres]);

  const loadMovies = async (append = false) => {
    setLoading(true);
    const genreQuery =
      selectedGenres.length > 0 ? selectedGenres.join(',') : null;
    try {
      const movieData = await fetchMovies(year, genreQuery);
      const moviesWithGenres = movieData.results.map(movie => ({
        ...movie,
        genre_names: movie.genre_ids.map(
          id => genres.find(g => g.id === id)?.name || '',
        ),
      }));

      const newSection = {year, data: moviesWithGenres};

      setSections(prevSections => {
        const updatedSections = [...prevSections];
        const existingSectionIndex = updatedSections.findIndex(
          section => section.year === year,
        );

        if (existingSectionIndex > -1) {
          const existingMovies = updatedSections[existingSectionIndex].data;
          const newMovies = moviesWithGenres.filter(
            movie =>
              !existingMovies.some(
                existingMovie => existingMovie.id === movie.id,
              ),
          );

          updatedSections[existingSectionIndex] = {
            ...updatedSections[existingSectionIndex],
            data: append
              ? [...existingMovies, ...newMovies]
              : [...newMovies, ...existingMovies],
          };
        } else {
          if (moviesWithGenres.length > 0) {
            updatedSections.push(newSection);
          }
        }

        return updatedSections.sort((a, b) => a.year - b.year);
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  const handleLoadMore = direction => {
    const newYear = direction === 'up' ? year - 1 : year + 1;
    setYear(newYear);
    loadMovies(true);
  };

  const loadGenres = async () => {
    try {
      const genreData = await fetchGenres();
      setGenres(genreData.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSelectGenre = genreId => {
    setSelectedGenres(genreId === 'all' ? [] : [genreId]);
    setYear(2012); // Reset year to 2012
    setSections([]); // Clear sections to reload movies based on the selected genre
  };

  const renderItem = ({item, index, section}) => {
    if (index % 2 === 0) {
      const nextItem = section.data[index + 1];
      return (
        <View style={styles.row}>
          <MovieCard movie={item} />
          {nextItem ? (
            <MovieCard movie={nextItem} />
          ) : (
            <View style={styles.cardPlaceholder} />
          )}
        </View>
      );
    }
    return null;
  };

  const renderSectionHeader = ({section: {year}}) => (
    <Text style={styles.year}>{year}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MOVIEFIX</Text>
      <GenreFilter
        genres={genres}
        selectedGenres={selectedGenres}
        onSelectGenre={handleSelectGenre}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#e50914" />
      ) : (
        <View style={{backgroundColor: '#000'}}>
          <SectionList
            sections={sections.filter(section => section.data.length > 0)} // Filter out empty sections
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={item => item.id.toString()}
            onEndReached={({distanceFromEnd}) => {
              if (distanceFromEnd > 0) handleLoadMore('down');
            }}
            onEndReachedThreshold={0.5}
            onScroll={({nativeEvent}) => {
              if (nativeEvent.contentOffset.y <= 0) handleLoadMore('up');
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1d',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e50914',
    marginVertical: 16,
    marginLeft: 16,
  },
  year: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardPlaceholder: {
    flex: 1,
    margin: 8,
  },
});

export default HomeScreen;
