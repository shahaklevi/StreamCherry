#include "TCPServer.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include "../interfaces/Runnable.h"
#include "ClientHandler.h"
#include "ThreadPool.h"
#define  MAX_CLIENTS 100

using namespace std;
bool TCPServer::validatePort(int port) const {
    return port > 0 && port <= 65535;
}

TCPServer::TCPServer(int port,bool running,size_t ThreadPoolSize) : port(port),running(true),threadPool(new ThreadPool(ThreadPoolSize)){
    if (!validatePort(port)) {
        throw std::runtime_error("Invalid port number");
    }
}

// Start the TCP server
void TCPServer::start(){
    int serverSocket, clientSocket;
    struct sockaddr_in serverAddr, clientAddr;
    socklen_t clientAddrLen = sizeof(clientAddr);

    // Create socket
    if ((serverSocket = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("Socket creation failed");
        exit(EXIT_FAILURE);
    }

    // Configure server address
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    // Bind the socket
    if (bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("Bind failed");
        exit(EXIT_FAILURE);
    }

    // Listen for incoming connections
    if (listen(serverSocket, MAX_CLIENTS) < 0) {
        perror("Listen failed");
        exit(EXIT_FAILURE);
    }
    while (running) {
        if ((clientSocket = accept(serverSocket, (struct sockaddr *)&clientAddr, &clientAddrLen)) < 0) {
            perror("Accept failed");
            continue;
        }
        Runnable *client_thread = new ClientHandler(clientSocket);
        threadPool->addTask(client_thread);   
    }
}

void TCPServer:: stop (){
    running = false;
}