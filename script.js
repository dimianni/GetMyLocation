'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');


class App {
    constructor() {
        btn.addEventListener("click", this.displayInfo.bind(this))
    }

    // This function will be used to pass location coordinates when they become available 
    getCoords() {
        return new Promise((resolve, reject) => {
            // getCurrentPosition нужно куда-то положить результат, поэтому нужен callback который смог бы его принять
            // можно использовать callback Промиса resolve, и достать результат из .then
            // P.S. значение из resolve всегда идет в .then, а значение из reject в .catch
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
    }

    // This is the function invoked on btn click. It will handle data passed from getCoords()
    displayInfo() {
        this.getCoords()
            .then(res => {
                let { latitude, longitude } = res.coords;

                return fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=307186385146089451646x96729`)
            })
            .then(res => {
                if (!res.ok) throw new Error(`There was a problem with Geocode. ${res.status}`)
                return res.json()
            })
            .then(data => {

                // console.log(data);
                let { city, state, prov, country } = data;

                let html = `<p class="title">You are located in ${city}, ${state ? state : country}</p>`
                countriesContainer.insertAdjacentHTML("beforeend", html)

                return fetch(`https://restcountries.com/v3.1/alpha/${prov}`)
            })
            .then(res => {
                if (!res.ok) throw new Error(`There was a problem getting country info. ${res.status}`)
                return res.json()
            })
            .then(data => {
                // console.log(data[0]);
                this.renderCountry(data[0])
            })
            .catch(err => console.error(`Damn...${err}`))
            .finally(() => btn.style.display = "none")
    }

    renderCountry(data, className = '') {

        let language = data.languages[Object.keys(data.languages)[0]];
        let currency = data.currencies[Object.keys(data.currencies)[0]].name;
        let population = (+data.population / 1000000).toFixed(1)

        const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flags.png}" />
            <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>   
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${population}M people</p>
            <p class="country__row"><span>🗣️</span>${language ? language : "Could not get data :("}</p>
            <p class="country__row"><span>💰</span>${currency ? currency : "Could not get data :("}</p>
            </div>
        </article>
        `;
        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
    };

}

const app = new App()















