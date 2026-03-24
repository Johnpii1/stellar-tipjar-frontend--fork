type QueueTask = () => Promise<unknown>;

interface QueuedRequest {
  task: QueueTask;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export class RequestQueue {
  private queue: QueuedRequest[] = [];
  private running = false;

  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const resolveUnknown = (value: unknown) => resolve(value as T);
      this.queue.push({
        task,
        resolve: resolveUnknown,
        reject,
      });

      void this.drain();
    });
  }

  get size(): number {
    return this.queue.length;
  }

  private async drain(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;
    while (this.queue.length > 0) {
      const next = this.queue.shift();
      if (!next) {
        continue;
      }

      try {
        const result = await next.task();
        next.resolve(result);
      } catch (error) {
        next.reject(error);
      }
    }
    this.running = false;
  }
}
