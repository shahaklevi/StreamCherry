#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <vector>
#include <string>

class ICommand {
public:
   virtual ~ICommand() = default;
   virtual std::string execute(const std::vector<std::string>& args) = 0;
};

#endif 