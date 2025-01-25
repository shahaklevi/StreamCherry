#include <iostream>
#include "CmdProcessor.h"
#include "server/TCPServer.h"
#include "commands/PostCommand.h"
#include "commands/PatchCommand.h"
#include "commands/HelpCommand.h"
#include "commands/GetCommand.h"
#include "commands/DeleteCommand.h"

int main(int argc,char *argv[]) {
    int port=55000;
    if (argc>1)
    {
        port=atoi(argv[1]);
    }
    try{
        
    TCPServer server (port,true);
    server.start();

    } catch (const std::exception &e) {
        std::cerr << e.what() << std::endl;
        return 1;
    }
    return 0;
    
}