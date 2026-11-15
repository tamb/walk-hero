import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import App from "./App";

vi.mock("./workers/client", () => ({
  createCityWorker: () => ({
    getCityByGeoData: vi.fn(async () => []),
  }),
  createMeasurementWorker: () => ({
    distBetweenInCM: vi.fn(async () => 0),
  }),
}));

beforeEach(() => {
  Reflect.deleteProperty(navigator, "wakeLock");
});

describe("Walk Hero", () => {
  it("opens on the landing screen", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "WALK HERO" })).toBeInTheDocument();
    expect(screen.getByText("v0.0.0-alpha.2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "QUEST" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "MINIGAMES" })).toBeEnabled();
    expect(screen.getByText("by Tamb")).toBeInTheDocument();
  });

  it("opens the quest warning before a walk starts", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "QUEST" }));

    expect(await screen.findByRole("heading", { name: "WARNING:" })).toBeInTheDocument();
    expect(screen.getByText(/pay attention/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /lock screen/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "I accept" }));
    expect(await screen.findByRole("heading", { name: "Start Your Game" })).toBeInTheDocument();
  });

  it("lists the minigames", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "MINIGAMES" }));

    const hangman = await screen.findByRole("link", { name: /Hangman/ });
    expect(hangman.getAttribute("href")).toContain("/minigames/hangman");
    expect(screen.getByRole("link", { name: /Target/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Raid/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Reorder/ })).toBeInTheDocument();
    expect(screen.getByText("Minigames")).toBeInTheDocument();
  });

  it("locks the screen with the wake lock and unlocks from the slider", async () => {
    const release = vi.fn(async () => {});
    const request = vi.fn(async () => ({
      release,
      addEventListener: vi.fn(),
    }));
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: { request },
    });

    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: "QUEST" }));

    fireEvent.click(await screen.findByRole("button", { name: /lock screen/i }));

    expect(request).toHaveBeenCalledWith("screen");
    const slider = await screen.findByRole("slider", { name: /unlock screen/i });
    fireEvent.change(slider, { target: { value: "100" } });

    expect(release).toHaveBeenCalledOnce();
    expect(screen.queryByRole("slider", { name: /unlock screen/i })).not.toBeInTheDocument();
  });

  it("does not show the lock screen when wake lock is unavailable", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: "QUEST" }));
    fireEvent.click(await screen.findByRole("button", { name: /lock screen/i }));

    expect(screen.queryByRole("slider", { name: /unlock screen/i })).not.toBeInTheDocument();
  });
});
