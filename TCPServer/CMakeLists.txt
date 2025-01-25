cmake_minimum_required(VERSION 3.10)
project(netflix_server)

set(CMAKE_CXX_STANDARD 14)

# Add source files to the library
add_executable(netflix_server
    src/commands/PostCommand.cpp
    src/commands/PatchCommand.cpp
    src/commands/GetCommand.cpp
    src/commands/DeleteCommand.cpp
    src/commands/HelpCommand.cpp
    src/models/WatchList.cpp
    src/server/TCPServer.cpp
    src/server/ClientHandler.cpp
    src/server/ThreadPool.cpp
    src/CmdProcessor.cpp
    src/main.cpp
)

# Include directories
target_include_directories(netflix_server PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
