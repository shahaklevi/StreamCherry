#include "CmdProcessor.h"
#include <sstream>
#include <iostream>
#include <string>
#include"commands/PostCommand.h"
#include"commands/PatchCommand.h"
#include"commands/HelpCommand.h"
#include"commands/GetCommand.h"
#include"commands/DeleteCommand.h"

CmdProcessor::CmdProcessor(const std::string& dataFile) : watchList(dataFile) {
   commands["post"] = std::make_unique<PostCommand>(&watchList);
   commands["patch"] = std::make_unique<PatchCommand>(&watchList);
   commands["help"] = std::make_unique<HelpCommand>(&watchList);
   commands["get"] = std::make_unique<GetCommand>(&watchList);
   commands["delete"] = std::make_unique<DeleteCommand>(&watchList);
}

void CmdProcessor::run() {
    std::string line;
    while (std::getline(std::cin, line)) {
        processCommand(line);
    }
}

std:: string CmdProcessor::processCommand(const std::string& line) {
    std::vector<std::string> args = parseCommand(line);
    if (args.empty()) return"";

    // Convert command to lowercase
    std::string cmdName = args[0];
    for(auto& c : cmdName) c = tolower(c);

    if (commands.count(cmdName)) {
       std::string ans = commands[cmdName]->execute(args);
       return ans;
    }
    return "400 Bad Request";
}

// Split the line into tokens
std::vector<std::string> CmdProcessor::parseCommand(const std::string& line) {
    std::vector<std::string> args;
    std::istringstream iss(line);
    std::string arg;
    
    while (iss >> arg) {
        args.push_back(arg);
    }
    
    return args;
}