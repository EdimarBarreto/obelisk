document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginBtn");
  const hostListContainer = document.getElementById("hostList");

  loginButton.addEventListener("click", () => {
    authenticate();
  });

  async function authenticate() {
    const authToken = await getAuthToken();
    if (authToken) {
      const hostList = await getHostList(authToken);
      hostListContainer.innerHTML = hostList;
    } else {
      console.error("Falha na autenticação");
    }
  }

  async function getAuthToken() {
    const url = "http://192.168.100.147:8080/api_jsonrpc.php";  // Substitua pela URL do seu Zabbix
    const username = "Kawan";  // Substitua pelo seu nome de usuário
    const password = "@k4w4n$soares";   // Substitua pela sua senha

    const authData = {
      jsonrpc: "2.0",
      method: "user.login",
      params: {
        user: username,
        password: password,
      },
      id: 3,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    const responseData = await response.json();

    if (responseData.result) {
      return responseData.result;
    } else {
      return null;
    }
  }

  async function getHostList(authToken) {
    const url = "http://192.168.100.147:8080/api_jsonrpc.php";  // Substitua pela URL do seu Zabbix
  
    const requestData = {
      jsonrpc: "2.0",
      method: "host.get",
      params: {
        output: ["hostid", "host"],
      },
      auth: authToken,
      id: 2,
    };
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
  
    const responseData = await response.json();
  
    if (responseData.result) {
      const hostItems = responseData.result.map(host => `<p>${host.host}</p>`).join("");
      return hostItems;
    } else {
      return "<p>Nenhum host encontrado</p>";
    }
  }
})