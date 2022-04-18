const socket = io();
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBtn = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#location-sharing-btn')
const $messages = document.querySelector('#messages')
// Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message',(message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        date: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})
socket.on('locationMessage',(message) => {
    const html = Mustache.render(locationTemplate, {
        url: message.url,
        date: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e) => {
    e.preventDefault()
    $messageFormBtn.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message, (error) => {
        $messageFormBtn.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            console.log(error);
        }
        console.log('delivered')
    })

})
$locationBtn.addEventListener('click',() => {
    $locationBtn.setAttribute('disabled','disabled')
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported for your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation',{latitude, longitude},() => {
            $locationBtn.removeAttribute('disabled')
            console.log('location shared');
        })
    },
    )
})