import { firstComeFirstServe, shortestJobFirst, priority } from './algorithms.js'

export function populateForm(process_amt) {
    const input_processes = document.querySelector('form#input-processes')

    for (let i = 0; i < process_amt; i++) {
        const process = document.createElement('div')
        process.setAttribute('id', `process${i}`)
        process.setAttribute('class', 'row')

        const label_field = document.createElement('label')
        label_field.setAttribute('for', 'input-arrival')
        label_field.setAttribute('class', 'col-sm-3 col-form-label')
        label_field.innerText = `Process #${i+1}`
        process.appendChild(label_field)

        for (let j = 0; j < 3; j++) {
            const input_field = document.createElement('div')
            input_field.setAttribute('class', 'col-sm-3 ms-auto')
            const input = document.createElement('input')
            input.setAttribute('type', 'number')
            input.setAttribute('required', 'true')
            input.setAttribute('class', 'form-control mb-2')
            if (j == 0) {
                input.setAttribute('id', 'input-arrival')
                input.setAttribute('placeholder', 'arrival time')
            } else if (j == 1) {
                input.setAttribute('id', 'input-burst')
                input.setAttribute('placeholder', 'burst time')
            } else {
                input.setAttribute('id', 'input-priority')
                input.setAttribute('placeholder', 'priority')
            }
            input_field.appendChild(input)
            process.appendChild(input_field)
        }

        input_processes.querySelector('#processes-fields').appendChild(process)
                
    }
    const eval_btn = document.querySelector('#eval-field button')

    input_processes.onsubmit = (e) => {
        const sched_method = document.querySelector('#schedule-method').value

        e.preventDefault()
        eval_btn.setAttribute('disabled', 'true')
        recordProcesses(sched_method)
    }
    input_processes.classList.remove('d-none')
}

function recordProcesses(sched_method) {
    let processes = []
    for(let i = 0; i < localStorage.getItem('process-amt'); i++) {
        const selected_process = document.querySelector(`#process${i}`)
        const retrieve_process_details = {
            pid: i+1,
            arrival: parseInt(selected_process.querySelector('#input-arrival').value),
            burst: parseInt(selected_process.querySelector('#input-burst').value),
            priority: parseInt(selected_process.querySelector('#input-priority').value)
        }

        processes.push(retrieve_process_details)
    }

    if (sched_method == 'fcfs') {
        const fcfs = {
            result: firstComeFirstServe(processes),
            twt: function() {
                let sum = new Number()
                this.result.forEach((process) => sum += process.turnaround)
                
                return sum
            },
            awt: function() { return this.twt() / this.result.length },
        }

        console.log(processes)
    
        spreadTableData(
            fcfs.result,
            fcfs.twt(),
            fcfs.awt(),
            sched_method
        )
    }
    if (sched_method == 'sjf') {
        const sjf = {
            result: shortestJobFirst(processes),
            twt: function() {
                let sum = new Number()
                this.result.forEach((process) => sum += process.turnaround)
                
                return sum
            },
            awt: function() { return this.twt() / this.result.length },
        }
    
        spreadTableData(
            sjf.result,
            sjf.twt(),
            sjf.awt(),
            sched_method
        )
    }
    if (sched_method == 'pr') {
        const pr = {
            result: priority(processes),
            zeroArrival: function() {this.result.forEach((r) => r.arrival = 0) },
            twt: function() {
                let sum = new Number()
                this.result.forEach((process) => sum += process.turnaround)
                
                return sum
            },
            awt: function() { 
                this.zeroArrival()
                return this.twt() / this.result.length
            }
            
        }
    
        spreadTableData(
            pr.result,
            pr.twt(),
            pr.awt(),
            sched_method
        )
    }

    const display_table = document.querySelectorAll('.d-none')
    display_table.forEach((element) => element.classList.remove('d-none'))

} 

function spreadTableData(processes, total, avg, sched_method) {
    processes.forEach((process, i) => {
        const table_body = document.querySelector(`#eval-table table tbody`)
        const row = document.createElement('tr')
        row.setAttribute('id', `process${i+1}-row`)

        const row_head = document.createElement('th')
        row_head.innerText = process.pid
        row.appendChild(row_head)

        if (sched_method == 'fcfs') document.querySelector('#method-title').innerText = 'First Come First Serve'
        else if (sched_method == 'sjf') document.querySelector('#method-title').innerText = 'Shortest Job First'
        else if (sched_method == 'pr') document.querySelector('#method-title').innerText = 'Priority'
        else if (sched_method == 'rr') document.querySelector('#method-title').innerText = 'Round Robin'

        const row_data = []        
        const { arrival, burst, priority, turnaround } = process
        for (let j = 0; j < 4; j++) row_data.push(document.createElement('td'))
        row_data[0].innerText = arrival
        row_data[1].innerText = burst
        row_data[2].innerText = priority
        row_data[3].innerText = turnaround

        row_data.forEach((data) => row.appendChild(data))

        table_body.appendChild(row)
    })

    document.querySelector(`#eval-table #twt`).innerText = total
    document.querySelector(`#eval-table #awt`).innerText = avg
}