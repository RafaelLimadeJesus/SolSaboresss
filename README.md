# Salgados Artesanais — SolSaboresss

Catálogo responsivo para apresentar salgados artesanais, montar uma encomenda e encaminhar os detalhes pelo WhatsApp.

## Funcionalidades

- Catálogo de seis produtos, organizado entre salgados e salgados assados.
- Seleção de centos por tipo, controle da quantidade de cada sabor e resumo atualizado da sacola.
- Seleção de sabores bloqueada até escolher um tipo de farinha/cento.
- Limite de unidades calculado pela capacidade de cada tipo de cento e compartilhado por todos os sabores; adicionar além do limite é bloqueado.
- Se reduzir os centos exigir cortar sabores, o site pede confirmação e ajusta apenas o excedente.
- Resumo, progresso e mensagem do WhatsApp sincronizados com as quantidades válidas.
- Formulário do pedido com nome, telefone, data e horário de retirada.
- Montagem de uma mensagem completa e encaminhamento para o WhatsApp da equipe.
- Fotos ampliadas em uma janela responsiva, com fechamento pelo botão, tecla `Esc` ou clique fora da imagem.
- Seção de experiências visível sem login.
- Aviso de que as imagens são meramente ilustrativas.

## Tecnologias

- HTML5
- CSS3, com layout responsivo
- JavaScript puro (sem framework, dependências ou etapa de compilação)
- APIs nativas do navegador, incluindo `dialog`, formulários e `Intl.NumberFormat`
- Link externo `wa.me` para iniciar o pedido no WhatsApp

## Estrutura

O repositório deve ter `index.html` na raiz para funcionar no GitHub Pages:

```text
Salgados-Artesanais/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── img/
│   ├── produtos/
│   │   ├── bolinha-queijo.jpg
│   │   ├── coxinha-frango.jpg
│   │   ├── empada-carne.jpg
│   │   ├── empada-frango.jpg
│   │   ├── esfiha-carne.jpg
│   │   ├── presunto-queijo.jpg
│   │   └── risole-presunto-queijo.jpg
│   └── logo/
│       └── logo.jpeg
├── .gitignore
└── README.md
```

`img/produtos/presunto-queijo.jpg` foi mantido conforme solicitado, mas não aparece como um produto separado no catálogo.

## Baixar ou clonar

Clone o repositório depois de criá-lo no GitHub. Troque `SEU_USUARIO` pelo nome da sua conta:

```bash
git clone https://github.com/SEU_USUARIO/Salgados-Artesanais.git
cd Salgados-Artesanais
```

Também é possível baixar o ZIP do repositório pelo botão **Code → Download ZIP** e extrair os arquivos.

## Executar localmente

Não é necessário instalar pacotes. Com Python 3 instalado, inicie um servidor estático a partir da raiz:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080` no navegador. Também é possível abrir `index.html` diretamente, mas o servidor local costuma reproduzir melhor a hospedagem.

## Editar o catálogo

- **Produtos, nomes, descrições, categorias e imagens:** edite a lista `flavors` em `js/script.js`.
- **Preços e unidades por cento:** edite `price` e `unitsPerCento` na lista `centoTypes` no mesmo arquivo. Os tipos atuais permitem 100 unidades por cento.
- **Fotos dos produtos:** coloque os arquivos em `img/produtos/` e atualize o caminho correspondente no item de `flavors`.
- **Logotipo:** substitua `img/logo/logo.jpeg` e mantenha o caminho em `index.html`, ou atualize o caminho se mudar o nome do arquivo.
- **Cores, tipografia, espaçamentos e comportamento responsivo:** edite `css/style.css`.
- **WhatsApp e endereço de retirada:** atualize as constantes `WHATSAPP_NUMBER` e `PICKUP_ADDRESS` no início de `js/script.js`.

Use nomes de arquivo em minúsculas, sem espaços, e mantenha maiúsculas/minúsculas dos caminhos iguais às dos arquivos; servidores Linux diferenciam letras maiúsculas.

## Publicar no GitHub Pages

1. Crie um repositório público chamado `Salgados-Artesanais`.
2. Envie **o conteúdo desta pasta** para a raiz do repositório, incluindo `index.html`, `.gitignore`, `css/`, `js/` e `img/`.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**, a branch `main` e a pasta `/(root)`.
5. Salve e aguarde o GitHub Pages mostrar o endereço publicado.

Os caminhos de estilos, scripts e imagens são relativos; não é necessário configurar um processo de build. Se publicar numa pasta `/docs`, em vez da raiz, mova todos os arquivos do projeto para dentro dessa pasta.

## Backend, dados e serviços externos

- O catálogo e a sacola funcionam no navegador. Este projeto não tem API, banco de dados nem variáveis de ambiente.
- Ao confirmar um pedido, o site prepara a mensagem e abre o WhatsApp pelo serviço externo `wa.me`; o cliente precisa concluir o envio no WhatsApp.
- A seção de experiências não exige login, mas o comentário enviado aparece apenas como prévia na sessão atual do navegador. Não há armazenamento compartilhado, publicação para outros visitantes ou moderação.
- Os dados do formulário do pedido são usados para compor a mensagem encaminhada ao WhatsApp; não são salvos por um servidor deste projeto.
- Não adicione senhas, tokens ou chaves de API ao repositório.