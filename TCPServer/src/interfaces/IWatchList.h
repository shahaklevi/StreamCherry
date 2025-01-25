#ifndef IWATCHLIST_H
#define IWATCHLIST_H

#include <vector>
#include <set>

class IWatchList {
public:
    virtual ~IWatchList() = default;
    virtual std::set<int> getUserMovies(int userId) = 0;
    virtual bool hasUser(int userId) = 0;
};

#endif 