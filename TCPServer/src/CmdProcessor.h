#ifndef CMDPROCESSOR_H
#define CMDPROCESSOR_H

#include <map>
#include <memory>
#include <string>
#include "interfaces/ICommand.h"
#include "models/WatchList.h"

class CmdProcessor {
private:
 WatchList watchList;
public:
   CmdProcessor(const std::string& dataFile);
   std::map<std::string, std::unique_ptr<ICommand>> commands;
   std::string processCommand(const std::string& line);
   std::vector<std::string> parseCommand(const std::string& line);
   void printMenu();
   void run();
};

#endif