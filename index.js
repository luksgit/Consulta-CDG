document.addEventListener("DOMContentLoaded", function () {
  const inputCondominio = document.getElementById("input-pesquisar");
  const inputNome = document.getElementById("input-nome");
  const inputRazaoSocial = document.getElementById("input-razao-social");
  const inputGarantidora = document.getElementById("input-garantidora");

  inputCondominio.addEventListener("input", async function () {
    const termo = inputCondominio.value.trim();

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

    try {
      const response = await fetch(`https://consultacdg.infinityfreeapp.com/consulta.php?nome=${encodeURIComponent(termo)}`);
      const dados = await response.json();

      if (dados.length === 0) {
        inputNome.value = "Não encontrado";
        inputRazaoSocial.value = "";
        inputGarantidora.value = "";
        return;
      }

      dados.forEach(c => {
        const sugestao = document.createElement("div");
        sugestao.classList.add("sugestao");
        sugestao.textContent = c.nome;

        sugestao.addEventListener("click", function () {
          inputCondominio.value = c.nome;
          inputNome.value = c.nome;
          inputRazaoSocial.value = ""; // você pode adicionar depois
          inputGarantidora.value = c.garantidora;
          sugestoesContainer.innerHTML = "";
        });

        sugestoesContainer.appendChild(sugestao);
      });

    } catch (error) {
      console.error("Erro ao consultar a API:", error);
    }
  });
});
