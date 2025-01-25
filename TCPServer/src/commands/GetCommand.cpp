#include "GetCommand.h"
#include <iostream>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
using namespace std;

// Constructor
GetCommand::GetCommand(WatchList *wl) : watchList(wl) {}

std::string GetCommand::execute(const vector<string> &args)
{
    std::string result;
    if (args.size() != 3)
    {
        result = "400 Bad Request";
        return result;
    }

    string userId = args[1];
    string movieId = args[2];

    if (!watchList->hasUser(userId) || !watchList->hasMovie(movieId))
    {
        result = "404 Not Found";
        return result;
    }

    
    // if (watchList->userWatchedMovie(userId, movieId))
    // {
    //     // TODO remove this (debugging)
    //     cout << "User has not watched the movie" << endl;
    //     result = "200 Ok\n\n";
    //     return result;
    // }

    result = "200 Ok\n\n";

    // Get a list of all other users
    auto allUsers = watchList->getAllUsers();
    vector<string> otherUsers;
    // // TODO remove this (debugging)
    // cout << "All users: ";

    for (string id : allUsers)
    {
        if (id != userId)
        {
            otherUsers.push_back(id);
        }
    }

    // // TODO remove this (debugging)
    // for (auto &id : otherUsers)
    // {
    //     cout << id << " ";
    // }

    // Get watched movies for each user and count common movies
    unordered_map<string, unordered_set<string>> userToMovies;
    unordered_map<string, int> commonMovieCount;
    for (string otherUserId : otherUsers)
    {
        auto movies = watchList->getUserMovies(otherUserId);
        userToMovies[otherUserId] = unordered_set<string>(movies.begin(), movies.end());

        int commonCount = 0;
        for (string movie : movies)
        {   
            // // TODO remove this (debugging)
            // cout << "Movie: " << movie << endl;
            if (watchList->userWatchedMovie(userId, movie))
            {
                ++commonCount;
            }
        }
        if (commonCount > 0)
        {
            commonMovieCount[otherUserId] = commonCount;
        }
    }

    // Filter users who have watched the desired movie
    vector<string> relevantUsers;
    for (const auto &[otherUserId, count] : commonMovieCount)
    {
        cout << "Other user: " << otherUserId << " Common count: " << count << endl;
        if (userToMovies[otherUserId].count(movieId))
        {
            relevantUsers.push_back(otherUserId);
        }
    }

    // // TODO remove this (debugging)
    // for (auto &id : relevantUsers)
    // {
    //     cout << "Relevant user: " << id << " ";
    // }

    // Calculate relevance for all movies
    unordered_map<string, int> movieScores;
    for (string otherUserId : relevantUsers)
    {   
        cout << "Other user: " << otherUserId << endl;
        for (string movie : userToMovies[otherUserId])
        {
            if (movie != movieId && !watchList->userWatchedMovie(userId, movie))
            {
                movieScores[movie] += commonMovieCount[otherUserId];
            }
        }
    }

    // Sort movies by score (descending) and ID (ascending)
    vector<pair<string, int>> sortedMovies(movieScores.begin(), movieScores.end());
    sort(sortedMovies.begin(), sortedMovies.end(), [](const auto &a, const auto &b)
         {
        if (a.second == b.second) {
            return a.first < b.first;
        }
        return a.second > b.second; });

    // Get top 10 movies
    vector<string> topMovies;
    for (size_t i = 0; i < sortedMovies.size() && i < 10; ++i)
    {
        topMovies.push_back(sortedMovies[i].first);
    }

    for (const auto &movie : topMovies)
    {
        result += movie + " ";
    }
    result += "\n";
    return result;
}