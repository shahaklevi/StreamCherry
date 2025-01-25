#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <atomic>
#include "../interfaces/Runnable.h"

class ThreadPool {
private:
    std::vector<std::thread> workers;                // Worker threads
    std::queue<Runnable*> tasks;                     // Task queue
    mutable std::mutex queue_mutex;                  // Mutex for synchronizing access to the queue
    std::condition_variable condition;               // Condition variable for thread signaling
    std::atomic<bool> stop;                          // Stop flag
    size_t num_threads;                              // Number of threads in the pool

    void workerFunction();                           // Worker thread function

public:
    ThreadPool(size_t threads);             // Constructor to initialize the pool with a specific number of threads
    ~ThreadPool();                                   // Destructor to clean up resources
    void addTask(Runnable* task);                    // Add a new task to the thread pool
    size_t getNumThreads() const;                    // Get the number of threads in the pool
    size_t getQueueSize() const;                     // Get the size of the task queue
};

#endif 
