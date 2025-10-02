const inputs = document.querySelectorAll('.input');
const button = document.querySelector('.loginbutton')

const handleFocus = ({ target }) => {
    const span = target.previousElementSibling;
    span.classList.add('spanactive');
}

const handleFocusOut = ({ target }) => {
    if (target.value == ''){
        const span = target.previousElementSibling;
        span.classList.remove('spanactive');
    }
}

const handleChange = () => {
    const [username, password] = inputs;

    if (username.value && password.value.length >= 3){
        button.removeAttribute('disabled')
    }else {
        button.setAttribute('disabled', '')
    }
}

inputs.forEach((input) =>{ input.addEventListener('focus', handleFocus) });
inputs.forEach((input) =>{ input.addEventListener('focusout', handleFocusOut) });
inputs.forEach((input) =>{ input.addEventListener('input', handleChange) });