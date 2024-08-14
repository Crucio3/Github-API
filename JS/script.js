let isRequestInProgress = false;

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function rem() {
    let block = document.querySelector('.search')
    while (block.contains(document.querySelector('.search__result'))) {
        block.removeChild(document.querySelector('.search__result'));
    }
}

function request() {
    rem();

    let currentValue = search.value;
    let block = document.querySelector('.search');

    

    if (currentValue !== '' && currentValue !== ' ' ) {
        console.log(currentValue);
        fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(currentValue)}`)
        .then(promis => {
            rem();
            return promis.json();
        }).then(data => {
            console.log(data);

            function add(data, text) {
                search.value = '';
                rem();

                function features(key, value) {
                    let string = document.createElement('div');
                    string.textContent = key + value;
                    string.classList.add('list__feature')
                    return string;
                }

                let obj = data.items.find(item => item.name === text);
                console.log(obj);
                let list = document.querySelector('.list');
                let element = document.createElement('div');
                element.appendChild(features('Name: ', obj.name));
                element.appendChild(features('Owner: ', obj.owner.login));
                element.appendChild(features('Stars: ', obj.stargazers_count));
                let img = document.createElement('img');
                img.classList.add('list__close');
                img.src = 'img/close.svg'
                img.addEventListener('click', event => {
                     img.parentElement.remove();


                }, {once: true})
                element.appendChild(img);


                element.classList.add('list__item');

                list.appendChild(element);
            }

            let fragment = document.createDocumentFragment()

            for (let i = 0; i < 5; i++) {
                let elem = document.createElement('div')
                elem.classList.add('search__result')
                elem.textContent = data.items[i].name;
                elem.addEventListener('click', event => {
                    add(data, elem.textContent);
                })
                fragment.appendChild(elem);
            }
            block.appendChild(fragment);
        });
    } 
}

const debRequest = debounce(request, 500)

let search = document.querySelector('.search__input');
search.addEventListener('keydown', (event) => {
    if (event.keyCode !== 32 ) {
        debRequest();
    }
    
});

