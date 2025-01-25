#ifndef TCPSERVER_H
#define TCPSERVER_H
#include <string>
#include "ThreadPool.h"
#include "../interfaces/Executable.h"
#include <stdexcept>

using namespace std;


class TCPServer  {
    private:
    int port;
    bool running;
    ThreadPool* threadPool;
    static const int POOL_SIZE = 100;
   

    public:
    bool validatePort(int port) const;
    TCPServer(int port,bool running,size_t poolSize = POOL_SIZE);
    void start();
    void stop();
};
#endif