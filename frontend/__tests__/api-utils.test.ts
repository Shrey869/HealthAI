import { describe, it, expect } from "vitest"
import { haversineDistance } from "@/lib/api-utils"

describe("haversineDistance", () => {
  it("calculates zero distance for same point", () => {
    const result = haversineDistance(28.6139, 77.2090, 28.6139, 77.2090)
    expect(result).toBe(0)
  })

  it("calculates distance between two known points", () => {
    // Delhi to Noida ~= 20-25 km
    const result = haversineDistance(28.6139, 77.2090, 28.5355, 77.3910)
    expect(result).toBeGreaterThan(15)
    expect(result).toBeLessThan(30)
  })

  it("calculates short distance correctly", () => {
    // Two nearby points in Delhi (~2km apart)
    const result = haversineDistance(28.6139, 77.2090, 28.6200, 77.2200)
    expect(result).toBeGreaterThan(0.5)
    expect(result).toBeLessThan(5)
  })

  it("returns positive value regardless of direction", () => {
    const d1 = haversineDistance(28.6139, 77.2090, 28.7, 77.3)
    const d2 = haversineDistance(28.7, 77.3, 28.6139, 77.2090)
    expect(d1).toBeCloseTo(d2, 5)
  })
})
