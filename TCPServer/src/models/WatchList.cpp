#include "WatchList.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <unordered_map>

WatchList::WatchList(const std::string& dataFile) : filename(dataFile) {
    std::ifstream file(filename);
    if (!file) {
        // File does not exist, create a new file
        std::ofstream newFile(filename);
        if (!newFile) {
            std::cerr << "Failed to create file: " << filename << std::endl;
            throw std::runtime_error("Failed to create file");
        }
        newFile.close();
    } 
    loadData();
}

// When save is true, the data is saved to the file (at the end of the function)
void WatchList::addUserMovie(const std::string& userId, const std::string& movieId, bool save) {
    userMovies[userId].insert(movieId);
    // Update each movie watchers list
    addMovieWatcher(movieId, userId);
    if (save){
        saveData();
    }
}

// Returns the set of movies watched by the user
std::set<std::string> WatchList::getUserMovies(const std::string& userId) const {
    auto it = userMovies.find(userId);
    if (it != userMovies.end()) {
        return it->second;
    }
    return std::set<std::string>();
}
		
// Check if a movie exists
bool WatchList::hasMovie(const std::string& movieId) const {
    return movieWatchers.find(movieId) != movieWatchers.end();
}

// Returns true if the user is in the watchlist
bool WatchList::hasUser(const std::string& userId) const {
    return userMovies.find(userId) != userMovies.end();
}

void WatchList::loadData() {
    // Clear existing data to avoid duplication
    userMovies.clear();
    movieWatchers.clear();
    std::ifstream file(filename);
    if (!file) return;

    std::string line;
    while (std::getline(file, line)) {
        std::istringstream iss(line);
        std::string userId;
        char colon;
        iss >> userId >> colon;
        iss >> std::ws; // Skipping whitespaces
        std::string movieId;
        while (iss.good()) {
            std::getline(iss, movieId, ','); // Read up to the next comma
            movieId.erase(movieId.find_last_not_of(" ") + 1); // Trim trailing spaces
            movieId.erase(0, movieId.find_first_not_of(" ")); // Trim leading spaces
            if (movieId.empty()) continue; // Skip empty movie IDs
            userMovies[userId].insert(movieId);
            movieWatchers[movieId].push_back(userId);
        }
    }
}



// Saves the data to the file
void WatchList::saveData() {
    std::ofstream file(filename);

    if (!file.is_open()) {
        return;
    }
    for (const auto& [userId, movies] : userMovies) {
        file << userId << " : ";
        bool first = true;
        for (const std::string& movieId : movies) {
            if (movieId.empty()) continue; // Skip empty movie IDs
            if (!first) file << ", ";
            file << movieId;
            first = false;
        }
        file << '\n';
    }
}

// Add a user to a movie's watchers list
void WatchList::addMovieWatcher(const std::string& movieId, const std::string& userId) {
    movieWatchers[movieId].push_back(userId);
}

// Retrieve a specific movie watchers list
std::list<std::string> WatchList::getMovieWatchers(const std::string& movieId) const {
    auto it = movieWatchers.find(movieId);
    if (it != movieWatchers.end()) {
        return it->second;
    }
    return {};
}

// Retrieve a set of all user IDs exist
std::set<std::string> WatchList::getAllUsers() const {
    std::set<std::string> allUsers;
    for (const auto& pair : userMovies) {
        allUsers.insert(pair.first);
    }
    return allUsers;
}

// Check if a user has watched a specific movie
bool WatchList::userWatchedMovie(const std::string& userId, const std::string& movieId) const {
    auto it = userMovies.find(userId);
    if (it != userMovies.end()) {
        return it->second.find(movieId) != it->second.end();
    }
    return false;
}

void WatchList::deleteUserMovie(const std::string& userId, const std::string& movieId) {
    // Find the user's movie set
    auto userIt = userMovies.find(userId);
    if (userIt != userMovies.end()) {
        // Delete the specific movie from user's set
        userIt->second.erase(movieId);
    }
}
