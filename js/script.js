window.onload = () => {

    let searchBtn = document.getElementById('search');

    searchBtn.addEventListener('click', (e) => {

        e.preventDefault();
        
        initSearch();

    });

};

async function initSearch() {

    let url = getUrl();

    console.log(url);

    getJobs(url);

}

function getUrl() {

    let description = document.getElementById('description').value;
    if (description == '') return false;

    let location = document.getElementById('location').value;
    let fullTime = document.getElementById('full_time').checked;

    let baseUrl = 'https://jobs.github.com/positions.json';
    let qs = `description=${description}`;
    if (location != '') qs += `&location=${location}`;
    if (fullTime) qs += `&full_time=${fullTime}`;

    let url = `${baseUrl}?${qs}`;

    return url;

}

async function getJobs(url) {

    fetch('proxy.php?url=' + url)
    .then(res => {

        console.log(res)

        if (res.status != 200) {

            alert('API malfunction');

            return false;

        };

        return res.json();

    })
    .then(data => {

        console.log(data);

        displayJobs(data);

    })

}

function displayJobs(data) {

    let jobs = document.getElementById('jobs');
    let html = '';
    let i = 1;
    let total = data.length;

    data.forEach((job) => {

        let date = new Date(job.created_at);

        html += `
            <div class="job border-radius-medium p-15 mb-20">
                <p>${i}/${total}</p>
                <h3 class="d-inline">${job.title}</h3>
                <span class="p"> (${job.type})</span>
                <h4>${job.location}</h4>
                <h4>${job.company}</h4>
                <div class="description truncate">
                    ${job.description}
                </div>
                <span class="a show-more hover-pointer">Expand &darr;</span>
                <p>Created: ${date.toLocaleDateString()}</p>
                ${job.how_to_apply}
                <a href="${job.company_url}" class="border-none">
                    <img src="${job.company_logo}" alt="${job.company}" class="maw-400" />
                </a>
                <p><a href="${job.url}">Github link</a></p>
                <span class="hide">ID: ${job.id}</span>
            </div>
            <hr class="mb-30 mb-30">
        `;

        i++;

    });

    jobs.innerHTML = html;

    initUncoverDescription();

}

function initUncoverDescription() {

    let uncoverBtns = document.querySelectorAll('.show-more');
    
    uncoverBtns.forEach((btn) => {

        btn.addEventListener('click', (e) => {

            btn.previousElementSibling.classList.remove('truncate');
            btn.classList.add('hide');

        });

    });

}

/*
https://jobs.github.com/positions.json
page=0,1,2
description — A search term, such as "ruby" or "java". This parameter is aliased to search.
location — A city name, zip code, or other location search term.
full_time — If you want to limit results to full time positions set this parameter to 'true'.

lat — A specific latitude. If used, you must also send long and must not send location.
long — A specific longitude. If used, you must also send lat and must not send location.
*/
