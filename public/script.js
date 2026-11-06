
// ADD USERS
function addUsers() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if (name === "" || email === "") {
        alert("Please enter all details");
        return;
    }

    fetch("/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";

        loadUsers();
    });
}


// DISPLAY USERS
function loadUsers() {
    fetch("/Users")
    .then(res => res.json())
    .then(users => {
        let output = "";

        users.forEach(user => {
            output += `
                <div class="users">
                    <div>
                        <b>${user.name}</b>
                        <p>${user.email}</p>
                    </div>

                    <button class="delete"
                    onclick='deleteUsers(${JSON.stringify(user.name)}, ${JSON.stringify(user.email)})'>
                        Delete
                    </button>
                </div>
            `;
        });

        document.getElementById("users").innerHTML = output;
    });
}


// DELETE USERS
function deleteUsers(name, email) {
    fetch("/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        loadUsers();
    });
}


// LOAD USERS WHEN PAGE OPENS
loadUsers();
