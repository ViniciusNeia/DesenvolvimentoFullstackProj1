# 🐾 PetCare Tips – Dicas de Cuidados

Aplicação web desenvolvida como parte do **Projeto 1 da disciplina Programação Web Fullstack (ES47B-ES71)**.  
O objetivo é fornecer dicas básicas de cuidados, expectativa de vida e informações sobre raças de cães e gatos, utilizando uma **SPA (Single Page Application)** em React.js.
Clique [aqui](https://dj4g9f72f15q1.cloudfront.net/) para acessar o site na versão que esta disponivel nesse repositório!

---

## 🚀 Funcionalidades
- Seleção da espécie (**cachorro** ou **gato**)
- Busca por raças disponíveis via **API pública** (The Dog API / The Cat API)
- Exibição de informações básicas: expectativa de vida, temperamento e cuidados gerais
- Interface com **cards responsivos** (React-Bootstrap)
- Validação de **campos obrigatórios** (não é possível buscar sem selecionar a espécie/raça)
- Uso do hook **useMemo** para cachear descrições e evitar recomputações desnecessárias

---

## 🛠️ Tecnologias Utilizadas
- [React.js](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [The Dog API](https://thedogapi.com/) / [The Cat API](https://thecatapi.com/)

## Imagens da aplicação
<img width="1116" height="635" alt="image" src="https://github.com/user-attachments/assets/c50dca52-3775-4dac-aa3b-d97e0485d018" />
<img width="1145" height="636" alt="image" src="https://github.com/user-attachments/assets/b3430396-4eb2-4897-9058-03c4cde99389" />
<img width="1121" height="640" alt="image" src="https://github.com/user-attachments/assets/39241744-b0fc-4fb6-bdf2-de0f0d927464" />
<img width="1142" height="648" alt="image" src="https://github.com/user-attachments/assets/2cccf59f-e074-4b32-9669-dfda54affa7d" />

## Por que PetCare Tips?
Os desenvolvedores do projeto são Bruna Naian e Vinicius Neia.
Bruna é apaixonada por raças caninas e felinas e por suas funções. Estuda cinofilia por hobby há mais de 10 anos e já cursou Medicina Veterinária. Movida pelo desejo de unir conhecimento e inovação, busca revolucionar o mercado pet por meio da tecnologia.
Ao seu lado está Vinicius, grande amigo e incentivador, que acompanha de perto seus estudos cinófilos e compartilha desse propósito.
Juntos, eles criaram este projeto com a missão de, de forma simples e acessível, espalhar e compartilhar informações sobre a cinofilia, uma ciência tão fascinante e ainda pouco conhecida.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
