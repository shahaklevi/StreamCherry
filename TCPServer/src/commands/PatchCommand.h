#ifndef PATCH_COMMAND_H
#define PATCH_COMMAND_H

#include "../interfaces/ICommand.h"
#include "../models/WatchList.h"

class PatchCommand : public ICommand {
private:
    WatchList* watchList;

public:
    explicit PatchCommand(WatchList* wl);
    std::string execute(const std::vector<std::string>& args) override;
    bool isCommandValid(const std::vector<std::string>& args);
};

#endif