#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <stdexcept>
#include <atomic>
#include "../interfaces/Runnable.h"
#include "ThreadPool.h"
using namespace std;

// Worker thread function that processes tasks
void ThreadPool::workerFunction()
{
    while (true)
    {
        Runnable *task = nullptr;
        {
            // Lock the queue to safely access the shared task queue
            std::unique_lock<std::mutex> lock(queue_mutex);

            // Wait until there is a task to process or the ThreadPool is stopped
            condition.wait(lock, [this]
                           { return stop || !tasks.empty(); });

            // If the pool is stopping and no tasks remain, exit the thread
            if (stop && tasks.empty())
            {
                return;
            }

            // Get the next task from the queue
            task = tasks.front();
            tasks.pop();
        }

        // Execute the task if it is not null
        if (task != nullptr)
        {
            task->run();
            delete task; // Clean up the task after execution to free memory
        }
    }
}

// Constructor to initialize the thread pool with a specified number of threads
ThreadPool::ThreadPool(size_t threads) : stop(false), num_threads(threads)
{
    // Create and start the worker threads
    for (size_t i = 0; i < threads; ++i)
    {
        workers.emplace_back(&ThreadPool::workerFunction, this);
    }
}

// Destructor to clean up resources
ThreadPool::~ThreadPool()
{
    {
        // Lock the queue to safely update the stop flag
        std::unique_lock<std::mutex> lock(queue_mutex);
        stop = true;
    }

    // Notify all worker threads to stop waiting
    condition.notify_all();

    // Join all threads to ensure proper cleanup
    for (std::thread &worker : workers)
    {
        if (worker.joinable())
        {
            worker.join();
        }
    }
}

// Add a new task to the queue
void ThreadPool::addTask(Runnable *task)
{
    if (stop)
    {
        // Throw an exception if the thread pool is already stopped
        throw std::runtime_error("ThreadPool is stopped");
    }

    {
        // Lock the queue to safely add the new task
        std::unique_lock<std::mutex> lock(queue_mutex);
        tasks.push(task);
    }

    // Notify one worker thread that a new task is available
    condition.notify_one();
}

// Get the number of threads in the thread pool
size_t ThreadPool::getNumThreads() const
{
    return num_threads;
}

// Get the number of tasks currently in the queue
size_t ThreadPool::getQueueSize() const
{
    std::unique_lock<std::mutex> lock(queue_mutex);
    return tasks.size();
}
