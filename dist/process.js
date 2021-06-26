import { firstComeFirstServe, shortestJobFirst } from './algorithms.js'

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

        for (let j = 0; j < 2; j++) {
            const input_field = document.createElement('div')
            input_field.setAttribute('class', 'col-sm-3 ms-auto')
            const input = document.createElement('input')
            input.setAttribute('type', 'number')
            input.setAttribute('required', 'true')
            input.setAttribute('class', 'form-control mb-2')
            if (j == 0) {
                input.setAttribute('id', 'input-arrival')
                input.setAttribute('placeholder', 'arrival time')
            } else {
                input.setAttribute('id', 'input-burst')
                input.setAttribute('placeholder', 'burst time')
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
            burst: parseInt(selected_process.querySelector('#input-burst').value)
        }

        processes.push(retrieve_process_details)
    }

    const computed_processes = {
        fcfs: firstComeFirstServe(processes),
        fcfs_twt: function() {
            let sum = new Number()
            this.fcfs.forEach((process) => sum += process.turnaround)
            
            return sum
        },
        fcfs_awt: function() { return this.fcfs_twt() / this.fcfs.length },

        // sjf: shortestJobFirst(processes)
    }

    console.log(processes)

    spreadTableData(
        computed_processes.fcfs,
        computed_processes.fcfs_twt(),
        computed_processes.fcfs_awt(),
        '#fcfs'
    )

    const display_table = document.querySelectorAll('.d-none')
    display_table.forEach((element) => {
        element.classList.remove('d-none')
    })

} 

function spreadTableData(processes, total, avg, div_id) {
    processes.forEach((process, i) => {
        const table_body = document.querySelector(`${div_id} table tbody`)
        const row = document.createElement('tr')
        row.setAttribute('id', `process${i+1}-row`)

        const row_head = document.createElement('th')
        row_head.innerText = process.pid
        row.appendChild(row_head)

        const row_data = []
        if (div_id == '#fcfs') {
            const { arrival, burst, turnaround } = process
            for (let j = 0; j < 3; j++) row_data.push(document.createElement('td'))
            row_data[0].innerText = arrival
            row_data[1].innerText = burst
            row_data[2].innerText = turnaround
        }
        if (div_id == '#sjf') {
            const { burst, turnaround } = process
            for (let j = 0; j < 2; j++) row_data.push(document.createElement('td'))
            row_data[0].innerText = burst
            row_data[1].innerText = turnaround
        }

        row_data.forEach((data) => row.appendChild(data))

        table_body.appendChild(row)
    })

    document.querySelector(`${div_id} #twt`).innerText = total
    document.querySelector(`${div_id} #awt`).innerText = avg
}