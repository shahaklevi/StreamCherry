#include "ClientHandler.h"
#include <map>
#include <string>
#include "../commands/DeleteCommand.h"
#include "../commands/GetCommand.h"
#include "../commands/PatchCommand.h"
#include "../commands/HelpCommand.h"
#include "../interfaces/ICommand.h"
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <threads.h>
#include "a.out.h"
#include "../CmdProcessor.h"
#define BUFFER_SIZE 1024
using namespace std;

CmdProcessor ClientHandler::cmdProcessor("/usr/src/data/watchlist.txt");
std::mutex ClientHandler::processorMutex;
// Constructor for ClientHandler
ClientHandler::ClientHandler(int socket) : clientSocket(socket){}

// Run method to handle client communication
void ClientHandler::run()
{
    char buffer[BUFFER_SIZE] = {0};
    while (true)
    {
        // Read data from client
        int bytesToRead = read(clientSocket, buffer, BUFFER_SIZE);
        if (bytesToRead <= 0)
        {
            close(clientSocket);
            break;
        }

        string response;
        // Creating a string from the client input (later to be sent to process command)
        string clientMessage(buffer);
        try
        {
            // Lock the mutex before processing the command
            {
                std::lock_guard<std::mutex> lock(processorMutex);
                response = cmdProcessor.processCommand(clientMessage);
            }

            // Log the response
            std::cout << "Sending response: " << response << std::endl;
            // Send the response back to the client
            send(this->clientSocket, response.c_str(), response.size(), 0);
            // Clear the buffer
            memset(buffer, 0, BUFFER_SIZE);
        }
        catch (const std::exception &e)
        {
            // Handle any exceptions that occur during command execution.
            response = std::string("Error: ") + e.what();
            send(this->clientSocket, response.c_str(), response.size(), 0);
            memset(buffer, 0, BUFFER_SIZE);
        }
    }
}
