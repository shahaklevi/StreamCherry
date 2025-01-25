#ifndef WATCHLIST_H
#define WATCHLIST_H

#include <map>
#include <set>
#include <string>
#include <vector>
#include "../interfaces/IWatchList.h"
#include <list>
#include <unordered_map> 
#include <thread>
#include <mutex>

class WatchList {
private:
   std::mutex mtx;
   std::map<std::string, std::set<std::string>> userMovies;
   std::string filename;
   std::unordered_map<std::string, std::list<std::string>> movieWatchers; 
public:
   explicit WatchList(const std::string& dataFile);
   void addUserMovie(const std::string& userId, const std::string& movieId, bool save = true);
   std::set<std::string> getUserMovies(const std::string& userId) const;
   bool hasMovie(const std::string& movieId) const;
   bool hasUser(const std::string& userId) const;
   void loadData();
   void saveData();
   void addMovieWatcher(const std::string& movieId, const std::string& userId);
   std::list<std::string> getMovieWatchers(const std::string& movieId) const;
   std::set<std::string> getAllUsers() const;
   bool userWatchedMovie(const std::string& userId, const std::string& movieId) const;
   void deleteUserMovie(const std::string& userId, const std::string& movieId);
};

#endif
