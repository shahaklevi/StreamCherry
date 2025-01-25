#ifndef EXECUTABLE_H
#define EXECUTABLE_H
#include "Runnable.h"

class Executable  {
    public:
    virtual void execute(Runnable& command)=0;
};
#endif