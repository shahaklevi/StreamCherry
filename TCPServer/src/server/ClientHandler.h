#ifndef CLIENTHANDLER_H
#define CLIENTHANDLER_H
#include "../interfaces/Runnable.h"
#include <mutex>
#include "../CmdProcessor.h"


class ClientHandler : public Runnable  {
    private:
    int clientSocket;
    static CmdProcessor cmdProcessor;
    static std::mutex processorMutex;
    public:
    ClientHandler(int clientSocket) ;
    void run() override;
};
#endif