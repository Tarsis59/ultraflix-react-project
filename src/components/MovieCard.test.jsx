import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MovieCard from "./MovieCard";

describe("MovieCard", () => {
  // Dados de teste (mock)
  const mockMovie = {
    title: "Filme de Teste",
    rating: "8.8",
    imageUrl: "https://via.placeholder.com/500x750",
  };

  it("deve renderizar o título, a nota e a imagem do filme", () => {
    // 1. Renderiza o componente com os dados de teste
    render(
      <MovieCard
        title={mockMovie.title}
        rating={mockMovie.rating}
        imageUrl={mockMovie.imageUrl}
      />
    );

    // 2. Procura pelos elementos na tela
    const titleElement = screen.getByText("Filme de Teste");
    const ratingElement = screen.getByText("Nota: 8.8");
    const imageElement = screen.getByAltText("Pôster do filme Filme de Teste"); // Testando a acessibilidade (alt text)

    // 3. Verifica se os elementos existem no documento
    expect(titleElement).toBeInTheDocument();
    expect(ratingElement).toBeInTheDocument();
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain(mockMovie.imageUrl); // Verifica se a URL da imagem está correta
  });
});
