/*

mortgage-calc.js

mortgage-calc

(C) 2018 Spoton.net Limited
Created by Liam Langstaff

*/

runOnLoad(function(){

    const INPUT  = document.querySelector('.calc > input')
    const SELECT = document.querySelectorAll('.calc > select')

    let costText    = document.querySelector('#total-cost')
    let costWeekly  = document.querySelector('#total-weekly-cost')
    let monthlyText = document.querySelector('#monthly-payments')
    let weeklyText  = document.querySelector('#weekly-payments')

    //set the initial visuals to pound signs

    costText.textContent    = '£'
    monthlyText.textContent = '£'
    //weeklyText.textContent  = '£'

    //define the select areas
    let loanTermContainer = document.querySelector('.loan-term')
    let loanTypeContainer = document.querySelector('.loan-type')

    //create an array
    let rates = []

    //define the table in edit mode
    let table = document.querySelector('.mortgage-table table')

    //call functions
    initialiseRates()
    initialiseLoanType()

    // for(let i=0; i < SELECT.length; i++){
    //     SELECT[i].addEventListener('change', calculations)
    //     //SELECT[0].addEventListener('change', createOptions)
    // }

    //when something changes within the input, perform calculations right away
    INPUT.addEventListener('input', calculations)

    //function for initialising the values from edit mode
    function initialiseRates(){

      //for every row in the table take some value out
      ;[].forEach.call(table.rows, function(row){

            let name  = row.cells[0].textContent.trim()
            let apr   = parseFloat(row.cells[1].textContent.trim())
            let term  = row.cells[2].textContent.trim()
            let limit = parseInt(row.cells[3].textContent.trim())

            //if in edit mode they can written the word "month" or "year"
            //then set the term based on this
            //1 x months input in edit mode gives you the max number of months in the term
            //1 x years input in edit mode gives the max number of years within the term
            if(term.match(/^month/i)){
              term = 1;
            }else if(term.match(/^year/i)){
              term = 12
            }else{
              return
            }

            //create an object with the new values and place inside our array
            rates.push({
              name:name,
              apr:apr,
              term:term,
              limit:limit
            })

        })

    }

    //function for performing the logic based off the formula given to us
    function calculations(){

        //variables set from the inputs on the calc
        let loanAmount = parseFloat(INPUT.value)
        let loanRate   = rates[parseInt(loanTypeContainer.value)];
        let loanTerm   = parseFloat(SELECT[1].value)

        // Turn the APR into a decimal ready for calculations

        rate         = loanRate.apr / 100
        repayments   = loanTerm

        if(loanAmount == NaN || loanAmount == ""){

            return 0

        }

        //USED FOR THE MATH: Divide the APR by 12 then add 1
        let monthlyRate = rate / 12
        monthlyRate += 1

        let weeklyRate = rate / 52.1429
        weeklyRate += 1

        // Total number of monthly repayments (months)
        let totalMonths = repayments * loanRate.term

        // Total number of weekly repayments (weeks)
        let totalWeeks  = (totalMonths / 12) * (365 / 7)

        // Total amount to pay per month
        let monthlyPayment = (1 - (Math.pow(monthlyRate, -totalMonths)))
            monthlyPayment = ((rate / 12) / monthlyPayment) * loanAmount
            monthlyPayment = monthlyPayment

        let weeklyPayment = (1 - (Math.pow(weeklyRate, -totalWeeks)))
            weeklyPayment = ((rate / 52.1429) / weeklyPayment) * loanAmount
            weeklyPayment = weeklyPayment

        //CALC
        totalRepayment       = monthlyPayment * totalMonths
        totalCredit          = totalRepayment - loanAmount

        totalWeeklyRepayment = weeklyPayment * totalWeeks

        //DISPLAY
        costText.textContent     = "£" + totalRepayment.toFixed(2)
        //costWeekly.textContent   = "£" + totalWeeklyRepayment.toFixed(2)


        if(loanRate.term == 1){
            monthlyText.textContent  = "£" + (totalRepayment.toFixed(2) / loanTerm).toFixed(2)
            //weeklyText.textContent   = "£" + (totalWeeklyRepayment / (4.345 * loanTerm)).toFixed(2)
            //console.log("months")
        }else{
            monthlyText.textContent  = "£" + monthlyPayment.toFixed(2)
            //weeklyText.textContent   = "£" + weeklyPayment.toFixed(2)
            //console.log("years")
        }
    }

    //create the options for loan type
    function initialiseLoanType(){


      //inside our loan type container create an initial empty 'option' to prompt the user
      //to then trigger events
      loanTypeContainer.appendChild(new Option('Select...', ''))

      //for every rate create a new option with the name from the object and index it
      rates.forEach(function(rate,index){

       let option = new Option(rate.name,index)

       //put that new option inside the container
       loanTypeContainer.appendChild(option)

      })


      loanTypeContainer.addEventListener('change', initialiseLoanTerm)
      loanTermContainer.addEventListener('change', calculations)

    }

    
    function initialiseLoanTerm(){

      INPUT.value = 0

      costText.textContent     = "£0"
      //costWeekly.textContent   = "£0"
      monthlyText.textContent  = "£0"
      //weeklyText.textContent   = "£0"

      //if there is nothing inside the type then display nothing
      if(loanTypeContainer.value == ''){
        loanTermContainer.innerHTML = "";
        return
      }

        //take the value from which loan type is selected
       let rate = rates[parseInt(loanTypeContainer.value)];

       loanTermContainer.innerHTML = "";

       //if the term amount is equal to 1, then get the wording right
       for(let i = 1;i <= rate.limit; i++){


          let option = new Option(i + ' ' + (rate.term == 1 ? 'month':'year') + (i != 1 ? 's':''),i)

          loanTermContainer.appendChild(option)
       }

    }

    //when not in edit mode, get rid of the table from edit mode
    if(!W.EDIT_MODE){
        table.style.display = "none";
    }
})