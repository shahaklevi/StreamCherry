#include "DeleteCommand.h"
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;
DeleteCommand::DeleteCommand(WatchList* wl) : watchList(wl) {}

std::string DeleteCommand::execute(const std::vector<std::string>& args) {
  // Check if command format is valid
  if(!isCommandValid(args)){
      std::string result = "400 Bad Request";
      return result;
  }

  string userId = args[1];
  
  // Check if user exists
  if(!watchList->hasUser(userId)){
      std::string result = "404 Not Found";
      return result;
  }

  // First verify all movies exist for this user
  for (size_t i = 2; i < args.size(); ++i) {
      string movieId = args[i];
      if(!watchList->userWatchedMovie(userId, movieId)){
          std::string result = "404 Not Found";
          return result;
      }
  }

  // If all movies exist for this user, delete them
  for (size_t i = 2; i < args.size(); ++i) {
      watchList->deleteUserMovie(userId,args[i]);
  }
  watchList->saveData();
  
  std::string result = "204 No Content";
  return result;
}

// Checks if args has a valid structure: command name, numeric userId, and at least one numeric movieId
bool DeleteCommand::isCommandValid(const std::vector<std::string>& args) {
    if (args.empty() || args.size() < 3) return false;  // Need command name, userId, and at least one movieId
    return true;
}