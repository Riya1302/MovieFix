# MovieFix

MovieFix is a React Native application that allows users to browse and search for movies using The Movie Database (TMDb) API. Users can filter movies by genre, search for specific movies by keyword, and navigate through different years to discover popular movies.

## Table of Contents

- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Integration](#api-integration)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## Pre-requisites

Required JAVA version: >=17

Required Node version: >=18

## Installation

To get started with MovieFix, follow these steps:

1. *Clone the repository:*

    bash
    git clone https://github.com/Riya1302/MovieFix.git
    cd MovieFix
    

2. *Install dependencies:*

    bash
    npm install
    

3. *Set up the TMDb API key:*

    Create a .env file in the root directory and add your TMDb API key:

    env
    TMDB_API_KEY=your_tmdb_api_key
    

4. *Run the application:*

    bash
    npm run android OR npx react-native run-android
    

## Usage

Once the application is running, you can:

- Browse movies by year.
- Filter movies by genre using the genre filter.
- Search for specific movies using the search functionality.

## Features

- *Browse Movies:* View a list of popular movies for different years.
- *Genre Filter:* Filter movies by genre using the genre filter component.
- *Search:* Search for specific movies by entering a keyword.
- *Infinite Scroll:* Load more movies by scrolling up or down.

## API Integration

MovieFix uses The Movie Database (TMDb) API to fetch movie data. To use the application, you need to set up your TMDb API key as described in the [Installation](#installation) section.

## Components

### HomeScreen

The main screen of the application where users can browse movies, filter by genre, and search for specific movies.

### MovieCard

A component to display individual movie details, including the title, poster, and genre names.

### GenreFilter

A component to display and manage the genre filter. Users can select genres to filter the list of movies.

## Code Structure

- *HomeScreen*: The main screen of the application.
- *components/*: Contains reusable components such as MovieCard and GenreFilter.
- *utils/*: Utility functions for API integration and other helper functions.
- *assets/*: Contains images and other static assets.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push your branch and create a pull request.