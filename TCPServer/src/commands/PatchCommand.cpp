#include "PatchCommand.h"
#include <algorithm>
#include <iostream>
#include <string>
using namespace std;
PatchCommand::PatchCommand(WatchList* wl) : watchList(wl) {}

// Checks if args has a valid structure: command name, numeric userId, and at least one numeric movieId
bool PatchCommand::isCommandValid(const std::vector<std::string>& args) {
    if (args.empty() || args.size() < 3) return false;  // Need command name, userId, and at least one movieId
    
    return true;
}

// Adds the specified movies to the watchlist of the specified user
std::string PatchCommand::execute(const std::vector<std::string>& args) {
    std::string result;
    if(!isCommandValid(args)){
       result = "400 Bad Request";
       return result;
   }

    string userId = args[1];

    if(!watchList->hasUser(userId)){  
        result = "404 Not Found"; 
        return result;
    }

    for (size_t i = 2; i < args.size(); ++i) {
       watchList->addUserMovie(userId, args[i],false);
    }
    watchList->saveData();

    result = "204 No Content";
    return result;
}
