const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "AFN" ? "selected" : "";
        
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;

        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); 
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){ 
            let imgTag = element.parentElement.querySelector("img"); 
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); 
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; 
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode; 
    loadFlag(fromCurrency); 
    loadFlag(toCurrency); 
    getExchangeRate(); 
})

function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = parseFloat(amount.value);

    if (isNaN(amountVal) || amountVal <= 0) {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";

    console.log("From Currency:", fromCurrency.value);
    console.log("To Currency:", toCurrency.value);

    let url = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_kRdbVuBysdvRciVIjB5gbBp7WDkOEnzQAD9vvVij&base_currency=${fromCurrency.value}&currencies=${toCurrency.value}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            console.log(result);  

           
            if (result.data && result.data[toCurrency.value]) {
                let exchangeRate = result.data[toCurrency.value];
                let totalExRate = (amountVal * exchangeRate).toFixed(2);

                exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
            } else {
                exchangeRateTxt.innerText = "Conversion rate not available";
            }
        })
        .catch(err => {
            console.error(err);
            exchangeRateTxt.innerText = "Something went wrong";
        });
}




  