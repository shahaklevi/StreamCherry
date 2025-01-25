# Use the GCC base image
FROM gcc:latest

# Install CMake and dependencies
RUN apt-get update && apt-get install -y cmake git && apt-get clean

# Set the working directory
WORKDIR /usr/src

# Copy project files
COPY ./TCPServer/CMakeLists.txt /usr/src
COPY ./TCPServer/src /usr/src/src
# COPY ./TCPServer/data /usr/src/data

# Ensure the `data` directory is writable
# RUN chmod -R 777 /usr/src/data

# Create a build directory
RUN mkdir build
WORKDIR /usr/src/build

# Run CMake and build both the main program and tests
RUN cmake .. && make

# Verify that executables are created
RUN ls /usr/src/build/netflix_server || echo "Executables not found!"

# Default command (can be overridden in docker-compose.yml)
ENTRYPOINT ["./netflix_server"]
