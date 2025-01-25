#ifndef HELP_COMMAND_H
#define HELP_COMMAND_H

#include "../interfaces/ICommand.h"
#include "../models/WatchList.h"

class HelpCommand : public ICommand {
private:
    WatchList* watchList;

public:
    explicit HelpCommand(WatchList* wl);
    std::string execute(const std::vector<std::string>& args) override;
};

#endif