import { populateForm } from './process.js'

const process_amt_form = document.querySelector('#process-amt-form')
const submit_btn = document.querySelector('#submit-amt')

process_amt_form.onsubmit = (e) => {
    e.preventDefault()
    submit()
}
function submit() {
    const process_amt = document.querySelector('input#process-amount').value
    localStorage.setItem('process-amt', process_amt)
    submit_btn.setAttribute('disabled', 'true')
    populateForm(process_amt)
}

submit_btn.addEventListener('click', submit)