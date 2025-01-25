#include "HelpCommand.h"
#include <iostream>

HelpCommand::HelpCommand(WatchList* wl) : watchList(wl) {}

// Prints the available commands to the console
std::string HelpCommand::execute(const std::vector<std::string>& args) {
   std::string output;
   if (args.size() > 1) {
        return "400 Bad Request";
   }
   output += "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n";
   output += "GET, arguments: [userid] [movieid]\n";
   output += "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n";
   output += "POST, arguments: [userid] [movieid1] [movieid2] ...\n";
   output += "HELP";
   return output;
}