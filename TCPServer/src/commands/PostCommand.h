#ifndef POST_COMMAND_H
#define POST_COMMAND_H

#include <thread>
#include <mutex>

#include "../interfaces/ICommand.h"
#include "../models/WatchList.h"

class PostCommand : public ICommand {
private:
    WatchList* watchList;


public:
    explicit PostCommand(WatchList* wl);
    std::string execute(const std::vector<std::string>& args) override;
    bool isCommandValid(const std::vector<std::string>& args);
};

#endif