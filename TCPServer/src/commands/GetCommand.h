#ifndef GET_COMMAND_H
#define GET_COMMAND_H

#include "../interfaces/ICommand.h"
#include "../models/WatchList.h"
#include <unordered_map>
#include <vector>
#include <string>

class GetCommand : public ICommand {
private:
    WatchList* watchList;

public:
    // Constructor
    explicit GetCommand(WatchList* wl);

    // Execute function that implements the logic
    std::string execute(const std::vector<std::string>& args) override;

};

#endif // GET_COMMAND_H