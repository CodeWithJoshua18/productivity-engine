// session 

export class Session {
  constructor(id, activityType, createdAt) {
    // Identity & metadata
    this.id = id;
    this.activityType = activityType;
    this.createdAt = createdAt;

    // Session state
    this.startTime = null;
    this.status = "IDLE"; // possible: IDLE, RUNNING, PAUSED, STOPPED
    this.accumulatedDuration = 0; // total time tracked
    this.pauseHistory = []; // store { pausedAt, resumedAt } objects
    this.finalDuration = null; // total session time after stop
  }

  start(currentTime) {
    if (this.status !== "IDLE") {
      throw new Error("Cannot start: session is already started or stopped.");
    }
    this.startTime = currentTime;
    this.status = "RUNNING";
  }

  pause(currentTime) {
    if (this.status !== "RUNNING") {
      throw new Error("Cannot pause: session is not running.");
    }
    this.accumulatedDuration += currentTime - this.startTime;
    this.status = "PAUSED";
    this.pauseHistory.push({ pausedAt: currentTime, resumedAt: null });
  }

  resume(currentTime) {
    if (this.status !== "PAUSED") {
      throw new Error("Cannot resume: session is not paused.");
    }
    this.startTime = currentTime;
    this.status = "RUNNING";
    // Update last pause event with resumedAt
    const lastPause = this.pauseHistory[this.pauseHistory.length - 1];
    lastPause.resumedAt = currentTime;
  }

  stop(currentTime) {
    if (this.status === "RUNNING") {
      this.finalDuration = this.accumulatedDuration + (currentTime - this.startTime);
    } else if (this.status === "PAUSED") {
      this.finalDuration = this.accumulatedDuration;
    } else {
      throw new Error("Cannot stop: session has not started.");
    }
    this.status = "STOPPED";
  }

  getDuration(currentTime) {
    if (this.status === "RUNNING") {
      return this.accumulatedDuration + (currentTime - this.startTime);
    } else if (this.status === "PAUSED") {
      return this.accumulatedDuration;
    } else if (this.status === "STOPPED") {
      return this.finalDuration;
    } else {
      return 0; // IDLE
    }
  }
}
