#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>

#define MEM_SIZE 1024

int main() {
    int mem_fd;
    char *mem_ptr;
    pid_t pid;

    // Create shared memory
    mem_fd = shm_open("/chat_memory", O_CREAT | O_RDWR, 0666);
    if (mem_fd == -1) {
        perror("shm_open");
        exit(EXIT_FAILURE);
    }
    ftruncate(mem_fd, MEM_SIZE);
    mem_ptr = mmap(NULL, MEM_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, mem_fd, 0);
    if (mem_ptr == MAP_FAILED) {
        perror("mmap");
        exit(EXIT_FAILURE);
    }

    // Initialize chat
    printf("Enter your first name followed by your surname: ");
    fgets(mem_ptr, MEM_SIZE, stdin);
    mem_ptr[strlen(mem_ptr) - 1] = '\0'; // Remove newline character

    // Start chat process
    pid = fork();
    if (pid == -1) {
        perror("fork");
        exit(EXIT_FAILURE);
    } else if (pid == 0) {
        // Child process (receiver)
        while (1) {
            if (strcmp(mem_ptr, "exit") == 0)
                break;
            printf("Received: %s\n", mem_ptr);
            sleep(1); // Sleep to avoid busy waiting
        }
        exit(EXIT_SUCCESS);
    } else {
        // Parent process (sender)
        printf("Chat initiated. Type 'exit' to end the chat.\n");
        while (1) {
            printf("Enter your message: ");
            fgets(mem_ptr, MEM_SIZE, stdin);
            mem_ptr[strlen(mem_ptr) - 1] = '\0'; // Remove newline character
            if (strcmp(mem_ptr, "exit") == 0)
                break;
        }
        wait(NULL); // Wait for the child process to finish
    }

    // Clean up
    munmap(mem_ptr, MEM_SIZE);
    close(mem_fd);
    shm_unlink("/chat_memory");

    return 0;
}
