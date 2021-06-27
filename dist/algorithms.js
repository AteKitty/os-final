function calculateTurnAround(processes) {
    processes.forEach((process, i) => {
        process.turnaround = (i == 0) ? process.arrival + process.burst : processes[i-1].turnaround + process.burst
    })

    return processes
}

function firstComeFirstServe(processes) {
    for (let i = 0; i < processes.length-1; i++) {
        for (let j = 0; j < processes.length-1; j++) {
            if (processes[j].arrival > processes[j+1].arrival) {
                let temp = processes[j]
                processes[j] = processes[j+1]
                processes[j+1] = temp
            }
        }
    }

    return calculateTurnAround(processes)
}

function shortestJobFirst(processes) {
    for (let i = 0; i < processes.length-1; i++) {
        for (let j = 0; j < processes.length-1; j++) {
            if (processes[j].burst > processes[j+1].burst) {
                let temp = processes[j]
                processes[j] = processes[j+1]
                processes[j+1] = temp
            }
        }
    }

    return calculateTurnAround(processes)
}

function priority(processes) {
    for (let i = 0; i < processes.length-1; i++) {
        for (let j = 0; j < processes.length-1; j++) {
            if (processes[j].priority > processes[j+1].priority) {
                let temp = processes[j]
                processes[j] = processes[j+1]
                processes[j+1] = temp
            }
        }
    }

    return calculateTurnAround(processes)
}


export { firstComeFirstServe, shortestJobFirst, priority }