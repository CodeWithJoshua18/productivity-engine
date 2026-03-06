// tests/Session.test.js
import { Session } from "../src/core/entities/Session";
describe("Session Entity", () => {
  test("Normal flow: start → pause → resume → stop", () => {
    const session = new Session("1", "Coding", 1000);

    session.start(1000);
    session.pause(1030);
    session.resume(1045);
    session.stop(1115);

    const duration = session.getDuration(1115);

    // Expected: 30 + 70 = 100
    expect(duration).toBe(100);

    // Check status
    expect(session.status).toBe("STOPPED");

    // Check pause history
    expect(session.pauseHistory).toEqual([{ pausedAt: 1030, resumedAt: 1045 }]);
  });

  test("Session without pause", () => {
    const session = new Session("2", "Debugging", 2000);

    session.start(2000);
    session.stop(2050);

    expect(session.getDuration(2050)).toBe(50);
    expect(session.status).toBe("STOPPED");
  });

  test("Cannot pause before start", () => {
    const session = new Session("3", "Reading", 3000);

    expect(() => session.pause(3005)).toThrow(
      "Cannot pause: session is not running.",
    );
  });
});