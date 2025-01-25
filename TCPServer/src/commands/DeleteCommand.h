#ifndef DELTE_COMMAND_H
#define DELETE_COMMAND_H

#include <thread>
#include <mutex>

#include "../interfaces/ICommand.h"
#include "../models/WatchList.h"

class DeleteCommand : public ICommand {
private:
    WatchList* watchList;
    bool isCommandValid(const std::vector<std::string>& args);  // הצהרה על הפונקציה

public:
    explicit DeleteCommand(WatchList* wl);
    std::string execute(const std::vector<std::string>& args) override;
};

#endif