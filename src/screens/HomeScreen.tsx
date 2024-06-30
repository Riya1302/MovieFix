import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  SectionList,
  StyleSheet,
  SectionListData,
  SectionListRenderItemInfo,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import MovieCard from './components/MovieCard';
import GenreFilter from './components/GenreFilter';
import {fetchMovies, fetchGenres, searchMovies} from './HomeScreens.utils';
import {
  ApiData,
  Genres,
  MovieData,
  MovieSections,
} from './HomeScreen.interface';

const HomeScreen = () => {
  const [genres, setGenres] = useState<Genres[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<MovieSections[]>([]);
  const [genresLoaded, setGenresLoaded] = useState(false);
  const [currentYear, setCurrentYear] = useState(2012);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const loadMovies = async (append = false, year = 2012) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const genreQuery =
      selectedGenres.length > 0 ? selectedGenres.join(',') : null;
    try {
      const movieData: ApiData = await fetchMovies(year, genreQuery);
      const moviesWithGenres = movieData.results.map(movie => ({
        ...movie,
        genre_names: movie.genre_ids.map(
          id => genres.find(g => g.id === id)?.name || '',
        ),
      }));

      const sortedMoviesWithGenres = moviesWithGenres
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);

      const newSection = {year, data: sortedMoviesWithGenres};

      setSections(prevSections => {
        const updatedSections = [...prevSections];
        const existingSectionIndex = updatedSections.findIndex(
          section => section.year === year,
        );

        if (existingSectionIndex > -1) {
          const existingMovies = updatedSections[existingSectionIndex].data;
          const newMovies = sortedMoviesWithGenres.filter(
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
          if (sortedMoviesWithGenres.length > 0) {
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

  const handleLoadMore = useCallback(
    (direction: string) => {
      if (loading) {
        return;
      }
      const firstYear = sections.length > 0 ? sections[0].year : 2012;
      const lastYear =
        sections.length > 0 ? sections[sections.length - 1].year : 2012;
      const newYear = direction === 'up' ? firstYear - 1 : lastYear + 1;

      if (newYear < 1888 || newYear > 2024) {
        return;
      }

      setCurrentYear(newYear);
      loadMovies(true, newYear);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections, selectedGenres, loading],
  );

  const loadGenres = async () => {
    try {
      const genreData = await fetchGenres();
      setGenres(genreData.genres);
      setGenresLoaded(true);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }
    setLoading(true);
    try {
      const movieData: ApiData = await searchMovies(searchQuery);
      const moviesWithGenres = movieData.results.map(movie => ({
        ...movie,
        genre_names: movie.genre_ids.map(
          id => genres.find(g => g.id === id)?.name || '',
        ),
      }));

      const sortedMoviesWithGenres = moviesWithGenres.sort(
        (a, b) => b.popularity - a.popularity,
      );

      setSections([
        {year: sortedMoviesWithGenres.length, data: sortedMoviesWithGenres},
      ]);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      loadMovies(false, currentYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genresLoaded, selectedGenres]);

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenres(genreId === 'all' ? [] : [genreId]);
    setSections([]);
    setCurrentYear(2012);
    loadMovies(false, 2012);
  };

  const renderItem = ({
    item,
    index,
    section,
  }: SectionListRenderItemInfo<MovieData>) => {
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

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<MovieData>;
  }) => <Text style={styles.year}>{section.year}</Text>;

  const movieSections = useMemo(() => {
    return sections.filter(section => section.data.length > 0);
  }, [sections]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>MOVIEFIX</Text>
        <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)}>
          <Image
            source={require('./assets/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#ccc"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
      )}
      <GenreFilter
        genres={genres}
        selectedGenres={selectedGenres}
        onSelectGenre={handleSelectGenre}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#e50914" />
      ) : (
        <View style={styles.sectionList}>
          <SectionList
            sections={movieSections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={item => item.id.toString()}
            onEndReached={({distanceFromEnd}) => {
              if (distanceFromEnd > 0 && !loading) {
                handleLoadMore('down');
              }
            }}
            onEndReachedThreshold={0.5}
            onScroll={({nativeEvent}) => {
              if (nativeEvent.contentOffset.y <= 0 && !loading) {
                handleLoadMore('up');
              }
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e50914',
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
  sectionList: {backgroundColor: '#000'},
});

export default HomeScreen;
