# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 

# Executable name
TARGET = tcp

# Source files
SRCS = main.cpp \
       CmdProcessor.cpp \
       commands/DeleteCommand.cpp \
       commands/GetCommand.cpp \
       commands/HelpCommand.cpp \
       commands/PatchCommand.cpp \
       commands/PostCommand.cpp \
       models/WatchList.cpp \
       server/ClientHandler.cpp \
       server/TCPServer.cpp \
       server/ThreadPool.cpp

# Default target
all:
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRCS)

# Clean up generated files
clean:
	rm -f $(TARGET)

# Phony targets
.PHONY: all clean
