import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { catalogCount, launchProducts } from "./catalog";

describe("Gear Guru Guide homepage", () => {
  beforeEach(() => { window.history.replaceState({}, "", "/"); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("filters the catalog by category", () => {
    render(<App />);

    expect(screen.getByText(new RegExp(`${catalogCount} RESEARCH TRACKS`, "i"))).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mobility" }));

    const mobilityProducts = launchProducts.filter((product) => product.category === "Mobility");
    const hypershellCount = mobilityProducts.filter((product) => product.maker === "Hypershell").length;
    const dnsysCount = mobilityProducts.filter((product) => product.maker === "DNSYS").length;

    expect(screen.getAllByText("Hypershell")).toHaveLength(hypershellCount);
    expect(screen.getAllByText("DNSYS")).toHaveLength(dnsysCount);
    expect(screen.queryAllByText("EcoFlow")).toHaveLength(
      mobilityProducts.filter((product) => product.maker === "EcoFlow").length,
    );
  });

  it("validates the launch brief email form before acknowledging signup", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /join/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Enter a valid email address");
  });

  it("keeps the founder story and safety disclosure visible", () => {
    render(<App />);

    expect(screen.getByText(/a life outdoors does not have an expiration date/i)).toBeInTheDocument();
    expect(screen.getByText(/Gear is not a substitute for training/i)).toBeInTheDocument();
  });

  it("opens the buying-guide hub from the primary navigation", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Buying Guides" }));

    expect(window.location.pathname).toBe("/guides");
    expect(screen.getByText(/Decision tools for/i)).toBeInTheDocument();
    expect(screen.getByText(/Outdoor exoskeletons:/i)).toBeInTheDocument();
  });

  it("opens the brand directory and protected partnership inquiry page", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Brands" }));
    expect(screen.getByText("BRAND DIRECTORY")).toBeInTheDocument();
    expect(screen.getByText("Hypershell")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Garmin, MSR, Starlink/i), { target: { value: "Starlink" } });
    expect(screen.getByText("Starlink")).toBeInTheDocument();
    expect(screen.queryByText("Hypershell")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Work with Gear Guru Guide/i }));
    expect(screen.getByText("PARTNER INQUIRIES")).toBeInTheDocument();
    expect(screen.getByText(/The editorial verdict is never for sale/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Sponsorship" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Endorsement / ambassador" })).toBeInTheDocument();
  });

  it("shows a labeled table of contents and related research inside a guide", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Buying Guides" }));
    fireEvent.click(screen.getAllByRole("button", { name: /Read the guide/i })[0]!);

    expect(screen.getByText("ON THIS PAGE")).toBeInTheDocument();
    expect(screen.getByText("RELATED RESEARCH TRACKS")).toBeInTheDocument();
    expect(screen.getByText(/editorial research entries, not active offers/i)).toBeInTheDocument();
    expect(screen.getByText("VIDEO REVIEW")).toBeInTheDocument();
    expect(screen.getByText("VIDEO REVIEW IN PRODUCTION")).toBeInTheDocument();
  });

  it("shows a disclosure immediately beside an owner-activated public affiliate placement", async () => {
    vi.stubGlobal("fetch", vi.fn((input: string) => Promise.resolve({
      ok: true,
      json: async () => input.includes("affiliate-offers") ? [{ productId: 1, merchant: "Amazon", destinationUrl: "https://www.amazon.com/dp/example?tag=gearguru-20" }] : [],
    })));
    render(<App />);

    const offer = await screen.findByTestId("affiliate-offer-1");
    expect(offer).toHaveTextContent(/Affiliate disclosure/i);
    expect(screen.getByRole("link", { name: /View approved Amazon option/i })).toHaveAttribute("href", "https://www.amazon.com/dp/example?tag=gearguru-20");
    expect(screen.getByRole("link", { name: /View approved Amazon option/i })).toHaveAttribute("rel", "sponsored noopener noreferrer");
    expect(screen.getByText(/As an Amazon Associate I earn from qualifying purchases/i)).toBeInTheDocument();
  });

  it("does not expose a public affiliate placement when no owner record is active", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true, json: async () => [] })));
    render(<App />);

    await screen.findByText(new RegExp(`${catalogCount} RESEARCH TRACKS`, "i"));
    expect(screen.queryByTestId("affiliate-offer-1")).not.toBeInTheDocument();
    expect(screen.queryByText(/As an Amazon Associate I earn from qualifying purchases/i)).not.toBeInTheDocument();
  });
});
