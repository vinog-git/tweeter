function submitForm(e) {
    e.preventDefault();
    let url = '/config';
    let configForm = document.forms[name = "configForm"];
    let userInput = configForm.elements[name = "configuration"].value;
    let userAuth = configForm.elements[name = "configAuth"].value;
    let data = { 'userInput': userInput, 'userAuth': userAuth };
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            if (response.callStatus === 'Success') {
                configForm.style.display = 'none';
            } else {
                configForm.reset();
            }
            console.log(response)
        });
}

function toggleForm() {
    let configForm = document.forms[name = "configForm"];
    let toggler = document.getElementById('toggler');
    if (configForm.style.display === "none") {
        configForm.style.display = 'block';
        toggler.style.display = 'none';
    } else {
        configForm.style.display = 'none';
        toggler.style.display = 'block';
    }
}