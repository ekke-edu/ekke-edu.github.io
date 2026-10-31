import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("EKKE-EDU homepage", () => {
  it("renders the Hungarian course and assistant content by default", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Tanulás. Építés. Megosztás." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kurzusok és projektek" })).toBeInTheDocument();
    expect(screen.getByText("Adatbázisrendszerek II.")).toBeInTheDocument();
  });

  it("switches the page copy to English", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("heading", { name: "Learn. Build. Share." })).toBeInTheDocument();
    expect(screen.getByText("Database Systems II")).toBeInTheDocument();
  });

  it("opens the chat dialog from the assistant section", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Próbáld ki a chatet" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByTitle("EKKE university assistant chat")).toBeInTheDocument();
  });
});
