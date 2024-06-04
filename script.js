function submitForm(event) {
    event.preventDefault(); // Previne trimiterea clasică a formularului

    if (validateForm()) { // Validează formularul înainte de a trimite datele
        var formData = new FormData(document.getElementById('formular'));

        fetch('/submit-form', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Formularul a fost trimis cu succes!');
        })
        .catch(error => {
            console.error('Eroare:', error);
            alert('A apărut o eroare la trimiterea formularului.');
        });
    }
}

function validateForm() {
    var namePattern = /^[a-zA-Z]{3,30}$/;
    var phonePattern = /^(\+4)?07\d{8}$/;
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    var nume = document.getElementById("nume").value;
    var prenume = document.getElementById("prenume").value;
    var telefon = document.getElementById("nrtel").value;
    var email = document.getElementById("mail").value;

    if (!namePattern.test(nume)) {
        alert("Nume invalid. Trebuie să conțină doar litere și să aibă între 3 și 30 de caractere.");
        return false;
    }
    if (!namePattern.test(prenume)) {
        alert("Prenume invalid. Trebuie să conțină doar litere și să aibă între 3 și 30 de caractere.");
        return false;
    }
    if (!phonePattern.test(telefon)) {
        alert("Număr de telefon invalid.");
        return false;
    }
    if (!emailPattern.test(email)) {
        alert("Email invalid.");
        return false;
    }
    return true;
}
function triggerSubmitButton() {
    document.getElementById("submitForm").click();
}


window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    var myButton = document.getElementById("myBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        myButton.style.display = "block";
    } else {
        myButton.style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
}


function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();


document.addEventListener('DOMContentLoaded', () => {
    const bodyElement = document.body;
    function toggleMode() {
        if (bodyElement.classList.contains('light-mode')) {
            setDarkMode();
        } else {
            setLightMode();
        }
    }
    function setDarkMode() {
        bodyElement.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('mode', 'dark-mode');
    }
    function setLightMode() {
        bodyElement.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('mode', 'light-mode');
    }
    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
        bodyElement.classList.add(savedMode);
    } else {
        bodyElement.classList.add('light-mode');
    }
    const toggleButton = document.getElementById('toggle-mode');
    toggleButton.addEventListener('click', toggleMode);
    window.addEventListener('keydown', function(event) {
        if (event.key === 'd') {
            setDarkMode();
        } else if (event.key === 'l') {
            setLightMode();
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const mesajContainer = document.getElementById('mesaj-container');
    const paragraf = document.querySelector('.multi-col p');

    function schimbaCuloare(event) {
        mesajContainer.innerHTML = '';//sterge ce aveam inainte
        const title = event.target;
        const culori = ['white', 'thistle', 'LightCyan', 'PapayaWhip', 'lavender', 'PaleGreen'];
        const randomColor = culori[Math.floor(Math.random() * culori.length)];
        title.style.color = randomColor;
        const computedColor = getComputedStyle(title).color;
        const rgbValues = computedColor.match(/\d+/g).map(Number);//folosesc array.map ca sa convertesc valorile la numere
        const darkerRgbValues = rgbValues.map(value => Math.max(0, Math.min(255, value - 50)));
        paragraf.style.color = `rgb(${darkerRgbValues.join(', ')})`;
        const numeCuloare = randomColor.toUpperCase();
        const elNou = document.createElement('p');
        elNou.textContent = `Culoarea titlului este acum ${numeCuloare} (cod: ${computedColor})`;
        mesajContainer.appendChild(elNou);
        setTimeout(() => {
            mesajContainer.removeChild(elNou);
        }, 2000);
    }
    const title = document.getElementById('title');
    title.addEventListener('click', schimbaCuloare);
});


function preiaDateJSON() {
    // Folosim metoda fetch pentru a face o cerere GET către fișierul JSON
    fetch('date.json')
      .then(response => {
        // Verificăm dacă răspunsul este OK (status 200)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Parsăm răspunsul JSON și îl returnăm
        return response.json();
      })
      .then(data => {
        // La primirea datelor JSON, le procesăm și le afișăm pe pagină
        afiseazaDate(data);
      })
      .catch(error => {
        // Gestionăm eventualele erori
        console.error('There was a problem with your fetch operation:', error);
      });
  }
  // Funcția care afișează datele pe pagină
  function afiseazaDate(data) {
    // Găsim elementul ul în care vom afișa datele
    const lista = document.getElementById('date-list');
    // Iterăm prin obiectul JSON și afișăm fiecare element într-un list item
    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `${item.nume}: ${item.descriere}`;
      lista.appendChild(listItem);
    });
  }
  window.onload = preiaDateJSON;


  
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.protected-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();  // Oprește propagarea evenimentului
            checkAuthentication(link.href);
        });
    });
});
function checkAuthentication(link) {
    fetch('/isAuthenticated')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                window.location.href = link;
            } else {
                alert("Trebuie să fiți autentificat pentru a accesa această pagină.");
            }
        })
        .catch(error => {
            console.error("Eroare la verificarea autentificării:", error);
        });
}
  