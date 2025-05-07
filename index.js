document.addEventListener("DOMContentLoaded", function () {
    const inputCondominio = document.getElementById("input-pesquisar");
    const inputNome = document.getElementById("input-nome");
    const inputRazaoSocial = document.getElementById("input-razao-social");
    const inputGarantidora = document.getElementById("input-garantidora");
  
    const googleSheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQh_qY-fI-QmyCXhHMhaGAqzI-4ARnrk7KoB94roa6z1BeUeU_4kgy-T5vi-Yfao6w_es29ffXzStUc/pub?output=csv";
  
    let condominios = [];
  
    // Carregar e processar os dados da planilha
    fetch(googleSheetURL)
      .then(response => response.text())
      .then(data => {
        const rows = data.split("\n").map(row => row.split(","));
        const headers = rows.shift().map(h => h.trim());
  
        condominios = rows.map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index]?.trim() || "";
          });
          return obj;
        });
  
        console.log("Dados carregados:", condominios[0]); // Debug
      })
      .catch(err => console.error("Erro ao carregar os dados da planilha:", err));
  
    inputCondominio.addEventListener("input", function () {
      const termo = inputCondominio.value.trim().toLowerCase();
  
      let sugestoesContainer = document.getElementById("sugestoes");
      if (!sugestoesContainer) {
        sugestoesContainer = document.createElement("div");
        sugestoesContainer.id = "sugestoes";
        inputCondominio.parentNode.appendChild(sugestoesContainer);
      }
  
      sugestoesContainer.innerHTML = "";
  
      if (termo.length === 0) {
        inputNome.value = "";
        inputRazaoSocial.value = "";
        inputGarantidora.value = "";
        return;
      }
  
      function removerAcentos(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
      
      const resultados = condominios.filter(c => {
        const nomeCondominio = removerAcentos(c["Condomínio"]?.toLowerCase() || "");
        const termoNormalizado = removerAcentos(termo);
        return nomeCondominio.includes(termoNormalizado);
      });
  
      resultados.forEach(c => {
        const sugestao = document.createElement("div");
        sugestao.classList.add("sugestao");
        sugestao.textContent = c["Condomínio"];
  
        sugestao.addEventListener("click", function () {
          inputCondominio.value = c["Condomínio"];
          inputNome.value = c["Nome cadastrado no Vouch"] || "";
          inputRazaoSocial.value = c["Razão Social"] || "";
          inputGarantidora.value = c["Garantidora"] || "";
          sugestoesContainer.innerHTML = "";
        });
  
        sugestoesContainer.appendChild(sugestao);
      });
    });
  });
  